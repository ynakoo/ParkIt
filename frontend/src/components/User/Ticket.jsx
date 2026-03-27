import { useNavigate, useLocation } from 'react-router-dom';

function Ticket() {
  const navigate = useNavigate();
  const location = useLocation();
  const ticket = location.state?.ticket || { ticketNumber: 'TKT-' + Date.now(), status: 'REQUESTED' };

  return (
    <div className="ticket-view">
      <h2>Ticket Created</h2>
      <div className="ticket-card">
        <h3>Ticket #{ticket.ticketNumber}</h3>
        <p><strong>Status:</strong> <span className="status-badge">{ticket.status}</span></p>
        <p>Waiting for driver assignment...</p>
        <p className="info-text">You will be notified when a driver accepts your request</p>
      </div>
      <button onClick={() => navigate('/dashboard')} className="btn-primary">Done</button>
    </div>
  );
}

export default Ticket;
