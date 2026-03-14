import { useState } from 'react';

function AddDriver() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dlNumber, setDlNumber] = useState('');
  const [_loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/manager/drivers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password, dlNumber })
      });

      const data = await res.json();
      alert(data.message || 'Driver added successfully');
      setName('');
      setEmail('');
      setPassword('');
      setDlNumber('');
    } catch (error) {
      console.error(error);
      alert('Error adding driver');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Driver</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Name</label>
          <input
            placeholder="Enter driver name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Driving License Number</label>
          <input
            placeholder="Enter DL number"
            value={dlNumber}
            onChange={(e) => setDlNumber(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Driver</button>
      </form>
    </div>
  );
}

export default AddDriver;
