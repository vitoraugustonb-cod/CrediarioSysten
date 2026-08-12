import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginScreen } from './components/auth/LoginScreen';
import { DesktopLayout } from './components/layout/DesktopLayout';
import { MobileLayout } from './components/layout/MobileLayout';
import './index.css';

const MainApp: React.FC = () => {
  const { isAuthenticated, usuario } = useAuth();

  // If not logged in, show Login Screen
  if (!isAuthenticated || !usuario) {
    return <LoginScreen />;
  }

  // Automatic routing based on user profile
  if (usuario.perfil === 'GERENTE') {
    return <DesktopLayout />;
  }

  if (usuario.perfil === 'VENDEDOR_COBRADOR') {
    return <MobileLayout />;
  }

  // Fallback if unexpected profile
  return <LoginScreen />;
};

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
