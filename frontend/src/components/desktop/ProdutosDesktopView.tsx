import React, { useEffect, useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Tag 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getProdutos, criarProdutoAPI, type Produto, type CategoriaProduto } from '../../services/api';
import { Modal } from '../common/Modal';

export const ProdutosDesktopView: React.FC = () => {
  const { token } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>('');

  // Modal Form
  const [modalNovo, setModalNovo] = useState<boolean>(false);
  const [nome, setNome] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [preco, setPreco] = useState<string>('');
  const [categoria, setCategoria] = useState<CategoriaProduto>('MOVEIS');
  const [salvando, setSalvando] = useState<boolean>(false);

  const carregarProdutos = async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await getProdutos(token);
      setProdutos(dados);
    } catch (err: any) {
      setError('Erro ao carregar catálogo de produtos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleCadastrarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !preco) return;

    setSalvando(true);
    try {
      await criarProdutoAPI({ nome, descricao, preco: parseFloat(preco), categoria }, token);
      alert(`✅ Produto "${nome}" (${categoria}) cadastrado com sucesso!`);
      setModalNovo(false);
      setNome('');
      setDescricao('');
      setPreco('');
      setCategoria('MOVEIS');
      await carregarProdutos();
    } catch (err: any) {
      alert(`❌ Erro ao cadastrar produto: ${err.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (p.descricao && p.descricao.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)' }}>
            Catálogo de Produtos
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Gerencie os produtos divididos por categoria (Móveis e Variedades) disponíveis para venda.
          </p>
        </div>

        <button
          onClick={() => setModalNovo(true)}
          style={{
            height: '46px',
            padding: '0 20px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-600)',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 3px 10px rgba(37, 99, 235, 0.3)',
          }}
        >
          <PlusCircle size={18} />
          <span>+ Cadastrar Produto</span>
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <Search
          size={18}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Buscar produto por nome ou descrição..."
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
          Carregando catálogo de produtos...
        </div>
      )}

      {error && (
        <div style={{ padding: '16px', backgroundColor: 'var(--status-atrasada-bg)', color: 'var(--status-atrasada-text)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {/* Grid of Product Cards */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {produtosFiltrados.map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={16} color="var(--accent-600)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>#{p.id}</span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: p.categoria === 'VARIEDADES' ? '#F3E8FF' : '#E0F2FE',
                      color: p.categoria === 'VARIEDADES' ? '#6B21A8' : '#0369A1',
                      border: `1px solid ${p.categoria === 'VARIEDADES' ? '#D8B4FE' : '#BAE6FD'}`,
                    }}
                  >
                    {p.categoria || 'MOVEIS'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-800)', marginBottom: '6px' }}>
                  {p.nome}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', minHeight: '40px' }}>
                  {p.descricao || 'Sem descrição cadastrada'}
                </p>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Preço de Tabela</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                  R$ {Number(p.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Form de Cadastrar Novo Produto (POST /produtos) */}
      <Modal
        isOpen={modalNovo}
        onClose={() => setModalNovo(false)}
        title="Cadastrar Novo Produto"
        maxWidth="440px"
      >
        <form onSubmit={handleCadastrarProduto} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Nome do Produto *
            </label>
            <input
              type="text"
              placeholder="Ex: Sofá Retrátil 3 Lugares"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Categoria do Produto *
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaProduto)}
              style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: '#FFFFFF', fontSize: '0.92rem' }}
            >
              <option value="MOVEIS">MÓVEIS</option>
              <option value="VARIEDADES">VARIEDADES</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Preço de Tabela (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="1200.00"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
              style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontWeight: 700 }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Descrição Completa
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Sofá em mola ensacada com tecido suede macio..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setModalNovo(false)}
              style={{ flex: 1, height: '44px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              style={{ flex: 1, height: '44px', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: 'var(--accent-600)', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
            >
              {salvando ? 'Salvar...' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
