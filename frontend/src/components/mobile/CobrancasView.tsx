import React, { useCallback, useEffect, useState } from 'react';
import { 
  Search, 
  Phone, 
  MapPin, 
  DollarSign, 
  FileText, 
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { 
  getParcelas, 
  registrarPagamentoAPI, 
  registrarObservacaoAPI, 
  type Parcela 
} from '../../services/api';

export const CobrancasView: React.FC = () => {
  const { token } = useAuth();
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>('');

  // Selected Parcela for Detail Modal
  const [parcelaSelecionada, setParcelaSelecionada] = useState<Parcela | null>(null);

  // Sub-modals for Action
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

  // Filtered and Sorted (ATRASADAS top)
  const parcelasFiltradas = parcelas.filter(p => {
    const nome = p.venda?.cliente?.nome?.toLowerCase() || '';
    const end = p.venda?.cliente?.endereco?.toLowerCase() || '';
    const q = busca.toLowerCase();
    return nome.includes(q) || end.includes(q);
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search
          size={18}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Buscar cliente na rota de hoje..."
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

      {loading && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando lista de cobranças...
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

      {/* Parcelas List */}
      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {parcelasFiltradas.length === 0 ? (
            <div style={{ padding: '30px 16px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)' }}>
              Nenhuma cobrança pendente encontrada.
            </div>
          ) : (
            parcelasFiltradas.map((p) => {
              const isAtrasada = p.status === 'ATRASADA';
              const cliente = p.venda?.cliente;
              const dataVenc = new Date(p.dataVencimento).toLocaleDateString('pt-BR');

              return (
                <div
                  key={p.id}
                  onClick={() => abrirDetalhe(p)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    border: '1px solid var(--border-color)',
                    borderLeft: `5px solid var(--status-${p.status.toLowerCase()}-dot, var(--accent-600))`,
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                        {cliente?.nome || 'Cliente não identificado'}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <MapPin size={14} color="var(--accent-600)" /> {cliente?.endereco || 'Sem endereço'}
                      </p>
                    </div>

                    <span className={`badge badge-${p.status}`}>
                      <span className="badge-dot" /> {p.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--bg-subtle)' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Parcela {p.numero}/{p.venda?.numParcelas || 1} • Venc: {dataVenc}
                      </span>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isAtrasada ? '#B91C1C' : 'var(--primary-800)' }}>
                        R$ {Number(p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    {/* Touch Action Button */}
                    <button
                      className="touch-target"
                      style={{
                        height: '44px',
                        padding: '0 16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isAtrasada ? '#FEE2E2' : 'var(--accent-50)',
                        color: isAtrasada ? '#B91C1C' : 'var(--accent-700)',
                        border: `1px solid ${isAtrasada ? '#FCA5A5' : 'var(--accent-600)'}`,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              );
            })
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
                <span className={`badge badge-${parcelaSelecionada.status}`}>
                  <span className="badge-dot" /> {parcelaSelecionada.status}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
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
                  fontWeight: 700,
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

      {/* Sub-modal: Form de Registrar Pagamento (PATCH /parcelas/:id/pagamento) */}
      {modalPagamento && parcelaSelecionada && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
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

      {/* Sub-modal: Form de Registrar Observação (PATCH /parcelas/:id/observacao) */}
      {modalObservacao && parcelaSelecionada && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
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
