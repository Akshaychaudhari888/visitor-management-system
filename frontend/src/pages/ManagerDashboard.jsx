import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

function ManagerDashboard() {
  const { user } = useAuth();
  const basePath = user.role === 'HR' ? '/hr' : '/manager';

  const cards = [
    { to: `${basePath}/visitor-form`, title: 'Visitor Form', description: 'Update meeting status' },
    { to: `${basePath}/visitor-list`, title: 'Visitor List', description: 'View past visitors' },
  ];

  return <DashboardLayout title={`${user.role} Dashboard`} cards={cards} />;
}

export default ManagerDashboard;
