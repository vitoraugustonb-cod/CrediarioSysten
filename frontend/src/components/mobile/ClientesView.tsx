import React, { useCallback, useEffect, useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Phone, 
  MapPin, 
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { 
  getClientes, 
  criarClienteAPI, 
  getSaldoCliente, 
  type Cliente, 
  type SaldoDevedorCliente 
} from '../../services/api';

export const ClientesView: React.FC = () => {
  const { token } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>('');

  // Modals
  const [modalNovoCliente, setModalNovoCliente] = useState<boolean>(false);
  const [clienteSaldoSel, setClienteSaldoSel] = useState<SaldoDevedorCliente | null>(null);
  const [loadingSaldo, setLoadingSaldo] = useState<boolean>(false);

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

  const abrirSaldoCliente = async (cliente: Cliente) => {
    setLoadingSaldo(true);
    setClienteSaldoSel(null);
    try {
      const saldo = await getSaldoCliente(cliente.id, token);
      setClienteSaldoSel(saldo);
    } catch (err: any) {
      alert(`Erro ao consultar saldo: ${err.message}`);
    } finally {
      setLoadingSaldo(false);
    }
  };

  const clientesFiltrados = clientes.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone.includes(busca) ||
    c.endereco.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
            placeholder="Buscar cliente por nome..."
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
          className="touch-target"
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
            boxShadow: '0 3px 10px rgba(37, 99, 235, 0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          <UserPlus size={18} />
          <span>+ Novo</span>
        </button>
      </div>

      {loading && (
        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando lista de clientes...
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

      {/* Clients List */}
      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {clientesFiltrados.length === 0 ? (
            <div style={{ padding: '30px 16px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)' }}>
              Nenhum cliente encontrado.
            </div>
          ) : (
            clientesFiltrados.map((c) => (
              <div
                key={c.id}
                onClick={() => abrirSaldoCliente(c)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                    {c.nome}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={14} color="var(--accent-600)" /> {c.endereco}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--accent-700)', fontWeight: 600, marginTop: '2px' }}>
                    📞 {c.telefone}
                  </p>
                </div>

                <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Toque para ver</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-600)' }}>Saldo Devedor</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal / Drawer: Saldo Devedor do Cliente (GET /clientes/:id/saldo) */}
      {(loadingSaldo || clienteSaldoSel) && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div className="animate-fade-in" style={{ width: '100%', maxWidth: '480px', backgroundColor: '#FFFFFF', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)', padding: '24px 20px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                {clienteSaldoSel?.cliente?.nome || 'Consultando Cliente...'}
              </h3>
              <button onClick={() => setClienteSaldoSel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>

            {loadingSaldo ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Buscando saldo devedor...
              </div>
            ) : clienteSaldoSel && (
              <div>
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>SALDO DEVEDOR TOTAL</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: clienteSaldoSel.saldoDevedorTotal > 0 ? '#B91C1C' : '#15803D', marginTop: '2px' }}>
                    R$ {Number(clienteSaldoSel.saldoDevedorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: '#FFFFFF' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Parcelas em Aberto</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                      {clienteSaldoSel.totalParcelasEmAberto}
                    </div>
                  </div>

                  <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #FCA5A5', backgroundColor: '#FEE2E2' }}>
                    <span style={{ fontSize: '0.75rem', color: '#B91C1C' }}>Parcelas em Atraso</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#B91C1C' }}>
                      {clienteSaldoSel.parcelasEmAtraso}
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${clienteSaldoSel.cliente?.telefone}`}
                  className="touch-target"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    height: '48px',
                    backgroundColor: 'var(--accent-600)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                  }}
                >
                  <Phone size={18} />
                  <span>Ligar para Cliente ({clienteSaldoSel.cliente?.telefone})</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Form de Cadastrar Novo Cliente (POST /clientes) */}
      {modalNovoCliente && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                Cadastrar Novo Cliente
              </h3>
              <button onClick={() => setModalNovoCliente(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCadastrarCliente} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
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
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Telefone / WhatsApp *
                </label>
                <input
                  type="text"
                  placeholder="(11) 99999-8888"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                  style={{ width: '100%', height: '46px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
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
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
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
                  style={{ flex: 1, height: '44px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  style={{ flex: 1, height: '44px', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: 'var(--accent-600)', color: '#FFFFFF', fontWeight: 700 }}
                >
                  {salvando ? 'Salvando...' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
