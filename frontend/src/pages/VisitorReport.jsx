import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import '../styles/form.css';

function VisitorReport() {
  const navigate = useNavigate();

  const handleDownload = async () => {
    try {
      const res = await API.get('/visitor/report', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'visitor-report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Error downloading report');
    }
  };

  return (
    <div className="page-container">
      <Navbar title="Visitor Report" />
      <div className="form-container">
        <div className="form-box">
          <h3 className="form-heading">Download Visitor Report</h3>
          <p>Click below to download the complete visitor report in Excel format.</p>
          <button className="submit-btn" onClick={handleDownload}>Download Report</button>
          <button className="back-btn" onClick={() => navigate('/security')}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default VisitorReport;
