import DashboardLayout from '../components/DashboardLayout';

const cards = [
  { to: '/security/visitor-in', title: 'Visitor In', description: 'Register new visitor entry' },
  { to: '/security/visitor-out', title: 'Visitor Out', description: 'Mark visitor exit time' },
  { to: '/security/report', title: 'Download Report', description: 'Download visitor report' },
];

function SecurityDashboard() {
  return <DashboardLayout title="Security Dashboard" cards={cards} />;
}

export default SecurityDashboard;
