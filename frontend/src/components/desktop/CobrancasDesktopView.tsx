import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Edit3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getParcelas, 
  ajustarParcelaAPI, 
  type Parcela
} from '../../services/api';
import { Modal } from '../common/Modal';

export const CobrancasDesktopView: React.FC = () => {
  const { token } = useAuth();
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filtroStatus, setFiltroStatus] = useState<string>('TODAS');
  const [buscaCliente, setBuscaCliente] = useState<string>('');

  // Manual Adjustment Modal (Gerente Only)
  const [parcelaAjuste, setParcelaAjuste] = useState<Parcela | null>(null);
  const [novoValor, setNovoValor] = useState<string>('');
  const [novaDataVencimento, setNovaDataVencimento] = useState<string>('');
  const [motivoAjuste, setMotivoAjuste] = useState<string>('');
  const [salvandoAjuste, setSalvandoAjuste] = useState<boolean>(false);

  const carregarParcelas = async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await getParcelas(token);
      setParcelas(p);
    } catch (err: any) {
      setError('Erro ao carregar lista de cobranças.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarParcelas();
  }, []);

  const abrirAjuste = (p: Parcela) => {
    setParcelaAjuste(p);
    setNovoValor(String(p.valor));
    setNovaDataVencimento(p.dataVencimento ? p.dataVencimento.substring(0, 10) : '');
    setMotivoAjuste('');
  };

  const handleSalvarAjuste = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parcelaAjuste) return;

    setSalvandoAjuste(true);
    try {
      await ajustarParcelaAPI(
        parcelaAjuste.id,
        novoValor ? parseFloat(novoValor) : undefined,
        novaDataVencimento || undefined,
        motivoAjuste,
        token
      );
      alert(`✅ Parcela #${parcelaAjuste.id} ajustada com sucesso!`);
      setParcelaAjuste(null);
      await carregarParcelas();
    } catch (err: any) {
      alert(`❌ Erro ao ajustar parcela: ${err.message}`);
    } finally {
      setSalvandoAjuste(false);
    }
  };

  const parcelasFiltradas = parcelas.filter((p) => {
    const matchStatus = filtroStatus === 'TODAS' || p.status === filtroStatus;
    const nomeCliente = p.venda?.cliente?.nome || '';
    const matchCliente = nomeCliente.toLowerCase().includes(buscaCliente.toLowerCase());
    return matchStatus && matchCliente;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)' }}>
            Gestão & Monitoramento de Cobranças
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Acompanhe parcelas pendentes, pagas e atrasadas, e execute ajustes manuais de gerente.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', backgroundColor: '#FFFFFF', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search
            size={18}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Buscar parcela por nome do cliente..."
            value={buscaCliente}
            onChange={(e) => setBuscaCliente(e.target.value)}
            style={{
              width: '100%',
              height: '42px',
              padding: '0 14px 0 42px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status:</span>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={{ height: '42px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: '#FFFFFF', fontSize: '0.9rem' }}
          >
            <option value="TODAS">TODAS AS COBRANÇAS</option>
            <option value="PENDENTE">PENDENTES</option>
            <option value="ATRASADA">ATRASADAS</option>
            <option value="PAGA">PAGAS</option>
            <option value="PARCIAL">PAGAS PARCIALMENTE</option>
          </select>
        </div>
      </div>

      {loading && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando parcelas...
        </div>
      )}

      {error && (
        <div style={{ padding: '16px', backgroundColor: 'var(--status-atrasada-bg)', color: 'var(--status-atrasada-text)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {!loading && (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px' }}>ID Parcela</th>
                <th style={{ padding: '14px 20px' }}>Cliente</th>
                <th style={{ padding: '14px 20px' }}>Cobrador Atribuído</th>
                <th style={{ padding: '14px 20px' }}>Vencimento</th>
                <th style={{ padding: '14px 20px' }}>Valor</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Ação de Gerente</th>
              </tr>
            </thead>
            <tbody>
              {parcelasFiltradas.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.92rem' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--primary-800)' }}>#{p.id} (P. {p.numero})</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>{p.venda?.cliente?.nome || 'Cliente'}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{p.cobrador?.nome || 'Não atribuído'}</td>
                  <td style={{ padding: '14px 20px' }}>{new Date(p.dataVencimento).toLocaleDateString('pt-BR')}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--primary-800)' }}>
                    R$ {Number(p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge badge-${p.status}`}>
                      <span className="badge-dot" /> {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => abrirAjuste(p)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#FEF3C7',
                        color: '#B45309',
                        border: '1px solid #FDE68A',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <Edit3 size={14} />
                      <span>Ajuste Manual</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Ajuste Manual de Parcela (Gerente) */}
      <Modal
        isOpen={!!parcelaAjuste}
        onClose={() => setParcelaAjuste(null)}
        title={`Ajuste Manual de Parcela #${parcelaAjuste?.id || ''}`}
        maxWidth="440px"
      >
        <form onSubmit={handleSalvarAjuste} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Novo Valor da Parcela (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              value={novoValor}
              onChange={(e) => setNovoValor(e.target.value)}
              required
              style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontWeight: 700 }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Nova Data de Vencimento *
            </label>
            <input
              type="date"
              value={novaDataVencimento}
              onChange={(e) => setNovaDataVencimento(e.target.value)}
              required
              style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Motivo / Justificativa do Ajuste *
            </label>
            <textarea
              rows={3}
              value={motivoAjuste}
              onChange={(e) => setMotivoAjuste(e.target.value)}
              placeholder="Ex: Desconto concedido autorizadamente pelo Gerente..."
              required
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setParcelaAjuste(null)}
              style={{ flex: 1, height: '44px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvandoAjuste}
              style={{ flex: 1, height: '44px', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: '#D97706', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
            >
              {salvandoAjuste ? 'Salvando...' : 'Aplicar Ajuste'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
