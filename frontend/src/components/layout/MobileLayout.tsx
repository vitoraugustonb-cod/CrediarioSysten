import React, { useState } from 'react';
import { 
  Wallet, 
  PlusCircle, 
  Users, 
  LogOut, 
  Sun,
  TrendingUp,
  FileSpreadsheet,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

import { ResumoDiaView } from '../mobile/ResumoDiaView';
import { CobrancasView } from '../mobile/CobrancasView';
import { NovaVendaView } from '../mobile/NovaVendaView';
import { ClientesView } from '../mobile/ClientesView';
import { HistoricoExtratoView } from '../mobile/HistoricoExtratoView';
import { HistoricoVendasExtratoView } from '../mobile/HistoricoVendasExtratoView';

export const MobileLayout: React.FC = () => {
  const { usuario, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('resumo');

  const bottomNavItems = [
    { id: 'resumo', label: 'Resumo', icon: TrendingUp },
    { id: 'cobrancas', label: 'Cobranças', icon: Wallet },
    { id: 'venda', label: 'Nova Venda', icon: PlusCircle },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'historico', label: 'Hist. Cobr.', icon: FileSpreadsheet },
    { id: 'historico_vendas', label: 'Hist. Vendas', icon: ShoppingBag },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-page)',
        paddingBottom: 'calc(var(--bottom-nav-height) + 20px)',
      }}
    >
      {/* Sticky Mobile Top Header Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 90,
          backgroundColor: 'var(--primary-800)',
          color: '#FFFFFF',
          padding: '12px 16px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* User & Role Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1rem',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              {usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.2 }}>
                {usuario?.nome || 'Vendedor/Cobrador'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#93C5FD',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    letterSpacing: '0.04em',
                  }}
                >
                  COBRADOR DE RUA
                </span>
                <span style={{ fontSize: '0.7rem', color: '#60A5FA', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Sun size={12} /> Modo Sol
                </span>
              </div>
            </div>
          </div>

          {/* Quick Logout button for field */}
          <button
            onClick={logout}
            className="touch-target"
            title="Sair do Sistema"
            style={{
              height: '44px',
              width: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#FCA5A5',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              cursor: 'pointer',
            }}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Dynamic Content Views */}
      <main style={{ padding: '12px 10px', flex: 1, maxWidth: '100vw', overflowX: 'hidden' }}>
        {activeTab === 'resumo' && <ResumoDiaView onNavigate={(t) => setActiveTab(t)} />}
        {activeTab === 'cobrancas' && <CobrancasView onNavigate={(t) => setActiveTab(t)} />}
        {activeTab === 'venda' && <NovaVendaView onNavigate={(t) => setActiveTab(t)} />}
        {activeTab === 'clientes' && <ClientesView />}
        {activeTab === 'historico' && <HistoricoExtratoView />}
        {activeTab === 'historico_vendas' && <HistoricoVendasExtratoView />}
      </main>

      {/* Navegação Inferior Fixa (Bottom Navigation for Mobile) */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'var(--bottom-nav-height)',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 100,
          boxShadow: 'var(--shadow-top)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="touch-target"
              style={{
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                border: 'none',
                backgroundColor: 'transparent',
                color: isActive ? 'var(--accent-600)' : 'var(--text-muted)',
                cursor: 'pointer',
                position: 'relative',
                padding: '0 2px',
                transition: 'color 0.15s ease',
              }}
            >
              {/* Active Tab Top Indicator Bar */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: '28px',
                    height: '3px',
                    backgroundColor: 'var(--accent-600)',
                    borderRadius: '0 0 4px 4px',
                  }}
                />
              )}

              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span
                style={{
                  fontSize: '0.66rem',
                  fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap',
                  letterSpacing: '-0.02em',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
