import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import FormMessages from '../components/FormMessages';
import useFormStatus from '../hooks/useFormStatus';
import '../styles/form.css';

function VisitorInForm() {
  const [visitorName, setVisitorName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [purpose, setPurpose] = useState('');
  const [noOfPersons, setNoOfPersons] = useState(1);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [photo, setPhoto] = useState(null);
  const [users, setUsers] = useState([]);
  const { message, error, setMessage, setError, clearStatus } = useFormStatus();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/user');
        setUsers(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearStatus();
    try {
      const res = await API.post('/visitor/create-visitor', {
        visitorName,
        mobileNumber,
        contactPerson,
        purpose,
        noOfPersons,
        vehicleNumber,
      });

      if (photo && res.data.data._id) {
        const formData = new FormData();
        formData.append('photo', photo);
        await API.patch(`/visitor/photo/${res.data.data._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setMessage('Visitor registered successfully');
      setVisitorName('');
      setMobileNumber('');
      setContactPerson('');
      setPurpose('');
      setNoOfPersons(1);
      setVehicleNumber('');
      setPhoto(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering visitor');
    }
  };

  return (
    <div className="page-container">
      <Navbar title="Visitor In - Registration" />
      <div className="form-container">
        <form className="form-box" onSubmit={handleSubmit}>
          <h3 className="form-heading">Register Visitor</h3>
          <FormMessages message={message} error={error} />
          <div className="form-group">
            <label>Visitor Name</label>
            <input type="text" value={visitorName} onChange={(e) => setVisitorName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contact Person</label>
            <select value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required>
              <option value="">Select Contact Person</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.userName} ({u.role})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Purpose</label>
            <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Number of Persons</label>
            <input type="number" value={noOfPersons} onChange={(e) => setNoOfPersons(e.target.value)} min="1" />
          </div>
          <div className="form-group">
            <label>Vehicle Number</label>
            <input type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
          </div>
          <button type="submit" className="submit-btn">Register Visitor</button>
          <button type="button" className="back-btn" onClick={() => navigate('/security')}>Back</button>
        </form>
      </div>
    </div>
  );
}

export default VisitorInForm;
