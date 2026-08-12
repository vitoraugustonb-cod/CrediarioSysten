import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getRelatorioMensal, type RelatorioMensalItem } from '../../services/api';

export const RelatorioMensalView: React.FC = () => {
  const { token } = useAuth();
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [relatorio, setRelatorio] = useState<RelatorioMensalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const carregarRelatorio = async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await getRelatorioMensal(mes, ano, token);
      setRelatorio(dados);
    } catch (err: any) {
      setError('Erro ao carregar relatório mensal consolidado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarRelatorio();
  }, [mes, ano]);

  const totalVendidoEmpresa = relatorio.reduce((acc, r) => acc + r.totalVendido, 0);
  const totalCobradoEmpresa = relatorio.reduce((acc, r) => acc + r.totalCobrado, 0);
  const totalAtrasosEmpresa = relatorio.reduce((acc, r) => acc + r.parcelasEmAtraso, 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)' }}>
            Relatório Mensal Consolidado por Funcionário
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Acompanhamento consolidado de vendas, recebimentos e parcelas atrasadas da equipe.
          </p>
        </div>
      </div>

      {/* Month/Year Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#FFFFFF', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="var(--accent-600)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Mês:</span>
          <select
            value={mes}
            onChange={(e) => setMes(parseInt(e.target.value, 10))}
            style={{ height: '40px', padding: '0 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: '#FFFFFF', fontSize: '0.9rem' }}
          >
            {[
              { id: 1, nome: 'Janeiro' }, { id: 2, nome: 'Fevereiro' }, { id: 3, nome: 'Março' },
              { id: 4, nome: 'Abril' }, { id: 5, nome: 'Maio' }, { id: 6, nome: 'Junho' },
              { id: 7, nome: 'Julho' }, { id: 8, nome: 'Agosto' }, { id: 9, nome: 'Setembro' },
              { id: 10, nome: 'Outubro' }, { id: 11, nome: 'Novembro' }, { id: 12, nome: 'Dezembro' }
            ].map(m => (
              <option key={m.id} value={m.id}>{m.nome}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Ano:</span>
          <select
            value={ano}
            onChange={(e) => setAno(parseInt(e.target.value, 10))}
            style={{ height: '40px', padding: '0 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: '#FFFFFF', fontSize: '0.9rem' }}
          >
            {[2024, 2025, 2026, 2027].map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <button
          onClick={carregarRelatorio}
          style={{ height: '40px', padding: '0 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={16} />
          <span>Atualizar</span>
        </button>
      </div>

      {loading && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando relatório mensal...
        </div>
      )}

      {error && (
        <div style={{ padding: '16px', backgroundColor: 'var(--status-atrasada-bg)', color: 'var(--status-atrasada-text)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {/* Summary Cards Row */}
      {!loading && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent-600)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL VENDIDO DA EQUIPE</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '2px' }}>
                R$ {totalVendidoEmpresa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', borderLeft: '4px solid #16A34A' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL COBRADO DA EQUIPE</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803D', marginTop: '2px' }}>
                R$ {totalCobradoEmpresa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', borderLeft: '4px solid #DC2626' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>PARCELAS EM ATRASO</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#B91C1C', marginTop: '2px' }}>
                {totalAtrasosEmpresa} <span style={{ fontSize: '0.85rem' }}>parcelas</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>Funcionário</th>
                  <th style={{ padding: '14px 20px' }}>🪑 Móveis</th>
                  <th style={{ padding: '14px 20px' }}>🛍️ Variedades</th>
                  <th style={{ padding: '14px 20px' }}>Total Vendido</th>
                  <th style={{ padding: '14px 20px' }}>Total Cobrado</th>
                  <th style={{ padding: '14px 20px' }}>Parcelas em Atraso</th>
                </tr>
              </thead>
              <tbody>
                {relatorio.map((item) => (
                  <tr key={item.funcionario.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.92rem' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--primary-800)' }}>
                      {item.funcionario.nome} ({item.funcionario.email})
                    </td>
                    <td style={{ padding: '14px 20px', color: '#0369A1', fontWeight: 600 }}>
                      R$ {Number(item.totalVendidoMoveis || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#6B21A8', fontWeight: 600 }}>
                      R$ {Number(item.totalVendidoVariedades || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--primary-800)' }}>
                      R$ {Number(item.totalVendido).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#15803D' }}>
                      R$ {Number(item.totalCobrado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className={item.parcelasEmAtraso > 0 ? 'badge badge-ATRASADA' : 'badge badge-PAGA'}>
                        {item.parcelasEmAtraso} parcelas em atraso
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
