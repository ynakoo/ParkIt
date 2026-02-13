import { useState } from 'react';

function Register({ onNavigate }) {
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [msg, setMsg] = useState('');

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.error){
        setMsg(data.error);
      }
      console.log(data)
      setMsg('Registered! Login now.');
      setTimeout(() => onNavigate('LOGIN'), 1200);
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <form onSubmit={submit} className="card">
      <h2>Register</h2>
      <input placeholder="Name" onChange={e => setForm({ ...form, name:e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email:e.target.value })} />
      <input type="password" placeholder="Password"
             onChange={e => setForm({ ...form, password:e.target.value })} />
      <button>Register</button>
      <p onClick={() => onNavigate('LOGIN')}>Login</p>
      <p>{msg}</p>
    </form>

  );
}

export default Register;


