import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import VisitorTable from '../components/VisitorTable';
import FormMessages from '../components/FormMessages';
import useFormStatus from '../hooks/useFormStatus';
import { useAuth } from '../context/AuthContext';
import '../styles/table.css';

function ManagerVisitorForm() {
  const [visitors, setVisitors] = useState([]);
  const { message, error, setMessage, setError, clearStatus } = useFormStatus();
  const navigate = useNavigate();
  const { user } = useAuth();
  const basePath = user.role === 'HR' ? '/hr' : '/manager';

  const fetchVisitors = async () => {
    try {
      const res = await API.get('/visitor?limit=50');
      const pending = res.data.data.filter((v) => v.meetingStatus === 'Pending');
      setVisitors(pending);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleStatus = async (id, status) => {
    clearStatus();
    try {
      await API.patch(`/visitor/meeting/${id}`, {
        meetingStatus: status,
        meetingOutTime: status === 'Completed' ? new Date() : null,
      });
      setMessage('Meeting status updated');
      fetchVisitors();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating status');
    }
  };

  const columns = [
    { key: 'visitorNo', header: 'Visitor No' },
    { key: 'visitorName', header: 'Name' },
    { key: 'purpose', header: 'Purpose' },
    { key: 'visitInTime', header: 'In Time', render: (v) => new Date(v).toLocaleString() },
    { key: 'meetingStatus', header: 'Status' },
    {
      key: '_id',
      header: 'Action',
      render: (_, row) => (
        <>
          <button className="action-btn" onClick={() => handleStatus(row._id, 'Completed')}>Complete</button>
          <button className="action-btn cancel-btn" onClick={() => handleStatus(row._id, 'Cancelled')}>Cancel</button>
        </>
      ),
    },
  ];

  return (
    <div className="page-container">
      <Navbar title="Visitor Meeting Status" />
      <div className="table-container">
        <button className="back-btn" onClick={() => navigate(basePath)}>Back</button>
        <FormMessages message={message} error={error} />
        <VisitorTable columns={columns} data={visitors} emptyMessage="No pending visitors" />
      </div>
    </div>
  );
}

export default ManagerVisitorForm;
