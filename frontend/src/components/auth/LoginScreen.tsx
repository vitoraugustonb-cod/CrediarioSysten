import React, { useState } from 'react';
import { Wallet, Eye, EyeOff, LogIn, ShieldCheck, Smartphone, Monitor } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { PerfilUsuario } from '../../types/auth';

export const LoginScreen: React.FC = () => {
  const { login, demoLogin, error, loading } = useAuth();
  
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) return;
    await login(email, senha);
  };

  const handleDemoClick = (perfil: PerfilUsuario) => {
    demoLogin(perfil);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-page)',
        padding: '20px',
        backgroundImage: 'radial-gradient(circle at 50% 10%, #E6F0FA 0%, #F8FAFC 70%)',
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
        }}
      >
        {/* Top Branding Banner */}
        <div
          style={{
            backgroundColor: 'var(--primary-800)',
            color: '#FFFFFF',
            padding: '32px 24px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--accent-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
            }}
          >
            <Wallet size={32} color="#FFFFFF" />
          </div>

          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Crediário<span style={{ color: '#60A5FA' }}>Master</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#93C5FD', marginTop: '4px' }}>
            Sistema de Gestão & Cobrança de Campo
          </p>
        </div>

        {/* Login Form Body */}
        <div style={{ padding: '28px 24px' }}>
          {error && (
            <div
              style={{
                backgroundColor: 'var(--status-atrasada-bg)',
                color: 'var(--status-atrasada-text)',
                border: '1px solid var(--status-atrasada-border)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '20px',
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: '18px' }}>
              <label
                htmlFor="email"
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-800)', marginBottom: '6px' }}
              >
                E-mail ou Usuário
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu.email@crediario.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-600)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label
                htmlFor="senha"
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-800)', marginBottom: '6px' }}
              >
                Senha de Acesso
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 44px 0 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent-600)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Entrar Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="touch-target"
              style={{
                width: '100%',
                height: 'var(--touch-target-large)',
                backgroundColor: 'var(--accent-600)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '1rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--accent-700)'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--accent-600)'; }}
            >
              <LogIn size={20} />
              <span>{loading ? 'Autenticando...' : 'Entrar no Sistema'}</span>
            </button>
          </form>

          {/* Quick Demo Access Section */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Acesso Rápido para Testes de Layout
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Gerente Demo Button */}
              <button
                type="button"
                onClick={() => handleDemoClick('GERENTE')}
                className="touch-target"
                style={{
                  height: '46px',
                  padding: '0 8px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-800)',
                  border: '1px solid var(--primary-600)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Monitor size={16} color="var(--primary-800)" />
                <span>Gerente (Desktop)</span>
              </button>

              {/* Vendedor/Cobrador Demo Button */}
              <button
                type="button"
                onClick={() => handleDemoClick('VENDEDOR_COBRADOR')}
                className="touch-target"
                style={{
                  height: '46px',
                  padding: '0 8px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-50)',
                  color: 'var(--accent-700)',
                  border: '1px solid var(--accent-600)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Smartphone size={16} color="var(--accent-700)" />
                <span>Vendedor (Mobile)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            padding: '12px 20px',
            textAlign: 'center',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <ShieldCheck size={16} color="#16A34A" />
          <span>Autenticação JWT Segura em Memória</span>
        </div>
      </div>
    </div>
  );
};
