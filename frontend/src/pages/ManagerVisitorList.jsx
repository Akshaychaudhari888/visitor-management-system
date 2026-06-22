import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import VisitorTable from '../components/VisitorTable';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import '../styles/table.css';

const columns = [
  { key: 'visitorNo', header: 'Visitor No' },
  { key: 'visitorName', header: 'Name' },
  { key: 'mobileNumber', header: 'Mobile' },
  { key: 'purpose', header: 'Purpose' },
  { key: 'visitInTime', header: 'In Time', render: (v) => v ? new Date(v).toLocaleString() : '-' },
  { key: 'visitorOutTime', header: 'Out Time', render: (v) => v ? new Date(v).toLocaleString() : '-' },
  { key: 'totalTimeSpent', header: 'Total Time' },
  { key: 'meetingStatus', header: 'Status' },
];

function ManagerVisitorList() {
  const [visitors, setVisitors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();
  const basePath = user.role === 'HR' ? '/hr' : '/manager';

  const fetchVisitors = async () => {
    try {
      const res = await API.get(`/visitor?page=${page}&limit=10`);
      setVisitors(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [page]);

  return (
    <div className="page-container">
      <Navbar title="Past Visitors" />
      <div className="table-container">
        <button className="back-btn" onClick={() => navigate(basePath)}>Back</button>
        <VisitorTable columns={columns} data={visitors} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

export default ManagerVisitorList;
