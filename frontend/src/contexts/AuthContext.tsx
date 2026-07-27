import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';
import { authService } from '../services/auth';

type UserRole = 'ADMIN' | 'USER' | null;

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseRole(token: string | null): UserRole {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = `${base64}${'='.repeat((4 - (base64.length % 4)) % 4)}`;
    const parsed = JSON.parse(atob(padded));
    return parsed.role === 'ADMIN' ? 'ADMIN' : 'USER';
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('bookmanager.token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem('bookmanager.refreshToken'));
  const [role, setRole] = useState<UserRole>(() => parseRole(localStorage.getItem('bookmanager.token')));

  const isAuthenticated = !!token;

  const handleAuthResponse = useCallback((data: AuthResponse) => {
    localStorage.setItem('bookmanager.token', data.token);
    localStorage.setItem('bookmanager.refreshToken', data.refreshToken);
    setToken(data.token);
    setRefreshToken(data.refreshToken);
    setRole(parseRole(data.token));
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authService.login(data);
    handleAuthResponse(response);
  }, [handleAuthResponse]);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authService.register(data);
    handleAuthResponse(response);
  }, [handleAuthResponse]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('bookmanager.token');
      localStorage.removeItem('bookmanager.refreshToken');
      setToken(null);
      setRefreshToken(null);
      setRole(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, refreshToken, role, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
