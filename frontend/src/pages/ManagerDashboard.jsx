import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

function ManagerDashboard() {
  const { user } = useAuth();
  const basePath = user.role === 'HR' ? '/hr' : '/manager';

  return (
    <div className="page-container">
      <Navbar title={`${user.role} Dashboard`} />
      <div className="dashboard-content">
        <div className="dashboard-cards">
          <Link to={`${basePath}/visitor-form`} className="dashboard-card">
            <h3>Visitor Form</h3>
            <p>Update meeting status</p>
          </Link>
          <Link to={`${basePath}/visitor-list`} className="dashboard-card">
            <h3>Visitor List</h3>
            <p>View past visitors</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
