import { useState } from 'react';

function LoginScreen({ onNavigate,onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async e => {
    e.preventDefault();
    const res = await onLogin(email.trim(), password);
    if (!res.success) setError(res.message);
  };

  return (
    <form onSubmit={submit} className="card">
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button>Login</button>
      <p onClick={() => onNavigate('REGISTER')}>Register</p>
    </form>
  );
}

export default LoginScreen;
