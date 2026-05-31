import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import RoleCreation from './pages/RoleCreation';
import VisitorFormCreation from './pages/VisitorFormCreation';
import VisitorDetails from './pages/VisitorDetails';
import SecurityDashboard from './pages/SecurityDashboard';
import VisitorInForm from './pages/VisitorInForm';
import VisitorOutForm from './pages/VisitorOutForm';
import VisitorReport from './pages/VisitorReport';
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerVisitorForm from './pages/ManagerVisitorForm';
import ManagerVisitorList from './pages/ManagerVisitorList';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/role-creation" element={<ProtectedRoute role="Admin"><RoleCreation /></ProtectedRoute>} />
        <Route path="/admin/visitor-form" element={<ProtectedRoute role="Admin"><VisitorFormCreation /></ProtectedRoute>} />
        <Route path="/admin/visitor-details" element={<ProtectedRoute role="Admin"><VisitorDetails /></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute role="Security"><SecurityDashboard /></ProtectedRoute>} />
        <Route path="/security/visitor-in" element={<ProtectedRoute role="Security"><VisitorInForm /></ProtectedRoute>} />
        <Route path="/security/visitor-out" element={<ProtectedRoute role="Security"><VisitorOutForm /></ProtectedRoute>} />
        <Route path="/security/report" element={<ProtectedRoute role="Security"><VisitorReport /></ProtectedRoute>} />
        <Route path="/manager" element={<ProtectedRoute role="Manager"><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/manager/visitor-form" element={<ProtectedRoute role="Manager"><ManagerVisitorForm /></ProtectedRoute>} />
        <Route path="/manager/visitor-list" element={<ProtectedRoute role="Manager"><ManagerVisitorList /></ProtectedRoute>} />
        <Route path="/hr" element={<ProtectedRoute role="HR"><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/hr/visitor-form" element={<ProtectedRoute role="HR"><ManagerVisitorForm /></ProtectedRoute>} />
        <Route path="/hr/visitor-list" element={<ProtectedRoute role="HR"><ManagerVisitorList /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
