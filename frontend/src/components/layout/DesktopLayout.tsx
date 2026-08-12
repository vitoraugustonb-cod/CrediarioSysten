import React, { useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  Wallet, 
  UserCheck, 
  LogOut, 
  Bell, 
  ShieldCheck,
  TrendingUp,
  Package,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import { DashboardView } from '../desktop/DashboardView';
import { FuncionariosView } from '../desktop/FuncionariosView';
import { ClientesDesktopView } from '../desktop/ClientesDesktopView';
import { VendasDesktopView } from '../desktop/VendasDesktopView';
import { CobrancasDesktopView } from '../desktop/CobrancasDesktopView';
import { RelatorioMensalView } from '../desktop/RelatorioMensalView';
import { ProdutosDesktopView } from '../desktop/ProdutosDesktopView';

export const DesktopLayout: React.FC = () => {
  const { usuario, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Inicial', icon: LayoutDashboard },
    { id: 'funcionarios', label: 'Funcionários', icon: UserCheck },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'vendas', label: 'Vendas', icon: ShoppingBag },
    { id: 'cobrancas', label: 'Cobranças', icon: Wallet },
    { id: 'relatorios', label: 'Relatório Mensal', icon: TrendingUp },
    { id: 'produtos', label: 'Produtos', icon: Package },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      {/* Sidebar Fixa à Esquerda (Perfil GERENTE) */}
      <aside
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--primary-800)',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
              }}
            >
              <Wallet size={24} color="#FFFFFF" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Crediário<span style={{ color: '#60A5FA' }}>Master</span>
              </h1>
              <span style={{ fontSize: '0.72rem', color: '#93C5FD', fontWeight: 500, letterSpacing: '0.05em' }}>
                PAINEL DO GERENTE
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', padding: '8px 12px', textTransform: 'uppercase' }}>
            Menu Principal
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#CBD5E1',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.92rem',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={20} color={isActive ? '#60A5FA' : '#94A3B8'} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Info & Logout Footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(0, 0, 0, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', padding: '0 4px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : 'G'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {usuario?.nome || 'Gerente'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {usuario?.email || 'gerente@crediario.com'}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(220, 38, 38, 0.15)',
              color: '#FCA5A5',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.15)')}
          >
            <LogOut size={16} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ marginLeft: 'var(--sidebar-width)', flex: 1, padding: '24px 32px' }}>
        {/* Top Header Bar */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            backgroundColor: '#FFFFFF',
            padding: '16px 24px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-PAGA">
                <ShieldCheck size={13} /> Sistema Gestor Online
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Perfil: <strong style={{ color: 'var(--primary-800)' }}>GERENTE</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '4px' }}>
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              <div>Bem-vindo, <strong>{usuario?.nome || 'Gerente'}</strong></div>
              <div style={{ fontSize: '0.78rem' }}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</div>
            </div>

            <button
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                position: 'relative',
              }}
            >
              <Bell size={18} />
              <span
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-600)',
                }}
              />
            </button>
          </div>
        </header>

        {/* Dynamic Desktop Views */}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'funcionarios' && <FuncionariosView />}
        {activeTab === 'clientes' && <ClientesDesktopView />}
        {activeTab === 'vendas' && <VendasDesktopView />}
        {activeTab === 'cobrancas' && <CobrancasDesktopView />}
        {activeTab === 'relatorios' && <RelatorioMensalView />}
        {activeTab === 'produtos' && <ProdutosDesktopView />}
      </main>
    </div>
  );
};
