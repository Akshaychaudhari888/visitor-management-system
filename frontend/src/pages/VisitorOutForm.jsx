import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import '../styles/table.css';

function VisitorOutForm() {
  const [visitors, setVisitors] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchVisitors = async () => {
    try {
      const res = await API.get('/visitor?limit=50');
      const active = res.data.data.filter((v) => !v.visitorOutTime);
      setVisitors(active);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleOut = async (id) => {
    setMessage('');
    setError('');
    try {
      await API.patch(`/visitor/out/${id}`);
      setMessage('Visitor out time updated');
      fetchVisitors();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating visitor out time');
    }
  };

  return (
    <div className="page-container">
      <Navbar title="Visitor Out" />
      <div className="table-container">
        <button className="back-btn" onClick={() => navigate('/security')}>Back</button>
        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}
        <table className="data-table">
          <thead>
            <tr>
              <th>Visitor No</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>In Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => (
              <tr key={v._id}>
                <td>{v.visitorNo}</td>
                <td>{v.visitorName}</td>
                <td>{v.mobileNumber}</td>
                <td>{new Date(v.visitInTime).toLocaleString()}</td>
                <td><button className="action-btn" onClick={() => handleOut(v._id)}>Mark Out</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {visitors.length === 0 && <p className="no-data">No active visitors</p>}
      </div>
    </div>
  );
}

export default VisitorOutForm;
