import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d{10}$/.test(phone)) {
      setError('Phone number must be exactly 10 digits');
      return;
    }
    try {
      const response = await API.post('/auth/login', { phone, password });
      if (response.data.success) {
        login(response.data.token, response.data.user.role);
        const role = response.data.user.role;
        if (role === 'Admin') navigate('/admin');
        else if (role === 'Security') navigate('/security');
        else if (role === 'Manager') navigate('/manager');
        else if (role === 'HR') navigate('/hr');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('Server not reachable. Check if backend is running.');
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Visitors Management System</h2>
        {error && <p className="login-error">{error}</p>}
        <div className="form-group">
          <label>Phone</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} maxLength="10" required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
}

export default Login;
