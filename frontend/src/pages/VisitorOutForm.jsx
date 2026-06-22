import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import VisitorTable from '../components/VisitorTable';
import FormMessages from '../components/FormMessages';
import useFormStatus from '../hooks/useFormStatus';
import '../styles/table.css';

function VisitorOutForm() {
  const [visitors, setVisitors] = useState([]);
  const { message, error, setMessage, setError, clearStatus } = useFormStatus();
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
    clearStatus();
    try {
      await API.patch(`/visitor/out/${id}`);
      setMessage('Visitor out time updated');
      fetchVisitors();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating visitor out time');
    }
  };

  const columns = [
    { key: 'visitorNo', header: 'Visitor No' },
    { key: 'visitorName', header: 'Name' },
    { key: 'mobileNumber', header: 'Mobile' },
    { key: 'visitInTime', header: 'In Time', render: (v) => new Date(v).toLocaleString() },
    {
      key: '_id',
      header: 'Action',
      render: (_, row) => (
        <button className="action-btn" onClick={() => handleOut(row._id)}>Mark Out</button>
      ),
    },
  ];

  return (
    <div className="page-container">
      <Navbar title="Visitor Out" />
      <div className="table-container">
        <button className="back-btn" onClick={() => navigate('/security')}>Back</button>
        <FormMessages message={message} error={error} />
        <VisitorTable columns={columns} data={visitors} emptyMessage="No active visitors" />
      </div>
    </div>
  );
}

export default VisitorOutForm;
