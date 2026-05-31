import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/dashboard.css';

function AdminDashboard() {
  return (
    <div className="page-container">
      <Navbar title="Admin Dashboard" />
      <div className="dashboard-content">
        <div className="dashboard-cards">
          <Link to="/admin/role-creation" className="dashboard-card">
            <h3>Role Creation</h3>
            <p>Create Security, Manager, HR users</p>
          </Link>
          <Link to="/admin/visitor-details" className="dashboard-card">
            <h3>Visitor Details</h3>
            <p>View all visitor records</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
