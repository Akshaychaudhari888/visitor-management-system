import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import '../styles/form.css';

function RoleCreation() {
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Security');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await API.post('/user/create-user', { userName, phone, password, role });
      setMessage('User created successfully');
      setUserName('');
      setPhone('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating user');
    }
  };

  return (
    <div className="page-container">
      <Navbar title="Role Creation" />
      <div className="form-container">
        <form className="form-box" onSubmit={handleSubmit}>
          <h3 className="form-heading">Create User</h3>
          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg">{error}</p>}
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Security">Security</option>
              <option value="Manager">Manager</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Create User</button>
          <button type="button" className="back-btn" onClick={() => navigate('/admin')}>Back</button>
        </form>
      </div>
    </div>
  );
}

export default RoleCreation;
