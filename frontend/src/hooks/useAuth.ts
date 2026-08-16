import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '../context/AuthContextDefinition';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
