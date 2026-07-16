import { useAuth } from '../context/AuthContext';

export default function Header({ title }) {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header-left">
        <span className="app-logo">TaskFlow</span>
        <span className="app-title">{title}</span>
      </div>
      <div className="app-header-right">
        <span className="app-user">{user.name}</span>
        <button className="btn-logout" onClick={logout}>Cerrar sesión</button>
      </div>
    </header>
  );
}