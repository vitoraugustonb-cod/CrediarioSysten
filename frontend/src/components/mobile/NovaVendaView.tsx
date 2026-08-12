import React, { useEffect, useState } from 'react';
import { 
  UserPlus, 
  CheckCircle2, 
  Plus, 
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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
  produto: Produto;
  quantidade: number;
  subtotal: number;
}

export const NovaVendaView: React.FC<NovaVendaViewProps> = ({ onNavigate }) => {
  const { token } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  
  const [clienteIdSel, setClienteIdSel] = useState<string>('');
  
  // Selected product & quantity for adding to list
  const [produtoIdAdd, setProdutoIdAdd] = useState<string>('');
  const [quantidadeAdd, setQuantidadeAdd] = useState<number>(1);

  // Cart list of items
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);

  const [valorEntrada, setValorEntrada] = useState<string>('0');
  const [numParcelas, setNumParcelas] = useState<number>(3);
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
        if (p.length > 0) setProdutoIdAdd(String(p[0].id));
      } catch (err) {
        console.error('Erro ao carregar dados para formulário de venda:', err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const handleAdicionarItem = () => {
    if (!produtoIdAdd) return;
    const prod = produtos.find(p => String(p.id) === produtoIdAdd);
    if (!prod) return;

    const sub = Number(prod.preco) * quantidadeAdd;
    
    // Se o item já existir no carrinho, incrementa a quantidade
    const idx = carrinho.findIndex(i => i.produto.id === prod.id);
    if (idx !== -1) {
      const novocarrinho = [...carrinho];
      const novaQtd = novocarrinho[idx].quantidade + quantidadeAdd;
      novocarrinho[idx] = {
        produto: prod,
        quantidade: novaQtd,
        subtotal: Number(prod.preco) * novaQtd
      };
      setCarrinho(novocarrinho);
    } else {
      setCarrinho([...carrinho, { produto: prod, quantidade: quantidadeAdd, subtotal: sub }]);
    }

    setQuantidadeAdd(1);
  };

  const handleRemoverItem = (index: number) => {
    const novocarrinho = carrinho.filter((_, i) => i !== index);
    setCarrinho(novocarrinho);
  };

  const valorTotalCalculado = carrinho.reduce((acc, item) => acc + item.subtotal, 0);

  const handleSalvarVenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteIdSel || carrinho.length === 0) {
      alert('Selecione um cliente e adicione pelo menos 1 produto à venda.');
      return;
    }

    setSalvando(true);
    setMensagemSucesso(null);

    try {
      const itensAPI = carrinho.map(item => ({
        produtoId: item.produto.id,
        quantidade: item.quantidade
      }));

      await criarVendaAPI(
        {
          clienteId: parseInt(clienteIdSel, 10),
          itens: itensAPI,
          valorEntrada: valorEntrada ? parseFloat(valorEntrada) : 0,
          numParcelas,
          dataVenda,
        },
        token
      );

      setMensagemSucesso('✅ Venda com múltiplos produtos registrada e carnê gerado!');
      setCarrinho([]);
      setValorEntrada('0');
    } catch (err: any) {
      alert(`❌ Erro ao registrar venda: ${err.message}`);
    } finally {
      setSalvando(false);
    }
  };

  // Calculations preview
  const entradaNum = parseFloat(valorEntrada) || 0;
  const financiado = Math.max(0, valorTotalCalculado - entradaNum);
  const valorParcela = numParcelas > 0 ? (financiado / numParcelas).toFixed(2) : '0.00';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '16px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-800)' }}>
              Lançar Nova Venda (Múltiplos Produtos)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Adicione produtos de Móveis e Variedades no mesmo pedido
            </p>
          </div>

          <button
            onClick={() => onNavigate('clientes')}
            className="touch-target"
            style={{
              padding: '0 12px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-50)',
              color: 'var(--accent-700)',
              border: '1px solid var(--accent-600)',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <UserPlus size={16} />
            <span>+ Cliente</span>
          </button>
        </div>
      </div>

      {mensagemSucesso && (
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--status-paga-bg)',
            color: 'var(--status-paga-text)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.92rem',
          }}
        >
          {mensagemSucesso}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando clientes e catálogo de produtos...
        </div>
      ) : (
        <form
          onSubmit={handleSalvarVenda}
          style={{
            backgroundColor: '#FFFFFF',
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* 1. Cliente Select */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '6px' }}>
              Selecione o Cliente *
            </label>
            <select
              value={clienteIdSel}
              onChange={(e) => setClienteIdSel(e.target.value)}
              required
              style={{
                width: '100%',
                height: '48px',
                padding: '0 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.95rem',
                backgroundColor: '#FFFFFF',
              }}
            >
              {clientes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nome} ({c.telefone})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Seleção e Adição de Produtos à Venda */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '8px' }}>
              Adicionar Produtos ao Pedido
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '8px', alignItems: 'center' }}>
              <select
                value={produtoIdAdd}
                onChange={(e) => setProdutoIdAdd(e.target.value)}
                style={{
                  height: '46px',
                  padding: '0 10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.88rem',
                  backgroundColor: '#FFFFFF',
                }}
              >
                {produtos.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.categoria || 'MOVEIS'}] {p.nome} - R$ {Number(p.preco).toFixed(2)}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={quantidadeAdd}
                onChange={(e) => setQuantidadeAdd(parseInt(e.target.value, 10) || 1)}
                style={{
                  height: '46px',
                  padding: '0 8px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.95rem',
                  textAlign: 'center',
                  fontWeight: 700,
                }}
              />

              <button
                type="button"
                onClick={handleAdicionarItem}
                className="touch-target"
                style={{
                  height: '46px',
                  padding: '0 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-600)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={18} />
                <span>Incluir</span>
              </button>
            </div>

            {/* Lista de Itens do Pedido */}
            <div style={{ marginTop: '14px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                ITENS ADICIONADOS ({carrinho.length})
              </div>

              {carrinho.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '10px 0' }}>
                  Nenhum produto adicionado ainda. Escolha um produto acima e clique em "Incluir".
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
                          {item.quantidade}x {item.produto.nome}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          [{item.produto.categoria}] R$ {Number(item.produto.preco).toFixed(2)} / un
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          </div>

          {/* Valor Total Calculado & Entrada */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--accent-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-600)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-700)' }}>
                VALOR TOTAL GERAL
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-700)', marginTop: '2px' }}>
                R$ {valorTotalCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

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
                  height: '48px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '1rem',
                }}
              />
            </div>
          </div>

          {/* Num Parcelas & Data Venda */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '4px' }}>
                Nº de Parcelas *
              </label>
              <select
                value={numParcelas}
                onChange={(e) => setNumParcelas(parseInt(e.target.value, 10))}
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.95rem',
                  backgroundColor: '#FFFFFF',
                }}
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                  <option key={n} value={n}>{n}x parcelas</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '4px' }}>
                Data da Venda
              </label>
              <input
                type="date"
                value={dataVenda}
                onChange={(e) => setDataVenda(e.target.value)}
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          {/* Parcel Simulation Preview Box */}
          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px border var(--border-color)',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Resumo do Carnê
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--primary-800)' }}>
                {numParcelas}x de <strong style={{ color: 'var(--accent-700)', fontSize: '1.1rem' }}>R$ {valorParcela}</strong>
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                (Financiado: R$ {financiado.toFixed(2)})
              </span>
            </div>
          </div>

          {/* Submit Button */}
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
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: (salvando || carrinho.length === 0) ? 'not-allowed' : 'pointer',
              boxShadow: carrinho.length > 0 ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
            }}
          >
            <CheckCircle2 size={20} />
            <span>{salvando ? 'Registrando Venda...' : 'Finalizar Venda & Gerar Carnê'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
