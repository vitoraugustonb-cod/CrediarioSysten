import React, { useEffect, useState } from 'react';
import { Smartphone, Download, X, Share2, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSHelp, setShowIOSHelp] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    // 1. Verifica se já está rodando em modo aplicativo standalone (instalado)
    const isApp = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    setIsStandalone(isApp);

    // 2. Detecta se é dispositivo iOS (iPhone / iPad)
    const ua = window.navigator.userAgent;
    const isIosDevice = /iphone|ipad|ipod/i.test(ua);
    setIsIOS(isIosDevice);

    // 3. Captura o evento nativo de instalação do Chrome / Android
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Se já estiver instalado como app, ou dispensado, não exibe
  if (isStandalone || dismissed) {
    return null;
  }

  // Se for Android/Chrome com prompt pronto, OU se for iOS e ainda não está instalado
  const canShowPrompt = Boolean(deferredPrompt) || isIOS;

  if (!canShowPrompt) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
        setDismissed(true);
      }
    } else if (isIOS) {
      setShowIOSHelp(true);
    }
  };

  return (
    <div
      style={{
        margin: '12px 16px',
        padding: '14px 16px',
        borderRadius: 'var(--radius-lg, 12px)',
        backgroundColor: '#1E293B',
        color: '#FFFFFF',
        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
        border: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <Smartphone size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F8FAFC' }}>
              Instalar App no Celular
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Acesso rápido e tela cheia para cobrança
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px'
          }}
          title="Fechar"
        >
          <X size={18} />
        </button>
      </div>

      <button
        type="button"
        onClick={handleInstallClick}
        style={{
          width: '100%',
          height: '40px',
          backgroundColor: '#2563EB',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '0.85rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
          transition: 'background-color 0.15s ease'
        }}
      >
        <Download size={16} />
        Instalar Aplicativo Agora
      </button>

      {/* Instrução visual especial para usuários de iPhone (Safari) */}
      {showIOSHelp && (
        <div
          style={{
            marginTop: '4px',
            padding: '10px 12px',
            backgroundColor: '#0F172A',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: '#E2E8F0',
            lineHeight: '1.4'
          }}
        >
          <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: '#60A5FA' }}>
            Como instalar no iPhone:
          </p>
          <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
            1. Toque no botão de compartilhar <Share2 size={12} color="#60A5FA" /> abaixo.
          </p>
          <p style={{ margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
            2. Selecione <strong style={{ color: '#F1F5F9' }}>"Adicionar à Tela de Início"</strong> <PlusSquare size={12} />.
          </p>
        </div>
      )}
    </div>
  );
};
