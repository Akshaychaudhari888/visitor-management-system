import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/dashboard.css';

function SecurityDashboard() {
  return (
    <div className="page-container">
      <Navbar title="Security Dashboard" />
      <div className="dashboard-content">
        <div className="dashboard-cards">
          <Link to="/security/visitor-in" className="dashboard-card">
            <h3>Visitor In</h3>
            <p>Register new visitor entry</p>
          </Link>
          <Link to="/security/visitor-out" className="dashboard-card">
            <h3>Visitor Out</h3>
            <p>Mark visitor exit time</p>
          </Link>
          <Link to="/security/report" className="dashboard-card">
            <h3>Download Report</h3>
            <p>Download visitor report</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SecurityDashboard;
