import React, { useCallback, useEffect, useState } from 'react';
import { 
  Search, 
  Phone, 
  MapPin, 
  DollarSign, 
  FileText, 
  X,
  ArrowRight,
  Users
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { 
  getParcelas, 
  registrarPagamentoAPI, 
  registrarObservacaoAPI, 
  type Parcela 
} from '../../services/api';

interface CobrancasViewProps {
  onNavigate?: (tab: string) => void;
}

export const CobrancasView: React.FC<CobrancasViewProps> = ({ onNavigate }) => {
  const { token } = useAuth();
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<'TODOS' | 'COBRAR_HOJE' | 'ATRASADO'>('TODOS');

  // Selected Parcela for Detail Modal
  const [parcelaSelecionada, setParcelaSelecionada] = useState<Parcela | null>(null);

  // Action Sub-modals
  const [modalPagamento, setModalPagamento] = useState<boolean>(false);
  const [modalObservacao, setModalObservacao] = useState<boolean>(false);

  // Form states
  const [valorPagoInput, setValorPagoInput] = useState<string>('');
  const [dataPagamentoInput, setDataPagamentoInput] = useState<string>('');
  const [observacaoInput, setObservacaoInput] = useState<string>('');
  const [salvando, setSalvando] = useState<boolean>(false);

  const carregarParcelas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await getParcelas(token);
      setParcelas(dados);
    } catch {
      setError('Erro ao carregar parcelas de cobrança.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    carregarParcelas();
  }, [carregarParcelas]);

  const abrirDetalhe = (p: Parcela) => {
    setParcelaSelecionada(p);
    setValorPagoInput(String(p.valor));
    setDataPagamentoInput(new Date().toISOString().substring(0, 10));
    setObservacaoInput(p.observacao || '');
  };

  const handleSalvarPagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parcelaSelecionada || !valorPagoInput) return;

    setSalvando(true);
    try {
      const valorNum = parseFloat(valorPagoInput);
      const atualizada = await registrarPagamentoAPI(
        parcelaSelecionada.id,
        valorNum,
        dataPagamentoInput,
        token
      );
      
      setParcelaSelecionada(atualizada);
      setModalPagamento(false);
      await carregarParcelas();
      alert(`✅ Pagamento de R$ ${valorNum.toFixed(2)} registrado com sucesso!`);
    } catch (err: any) {
      alert(`❌ Erro ao registrar pagamento: ${err.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvarObservacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parcelaSelecionada) return;

    setSalvando(true);
    try {
      const atualizada = await registrarObservacaoAPI(
        parcelaSelecionada.id,
        observacaoInput,
        token
      );
      
      setParcelaSelecionada(atualizada);
      setModalObservacao(false);
      await carregarParcelas();
      alert('✅ Observação registrada com sucesso!');
    } catch (err: any) {
      alert(`❌ Erro ao salvar observação: ${err.message}`);
    } finally {
      setSalvando(false);
    }
  };

  // Funcao para calcular o status exato da cobranca: COBRAR_HOJE ou ATRASADO
  const getStatusCobranca = (dataVencimentoStr: string, statusOriginal: string): 'COBRAR_HOJE' | 'ATRASADO' | 'EM_DIA' | 'PAGA' => {
    if (statusOriginal === 'PAGA') return 'PAGA';

    const hoje = new Date();
    const yyyy = hoje.getFullYear();
    const mm = String(hoje.getMonth() + 1).padStart(2, '0');
    const dd = String(hoje.getDate()).padStart(2, '0');
    const hojeIso = `${yyyy}-${mm}-${dd}`;

    const vencIso = dataVencimentoStr.substring(0, 10);

    if (vencIso === hojeIso) {
      return 'COBRAR_HOJE';
    } else if (vencIso < hojeIso) {
      return 'ATRASADO';
    } else {
      return 'EM_DIA';
    }
  };

  // 1. Filtrar APENAS parcelas com vencimento HOJE ou ATRASADAS (exclui em dia e pagas)
  const cobrancasFiltradasPorData = parcelas.filter(p => {
    const statusC = getStatusCobranca(p.dataVencimento, p.status);
    return statusC === 'COBRAR_HOJE' || statusC === 'ATRASADO';
  });

  // 2. Filtro pelas abas (Todos / Cobrar Hoje / Atrasados)
  const cobrancasPorStatus = cobrancasFiltradasPorData.filter(p => {
    const statusC = getStatusCobranca(p.dataVencimento, p.status);
    if (filtroStatus === 'COBRAR_HOJE') return statusC === 'COBRAR_HOJE';
    if (filtroStatus === 'ATRASADO') return statusC === 'ATRASADO';
    return true;
  });

  // 3. Filtro por Busca de texto
  const parcelasExibidas = cobrancasPorStatus.filter(p => {
    const q = busca.toLowerCase().trim();
    if (!q) return true;
    const nome = p.venda?.cliente?.nome?.toLowerCase() || '';
    const end = p.venda?.cliente?.endereco?.toLowerCase() || '';
    const tel = p.venda?.cliente?.telefone || '';
    return nome.includes(q) || end.includes(q) || tel.includes(q);
  });

  // Contadores
  const qtdTotal = cobrancasFiltradasPorData.length;
  const qtdHoje = cobrancasFiltradasPorData.filter(p => getStatusCobranca(p.dataVencimento, p.status) === 'COBRAR_HOJE').length;
  const qtdAtrasados = cobrancasFiltradasPorData.filter(p => getStatusCobranca(p.dataVencimento, p.status) === 'ATRASADO').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '20px' }}>
      
      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search
          size={18}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Buscar cliente na rota (Cobrar Hoje / Atrasados)..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            width: '100%',
            height: '48px',
            padding: '0 14px 0 42px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            backgroundColor: '#FFFFFF',
            fontSize: '0.92rem',
            outline: 'none',
            boxShadow: 'var(--shadow-sm)',
          }}
        />
      </div>

      {/* Filter Tabs: Todos, Cobrar Hoje, Atrasados */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        <button
          type="button"
          onClick={() => setFiltroStatus('TODOS')}
          style={{
            padding: '10px 4px',
            borderRadius: 'var(--radius-md)',
            border: filtroStatus === 'TODOS' ? '2px solid var(--accent-600)' : '1px solid var(--border-color)',
            backgroundColor: filtroStatus === 'TODOS' ? 'var(--accent-50)' : '#FFFFFF',
            color: filtroStatus === 'TODOS' ? 'var(--accent-700)' : 'var(--primary-800)',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <span>Todos ({qtdTotal})</span>
        </button>

        <button
          type="button"
          onClick={() => setFiltroStatus('COBRAR_HOJE')}
          style={{
            padding: '10px 4px',
            borderRadius: 'var(--radius-md)',
            border: filtroStatus === 'COBRAR_HOJE' ? '2px solid #EA580C' : '1px solid var(--border-color)',
            backgroundColor: filtroStatus === 'COBRAR_HOJE' ? '#FFEDD5' : '#FFFFFF',
            color: filtroStatus === 'COBRAR_HOJE' ? '#C2410C' : '#C2410C',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <span>🟠 Cobrar Hoje ({qtdHoje})</span>
        </button>

        <button
          type="button"
          onClick={() => setFiltroStatus('ATRASADO')}
          style={{
            padding: '10px 4px',
            borderRadius: 'var(--radius-md)',
            border: filtroStatus === 'ATRASADO' ? '2px solid #DC2626' : '1px solid var(--border-color)',
            backgroundColor: filtroStatus === 'ATRASADO' ? '#FEE2E2' : '#FFFFFF',
            color: filtroStatus === 'ATRASADO' ? '#B91C1C' : '#B91C1C',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <span>🔴 Atrasados ({qtdAtrasados})</span>
        </button>
      </div>

      {loading && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando rota de cobrança de hoje...
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '14px',
            backgroundColor: 'var(--status-atrasada-bg)',
            color: 'var(--status-atrasada-text)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Parcelas Cards List */}
      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {parcelasExibidas.length === 0 ? (
            <div 
              style={{ 
                padding: '24px 16px', 
                textAlign: 'center', 
                backgroundColor: '#FFFFFF', 
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                {busca 
                  ? `Nenhum cliente em cobrança hoje ou em atraso encontrado com "${busca}".` 
                  : 'Nenhuma cobrança pendente para hoje ou em atraso!'}
              </div>

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('clientes')}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--accent-600)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <Users size={18} />
                  <span>Ver Todos os Clientes na Aba Clientes</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          ) : (
            parcelasExibidas.map((p) => {
              const statusC = getStatusCobranca(p.dataVencimento, p.status);
              const isHoje = statusC === 'COBRAR_HOJE';
              const cliente = p.venda?.cliente;

              const [yyyy, mm, dd] = p.dataVencimento.substring(0, 10).split('-');
              const dataVencFormatada = `${dd}/${mm}/${yyyy}`;

              // Visual styles based on status (Cobrar Hoje = Orange, Atrasado = Red)
              const cardBorderLeft = isHoje ? '6px solid #F97316' : '6px solid #DC2626';
              const badgeBg = isHoje ? '#FFEDD5' : '#FEE2E2';
              const badgeText = isHoje ? '#C2410C' : '#B91C1C';
              const statusLabel = isHoje ? '🟠 Cobrar Hoje' : '🔴 Atrasado';

              return (
                <div
                  key={p.id}
                  onClick={() => abrirDetalhe(p)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    border: '1px solid var(--border-color)',
                    borderLeft: cardBorderLeft,
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Top Header Row: Customer Name & Status Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, paddingRight: '8px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-800)', margin: 0 }}>
                        {cliente?.nome || 'Cliente não identificado'}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <MapPin size={14} color="var(--accent-600)" /> {cliente?.endereco || 'Endereço não cadastrado'}
                      </p>
                    </div>

                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: badgeBg,
                        color: badgeText,
                        fontWeight: 800,
                        fontSize: '0.76rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  {/* Contact Row */}
                  {cliente?.telefone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a
                        href={`tel:${cliente.telefone}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'var(--accent-700)',
                          backgroundColor: 'var(--accent-50)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          textDecoration: 'none',
                          border: '1px solid var(--accent-600)'
                        }}
                      >
                        <Phone size={13} />
                        <span>{cliente.telefone}</span>
                      </a>
                    </div>
                  )}

                  {/* Footer Row: Parcela Info & Action Button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', paddingTop: '10px', borderTop: '1px solid var(--bg-subtle)' }}>
                    <div>
                      <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Parcela {p.numero}/{p.venda?.numParcelas || 1} • Venc: {dataVencFormatada}
                      </span>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: isHoje ? '#C2410C' : '#B91C1C' }}>
                        R$ {Number(p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <button
                      className="touch-target"
                      style={{
                        height: '42px',
                        padding: '0 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isHoje ? '#FFEDD5' : '#FEE2E2',
                        color: isHoje ? '#C2410C' : '#B91C1C',
                        border: `1px solid ${isHoje ? '#FDBA74' : '#FCA5A5'}`,
                        fontWeight: 800,
                        fontSize: '0.84rem',
                      }}
                    >
                      Cobrar R$ {Number(p.valor).toFixed(2)}
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Prompt to navigate to Clientes tab */}
          {onNavigate && cobrancasFiltradasPorData.length > 0 && (
            <div style={{ marginTop: '10px', padding: '12px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Precisa consultar um cliente que não está em cobrança hoje?
              </span>
              <button
                type="button"
                onClick={() => onNavigate('clientes')}
                style={{
                  marginTop: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'transparent',
                  color: 'var(--accent-700)',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <span>Ir para a Aba Clientes (Ver Todos)</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL DETALHE DA PARCELA */}
      {/* -------------------------------------------------------------------------- */}
      {parcelaSelecionada && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '500px',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 'var(--radius-lg)',
              borderTopRightRadius: 'var(--radius-lg)',
              padding: '24px 20px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: getStatusCobranca(parcelaSelecionada.dataVencimento, parcelaSelecionada.status) === 'COBRAR_HOJE' ? '#FFEDD5' : '#FEE2E2',
                    color: getStatusCobranca(parcelaSelecionada.dataVencimento, parcelaSelecionada.status) === 'COBRAR_HOJE' ? '#C2410C' : '#B91C1C',
                    fontWeight: 800,
                    fontSize: '0.78rem'
                  }}
                >
                  {getStatusCobranca(parcelaSelecionada.dataVencimento, parcelaSelecionada.status) === 'COBRAR_HOJE' ? '🟠 Cobrar Hoje' : '🔴 Atrasado'}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  Parcela #{parcelaSelecionada.numero}
                </span>
              </div>

              <button
                onClick={() => setParcelaSelecionada(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Customer Details Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                {parcelaSelecionada.venda?.cliente?.nome}
              </h3>
              
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="var(--accent-600)" /> {parcelaSelecionada.venda?.cliente?.endereco}
              </p>

              {parcelaSelecionada.venda?.cliente?.referencias && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                  Ref: {parcelaSelecionada.venda.cliente.referencias}
                </p>
              )}

              {/* Call Button (link tel:) */}
              <a
                href={`tel:${parcelaSelecionada.venda?.cliente?.telefone}`}
                className="touch-target"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  height: '46px',
                  marginTop: '12px',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--accent-700)',
                  border: '1px solid var(--accent-600)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <Phone size={18} />
                <span>Ligar para {parcelaSelecionada.venda?.cliente?.telefone}</span>
              </a>
            </div>

            {/* Sale & Installment Details */}
            <div style={{ marginBottom: '20px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                PRODUTO & VALOR
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                {parcelaSelecionada.venda?.itens?.[0]?.produto?.nome || 'Venda de Crediário'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.85rem' }}>
                <span>Valor da Parcela:</span>
                <strong style={{ color: 'var(--primary-800)' }}>
                  R$ {Number(parcelaSelecionada.valor).toFixed(2)}
                </strong>
              </div>
              {parcelaSelecionada.valorPago && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.85rem', color: '#15803D' }}>
                  <span>Valor já pago:</span>
                  <strong>R$ {Number(parcelaSelecionada.valorPago).toFixed(2)}</strong>
                </div>
              )}
              {parcelaSelecionada.observacao && (
                <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#B45309' }}>
                  💬 <strong>Observação:</strong> {parcelaSelecionada.observacao}
                </div>
              )}
            </div>

            {/* Main Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => setModalPagamento(true)}
                className="touch-target"
                style={{
                  width: '100%',
                  height: 'var(--touch-target-large)',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(22, 163, 74, 0.3)',
                }}
              >
                <DollarSign size={20} />
                <span>Registrar Pagamento</span>
              </button>

              <button
                onClick={() => setModalObservacao(true)}
                className="touch-target"
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--primary-800)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <FileText size={18} />
                <span>Registrar Observação</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-modal: Form de Registrar Pagamento */}
      {modalPagamento && parcelaSelecionada && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-800)', marginBottom: '14px' }}>
              Registrar Pagamento
            </h3>
            
            <form onSubmit={handleSalvarPagamento}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Valor Pago (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={valorPagoInput}
                  onChange={(e) => setValorPagoInput(e.target.value)}
                  required
                  style={{ width: '100%', height: '48px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '1.1rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Data do Pagamento
                </label>
                <input
                  type="date"
                  value={dataPagamentoInput}
                  onChange={(e) => setDataPagamentoInput(e.target.value)}
                  style={{ width: '100%', height: '48px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalPagamento(false)}
                  style={{ flex: 1, height: '44px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  style={{ flex: 1, height: '44px', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: '#16A34A', color: '#FFFFFF', fontWeight: 700 }}
                >
                  {salvando ? 'Salvando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-modal: Form de Registrar Observação */}
      {modalObservacao && parcelaSelecionada && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-800)', marginBottom: '14px' }}>
              Registrar Observação
            </h3>
            
            <form onSubmit={handleSalvarObservacao}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Observação de Campo
                </label>
                <textarea
                  rows={4}
                  value={observacaoInput}
                  onChange={(e) => setObservacaoInput(e.target.value)}
                  placeholder="Ex: Cliente viajou e retorna na quinta-feira..."
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalObservacao(false)}
                  style={{ flex: 1, height: '44px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  style={{ flex: 1, height: '44px', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: 'var(--accent-600)', color: '#FFFFFF', fontWeight: 700 }}
                >
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
