import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  UserPlus, 
  Phone, 
  MapPin, 
  X,
  CreditCard
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
  const [clienteSelObj, setClienteSelObj] = useState<Cliente | null>(null);
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
    setClienteSelObj(cliente);
    setLoadingSaldo(true);
    setClienteSaldoSel(null);
    try {
      const saldo = await getSaldoCliente(cliente.id, token);
      setClienteSaldoSel(saldo);
    } catch (err: any) {
      alert(`Erro ao consultar saldo do cliente: ${err.message}`);
    } finally {
      setLoadingSaldo(false);
    }
  };

  const fecharModalSaldo = () => {
    setClienteSelObj(null);
    setClienteSaldoSel(null);
  };

  const clientesFiltrados = clientes.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone.includes(busca) ||
    c.endereco.toLowerCase().includes(busca.toLowerCase())
  );

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

                <button
                  type="button"
                  style={{
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--accent-50)',
                    color: 'var(--accent-700)',
                    border: '1px solid var(--border-subtle)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <CreditCard size={14} />
                  <span>Ver Saldo</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL: Saldo Devedor do Cliente (Centralizado no meio da tela com Portal) */}
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
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-600)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Ficha do Cliente
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '2px' }}>
                  {clienteSaldoSel?.cliente?.nome || clienteSaldoSel?.nome || clienteSelObj?.nome || 'Consultando Cliente...'}
                </h3>
              </div>

              <button
                onClick={fecharModalSaldo}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
              >
                <X size={24} />
              </button>
            </div>

            {loadingSaldo ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Consultando saldo devedor no banco de dados...
              </div>
            ) : (
              <div>
                {/* Saldo Devedor Card */}
                {(() => {
                  const saldoTotalNum = Number(clienteSaldoSel?.saldoDevedorTotal ?? clienteSaldoSel?.saldoDevedor ?? 0);
                  const parcelasAbertoCount = clienteSaldoSel?.totalParcelasEmAberto ?? 0;
                  const parcelasAtrasoCount = clienteSaldoSel?.parcelasEmAtraso ?? 0;
                  const telefoneCliente = clienteSaldoSel?.cliente?.telefone || clienteSelObj?.telefone || '';

                  return (
                    <>
                      <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '16px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Saldo Devedor Total
                        </span>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: saldoTotalNum > 0 ? '#B91C1C' : '#15803D', marginTop: '4px' }}>
                          R$ {saldoTotalNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                        <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: '#FFFFFF', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Parcelas em Aberto</span>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '2px' }}>
                            {parcelasAbertoCount}
                          </div>
                        </div>

                        <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #FCA5A5', backgroundColor: '#FEE2E2', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.78rem', color: '#B91C1C', fontWeight: 600 }}>Parcelas em Atraso</span>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#B91C1C', marginTop: '2px' }}>
                            {parcelasAtrasoCount}
                          </div>
                        </div>
                      </div>

                      {telefoneCliente && (
                        <a
                          href={`tel:${telefoneCliente}`}
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
                          <span>Ligar para {telefoneCliente}</span>
                        </a>
                      )}
                    </>
                  );
                })()}
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
    </div>
  );
};
