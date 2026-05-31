import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import '../styles/table.css';

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
        <table className="data-table">
          <thead>
            <tr>
              <th>Visitor No</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Purpose</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Total Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => (
              <tr key={v._id}>
                <td>{v.visitorNo}</td>
                <td>{v.visitorName}</td>
                <td>{v.mobileNumber}</td>
                <td>{v.purpose}</td>
                <td>{v.visitInTime ? new Date(v.visitInTime).toLocaleString() : '-'}</td>
                <td>{v.visitorOutTime ? new Date(v.visitorOutTime).toLocaleString() : '-'}</td>
                <td>{v.totalTimeSpent || '-'}</td>
                <td>{v.meetingStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default ManagerVisitorList;
