import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { TokenStorage } from './tokenStorage';
import { AuthContextType, AuthState, AuthUser } from './types';

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Reducer ─────────────────────────────────────────────────────────────────
type Action =
  | { type: 'RESTORE';      token: string | null; user: AuthUser | null }
  | { type: 'LOGIN';        token: string;         user: AuthUser }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER';  user: AuthUser };

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'RESTORE':
      return {
        ...state,
        token: action.token,
        user: action.user,
        isAuthenticated: !!action.token,
        isLoading: false,
      };
    case 'LOGIN':
      return {
        token: action.token,
        user: action.user,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return { token: null, user: null, isAuthenticated: false, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: action.user };
    default:
      return state;
  }
}

const INITIAL: AuthState = {
  token: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  // Uygulama açılırken SecureStore'dan token/kullanıcı restore et
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [token, user] = await Promise.all([
        TokenStorage.getToken(),
        TokenStorage.getUser<AuthUser>(),
      ]);
      if (!cancelled) {
        dispatch({ type: 'RESTORE', token, user });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (token: string, user: AuthUser): Promise<void> => {
    await Promise.all([
      TokenStorage.setToken(token),
      TokenStorage.setUser(user),
    ]);
    dispatch({ type: 'LOGIN', token, user });
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await TokenStorage.clearAll();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateUser = useCallback(async (partial: Partial<AuthUser>): Promise<void> => {
    if (!state.user) return;
    const updated = { ...state.user, ...partial };
    await TokenStorage.setUser(updated);
    dispatch({ type: 'UPDATE_USER', user: updated });
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be called inside <AuthProvider>');
  }
  return ctx;
}
