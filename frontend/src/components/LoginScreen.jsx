import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

const ROLE_DASHBOARD = {
  USER: '/dashboard',
  DRIVER: '/driver',
  MANAGER: '/manager',
  SUPERADMIN: '/admin'
};

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      navigate(ROLE_DASHBOARD[data.user.role] || '/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="parking-icon"></div>
          <h1>ParkIt</h1>
          <p>Smart Parking Solution</p>
        </div>

        <form onSubmit={submit} className="auth-form">
          <h2>Welcome Back</h2>
          {error && <div className="error-msg">{error}</div>}
          
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div className="auth-footer">
            <span>Don't have an account?</span>
            <button type="button" className="link-btn" onClick={() => navigate('/register')}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;
