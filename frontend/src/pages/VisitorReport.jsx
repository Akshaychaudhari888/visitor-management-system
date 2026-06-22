import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import '../styles/form.css';

function VisitorReport() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDownload = async () => {
    setError('');
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
      setError(err.response?.data?.message || 'Error downloading report');
    }
  };

  return (
    <div className="page-container">
      <Navbar title="Visitor Report" />
      <div className="form-container">
        <div className="form-box">
          <h3 className="form-heading">Download Visitor Report</h3>
          {error && <p className="error-msg">{error}</p>}
          <p>Click below to download the complete visitor report in Excel format.</p>
          <button className="submit-btn" onClick={handleDownload}>Download Report</button>
          <button className="back-btn" onClick={() => navigate('/security')}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default VisitorReport;
