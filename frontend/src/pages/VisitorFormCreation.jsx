import Navbar from '../components/Navbar';
import '../styles/form.css';

function VisitorFormCreation() {
  return (
    <div className="page-container">
      <Navbar title="Visitor Form Structure" />
      <div className="form-container">
        <div className="form-box">
          <h3 className="form-heading">Visitor Form Fields</h3>
          <table className="fields-table">
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Type</th>
                <th>Required</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Visitor Number</td><td>Auto Generated (VN101)</td><td>Yes</td></tr>
              <tr><td>Visitor Name</td><td>Text</td><td>Yes</td></tr>
              <tr><td>Mobile Number</td><td>Text</td><td>Yes</td></tr>
              <tr><td>Contact Person</td><td>Dropdown (Manager/HR)</td><td>Yes</td></tr>
              <tr><td>Purpose</td><td>Text</td><td>Yes</td></tr>
              <tr><td>Number of Persons</td><td>Number</td><td>No</td></tr>
              <tr><td>Vehicle Number</td><td>Text</td><td>No</td></tr>
              <tr><td>Visit In Time</td><td>Auto (Current Time)</td><td>Yes</td></tr>
              <tr><td>Visitor Out Time</td><td>Updated by Security</td><td>No</td></tr>
              <tr><td>Total Time Spent</td><td>Auto Calculated</td><td>No</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VisitorFormCreation;
