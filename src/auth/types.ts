// ─── Kullanıcı Modeli ─────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  studentNumber?: string;
  faculty?: string;
  role: 'student' | 'staff' | 'admin';
}

// ─── Auth Durumu ─────────────────────────────────────────────────────────────
export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;    // SecureStore'dan restore ediliyor
  isAuthenticated: boolean;
}

// ─── Context API ─────────────────────────────────────────────────────────────
export interface AuthContextType extends AuthState {
  login: (token: string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (partial: Partial<AuthUser>) => Promise<void>;
}
