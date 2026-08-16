import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  Phone, 
  MapPin, 
  DollarSign, 
  FileText, 
  X,
  ArrowRight,
  Users,
  CheckCircle2
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
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

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

    const nomeCliente = parcelaSelecionada.venda?.cliente?.nome || 'Cliente';
    const valorNum = parseFloat(valorPagoInput);

    setSalvando(true);
    try {
      await registrarPagamentoAPI(
        parcelaSelecionada.id,
        valorNum,
        dataPagamentoInput,
        token
      );
      
      // Fecha os modais limpos ANTES de recarregar a lista
      setModalPagamento(false);
      setParcelaSelecionada(null);
      
      // Recarrega lista de cobrancas ativas
      await carregarParcelas();

      // Exibe mensagem de sucesso visual na tela
      setMensagemSucesso(`✅ Pagamento de R$ ${valorNum.toFixed(2)} registrado para ${nomeCliente}! O valor foi abatido do saldo devedor.`);
      
      // Oculta a mensagem apos 5 segundos
      setTimeout(() => setMensagemSucesso(null), 5000);
    } catch (err: any) {
      alert(`❌ Erro ao registrar pagamento: ${err.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvarObservacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parcelaSelecionada) return;

    const nomeCliente = parcelaSelecionada.venda?.cliente?.nome || 'Cliente';

    setSalvando(true);
    try {
      await registrarObservacaoAPI(
        parcelaSelecionada.id,
        observacaoInput,
        token
      );
      
      setModalObservacao(false);
      setParcelaSelecionada(null);
      await carregarParcelas();
      
      setMensagemSucesso(`✅ Observação registrada para ${nomeCliente}!`);
      setTimeout(() => setMensagemSucesso(null), 4000);
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

  // 2. Filtro pelas abas (Cobrar Hoje / Atrasados)
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
  const qtdHoje = cobrancasFiltradasPorData.filter(p => getStatusCobranca(p.dataVencimento, p.status) === 'COBRAR_HOJE').length;
  const qtdAtrasados = cobrancasFiltradasPorData.filter(p => getStatusCobranca(p.dataVencimento, p.status) === 'ATRASADO').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '20px' }}>
      
      {/* Banner de Mensagem de Sucesso (Não-bloqueante) */}
      {mensagemSucesso && (
        <div
          style={{
            padding: '14px 16px',
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: '1px solid #86EFAC',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <CheckCircle2 size={20} color="#16A34A" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

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

      {/* Filter Tabs: Cobrar Hoje & Atrasados */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <button
          type="button"
          onClick={() => setFiltroStatus(filtroStatus === 'COBRAR_HOJE' ? 'TODOS' : 'COBRAR_HOJE')}
          style={{
            padding: '10px 4px',
            borderRadius: 'var(--radius-md)',
            border: filtroStatus === 'COBRAR_HOJE' ? '2px solid #EA580C' : '1px solid var(--border-color)',
            backgroundColor: filtroStatus === 'COBRAR_HOJE' ? '#FFEDD5' : '#FFFFFF',
            color: '#C2410C',
            fontWeight: 800,
            fontSize: '0.84rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: filtroStatus === 'COBRAR_HOJE' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <span>🟠 Cobrar Hoje ({qtdHoje})</span>
        </button>

        <button
          type="button"
          onClick={() => setFiltroStatus(filtroStatus === 'ATRASADO' ? 'TODOS' : 'ATRASADO')}
          style={{
            padding: '10px 4px',
            borderRadius: 'var(--radius-md)',
            border: filtroStatus === 'ATRASADO' ? '2px solid #DC2626' : '1px solid var(--border-color)',
            backgroundColor: filtroStatus === 'ATRASADO' ? '#FEE2E2' : '#FFFFFF',
            color: '#B91C1C',
            fontWeight: 800,
            fontSize: '0.84rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: filtroStatus === 'ATRASADO' ? 'var(--shadow-sm)' : 'none'
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

      {/* Parcelas Grid of Vertical Rectangular Cards */}
      {!loading && (
        <>
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
            <div className="cobrancas-grid">
              {parcelasExibidas.map((p) => {
                const statusC = getStatusCobranca(p.dataVencimento, p.status);
                const isHoje = statusC === 'COBRAR_HOJE';
                const cliente = p.venda?.cliente;

                const [yyyy, mm, dd] = p.dataVencimento.substring(0, 10).split('-');
                const dataVencFormatada = `${dd}/${mm}/${yyyy}`;

                // Card styles (Vertical rectangular card)
                const cardBorderTop = isHoje ? '5px solid #F97316' : '5px solid #DC2626';
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
                      padding: '14px 12px',
                      border: '1px solid var(--border-color)',
                      borderTop: cardBorderTop,
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '10px',
                      minHeight: '210px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Top Status Badge */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: badgeBg,
                          color: badgeText,
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          textAlign: 'center',
                          display: 'inline-block',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center' }}>
                      <h4
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 800,
                          color: 'var(--primary-800)',
                          margin: 0,
                          lineHeight: 1.2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                        title={cliente?.nome}
                      >
                        {cliente?.nome || 'Cliente'}
                      </h4>

                      <p
                        style={{
                          fontSize: '0.74rem',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '3px',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={cliente?.endereco}
                      >
                        <MapPin size={12} color="var(--accent-600)" />
                        <span>{cliente?.endereco || 'Sem endereço'}</span>
                      </p>
                    </div>

                    {/* Installment Info & Amount */}
                    <div style={{ padding: '8px 4px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>
                        P. {p.numero}/{p.venda?.numParcelas || 1} • {dataVencFormatada}
                      </span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isHoje ? '#C2410C' : '#B91C1C', marginTop: '2px' }}>
                        R$ {Number(p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className="touch-target"
                      style={{
                        width: '100%',
                        height: '38px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isHoje ? '#FFEDD5' : '#FEE2E2',
                        color: isHoje ? '#C2410C' : '#B91C1C',
                        border: `1px solid ${isHoje ? '#FDBA74' : '#FCA5A5'}`,
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Cobrar
                    </button>
                  </div>
                );
              })}
            </div>
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
        </>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL DETALHE DA PARCELA (CENTRALIZADO NA TELA COM PORTAL E BLUR) */}
      {/* -------------------------------------------------------------------------- */}
      {parcelaSelecionada && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setParcelaSelecionada(null);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              maxHeight: '88vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              position: 'relative',
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
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-800)' }}>
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
                  height: '44px',
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
            <div style={{ marginBottom: '20px', padding: '14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#FFFFFF' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Produto & Valor
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                {parcelaSelecionada.venda?.itens?.[0]?.produto?.nome || 'Venda de Crediário'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.9rem' }}>
                <span>Valor da Parcela:</span>
                <strong style={{ color: 'var(--primary-800)', fontSize: '1.05rem' }}>
                  R$ {Number(parcelaSelecionada.valor).toFixed(2)}
                </strong>
              </div>
              {parcelaSelecionada.valorPago && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.88rem', color: '#15803D' }}>
                  <span>Valor já pago:</span>
                  <strong>R$ {Number(parcelaSelecionada.valorPago).toFixed(2)}</strong>
                </div>
              )}
              {parcelaSelecionada.observacao && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: '#B45309' }}>
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
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.35)',
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
                  fontWeight: 700,
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
        </div>,
        document.body
      )}

      {/* Sub-modal: Form de Registrar Pagamento */}
      {modalPagamento && parcelaSelecionada && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalPagamento(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 10010,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                Registrar Pagamento
              </h3>
              <button
                onClick={() => setModalPagamento(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSalvarPagamento} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: 'var(--primary-800)' }}>
                  Valor Pago (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={valorPagoInput}
                  onChange={(e) => setValorPagoInput(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: 'var(--accent-700)',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: 'var(--primary-800)' }}>
                  Data do Pagamento *
                </label>
                <input
                  type="date"
                  value={dataPagamentoInput}
                  onChange={(e) => setDataPagamentoInput(e.target.value)}
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.95rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalPagamento(false)}
                  style={{
                    flex: 1,
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  style={{
                    flex: 1,
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: '#16A34A',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {salvando ? 'Salvando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Sub-modal: Form de Registrar Observação */}
      {modalObservacao && parcelaSelecionada && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalObservacao(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 10010,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                Registrar Observação
              </h3>
              <button
                onClick={() => setModalObservacao(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSalvarObservacao} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: 'var(--primary-800)' }}>
                  Observação de Campo *
                </label>
                <textarea
                  rows={4}
                  value={observacaoInput}
                  onChange={(e) => setObservacaoInput(e.target.value)}
                  placeholder="Ex: Cliente viajou e retorna na quinta-feira..."
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.95rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalObservacao(false)}
                  style={{
                    flex: 1,
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  style={{
                    flex: 1,
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: 'var(--accent-600)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
