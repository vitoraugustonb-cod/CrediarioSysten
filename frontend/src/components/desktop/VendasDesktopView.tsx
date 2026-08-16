import React, { useCallback, useEffect, useState } from 'react';
import { 
  Calendar 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { 
  getVendas, 
  getVendaPorId, 
  type VendaItem
} from '../../services/api';

import { Modal } from '../common/Modal';

export const VendasDesktopView: React.FC = () => {
  const { token } = useAuth();
  const [vendas, setVendas] = useState<VendaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Date Filter State
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');

  // Selected Sale Modal (Carnê)
  const [vendaSelecionada, setVendaSelecionada] = useState<VendaItem | null>(null);
  const [loadingCarnes, setLoadingCarnes] = useState<boolean>(false);

  const carregarVendas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await getVendas(dataInicio, dataFim, token);
      setVendas(dados);
    } catch {
      setError('Erro ao carregar lista de vendas.');
    } finally {
      setLoading(false);
    }
  }, [dataInicio, dataFim, token]);

  useEffect(() => {
    carregarVendas();
  }, [carregarVendas]);

  const abrirCarneVenda = async (venda: VendaItem) => {
    setVendaSelecionada(venda);
    setLoadingCarnes(true);
    try {
      const detalhe = await getVendaPorId(venda.id, token);
      setVendaSelecionada(detalhe);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCarnes(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)' }}>
            Registro Geral de Vendas
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Consulte todas as vendas emitidas, itens de cada pedido e o carnê de parcelas.
          </p>
        </div>
      </div>

      {/* Date Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#FFFFFF', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="var(--accent-600)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>De:</span>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            style={{ border: '1px solid var(--border-subtle)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Até:</span>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            style={{ border: '1px solid var(--border-subtle)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}
          />
        </div>

        {(dataInicio || dataFim) && (
          <button
            onClick={() => { setDataInicio(''); setDataFim(''); }}
            style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {loading && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando vendas...
        </div>
      )}

      {error && (
        <div style={{ padding: '16px', backgroundColor: 'var(--status-atrasada-bg)', color: 'var(--status-atrasada-text)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px' }}>ID Venda</th>
                <th style={{ padding: '14px 20px' }}>Cliente</th>
                <th style={{ padding: '14px 20px' }}>Itens / Produtos</th>
                <th style={{ padding: '14px 20px' }}>Valor Total</th>
                <th style={{ padding: '14px 20px' }}>Parcelas</th>
                <th style={{ padding: '14px 20px' }}>Vendedor</th>
                <th style={{ padding: '14px 20px' }}>Data</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((v) => {
                const resumoItens = v.itens && v.itens.length > 0
                  ? v.itens.map(i => `${i.quantidade}x ${i.produto?.nome || 'Produto'}`).join(', ')
                  : 'Venda de Crediário';

                return (
                  <tr key={v.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.92rem' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--primary-800)' }}>#{v.id}</td>
                    <td style={{ padding: '14px 20px', fontWeight: 600 }}>{v.cliente?.nome || `Cliente #${v.clienteId}`}</td>
                    <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'var(--text-main)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {resumoItens}
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--primary-800)' }}>
                      R$ {Number(v.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 20px' }}>{v.numParcelas}x</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{v.vendedor?.nome || '-'}</td>
                    <td style={{ padding: '14px 20px', fontSize: '0.85rem' }}>
                      {new Date(v.dataVenda).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => abrirCarneVenda(v)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--accent-600)',
                          color: '#FFFFFF',
                          border: 'none',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                        }}
                      >
                        Ver Detalhes & Carnê
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Detalhes da Venda & Carnê */}
      <Modal
        isOpen={!!vendaSelecionada}
        onClose={() => setVendaSelecionada(null)}
        title={`Cliente: ${vendaSelecionada?.cliente?.nome || ''}`}
        subtitle={`DETALHES DA VENDA #${vendaSelecionada?.id || ''}`}
        maxWidth="680px"
      >
        {vendaSelecionada && (
          <>
            {/* List of Sold Items */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '8px', textTransform: 'uppercase' }}>
                Produtos Comprados ({vendaSelecionada.itens?.length || 0})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {vendaSelecionada.itens?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--primary-800)' }}>
                        {item.quantidade}x {item.produto?.nome || 'Produto'}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                        Categoria: [{item.produto?.categoria || 'MOVEIS'}] • R$ {Number(item.valorUnitario).toFixed(2)} / un
                      </span>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-800)' }}>
                      Subtotal: R$ {Number(item.subtotal).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', fontSize: '1rem', fontWeight: 800 }}>
                <span>Valor Total da Venda:</span>
                <span style={{ color: 'var(--accent-700)' }}>
                  R$ {Number(vendaSelecionada.valorTotal).toFixed(2)}
                </span>
              </div>
            </div>

            {loadingCarnes ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Carregando parcelas do carnê...
              </div>
            ) : (
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '8px' }}>
                  Carnê de Parcelas Geradas ({vendaSelecionada.numParcelas}x)
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '10px' }}>Nº</th>
                      <th style={{ padding: '10px' }}>Vencimento</th>
                      <th style={{ padding: '10px' }}>Valor</th>
                      <th style={{ padding: '10px' }}>Valor Pago</th>
                      <th style={{ padding: '10px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendaSelecionada.parcelas?.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
                        <td style={{ padding: '10px', fontWeight: 700 }}>Parcela #{p.numero}</td>
                        <td style={{ padding: '10px' }}>{new Date(p.dataVencimento).toLocaleDateString('pt-BR')}</td>
                        <td style={{ padding: '10px', fontWeight: 600 }}>R$ {Number(p.valor).toFixed(2)}</td>
                        <td style={{ padding: '10px', color: p.valorPago ? '#15803D' : 'var(--text-muted)' }}>
                          {p.valorPago ? `R$ ${Number(p.valorPago).toFixed(2)}` : '-'}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span className={`badge badge-${p.status}`}>
                            <span className="badge-dot" /> {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};
