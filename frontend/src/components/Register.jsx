import { useState } from 'react';

function Register({ onNavigate }) {
  const [form, setForm] = useState({ name:'', email:'', password:'' });

  const submit = async e => {
    e.preventDefault();
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
    </form>

  );
}

export default Register;


