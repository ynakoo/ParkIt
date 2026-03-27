import { useNavigate } from 'react-router-dom';
import './layout.css';

const ROLE_DASHBOARD = {
  USER: '/dashboard',
  DRIVER: '/driver',
  MANAGER: '/manager',
  SUPERADMIN: '/admin'
};

function Layout({ children, title }) {
  const navigate = useNavigate();

  const handleHome = () => {
    try {
      const saved = localStorage.getItem('currentUser');
      if (saved) {
        const user = JSON.parse(saved);
        navigate(ROLE_DASHBOARD[user.role] || '/dashboard');
        return;
      }
    } catch (e) {
      console.error(e);
    }
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <button onClick={handleHome}>Home</button>
        <strong>{title}</strong>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default Layout;