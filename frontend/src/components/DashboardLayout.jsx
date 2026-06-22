import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/dashboard.css';

/**
 * Shared dashboard layout that renders a title via Navbar and a grid of
 * navigation cards. Eliminates repeated page-container + dashboard-cards
 * markup across Admin, Manager, and Security dashboards.
 *
 * cards: [{ to: string, title: string, description: string }]
 */
function DashboardLayout({ title, cards }) {
  return (
    <div className="page-container">
      <Navbar title={title} />
      <div className="dashboard-content">
        <div className="dashboard-cards">
          {cards.map((card) => (
            <Link key={card.to} to={card.to} className="dashboard-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
