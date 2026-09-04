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
    <div className="auth-page">
      <div className="auth-panel">
        <div className="vault-mark" />
        <p className="brand-title">Pandora Vault</p>
        <p className="brand-tagline">Secure against demons</p>
        <h1>Create account</h1>
        {error && <p className="form-error" role="alert">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field">
            <span className="field-label">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span className="field-label">Master password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </label>
          <StrengthMeter password={password} />
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}

export default Register;
