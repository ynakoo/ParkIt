import { useState } from 'react';
import './auth.css';

function LoginScreen({ onNavigate, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async e => {
    e.preventDefault();
    const res = await onLogin(email.trim(), password);
    if (!res.success) setError(res.message);
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

          <button type="submit" className="auth-btn">Sign In</button>
          
          <div className="auth-footer">
            <span>Don't have an account?</span>
            <button type="button" className="link-btn" onClick={() => onNavigate('REGISTER')}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;
