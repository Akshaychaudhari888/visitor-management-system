import DashboardLayout from '../components/DashboardLayout';

const cards = [
  { to: '/admin/role-creation', title: 'Role Creation', description: 'Create Security, Manager, HR users' },
  { to: '/admin/visitor-details', title: 'Visitor Details', description: 'View all visitor records' },
];

function AdminDashboard() {
  return <DashboardLayout title="Admin Dashboard" cards={cards} />;
}

export default AdminDashboard;
