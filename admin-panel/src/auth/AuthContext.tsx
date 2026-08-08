import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { authService } from '../services/authService';
import { authTokenStorage } from '../api/client';
import type { AdminUser } from '../types/models';

const SESSION_KEY = 'yiu_admin_session';

interface StoredSession {
  token: string;
  user: AdminUser;
}

interface AuthState {
  token: string | null;
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type Action =
  | { type: 'RESTORE'; session: StoredSession | null }
  | { type: 'LOGIN'; session: StoredSession }
  | { type: 'LOGOUT' };

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'RESTORE':
      return {
        token: action.session?.token ?? null,
        user: action.session?.user ?? null,
        isAuthenticated: !!action.session,
        isLoading: false,
      };
    case 'LOGIN':
      return {
        token: action.session.token,
        user: action.session.user,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return { token: null, user: null, isAuthenticated: false, isLoading: false };
    default:
      return state;
  }
}

const INITIAL: AuthState = { token: null, user: null, isLoading: true, isAuthenticated: false };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

/**
 * Mobil uygulamadaki `src/auth/AuthContext.tsx` ile aynı desen (reducer +
 * mount'ta restore + login/logout). Backend geldiğinde yalnızca
 * `authService.login` içindeki mock dalı kaldırılacak — bu context hiç
 * değişmeyecek.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  useEffect(() => {
    dispatch({ type: 'RESTORE', session: readSession() });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await authService.login(email, password);
    const session: StoredSession = { token, user };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    authTokenStorage.set(token);
    dispatch({ type: 'LOGIN', session });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    authTokenStorage.clear();
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be called inside <AuthProvider>');
  }
  return ctx;
}
