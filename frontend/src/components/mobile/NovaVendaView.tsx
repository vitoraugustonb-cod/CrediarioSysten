import React, { useEffect, useState } from 'react';
import { 
  User, 
  MapPin, 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Calendar, 
  CreditCard, 
  CheckCircle2,
  Phone,
  UserPlus,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { 
  getClientes, 
  getProdutos, 
  criarVendaAPI, 
  type Cliente, 
  type Produto 
} from '../../services/api';

interface NovaVendaViewProps {
  onNavigate: (tab: string) => void;
}

interface ItemCarrinho {
  produtoId: number;
  nome: string;
  categoria: string;
  quantidade: number;
  valorUnitario: number;
  subtotal: number;
}

export const NovaVendaView: React.FC<NovaVendaViewProps> = () => {
  const { token } = useAuth();
  
  // Catalog states loaded from backend
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Selection mode: 'novo' (default for quick input) or 'existente'
  const [modoCliente, setModoCliente] = useState<'novo' | 'existente'>('novo');

  // Input fields for New Customer
  const [nomeCliente, setNomeCliente] = useState<string>('');
  const [ruaCliente, setRuaCliente] = useState<string>('');
  const [numeroCliente, setNumeroCliente] = useState<string>('');
  const [bairroCliente, setBairroCliente] = useState<string>('');
  const [telefoneCliente, setTelefoneCliente] = useState<string>('');

  // Selected Existing Customer
  const [clienteIdSel, setClienteIdSel] = useState<string>('');

  // Selected Product & Add Item inputs
  const [produtoIdAdd, setProdutoIdAdd] = useState<string>('');
  const [valorUnitarioAdd, setValorUnitarioAdd] = useState<string>('');
  const [quantidadeAdd, setQuantidadeAdd] = useState<number>(1);

  // Cart / Items List
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);

  // Payment terms
  const [valorEntrada, setValorEntrada] = useState<string>('0');
  const [periodicidade, setPeriodicidade] = useState<'MENSAL' | 'QUINZENAL' | 'SEMANAL'>('MENSAL');
  const [numParcelas, setNumParcelas] = useState<number>(3);
  
  // Calculate initial first payment date based on periodicity
  const getInitialFirstPayment = (period: 'MENSAL' | 'QUINZENAL' | 'SEMANAL') => {
    const d = new Date();
    if (period === 'SEMANAL') d.setDate(d.getDate() + 7);
    else if (period === 'QUINZENAL') d.setDate(d.getDate() + 15);
    else d.setDate(d.getDate() + 30);
    return d.toISOString().substring(0, 10);
  };

  const [primeiroVencimento, setPrimeiroVencimento] = useState<string>(getInitialFirstPayment('MENSAL'));
  const [dataVenda, setDataVenda] = useState<string>(new Date().toISOString().substring(0, 10));

  const [loading, setLoading] = useState<boolean>(true);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const [c, p] = await Promise.all([getClientes(token), getProdutos(token)]);
        setClientes(c);
        setProdutos(p);
        if (c.length > 0) setClienteIdSel(String(c[0].id));
        if (p.length > 0) {
          setProdutoIdAdd(String(p[0].id));
          setValorUnitarioAdd(Number(p[0].preco).toFixed(2));
        }
      } catch (err) {
        console.error('Erro ao carregar dados para formulário de venda:', err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [token]);

  // When selected product changes in selector, prefill default price
  const handleProdutoSelect = (prodId: string) => {
    setProdutoIdAdd(prodId);
    const prod = produtos.find(p => String(p.id) === prodId);
    if (prod) {
      setValorUnitarioAdd(Number(prod.preco).toFixed(2));
    }
  };

  // Change periodicity and automatically adjust recommended first payment date
  const handlePeriodicidadeChange = (novoPeriodo: 'MENSAL' | 'QUINZENAL' | 'SEMANAL') => {
    setPeriodicidade(novoPeriodo);
    setPrimeiroVencimento(getInitialFirstPayment(novoPeriodo));
  };

  const handleAdicionarItem = () => {
    if (!produtoIdAdd) return;
    const prod = produtos.find(p => String(p.id) === produtoIdAdd);
    if (!prod) return;

    const precoUnitario = parseFloat(valorUnitarioAdd) || Number(prod.preco);
    const subtotal = precoUnitario * quantidadeAdd;

    const novoItem: ItemCarrinho = {
      produtoId: prod.id,
      nome: prod.nome,
      categoria: prod.categoria || 'MOVEIS',
      quantidade: quantidadeAdd,
      valorUnitario: precoUnitario,
      subtotal
    };

    setCarrinho(prev => [...prev, novoItem]);
    setQuantidadeAdd(1);
  };

  const handleRemoverItem = (index: number) => {
    setCarrinho(prev => prev.filter((_, i) => i !== index));
  };

  const valorTotalCalculado = carrinho.reduce((acc, item) => acc + item.subtotal, 0);
  const entradaNum = parseFloat(valorEntrada) || 0;
  const financiado = Math.max(0, valorTotalCalculado - entradaNum);
  const valorParcela = numParcelas > 0 ? (financiado / numParcelas).toFixed(2) : '0.00';

  const handleSalvarVenda = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modoCliente === 'novo' && !nomeCliente.trim()) {
      alert('Por favor, informe o Nome do Cliente.');
      return;
    }

    if (modoCliente === 'existente' && !clienteIdSel) {
      alert('Por favor, selecione um Cliente existente.');
      return;
    }

    if (carrinho.length === 0) {
      alert('Adicione pelo menos 1 produto à venda antes de finalizar.');
      return;
    }

    setSalvando(true);
    setMensagemSucesso(null);

    try {
      await criarVendaAPI(
        {
          clienteId: modoCliente === 'existente' ? parseInt(clienteIdSel, 10) : undefined,
          novoCliente: modoCliente === 'novo' ? {
            nome: nomeCliente,
            rua: ruaCliente,
            numero: numeroCliente,
            bairro: bairroCliente,
            telefone: telefoneCliente
          } : undefined,
          itens: carrinho.map(item => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario
          })),
          valorEntrada: entradaNum,
          numParcelas,
          periodicidade,
          primeiroVencimento,
          dataVenda,
        },
        token
      );

      setMensagemSucesso('✅ Venda registrada com sucesso e carnê de parcelas gerado!');
      setCarrinho([]);
      setNomeCliente('');
      setRuaCliente('');
      setNumeroCliente('');
      setBairroCliente('');
      setTelefoneCliente('');
      setValorEntrada('0');
      
      // Refresh clients list in background
      getClientes(token).then(setClientes).catch(() => {});
    } catch (err: any) {
      alert(`❌ Erro ao registrar venda: ${err.message}`);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '30px' }}>
      
      {/* Page Title Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--accent-600)" />
              Lançar Nova Venda
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Preencha os dados do cliente, produtos e condições de parcelamento
            </p>
          </div>
        </div>
      </div>

      {mensagemSucesso && (
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--status-paga-bg)',
            color: 'var(--status-paga-text)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.95rem',
            border: '1px solid #BBF7D0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={22} color="#15803D" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando informações do sistema...
        </div>
      ) : (
        <form onSubmit={handleSalvarVenda} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* SECTION 1: SEÇÃO DO CLIENTE */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-800)' }}>
                <User size={18} color="var(--accent-600)" />
                <span>1. Dados do Cliente</span>
              </div>

              {/* Mode Toggle */}
              <div style={{ display: 'flex', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
                <button
                  type="button"
                  onClick={() => setModoCliente('novo')}
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: modoCliente === 'novo' ? 'var(--accent-600)' : 'transparent',
                    color: modoCliente === 'novo' ? '#FFFFFF' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Novo Cliente
                </button>
                <button
                  type="button"
                  onClick={() => setModoCliente('existente')}
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: modoCliente === 'existente' ? 'var(--accent-600)' : 'transparent',
                    color: modoCliente === 'existente' ? '#FFFFFF' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Já Cadastrado
                </button>
              </div>
            </div>

            {modoCliente === 'existente' ? (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '6px' }}>
                  Selecionar Cliente Existente *
                </label>
                <select
                  value={clienteIdSel}
                  onChange={(e) => setClienteIdSel(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.95rem',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="">-- Escolha um cliente --</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nome} ({c.telefone || 'Sem Tel'}) - {c.endereco}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Nome do Cliente */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '4px' }}>
                    Nome do Cliente *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Nome completo do cliente"
                      value={nomeCliente}
                      onChange={(e) => setNomeCliente(e.target.value)}
                      required={modoCliente === 'novo'}
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '0 12px 0 38px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.95rem',
                      }}
                    />
                    <UserPlus size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  </div>
                </div>

                {/* Campos de Endereço: Rua, Número, Bairro */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-800)', marginTop: '4px' }}>
                  <MapPin size={16} color="var(--accent-600)" />
                  <span>Endereço Completo</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Rua / Logradouro
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Rua das Flores"
                      value={ruaCliente}
                      onChange={(e) => setRuaCliente(e.target.value)}
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0 10px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Número
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 123"
                      value={numeroCliente}
                      onChange={(e) => setNumeroCliente(e.target.value)}
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0 10px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Bairro
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Centro"
                      value={bairroCliente}
                      onChange={(e) => setBairroCliente(e.target.value)}
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0 10px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Telefone / WhatsApp
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="(88) 99999-9999"
                        value={telefoneCliente}
                        onChange={(e) => setTelefoneCliente(e.target.value)}
                        style={{
                          width: '100%',
                          height: '44px',
                          padding: '0 10px 0 34px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.9rem',
                        }}
                      />
                      <Phone size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '14px' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: SEÇÃO DE PRODUTOS */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-800)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <ShoppingCart size={18} color="var(--accent-600)" />
              <span>2. Produtos da Venda</span>
            </div>

            {/* Inclusão de Produto */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '6px' }}>
                Selecione o Produto do Catálogo
              </label>

              <select
                value={produtoIdAdd}
                onChange={(e) => handleProdutoSelect(e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.9rem',
                  backgroundColor: '#FFFFFF',
                  marginBottom: '10px'
                }}
              >
                {produtos.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.categoria || 'MOVEIS'}] {p.nome} - R$ {Number(p.preco).toFixed(2)}
                  </option>
                ))}
              </select>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
                    Valor Unit. (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={valorUnitarioAdd}
                    onChange={(e) => setValorUnitarioAdd(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 8px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
                    Qtd
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantidadeAdd}
                    onChange={(e) => setQuantidadeAdd(parseInt(e.target.value, 10) || 1)}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 8px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.95rem',
                      textAlign: 'center',
                      fontWeight: 700,
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAdicionarItem}
                  style={{
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--accent-600)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Plus size={16} />
                  <span>Incluir</span>
                </button>
              </div>
            </div>

            {/* Lista de Itens no Carrinho */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                ITENS INCLUÍDOS ({carrinho.length})
              </div>

              {carrinho.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px', textAlign: 'center', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  Nenhum produto incluído. Escolha o produto acima e clique em "+ Incluir".
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {carrinho.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                          {item.quantidade}x {item.nome}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          R$ {item.valorUnitario.toFixed(2)} / un
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                          R$ {item.subtotal.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoverItem(index)}
                          style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totalizador da Venda */}
            <div style={{ padding: '12px 16px', backgroundColor: 'var(--accent-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-600)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-700)' }}>
                VALOR TOTAL GERAL
              </span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-700)' }}>
                R$ {valorTotalCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* SECTION 3: CONDIÇÕES DE PAGAMENTO E PARCELAMENTO */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-800)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <CreditCard size={18} color="var(--accent-600)" />
              <span>3. Condições de Pagamento e Carnê</span>
            </div>

            {/* Entrada em Dinheiro */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '4px' }}>
                Entrada em Dinheiro (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={valorEntrada}
                onChange={(e) => setValorEntrada(e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '1rem',
                  fontWeight: 700
                }}
              />
            </div>

            {/* Forma de Parcelamento (Periodicidade: Mensal, Quinzenal, Semanal) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '6px' }}>
                Forma de Parcelamento *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {(['MENSAL', 'QUINZENAL', 'SEMANAL'] as const).map((periodo) => {
                  const ativo = periodicidade === periodo;
                  const labelMap = {
                    MENSAL: 'Mensal',
                    QUINZENAL: 'Quinzenal',
                    SEMANAL: 'Semanal'
                  };
                  const subMap = {
                    MENSAL: 'A cada 30 dias',
                    QUINZENAL: 'A cada 15 dias',
                    SEMANAL: 'A cada 7 dias'
                  };

                  return (
                    <button
                      key={periodo}
                      type="button"
                      onClick={() => handlePeriodicidadeChange(periodo)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: 'var(--radius-md)',
                        border: ativo ? '2px solid var(--accent-600)' : '1px solid var(--border-subtle)',
                        backgroundColor: ativo ? 'var(--accent-50)' : '#FFFFFF',
                        color: ativo ? 'var(--accent-700)' : 'var(--primary-800)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>{labelMap[periodo]}</span>
                      <span style={{ fontSize: '0.68rem', opacity: 0.8, marginTop: '2px' }}>{subMap[periodo]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Número de Parcelas e Data do Primeiro Pagamento */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '4px' }}>
                  Quantas Parcelas *
                </label>
                <select
                  value={numParcelas}
                  onChange={(e) => setNumParcelas(parseInt(e.target.value, 10))}
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '0 10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.95rem',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 700
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 24].map(n => (
                    <option key={n} value={n}>{n}x parcelas</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '4px' }}>
                  Data 1º Pagamento *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    value={primeiroVencimento}
                    onChange={(e) => setPrimeiroVencimento(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      height: '44px',
                      padding: '0 10px 0 34px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.88rem',
                      fontWeight: 600
                    }}
                  />
                  <Calendar size={16} color="var(--accent-600)" style={{ position: 'absolute', left: '10px', top: '14px' }} />
                </div>
              </div>
            </div>

            {/* Resumo do Carnê Box */}
            <div
              style={{
                padding: '14px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-800)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} color="var(--accent-600)" />
                Resumo das Parcelas do Carnê
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '0.92rem', color: 'var(--primary-800)' }}>
                  {numParcelas}x ({periodicidade.toLowerCase()}) de:
                </span>
                <strong style={{ color: 'var(--accent-700)', fontSize: '1.25rem' }}>
                  R$ {valorParcela}
                </strong>
              </div>

              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Total financiado: R$ {financiado.toFixed(2)}</span>
                <span>1ª Parcela: {primeiroVencimento ? new Date(primeiroVencimento + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}</span>
              </div>
            </div>

            {/* Data da Venda (oculta ou ajustável) */}
            <div style={{ marginTop: '2px' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
                Data do Registro da Venda
              </label>
              <input
                type="date"
                value={dataVenda}
                onChange={(e) => setDataVenda(e.target.value)}
                style={{
                  width: '100%',
                  height: '38px',
                  padding: '0 10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem',
                  backgroundColor: '#FFFFFF'
                }}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={salvando || carrinho.length === 0}
            className="touch-target"
            style={{
              width: '100%',
              height: 'var(--touch-target-large)',
              backgroundColor: carrinho.length === 0 ? 'var(--border-subtle)' : 'var(--accent-600)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: (salvando || carrinho.length === 0) ? 'not-allowed' : 'pointer',
              boxShadow: carrinho.length > 0 ? '0 4px 14px rgba(37, 99, 235, 0.35)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <CheckCircle2 size={22} />
            <span>{salvando ? 'Registrando Venda...' : 'Finalizar Venda & Gerar Carnê'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
