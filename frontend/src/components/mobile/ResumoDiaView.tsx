import React, { useCallback, useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Wallet, 
  Calendar, 
  RefreshCw, 
  PlusCircle, 
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  X,
  User
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getPrestacaoContasDia, type PrestacaoContasDia } from '../../services/api';

interface ResumoDiaViewProps {
  onNavigate: (tab: string) => void;
}

function getDataHojeLocal(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export const ResumoDiaView: React.FC<ResumoDiaViewProps> = ({ onNavigate }) => {
  const { token } = useAuth();
  const [dataSel, setDataSel] = useState<string>(getDataHojeLocal());
  const [resumo, setResumo] = useState<PrestacaoContasDia | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [detalheAberto, setDetalheAberto] = useState<'cobrancas' | 'vendas' | null>(null);

  const carregarResumo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await getPrestacaoContasDia(token, dataSel);
      setResumo(dados);
    } catch {
      setError('Não foi possível carregar a prestação de contas do dia.');
    } finally {
      setLoading(false);
    }
  }, [token, dataSel]);

  useEffect(() => {
    carregarResumo();
  }, [carregarResumo]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Date Header Filter */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '16px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="var(--accent-600)" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              Data da Prestação
            </span>
            <input
              type="date"
              value={dataSel}
              onChange={(e) => setDataSel(e.target.value)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: 'var(--primary-800)',
                outline: 'none',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>

        <button
          onClick={carregarResumo}
          className="touch-target"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
        </button>
      </div>

      {loading && (
        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando resumo do dia...
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

      {!loading && resumo && (
        <>
          {/* Main Metric Cards (Clicáveis para abrir o detalhamento) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Card: Total Vendido no Dia */}
            <div
              onClick={() => setDetalheAberto(detalheAberto === 'vendas' ? null : 'vendas')}
              className="touch-target"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: detalheAberto === 'vendas' ? '2px solid #2563EB' : '1px solid var(--border-color)',
                borderTop: '4px solid var(--accent-600)',
                boxShadow: detalheAberto === 'vendas' ? '0 4px 12px rgba(37, 99, 235, 0.18)' : 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Total Vendido
                  </span>
                  <div style={{ padding: '6px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                    <ShoppingBag size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                  R$ {resumo.totalVendido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                  {resumo.qtdVendas} {resumo.qtdVendas === 1 ? 'venda' : 'vendas'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '6px', borderTop: '1px dashed var(--border-subtle, #E2E8F0)', fontSize: '0.72rem', color: detalheAberto === 'vendas' ? '#2563EB' : 'var(--text-muted)', fontWeight: 700 }}>
                <span>{detalheAberto === 'vendas' ? 'Ocultar detalhes' : 'Ver lista'}</span>
                {detalheAberto === 'vendas' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </div>

            {/* Card: Total Cobrado no Dia */}
            <div
              onClick={() => setDetalheAberto(detalheAberto === 'cobrancas' ? null : 'cobrancas')}
              className="touch-target"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: detalheAberto === 'cobrancas' ? '2px solid #16A34A' : '1px solid var(--border-color)',
                borderTop: '4px solid #16A34A',
                boxShadow: detalheAberto === 'cobrancas' ? '0 4px 12px rgba(22, 163, 74, 0.18)' : 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Total Cobrado
                  </span>
                  <div style={{ padding: '6px', borderRadius: 'var(--radius-md)', backgroundColor: '#DCFCE7', color: '#16A34A' }}>
                    <Wallet size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#15803D' }}>
                  R$ {resumo.totalCobrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                  {resumo.qtdCobrancas} {resumo.qtdCobrancas === 1 ? 'recebimento' : 'recebimentos'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '6px', borderTop: '1px dashed var(--border-subtle, #E2E8F0)', fontSize: '0.72rem', color: detalheAberto === 'cobrancas' ? '#16A34A' : 'var(--text-muted)', fontWeight: 700 }}>
                <span>{detalheAberto === 'cobrancas' ? 'Ocultar detalhes' : 'Ver lista'}</span>
                {detalheAberto === 'cobrancas' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------------- */}
          {/* PAINEL EXPANSÍVEL 1: LISTA CORRIDA DE COBRANÇAS DO DIA */}
          {/* -------------------------------------------------------------------------- */}
          {detalheAberto === 'cobrancas' && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                border: '1px solid #86EFAC',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ padding: '6px', backgroundColor: '#DCFCE7', borderRadius: 'var(--radius-sm)', color: '#16A34A' }}>
                    <Wallet size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--primary-800)', margin: 0 }}>
                      Recebimentos do Dia ({resumo.cobrancasDetalhes?.length || 0})
                    </h3>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Clientes que pagaram nesta data
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDetalheAberto(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Lista corrida de clientes que pagaram */}
              {(!resumo.cobrancasDetalhes || resumo.cobrancasDetalhes.length === 0) ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Nenhuma cobrança recebida nesta data.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px', overflowY: 'auto' }}>
                  {resumo.cobrancasDetalhes.map((c, idx) => (
                    <div
                      key={c.id || idx}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.92rem', color: 'var(--primary-800)' }}>
                          <User size={15} color="var(--accent-600)" />
                          <span>{c.clienteNome}</span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{c.produtoNome}</span>
                          {c.clienteTelefone && (
                            <>
                              <span>•</span>
                              <span>📞 {c.clienteTelefone}</span>
                            </>
                          )}
                        </div>
                        {c.detalhes && (
                          <div style={{ fontSize: '0.72rem', color: '#166534', marginTop: '2px' }}>
                            {c.detalhes}
                          </div>
                        )}
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                          Valor Pago
                        </span>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#166534' }}>
                          + R$ {c.valorPago.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* -------------------------------------------------------------------------- */}
          {/* PAINEL EXPANSÍVEL 2: LISTA CORRIDA DE VENDAS DO DIA */}
          {/* -------------------------------------------------------------------------- */}
          {detalheAberto === 'vendas' && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                border: '1px solid #93C5FD',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ padding: '6px', backgroundColor: '#DBEAFE', borderRadius: 'var(--radius-sm)', color: '#2563EB' }}>
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--primary-800)', margin: 0 }}>
                      Vendas Realizadas no Dia ({resumo.vendasDetalhes?.length || 0})
                    </h3>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Clientes, produtos e valores vendidos
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDetalheAberto(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Lista corrida de vendas */}
              {(!resumo.vendasDetalhes || resumo.vendasDetalhes.length === 0) ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Nenhuma venda realizada nesta data.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px', overflowY: 'auto' }}>
                  {resumo.vendasDetalhes.map((v, idx) => (
                    <div
                      key={v.id || idx}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.92rem', color: 'var(--primary-800)' }}>
                          <User size={15} color="#2563EB" />
                          <span>{v.clienteNome}</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-800)', marginTop: '2px' }}>
                          📦 {v.nomeProduto || v.itensDesc}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#2563EB', marginTop: '2px', fontWeight: 600 }}>
                          {v.condicao}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                          Valor da Venda
                        </span>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E40AF' }}>
                          R$ {v.valorTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Detalhamento por Categoria */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Vendas do Dia por Categoria
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
              <div style={{ padding: '10px 12px', backgroundColor: '#E0F2FE', borderRadius: 'var(--radius-md)', border: '1px solid #BAE6FD' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369A1' }}>🪑 MÓVEIS</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0369A1', marginTop: '2px' }}>
                  R$ {(resumo.totalVendidoMoveis || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div style={{ padding: '10px 12px', backgroundColor: '#ECFDF5', borderRadius: 'var(--radius-md)', border: '1px solid #A7F3D0' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857' }}>🛍️ VARIEDADES</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065F46', marginTop: '2px' }}>
                  R$ {(resumo.totalVendidoVariedades || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '12px' }}>
              Ações Rápidas de Campo
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => onNavigate('cobrancas')}
                className="touch-target"
                style={{
                  width: '100%',
                  height: 'var(--touch-target-large)',
                  backgroundColor: 'var(--accent-600)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 16px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(37, 99, 235, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Wallet size={20} />
                  <span>Ver Cobranças do Dia</span>
                </div>
                <ArrowUpRight size={18} />
              </button>

              <button
                onClick={() => onNavigate('venda')}
                className="touch-target"
                style={{
                  width: '100%',
                  height: 'var(--touch-target-large)',
                  backgroundColor: 'var(--primary-800)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <PlusCircle size={20} />
                  <span>Nova Venda em Campo</span>
                </div>
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

