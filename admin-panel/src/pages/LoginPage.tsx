import { useState, type FormEvent } from 'react';

/**
 * Giriş ekranı iskeleti. Backend Auth modülü Faz-2'de implemente edildikten
 * sonra bu form gerçek /api/auth/login çağrısına bağlanacak (bkz. src/api/client.ts).
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO (Faz 2): apiClient.post('/api/auth/login', { email, password })
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>YIU Admin Panel</h1>
        <p className="login-card__hint">Backend hazır olduğunda giriş aktif olacak.</p>

        <label htmlFor="email">E-posta</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@yiu.edu.tr"
          autoComplete="username"
        />

        <label htmlFor="password">Şifre</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <button type="submit" disabled>
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
