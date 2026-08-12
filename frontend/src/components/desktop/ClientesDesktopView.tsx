import React, { useEffect, useState } from 'react';
import { 
  Search 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getClientes, 
  getSaldoCliente, 
  getClientePorId,
  type Cliente, 
  type SaldoDevedorCliente 
} from '../../services/api';
import { Modal } from '../common/Modal';

export const ClientesDesktopView: React.FC = () => {
  const { token } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>('');

  // Selected Client Modal Detail
  const [clienteDetalhe, setClienteDetalhe] = useState<Cliente | null>(null);
  const [saldo, setSaldo] = useState<SaldoDevedorCliente | null>(null);
  const [loadingDetalhe, setLoadingDetalhe] = useState<boolean>(false);

  const carregarClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await getClientes(token);
      setClientes(dados);
    } catch (err: any) {
      setError('Erro ao carregar clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const [historicoVendas, setHistoricoVendas] = useState<any[]>([]);

  const abrirDetalheCliente = async (c: Cliente) => {
    setClienteDetalhe(c);
    setLoadingDetalhe(true);
    try {
      const [s, fullData] = await Promise.all([
        getSaldoCliente(c.id, token),
        getClientePorId(c.id, token)
      ]);
      setSaldo(s);
      setHistoricoVendas(fullData?.vendas || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetalhe(false);
    }
  };

  const clientesFiltrados = clientes.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone.includes(busca) ||
    c.endereco.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)' }}>
            Base Geral de Clientes
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Consulte dados cadastrais, histórico de dívidas e saldo devedor de cada cliente.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <Search
          size={18}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Buscar por nome, telefone ou endereço..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            width: '100%',
            height: '44px',
            padding: '0 14px 0 42px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: '#FFFFFF',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
      </div>

      {loading && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando clientes...
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
                <th style={{ padding: '14px 20px' }}>Cliente</th>
                <th style={{ padding: '14px 20px' }}>Telefone</th>
                <th style={{ padding: '14px 20px' }}>Endereço</th>
                <th style={{ padding: '14px 20px' }}>Referências</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.92rem' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--primary-800)' }}>{c.nome}</td>
                  <td style={{ padding: '14px 20px' }}>{c.telefone}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{c.endereco}</td>
                  <td style={{ padding: '14px 20px', fontSize: '0.82rem', color: 'var(--text-light)' }}>
                    {c.referencias || '-'}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => abrirDetalheCliente(c)}
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
                      Ver Perfil & Saldo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal / Drawer: Detalhes do Cliente (GET /clientes/:id & GET /clientes/:id/saldo) */}
      <Modal
        isOpen={!!clienteDetalhe}
        onClose={() => setClienteDetalhe(null)}
        title={`Ficha do Cliente: ${clienteDetalhe?.nome || ''}`}
        maxWidth="600px"
      >
        {clienteDetalhe && (
          <>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>📞 Telefone: {clienteDetalhe.telefone}</p>
              <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>📍 Endereço: {clienteDetalhe.endereco}</p>
              {clienteDetalhe.referencias && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  📌 Ref: {clienteDetalhe.referencias}
                </p>
              )}
            </div>

            {loadingDetalhe ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Consultando saldo devedor e histórico...
              </div>
            ) : saldo && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#B91C1C', textTransform: 'uppercase' }}>
                    Saldo Devedor Total
                  </span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#B91C1C', marginTop: '2px' }}>
                    R$ {Number(saldo.saldoDevedorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Parcelas em Aberto</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                      {saldo.totalParcelasEmAberto}
                    </div>
                  </div>

                  <div style={{ padding: '12px', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', backgroundColor: '#FEF2F2' }}>
                    <span style={{ fontSize: '0.75rem', color: '#B91C1C' }}>Parcelas em Atraso</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#B91C1C' }}>
                      {saldo.parcelasEmAtraso}
                    </div>
                  </div>
                </div>

                {/* Histórico de Vendas do Cliente */}
                <div style={{ marginTop: '8px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '8px' }}>
                    Histórico de Vendas Realizadas
                  </h4>
                  {historicoVendas.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nenhuma venda registrada para este cliente.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {historicoVendas.map((v: any) => (
                        <div key={v.id} style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700 }}>
                            <span>Venda #{v.id} - {v.produto?.nome || 'Produto'}</span>
                            <span style={{ color: 'var(--primary-800)' }}>R$ {Number(v.valorTotal).toFixed(2)}</span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Data: {new Date(v.dataVenda).toLocaleDateString('pt-BR')} • {v.numParcelas}x parcelas
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};
