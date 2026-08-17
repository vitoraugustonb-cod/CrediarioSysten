import React, { useCallback, useEffect, useState } from 'react';
import { 
  Search,
  DollarSign,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { 
  getClientes, 
  getSaldoCliente, 
  getClientePorId,
  registrarPagamentoAPI,
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
  const [historicoVendas, setHistoricoVendas] = useState<any[]>([]);

  // Advance Payment Modal / Form State
  const [parcelaParaPagamento, setParcelaParaPagamento] = useState<any | null>(null);
  const [valorPagoInput, setValorPagoInput] = useState<string>('');
  const [dataPagamentoInput, setDataPagamentoInput] = useState<string>('');
  const [salvandoPagamento, setSalvandoPagamento] = useState<boolean>(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const carregarClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await getClientes(token);
      setClientes(dados);
    } catch {
      setError('Erro ao carregar clientes.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  const abrirDetalheCliente = async (c: Cliente) => {
    setClienteDetalhe(c);
    setLoadingDetalhe(true);
    setMensagemSucesso(null);
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

  const iniciarPagamentoAdiantado = (p: any) => {
    const valorRestante = Number(p.valor) - (p.valorPago ? Number(p.valorPago) : 0);
    setParcelaParaPagamento(p);
    setValorPagoInput(valorRestante.toFixed(2));
    setDataPagamentoInput(new Date().toISOString().substring(0, 10));
  };

  const handleConfirmarPagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parcelaParaPagamento || !valorPagoInput || !clienteDetalhe) return;

    const val = parseFloat(valorPagoInput);
    if (isNaN(val) || val <= 0) {
      alert('Informe um valor válido maior que zero.');
      return;
    }

    setSalvandoPagamento(true);
    try {
      await registrarPagamentoAPI(
        parcelaParaPagamento.id,
        val,
        dataPagamentoInput,
        token
      );

      setMensagemSucesso(`✅ Pagamento adiantado de R$ ${val.toFixed(2)} registrado com sucesso!`);
      setParcelaParaPagamento(null);

      // Recarrega os dados do cliente para atualizar o saldo e status
      await abrirDetalheCliente(clienteDetalhe);
    } catch (err: any) {
      alert(`❌ Erro ao registrar pagamento: ${err.message}`);
    } finally {
      setSalvandoPagamento(false);
    }
  };

  const clientesFiltrados = clientes.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone.includes(busca) ||
    c.endereco.toLowerCase().includes(busca.toLowerCase())
  );

  // Extrair parcelas em aberto
  const parcelasEmAberto = historicoVendas
    .flatMap((v: any) => (v.parcelas || []).map((p: any) => ({ ...p, venda: v })))
    .filter((p: any) => ['PENDENTE', 'ATRASADA', 'PARCIAL'].includes(p.status))
    .sort((a: any, b: any) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime());

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)' }}>
            Base Geral de Clientes
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Consulte dados cadastrais, histórico de dívidas e registre pagamentos adiantados.
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

      {/* Modal / Drawer: Detalhes do Cliente */}
      <Modal
        isOpen={!!clienteDetalhe}
        onClose={() => { setClienteDetalhe(null); setParcelaParaPagamento(null); }}
        title={`Ficha do Cliente: ${clienteDetalhe?.nome || ''}`}
        maxWidth="650px"
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

            {mensagemSucesso && (
              <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', color: '#166534', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.88rem', fontWeight: 600 }}>
                {mensagemSucesso}
              </div>
            )}

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

                {/* Form de Pagamento Adiantado em Exibição */}
                {parcelaParaPagamento ? (
                  <form onSubmit={handleConfirmarPagamento} style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#166534', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <DollarSign size={18} />
                        Pagamento Adiantado - Parcela #{parcelaParaPagamento.numero}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setParcelaParaPagamento(null)}
                        style={{ background: 'none', border: 'none', color: '#166534', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Cancelar
                      </button>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: '#15803D' }}>
                      Valor total da parcela: <strong>R$ {Number(parcelaParaPagamento.valor).toFixed(2)}</strong> | Vencimento: {new Date(parcelaParaPagamento.dataVencimento).toLocaleDateString('pt-BR')}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>
                          Valor Pago (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          value={valorPagoInput}
                          onChange={(e) => setValorPagoInput(e.target.value)}
                          style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: 'var(--radius-sm)', border: '1px solid #86EFAC', fontSize: '0.9rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>
                          Data do Pagamento
                        </label>
                        <input
                          type="date"
                          required
                          value={dataPagamentoInput}
                          onChange={(e) => setDataPagamentoInput(e.target.value)}
                          style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: 'var(--radius-sm)', border: '1px solid #86EFAC', fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={salvandoPagamento}
                      style={{
                        height: '40px',
                        backgroundColor: '#166534',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        marginTop: '4px'
                      }}
                    >
                      {salvandoPagamento ? 'Registrando...' : 'Confirmar Recebimento'}
                    </button>
                  </form>
                ) : (
                  /* Lista de Parcelas em Aberto para Pagamento Adiantado */
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '8px' }}>
                      Parcelas em Aberto (Prontas para Quitar/Abater)
                    </h4>
                    {parcelasEmAberto.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Este cliente não possui nenhuma parcela em aberto.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {parcelasEmAberto.map((p: any) => {
                          const vPago = p.valorPago ? Number(p.valorPago) : 0;
                          const resta = Number(p.valor) - vPago;
                          return (
                            <div key={p.id} style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                                  Parcela #{p.numero} (Venda #{p.vendaId})
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                  Vencimento: {new Date(p.dataVencimento).toLocaleDateString('pt-BR')} • Status: <strong style={{ color: p.status === 'ATRASADA' ? '#B91C1C' : '#D97706' }}>{p.status}</strong>
                                </div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-600)', marginTop: '2px' }}>
                                  Restante: R$ {resta.toFixed(2)} (de R$ {Number(p.valor).toFixed(2)})
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => iniciarPagamentoAdiantado(p)}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: 'var(--radius-md)',
                                  backgroundColor: '#166534',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontWeight: 700,
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <DollarSign size={14} />
                                Pagar
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

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

