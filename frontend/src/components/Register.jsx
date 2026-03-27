import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.error){
        setMsg(data.error);
      } else {
        setMsg('Registered! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1200);
      }
    } catch (e) {
      setMsg(e.message);
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
          <h2>Create Account</h2>
          {msg && <div className={msg.includes('error') ? 'error-msg' : 'success-msg'}>{msg}</div>}
          
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text"
              placeholder="Enter your name" 
              onChange={e => setForm({ ...form, name:e.target.value })} 
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input 
              type="email"
              placeholder="Enter your email" 
              onChange={e => setForm({ ...form, email:e.target.value })} 
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Create a password"
              onChange={e => setForm({ ...form, password:e.target.value })} 
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          
          <div className="auth-footer">
            <span>Already have an account?</span>
            <button type="button" className="link-btn" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
