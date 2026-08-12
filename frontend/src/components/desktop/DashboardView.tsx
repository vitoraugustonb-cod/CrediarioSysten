import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Wallet, 
  AlertTriangle, 
  Users, 
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getRelatorioMensal, 
  getClientes, 
  getParcelas, 
  type RelatorioMensalItem,
  type Cliente,
  type Parcela
} from '../../services/api';

export const DashboardView: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [relatorio, setRelatorio] = useState<RelatorioMensalItem[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [error, setError] = useState<string | null>(null);

  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const [r, c, p] = await Promise.all([
          getRelatorioMensal(mesAtual, anoAtual, token),
          getClientes(token),
          getParcelas(token)
        ]);
        setRelatorio(r);
        setClientes(c);
        setParcelas(p);
      } catch (err: any) {
        setError('Erro ao carregar os dados do dashboard.');
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const totalVendidoMes = relatorio.reduce((acc, item) => acc + item.totalVendido, 0);
  const totalCobradoMes = relatorio.reduce((acc, item) => acc + item.totalCobrado, 0);
  const parcelasAtrasadasCount = parcelas.filter(p => p.status === 'ATRASADA').length;
  const clientesAtivosCount = clientes.length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)' }}>
            Visão Geral da Empresa
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Mês de Referência: <strong>{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</strong>
          </p>
        </div>
      </div>

      {loading && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Carregando indicadores gerenciais...
        </div>
      )}

      {error && (
        <div style={{ padding: '16px', backgroundColor: 'var(--status-atrasada-bg)', color: 'var(--status-atrasada-text)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {!loading && (
        <>
          {/* KPI Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {/* Card 1: Total Vendido no Mês */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                borderLeft: '5px solid var(--accent-600)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Total Vendido no Mês</span>
                <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                  <ShoppingBag size={20} />
                </div>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                R$ {totalVendidoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                <TrendingUp size={14} /> Consolidação Mensal
              </span>
            </div>

            {/* Card 2: Total Cobrado no Mês */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                borderLeft: '5px solid #16A34A',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Total Cobrado no Mês</span>
                <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', backgroundColor: '#DCFCE7', color: '#16A34A' }}>
                  <Wallet size={20} />
                </div>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803D' }}>
                R$ {totalCobradoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                Entradas & Parcelas
              </span>
            </div>

            {/* Card 3: Parcelas em Atraso */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                borderLeft: '5px solid #DC2626',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Parcelas em Atraso</span>
                <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                  <AlertTriangle size={20} />
                </div>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#B91C1C' }}>
                {parcelasAtrasadasCount} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>parcelas</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#B91C1C', fontWeight: 600, display: 'block', marginTop: '6px' }}>
                Requer ação de cobrança
              </span>
            </div>

            {/* Card 4: Clientes Ativos */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                borderLeft: '5px solid var(--primary-800)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Clientes Ativos</span>
                <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', color: 'var(--primary-800)' }}>
                  <Users size={20} />
                </div>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                {clientesAtivosCount}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                Cadastrados no sistema
              </span>
            </div>
          </div>

          {/* Performance por Funcionário Section */}
          <section
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-800)', marginBottom: '16px' }}>
              Desempenho por Funcionário no Mês
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Funcionário</th>
                  <th style={{ padding: '12px 16px' }}>Total Vendido</th>
                  <th style={{ padding: '12px 16px' }}>Total Cobrado</th>
                  <th style={{ padding: '12px 16px' }}>Inadimplência (Atrasos)</th>
                </tr>
              </thead>
              <tbody>
                {relatorio.map((row) => (
                  <tr key={row.funcionario.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.92rem' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary-800)' }}>
                      {row.funcionario.nome} ({row.funcionario.email})
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                      R$ {row.totalVendido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#15803D' }}>
                      R$ {row.totalCobrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={row.parcelasEmAtraso > 0 ? 'badge badge-ATRASADA' : 'badge badge-PAGA'}>
                        {row.parcelasEmAtraso} parcelas
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
};
