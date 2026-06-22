import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import VisitorTable from '../components/VisitorTable';
import Pagination from '../components/Pagination';
import '../styles/table.css';

const columns = [
  { key: 'visitorNo', header: 'Visitor No' },
  { key: 'visitorName', header: 'Name' },
  { key: 'mobileNumber', header: 'Mobile' },
  { key: 'purpose', header: 'Purpose' },
  { key: 'noOfPersons', header: 'Persons' },
  { key: 'vehicleNumber', header: 'Vehicle' },
  { key: 'visitInTime', header: 'In Time', render: (v) => v ? new Date(v).toLocaleString() : '-' },
  { key: 'visitorOutTime', header: 'Out Time', render: (v) => v ? new Date(v).toLocaleString() : '-' },
  { key: 'totalTimeSpent', header: 'Total Time' },
  { key: 'meetingStatus', header: 'Status' },
];

function VisitorDetails() {
  const [visitors, setVisitors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

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
      <Navbar title="Visitor Details" />
      <div className="table-container">
        <button className="back-btn" onClick={() => navigate('/admin')}>Back</button>
        <VisitorTable columns={columns} data={visitors} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

export default VisitorDetails;
