import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      setError('Email o contraseña incorrectos');
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <span className="login-logo">TaskFlow</span>
        <p className="login-subtitle">Accede con tus credenciales para ver tus tareas</p>

        <form onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="login-label" htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button className="btn-primary login-submit" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}