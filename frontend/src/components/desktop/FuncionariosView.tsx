import React, { useEffect, useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Smartphone, 
  Monitor, 
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getUsuarios, 
  criarUsuarioAPI, 
  getPrestacaoContasFuncionarioDia, 
  type UsuarioItem, 
  type PrestacaoContasDia 
} from '../../services/api';

import { Modal } from '../common/Modal';

export const FuncionariosView: React.FC = () => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>('');

  // Modal Novo Funcionário
  const [modalNovo, setModalNovo] = useState<boolean>(false);
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [perfil, setPerfil] = useState<'GERENTE' | 'VENDEDOR_COBRADOR'>('VENDEDOR_COBRADOR');
  const [salvando, setSalvando] = useState<boolean>(false);

  // Prestação de Contas Modal
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<UsuarioItem | null>(null);
  const [dataPrestacao, setDataPrestacao] = useState<string>(new Date().toISOString().substring(0, 10));
  const [prestacao, setPrestacao] = useState<PrestacaoContasDia | null>(null);
  const [loadingPrestacao, setLoadingPrestacao] = useState<boolean>(false);

  const carregarUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await getUsuarios(token);
      setUsuarios(dados);
    } catch (err: any) {
      setError('Erro ao carregar lista de funcionários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleCadastrarFuncionario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !senha) return;

    setSalvando(true);
    try {
      await criarUsuarioAPI({ nome, email, senha, perfil }, token);
      alert(`✅ Funcionário ${nome} cadastrado com sucesso!`);
      setModalNovo(false);
      setNome('');
      setEmail('');
      setSenha('');
      await carregarUsuarios();
    } catch (err: any) {
      alert(`❌ Erro ao criar funcionário: ${err.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const abrirPrestacao = async (u: UsuarioItem) => {
    setUsuarioSelecionado(u);
    setLoadingPrestacao(true);
    try {
      const dados = await getPrestacaoContasFuncionarioDia(u.id, token, dataPrestacao);
      setPrestacao(dados);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPrestacao(false);
    }
  };

  const atualizarDataPrestacao = async (novaData: string) => {
    setDataPrestacao(novaData);
    if (usuarioSelecionado) {
      setLoadingPrestacao(true);
      try {
        const dados = await getPrestacaoContasFuncionarioDia(usuarioSelecionado.id, token, novaData);
        setPrestacao(dados);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPrestacao(false);
      }
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(busca.toLowerCase()) ||
    u.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)' }}>
            Gestão de Funcionários & Equipe
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Gerencie perfis, acessos e acompanhe a prestação de contas diária da equipe de rua.
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
          <UserPlus size={18} />
          <span>+ Cadastrar Funcionário</span>
        </button>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <Search
          size={18}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Buscar funcionário por nome ou e-mail..."
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
          Carregando lista de funcionários...
        </div>
      )}

      {error && (
        <div style={{ padding: '16px', backgroundColor: 'var(--status-atrasada-bg)', color: 'var(--status-atrasada-text)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {/* Users Table */}
      {!loading && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px' }}>ID</th>
                <th style={{ padding: '14px 20px' }}>Nome</th>
                <th style={{ padding: '14px 20px' }}>E-mail</th>
                <th style={{ padding: '14px 20px' }}>Perfil de Acesso</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.92rem' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)' }}>#{u.id}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--primary-800)' }}>{u.nome}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-main)' }}>{u.email}</td>
                  <td style={{ padding: '14px 20px' }}>
                    {u.perfil === 'GERENTE' ? (
                      <span className="badge badge-PAGA">
                        <Monitor size={12} /> GERENTE
                      </span>
                    ) : (
                      <span className="badge badge-PARCIAL">
                        <Smartphone size={12} /> VENDEDOR / COBRADOR
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={u.ativo ? 'badge badge-PAGA' : 'badge badge-ATRASADA'}>
                      {u.ativo ? 'ATIVO' : 'INATIVO'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => abrirPrestacao(u)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--accent-50)',
                        color: 'var(--accent-700)',
                        border: '1px solid var(--accent-600)',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      Ver Prestação de Contas
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Prestação de Contas do Funcionário no Dia (GET /prestacao-contas/dia/:usuarioId) */}
      <Modal
        isOpen={!!usuarioSelecionado}
        onClose={() => setUsuarioSelecionado(null)}
        title={usuarioSelecionado?.nome || ''}
        subtitle="PRESTAÇÃO DE CONTAS DIÁRIA"
        maxWidth="520px"
      >
        {/* Date Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
          <Calendar size={18} color="var(--accent-600)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-800)' }}>Data:</span>
          <input
            type="date"
            value={dataPrestacao}
            onChange={(e) => atualizarDataPrestacao(e.target.value)}
            style={{ border: '1px solid var(--border-subtle)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}
          />
        </div>

        {loadingPrestacao ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Buscando prestação de contas...
          </div>
        ) : prestacao && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '16px', backgroundColor: 'var(--accent-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-600)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-700)', fontWeight: 600 }}>Total Vendido no Dia</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-700)', marginTop: '4px' }}>
                  R$ {prestacao.totalVendido.toFixed(2)}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {prestacao.qtdVendas} vendas registradas
                </span>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#DCFCE7', borderRadius: 'var(--radius-md)', border: '1px solid #86EFAC' }}>
                <span style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 600 }}>Total Cobrado no Dia</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D', marginTop: '4px' }}>
                  R$ {prestacao.totalCobrado.toFixed(2)}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {prestacao.qtdCobrancas} parcelas recebidas
                </span>
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Valores validados pelo sistema para acerto de caixa ao final do expediente.
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Form de Cadastrar Novo Funcionário (POST /usuarios) */}
      <Modal
        isOpen={modalNovo}
        onClose={() => setModalNovo(false)}
        title="Cadastrar Novo Funcionário"
        maxWidth="460px"
      >
        <form onSubmit={handleCadastrarFuncionario} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Nome Completo *
            </label>
            <input
              type="text"
              placeholder="Ex: Carlos Cobrador"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              E-mail de Acesso *
            </label>
            <input
              type="email"
              placeholder="carlos@crediario.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Senha de Acesso *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Perfil de Acesso *
            </label>
            <select
              value={perfil}
              onChange={(e) => setPerfil(e.target.value as any)}
              style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: '#FFFFFF' }}
            >
              <option value="VENDEDOR_COBRADOR">VENDEDOR / COBRADOR (Uso Mobile no Campo)</option>
              <option value="GERENTE">GERENTE (Acesso Completo ao Painel)</option>
            </select>
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
              {salvando ? 'Salvando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
