import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import StrengthMeter from '../components/StrengthMeter.jsx';

function Register({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const user = await api.register(email, password);
      onAuth(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create account</h1>
      {error && <p role="alert">{error}</p>}
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Master password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
      </label>
      <StrengthMeter password={password} />
      <button type="submit">Register</button>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </form>
  );
}

export default Register;
