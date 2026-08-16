import React, { useCallback, useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Wallet, 
  Calendar, 
  RefreshCw,
  PlusCircle,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getPrestacaoContasDia, type PrestacaoContasDia } from '../../services/api';

interface ResumoDiaViewProps {
  onNavigate: (tab: string) => void;
}

export const ResumoDiaView: React.FC<ResumoDiaViewProps> = ({ onNavigate }) => {
  const { token } = useAuth();
  const [dataSel, setDataSel] = useState<string>(new Date().toISOString().substring(0, 10));
  const [resumo, setResumo] = useState<PrestacaoContasDia | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const carregarResumo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await getPrestacaoContasDia(token, dataSel);
      setResumo(dados);
    } catch {
      setError('Não foi possível carregar a prestação de contas do dia.');
    } finally {
      setLoading(false);
    }
  }, [token, dataSel]);

  useEffect(() => {
    carregarResumo();
  }, [carregarResumo]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Date Header Filter */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '16px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="var(--accent-600)" />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              Data da Prestação
            </span>
            <input
              type="date"
              value={dataSel}
              onChange={(e) => setDataSel(e.target.value)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: 'var(--primary-800)',
                outline: 'none',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>

        <button
          onClick={carregarResumo}
          className="touch-target"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
        </button>
      </div>

      {loading && (
        <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando resumo do dia...
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

      {!loading && resumo && (
        <>
          {/* Main Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Total Vendido no Dia */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                borderTop: '4px solid var(--accent-600)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Total Vendido
                </span>
                <div style={{ padding: '6px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                  <ShoppingBag size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                R$ {resumo.totalVendido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                {resumo.qtdVendas} {resumo.qtdVendas === 1 ? 'venda realizada' : 'vendas realizadas'}
              </span>
            </div>

            {/* Total Cobrado no Dia */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                borderTop: '4px solid #16A34A',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Total Cobrado
                </span>
                <div style={{ padding: '6px', borderRadius: 'var(--radius-md)', backgroundColor: '#DCFCE7', color: '#16A34A' }}>
                  <Wallet size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D' }}>
                R$ {resumo.totalCobrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                {resumo.qtdCobrancas} {resumo.qtdCobrancas === 1 ? 'parcela recebida' : 'parcelas recebidas'}
              </span>
            </div>
          </div>

          {/* Detalhamento por Categoria */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Vendas do Dia por Categoria
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
              <div style={{ padding: '10px 12px', backgroundColor: '#E0F2FE', borderRadius: 'var(--radius-md)', border: '1px solid #BAE6FD' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369A1' }}>🪑 MÓVEIS</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0369A1', marginTop: '2px' }}>
                  R$ {(resumo.totalVendidoMoveis || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div style={{ padding: '10px 12px', backgroundColor: '#F3E8FF', borderRadius: 'var(--radius-md)', border: '1px solid #D8B4FE' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B21A8' }}>🛍️ VARIEDADES</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6B21A8', marginTop: '2px' }}>
                  R$ {(resumo.totalVendidoVariedades || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '12px' }}>
              Ações Rápidas de Campo
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => onNavigate('cobrancas')}
                className="touch-target"
                style={{
                  width: '100%',
                  height: 'var(--touch-target-large)',
                  backgroundColor: 'var(--accent-600)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 16px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(37, 99, 235, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Wallet size={20} />
                  <span>Ver Cobranças do Dia</span>
                </div>
                <ArrowUpRight size={18} />
              </button>

              <button
                onClick={() => onNavigate('venda')}
                className="touch-target"
                style={{
                  width: '100%',
                  height: 'var(--touch-target-large)',
                  backgroundColor: 'var(--primary-800)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <PlusCircle size={20} />
                  <span>Nova Venda em Campo</span>
                </div>
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
