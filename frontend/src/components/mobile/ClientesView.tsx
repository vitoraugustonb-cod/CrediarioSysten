import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  UserPlus, 
  Phone,
  MapPin, 
  X,
  CreditCard,
  DollarSign,
  CheckCircle2,
  MoreVertical,
  History,
  Calendar,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { 
  getClientes, 
  criarClienteAPI, 
  getSaldoCliente, 
  getClientePorId,
  registrarPagamentoAPI,
  type Cliente, 
  type SaldoDevedorCliente 
} from '../../services/api';

export const ClientesView: React.FC = () => {
  const { token } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>('');

  // Modals & Client Selection
  const [modalNovoCliente, setModalNovoCliente] = useState<boolean>(false);
  const [clienteSelObj, setClienteSelObj] = useState<Cliente | null>(null);
  const [clienteSaldoSel, setClienteSaldoSel] = useState<SaldoDevedorCliente | null>(null);
  const [loadingSaldo, setLoadingSaldo] = useState<boolean>(false);
  const [historicoVendas, setHistoricoVendas] = useState<any[]>([]);
  const [abaModalCliente, setAbaModalCliente] = useState<'debitos' | 'historico'>('debitos');

  // Advance Payment State
  const [parcelaParaPagamento, setParcelaParaPagamento] = useState<any | null>(null);
  const [valorPagoInput, setValorPagoInput] = useState<string>('');
  const [dataPagamentoInput, setDataPagamentoInput] = useState<string>('');
  const [salvandoPagamento, setSalvandoPagamento] = useState<boolean>(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  // Validation Sub-modal
  const [modalValidacaoValor, setModalValidacaoValor] = useState<boolean>(false);
  const [valorConfirmacaoInput, setValorConfirmacaoInput] = useState<string>('');
  const [erroConfirmacao, setErroConfirmacao] = useState<string | null>(null);

  // New Client Form
  const [nome, setNome] = useState<string>('');
  const [telefone, setTelefone] = useState<string>('');
  const [endereco, setEndereco] = useState<string>('');
  const [referencias, setReferencias] = useState<string>('');
  const [salvando, setSalvando] = useState<boolean>(false);

  const carregarClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await getClientes(token);
      setClientes(dados);
    } catch {
      setError('Erro ao carregar lista de clientes.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  const handleCadastrarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !telefone || !endereco) return;

    setSalvando(true);
    try {
      await criarClienteAPI({ nome, telefone, endereco, referencias }, token);
      alert(`✅ Cliente ${nome} cadastrado com sucesso!`);
      setModalNovoCliente(false);
      setNome('');
      setTelefone('');
      setEndereco('');
      setReferencias('');
      await carregarClientes();
    } catch (err: any) {
      alert(`❌ Erro ao cadastrar cliente: ${err.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const abrirSaldoCliente = async (cliente: Cliente, abaInicial: 'debitos' | 'historico' = 'debitos') => {
    setClienteSelObj(cliente);
    setAbaModalCliente(abaInicial);
    setLoadingSaldo(true);
    setClienteSaldoSel(null);
    setParcelaParaPagamento(null);
    setMensagemSucesso(null);
    try {
      const [saldo, fullData] = await Promise.all([
        getSaldoCliente(cliente.id, token),
        getClientePorId(cliente.id, token)
      ]);
      setClienteSaldoSel(saldo);
      setHistoricoVendas(fullData?.vendas || []);
    } catch (err: any) {
      alert(`Erro ao consultar dados do cliente: ${err.message}`);
    } finally {
      setLoadingSaldo(false);
    }
  };

  const fecharModalSaldo = () => {
    setClienteSelObj(null);
    setClienteSaldoSel(null);
    setParcelaParaPagamento(null);
    setMensagemSucesso(null);
    setAbaModalCliente('debitos');
  };

  const iniciarPagamentoAdiantado = (p: any) => {
    const valorRestante = Number(p.valor) - (p.valorPago ? Number(p.valorPago) : 0);
    setParcelaParaPagamento(p);
    setValorPagoInput(valorRestante.toFixed(2));
    setDataPagamentoInput(new Date().toISOString().substring(0, 10));
  };

  const handleIniciarValidacaoPagamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parcelaParaPagamento || !valorPagoInput) return;

    const val = parseFloat(valorPagoInput);
    if (isNaN(val) || val <= 0) {
      alert('Informe um valor válido maior que zero.');
      return;
    }

    setValorConfirmacaoInput('');
    setErroConfirmacao(null);
    setModalValidacaoValor(true);
  };

  const handleConfirmarEExecutarPagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parcelaParaPagamento || !valorPagoInput || !clienteSelObj) return;

    const valOriginal = parseFloat(valorPagoInput);
    const valConfirma = parseFloat(valorConfirmacaoInput);

    if (isNaN(valConfirma) || Math.abs(valOriginal - valConfirma) > 0.001) {
      setErroConfirmacao(`O valor digitado (R$ ${isNaN(valConfirma) ? '0,00' : valConfirma.toFixed(2)}) não coincide com R$ ${valOriginal.toFixed(2)}. Re-digite exatamente o mesmo valor.`);
      return;
    }

    setSalvandoPagamento(true);
    try {
      await registrarPagamentoAPI(
        parcelaParaPagamento.id,
        valOriginal,
        dataPagamentoInput,
        token
      );

      setMensagemSucesso(`✅ Pagamento de R$ ${valOriginal.toFixed(2)} registrado com sucesso!`);
      setModalValidacaoValor(false);
      setParcelaParaPagamento(null);

      // Recarrega informações do cliente
      await abrirSaldoCliente(clienteSelObj, abaModalCliente);
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

  // Extrai lista cronológica de todos os pagamentos individuais já realizados pelo cliente
  const pagamentosRealizados = historicoVendas
    .flatMap((v: any) => 
      (v.parcelas || []).map((p: any) => {
        const nomesItens = v.itens?.map((i: any) => i.produto?.nome || i.nomeProduto).filter(Boolean).join(', ');
        return {
          ...p,
          venda: v,
          nomeProduto: nomesItens || v.nomeProduto || `Venda #${v.id}`
        };
      })
    )
    .filter((p: any) => Number(p.valorPago || 0) > 0 || p.status === 'PAGA' || p.dataPagamento)
    .sort((a: any, b: any) => {
      const timeA = a.dataPagamento ? new Date(a.dataPagamento).getTime() : new Date(a.dataVencimento).getTime();
      const timeB = b.dataPagamento ? new Date(b.dataPagamento).getTime() : new Date(b.dataVencimento).getTime();
      return timeB - timeA; // Mais recente primeiro
    });

  const totalJaPagoCliente = pagamentosRealizados.reduce((acc: number, p: any) => {
    const val = p.valorPago ? Number(p.valorPago) : (p.status === 'PAGA' ? Number(p.valor) : 0);
    return acc + val;
  }, 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '20px' }}>
      {/* Search Bar & Add Button */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
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

        <button
          onClick={() => setModalNovoCliente(true)}
          style={{
            height: '48px',
            padding: '0 16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--accent-600)',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            whiteSpace: 'nowrap',
          }}
        >
          <UserPlus size={18} />
          <span>Novo Cliente</span>
        </button>
      </div>

      {loading && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando lista de clientes...
        </div>
      )}

      {error && (
        <div style={{ padding: '14px', backgroundColor: 'var(--status-atrasada-bg)', color: 'var(--status-atrasada-text)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {/* Lista Completa de Clientes */}
      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {clientesFiltrados.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              {busca ? `Nenhum cliente encontrado para "${busca}".` : 'Nenhum cliente cadastrado ainda.'}
            </div>
          ) : (
            clientesFiltrados.map((cliente) => (
              <div
                key={cliente.id}
                onClick={() => abrirSaldoCliente(cliente)}
                className="card-interactive touch-target"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0, paddingRight: '12px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-800)', margin: 0 }}>
                    {cliente.nome}
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--accent-600)" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cliente.endereco}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="var(--primary-500)" />
                    <span>{cliente.telefone}</span>
                  </div>
                </div>

                {/* Botão de 3 Pontos na Vertical */}
                <button
                  type="button"
                  title="Opções do cliente"
                  aria-label="Opções do cliente"
                  onClick={(e) => {
                    e.stopPropagation();
                    abrirSaldoCliente(cliente);
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle, #F8FAFC)',
                    color: 'var(--primary-700, #334155)',
                    border: '1px solid var(--border-color, #E2E8F0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <MoreVertical size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL: Detalhes, Débitos, Adiantamento e Histórico do Cliente */}
      {/* -------------------------------------------------------------------------- */}
      {(loadingSaldo || clienteSelObj) && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) fecharModalSaldo();
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
              padding: '22px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle, #E2E8F0)', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-600)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Ficha do Cliente
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)', margin: '2px 0 0 0' }}>
                  {clienteSaldoSel?.cliente?.nome || clienteSelObj?.nome || 'Consultando Cliente...'}
                </h3>
                {(clienteSaldoSel?.cliente?.telefone || clienteSelObj?.telefone) && (
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    📞 {clienteSaldoSel?.cliente?.telefone || clienteSelObj?.telefone}
                  </p>
                )}
              </div>

              <button
                onClick={fecharModalSaldo}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                aria-label="Fechar modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navegação entre Abas: Débitos & Histórico */}
            <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-subtle, #F1F5F9)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
              <button
                type="button"
                onClick={() => {
                  setAbaModalCliente('debitos');
                  setParcelaParaPagamento(null);
                }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: abaModalCliente === 'debitos' ? '#FFFFFF' : 'transparent',
                  color: abaModalCliente === 'debitos' ? 'var(--primary-800)' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: abaModalCliente === 'debitos' ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <CreditCard size={16} />
                <span>Débitos & Cobrança</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAbaModalCliente('historico');
                  setParcelaParaPagamento(null);
                }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: abaModalCliente === 'historico' ? '#FFFFFF' : 'transparent',
                  color: abaModalCliente === 'historico' ? 'var(--accent-700)' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: abaModalCliente === 'historico' ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <History size={16} />
                <span>Histórico de Pagamentos</span>
              </button>
            </div>

            {mensagemSucesso && (
              <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', color: '#166534', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', fontWeight: 600 }}>
                {mensagemSucesso}
              </div>
            )}

            {loadingSaldo ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Consultando informações do cliente no servidor...
              </div>
            ) : (
              <div>
                {/* ----------------------------------------- */}
                {/* ABA 1: Débitos & Opção de Adiantamento    */}
                {/* ----------------------------------------- */}
                {abaModalCliente === 'debitos' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {(() => {
                      const saldoTotalNum = Number(clienteSaldoSel?.saldoDevedorTotal ?? 0);
                      const parcelasAbertoCount = clienteSaldoSel?.totalParcelasEmAberto ?? 0;
                      const parcelasAtrasoCount = clienteSaldoSel?.parcelasEmAtraso ?? 0;

                      const parcelasEmAberto = historicoVendas
                        .flatMap((v: any) => (v.parcelas || []).map((p: any) => ({ ...p, venda: v })))
                        .filter((p: any) => ['PENDENTE', 'ATRASADA', 'PARCIAL'].includes(p.status))
                        .sort((a: any, b: any) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime());

                      const estaEmDia = saldoTotalNum === 0 && parcelasAbertoCount === 0;

                      return (
                        <>
                          {/* Banner de Situação */}
                          <div style={{
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: estaEmDia ? '#DCFCE7' : (parcelasAtrasoCount > 0 ? '#FEE2E2' : '#FEF3C7'),
                            border: `1px solid ${estaEmDia ? '#86EFAC' : (parcelasAtrasoCount > 0 ? '#FCA5A5' : '#FCD34D')}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            {estaEmDia ? (
                              <CheckCircle size={22} color="#166534" style={{ flexShrink: 0 }} />
                            ) : parcelasAtrasoCount > 0 ? (
                              <AlertCircle size={22} color="#B91C1C" style={{ flexShrink: 0 }} />
                            ) : (
                              <Clock size={22} color="#D97706" style={{ flexShrink: 0 }} />
                            )}
                            <div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: estaEmDia ? '#166534' : (parcelasAtrasoCount > 0 ? '#B91C1C' : '#92400E') }}>
                                {estaEmDia ? 'Cliente em Dia (Sem Débitos)' : (parcelasAtrasoCount > 0 ? 'Cliente com Parcelas em Atraso' : 'Cliente com Parcelas a Vencer')}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: estaEmDia ? '#15803D' : (parcelasAtrasoCount > 0 ? '#991B1B' : '#B45309'), marginTop: '2px' }}>
                                {estaEmDia 
                                  ? 'Nenhuma pendência financeira em aberto.' 
                                  : `Possui ${parcelasAbertoCount} parcela(s) em aberto${parcelasAtrasoCount > 0 ? ` (${parcelasAtrasoCount} em atraso)` : ''}.`}
                              </div>
                            </div>
                          </div>

                          {/* Saldo Devedor Card */}
                          <div style={{ backgroundColor: 'var(--bg-subtle, #F8FAFC)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color, #E2E8F0)' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                              Saldo Devedor Total
                            </span>
                            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: saldoTotalNum > 0 ? '#B91C1C' : '#15803D', marginTop: '2px' }}>
                              R$ {saldoTotalNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>

                          {/* Indicadores de Parcelas */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color, #E2E8F0)', backgroundColor: '#FFFFFF', textAlign: 'center' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Parcelas em Aberto</span>
                              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '2px' }}>
                                {parcelasAbertoCount}
                              </div>
                            </div>

                            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: `1px solid ${parcelasAtrasoCount > 0 ? '#FCA5A5' : 'var(--border-color, #E2E8F0)'}`, backgroundColor: parcelasAtrasoCount > 0 ? '#FEE2E2' : '#FFFFFF', textAlign: 'center' }}>
                              <span style={{ fontSize: '0.75rem', color: parcelasAtrasoCount > 0 ? '#B91C1C' : 'var(--text-muted)', fontWeight: 600 }}>Parcelas em Atraso</span>
                              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: parcelasAtrasoCount > 0 ? '#B91C1C' : 'var(--primary-800)', marginTop: '2px' }}>
                                {parcelasAtrasoCount}
                              </div>
                            </div>
                          </div>

                          {/* Botão de Atalho para Histórico de Pagamentos */}
                          <button
                            type="button"
                            onClick={() => setAbaModalCliente('historico')}
                            style={{
                              padding: '12px 16px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'var(--accent-50, #F0FDF4)',
                              color: 'var(--accent-700, #15803D)',
                              border: '1px solid var(--accent-200, #BBF7D0)',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              width: '100%',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <History size={18} />
                            <span>Ver Histórico de Pagamentos ({pagamentosRealizados.length})</span>
                          </button>

                          {/* Formulário de Pagamento Adiantado / Quitação de Parcela */}
                          {parcelaParaPagamento ? (
                            <form onSubmit={handleIniciarValidacaoPagamento} style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#166534', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <DollarSign size={18} />
                                  Adiantar Parcela #{parcelaParaPagamento.numero}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => setParcelaParaPagamento(null)}
                                  style={{ background: 'none', border: 'none', color: '#166534', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                  Cancelar
                                </button>
                              </div>

                              <p style={{ fontSize: '0.82rem', color: '#15803D', margin: 0 }}>
                                Valor da parcela: <strong>R$ {Number(parcelaParaPagamento.valor).toFixed(2)}</strong> | Venc: {new Date(parcelaParaPagamento.dataVencimento).toLocaleDateString('pt-BR')}
                              </p>

                              <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>
                                  Valor a Pagar (R$)
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  required
                                  value={valorPagoInput}
                                  onChange={(e) => setValorPagoInput(e.target.value)}
                                  style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid #86EFAC', fontSize: '0.92rem', outline: 'none' }}
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
                                  style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid #86EFAC', fontSize: '0.92rem', outline: 'none' }}
                                />
                              </div>

                              <button
                                type="submit"
                                style={{
                                  height: '44px',
                                  backgroundColor: '#166534',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: 'var(--radius-md)',
                                  fontWeight: 700,
                                  fontSize: '0.9rem',
                                  cursor: 'pointer',
                                  marginTop: '4px'
                                }}
                              >
                                Continuar Pagamento
                              </button>
                            </form>
                          ) : (
                            /* Lista de Parcelas em Aberto para Adiantamento */
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary-800)', margin: 0 }}>
                                  Parcelas em Aberto (Cobrar / Adiantar)
                                </h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {parcelasEmAberto.length} encontrada(s)
                                </span>
                              </div>

                              {parcelasEmAberto.length === 0 ? (
                                <div style={{ padding: '16px', textAlign: 'center', backgroundColor: 'var(--bg-subtle, #F8FAFC)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color, #CBD5E1)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                  Nenhuma parcela em aberto no momento.
                                </div>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                                  {parcelasEmAberto.map((p: any) => {
                                    const vPago = p.valorPago ? Number(p.valorPago) : 0;
                                    const resta = Number(p.valor) - vPago;
                                    const estaAtrasada = p.status === 'ATRASADA' || new Date(p.dataVencimento) < new Date();

                                    return (
                                      <div
                                        key={p.id}
                                        style={{
                                          padding: '12px',
                                          border: `1px solid ${estaAtrasada ? '#FCA5A5' : 'var(--border-color, #E2E8F0)'}`,
                                          borderRadius: 'var(--radius-md)',
                                          backgroundColor: estaAtrasada ? '#FFF5F5' : '#FFFFFF',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          gap: '8px'
                                        }}
                                      >
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                                            Parcela #{p.numero} <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>(Venda #{p.vendaId})</span>
                                          </div>
                                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            Venc: {new Date(p.dataVencimento).toLocaleDateString('pt-BR')} • <strong style={{ color: estaAtrasada ? '#B91C1C' : '#D97706' }}>{estaAtrasada ? 'ATRASADA' : p.status}</strong>
                                          </div>
                                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-700)', marginTop: '2px' }}>
                                            Resta: R$ {resta.toFixed(2)}
                                          </div>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => iniciarPagamentoAdiantado(p)}
                                          style={{
                                            padding: '8px 14px',
                                            borderRadius: 'var(--radius-md)',
                                            backgroundColor: '#166534',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            fontWeight: 700,
                                            fontSize: '0.82rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0
                                          }}
                                        >
                                          <DollarSign size={14} />
                                          <span>Adiantar</span>
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* ----------------------------------------- */}
                {/* ABA 2: Histórico de Pagamentos Individual */}
                {/* ----------------------------------------- */}
                {abaModalCliente === 'historico' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Botão de Retorno rápido */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setAbaModalCliente('debitos')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-700)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0
                        }}
                      >
                        <ArrowLeft size={16} />
                        <span>Voltar para Débitos</span>
                      </button>

                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {pagamentosRealizados.length} registro(s)
                      </span>
                    </div>

                    {/* Resumo do Total Pago */}
                    <div style={{ backgroundColor: 'var(--accent-50, #F0FDF4)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-200, #BBF7D0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-800)', textTransform: 'uppercase' }}>
                          Total Pago Pelo Cliente
                        </span>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-700)', marginTop: '2px' }}>
                          R$ {totalJaPagoCliente.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <CheckCircle size={28} color="var(--accent-600)" />
                    </div>

                    {/* Lista Individual de Pagamentos */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
                      {pagamentosRealizados.length === 0 ? (
                        <div style={{ padding: '30px 16px', textAlign: 'center', backgroundColor: 'var(--bg-subtle, #F8FAFC)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color, #CBD5E1)' }}>
                          <History size={32} color="var(--text-muted)" style={{ margin: '0 auto 8px auto', display: 'block', opacity: 0.6 }} />
                          <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary-800)', margin: '0 0 4px 0' }}>
                            Nenhum pagamento registrado
                          </p>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                            Este cliente ainda não efetuou pagamentos de parcelas.
                          </p>
                        </div>
                      ) : (
                        pagamentosRealizados.map((p: any) => {
                          const valPagoNum = p.valorPago ? Number(p.valorPago) : (p.status === 'PAGA' ? Number(p.valor) : 0);
                          const dataFormatada = p.dataPagamento 
                            ? new Date(p.dataPagamento).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                            : (p.dataVencimento ? new Date(p.dataVencimento).toLocaleDateString('pt-BR') : 'Data não informada');

                          return (
                            <div
                              key={p.id}
                              style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 'var(--radius-md)',
                                padding: '14px',
                                border: '1px solid var(--border-color, #E2E8F0)',
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                                    Parcela #{p.numero}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    {p.nomeProduto}
                                  </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#166534' }}>
                                    + R$ {valPagoNum.toFixed(2)}
                                  </div>
                                  <span style={{
                                    display: 'inline-block',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '9999px',
                                    backgroundColor: p.status === 'PAGA' ? '#DCFCE7' : '#FEF3C7',
                                    color: p.status === 'PAGA' ? '#166534' : '#92400E',
                                    marginTop: '2px'
                                  }}>
                                    {p.status === 'PAGA' ? 'Pago' : (p.status === 'PARCIAL' ? 'Parcial' : p.status)}
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed var(--border-subtle, #F1F5F9)', paddingTop: '6px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Calendar size={13} color="var(--accent-600)" />
                                  <span>Pago em: <strong>{dataFormatada}</strong></span>
                                </div>

                                <span>Venda #{p.vendaId}</span>
                              </div>

                              {p.observacao && (
                                <div style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-subtle, #F8FAFC)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
                                  💬 <em>{p.observacao}</em>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL: Cadastrar Novo Cliente */}
      {/* -------------------------------------------------------------------------- */}
      {modalNovoCliente && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalNovoCliente(false);
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
              maxWidth: '460px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              maxHeight: '88vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                Cadastrar Novo Cliente
              </h3>
              <button onClick={() => setModalNovoCliente(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleCadastrarCliente} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: 'var(--primary-800)' }}>
                  Nome Completo *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Roberto Carlos"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  style={{ width: '100%', height: '46px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: 'var(--primary-800)' }}>
                  Telefone / WhatsApp *
                </label>
                <input
                  type="text"
                  placeholder="(88) 99999-8888"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                  style={{ width: '100%', height: '46px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: 'var(--primary-800)' }}>
                  Endereço Completo *
                </label>
                <input
                  type="text"
                  placeholder="Rua, Número, Bairro"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  required
                  style={{ width: '100%', height: '46px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: 'var(--primary-800)' }}>
                  Referências de Localização (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Próximo à igreja matriz"
                  value={referencias}
                  onChange={(e) => setReferencias(e.target.value)}
                  style={{ width: '100%', height: '46px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalNovoCliente(false)}
                  style={{ flex: 1, height: '44px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)', fontWeight: 700 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  style={{ flex: 1, height: '44px', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: 'var(--accent-600)', color: '#FFFFFF', fontWeight: 800 }}
                >
                  {salvando ? 'Salvando...' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal de Validação de Segurança (Confirmação Dupla de Valor) */}
      {modalValidacaoValor && parcelaParaPagamento && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalValidacaoValor(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 10020,
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
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '2px solid #16A34A'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={22} color="#16A34A" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-800)', margin: 0 }}>
                  Confirmação de Segurança
                </h3>
              </div>
              <button
                onClick={() => setModalValidacaoValor(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              <p style={{ fontSize: '0.85rem', color: '#166534', margin: 0, lineHeight: 1.4 }}>
                Para evitar pagamentos acidentais com valor incorreto, <strong>digite novamente o valor a ser registrado</strong> (R$ <strong>{parseFloat(valorPagoInput || '0').toFixed(2)}</strong>):
              </p>
            </div>

            <form onSubmit={handleConfirmarEExecutarPagamento} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--primary-800)' }}>
                  Re-digite o Valor Pago (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  autoFocus
                  required
                  placeholder={`Ex: ${parseFloat(valorPagoInput || '0').toFixed(2)}`}
                  value={valorConfirmacaoInput}
                  onChange={(e) => {
                    setValorConfirmacaoInput(e.target.value);
                    setErroConfirmacao(null);
                  }}
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 12px',
                    borderRadius: 'var(--radius-md)',
                    border: erroConfirmacao ? '2px solid #B91C1C' : '2px solid #16A34A',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#166534',
                    outline: 'none'
                  }}
                />
                {erroConfirmacao && (
                  <p style={{ color: '#B91C1C', fontSize: '0.8rem', fontWeight: 700, marginTop: '6px' }}>
                    {erroConfirmacao}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalValidacaoValor(false)}
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
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={salvandoPagamento}
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
                  {salvandoPagamento ? 'Registrando...' : 'Finalizar Pagamento'}
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
