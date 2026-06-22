import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import '../styles/table.css';

function ManagerVisitorForm() {
  const [visitors, setVisitors] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const basePath = user.role === 'HR' ? '/hr' : '/manager';

  const fetchVisitors = async () => {
    try {
      const res = await API.get('/visitor?limit=50');
      const pending = res.data.data.filter((v) => v.meetingStatus === 'Pending');
      setVisitors(pending);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load visitors');
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleStatus = async (id, status) => {
    setMessage('');
    setError('');
    try {
      await API.patch(`/visitor/meeting/${id}`, {
        meetingStatus: status,
        meetingOutTime: status === 'Completed' ? new Date() : null
      });
      setMessage('Meeting status updated');
      fetchVisitors();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div className="page-container">
      <Navbar title="Visitor Meeting Status" />
      <div className="table-container">
        <button className="back-btn" onClick={() => navigate(basePath)}>Back</button>
        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}
        <table className="data-table">
          <thead>
            <tr>
              <th>Visitor No</th>
              <th>Name</th>
              <th>Purpose</th>
              <th>In Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => (
              <tr key={v._id}>
                <td>{v.visitorNo}</td>
                <td>{v.visitorName}</td>
                <td>{v.purpose}</td>
                <td>{new Date(v.visitInTime).toLocaleString()}</td>
                <td>{v.meetingStatus}</td>
                <td>
                  <button className="action-btn" onClick={() => handleStatus(v._id, 'Completed')}>Complete</button>
                  <button className="action-btn cancel-btn" onClick={() => handleStatus(v._id, 'Cancelled')}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visitors.length === 0 && <p className="no-data">No pending visitors</p>}
      </div>
    </div>
  );
}

export default ManagerVisitorForm;
