import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './user.css';

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrievalLoading, setRetrievalLoading] = useState(false);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  let user = { name: '' };
  try {
    const saved = localStorage.getItem('currentUser');
    if (saved) user = JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTickets(data);
      const active = data.find(t => !['COMPLETED'].includes(t.status));
      setCurrentTicket(active);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTickets();
  }, []);

  const handleRetrieval = async () => {
    try {
      setRetrievalLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/request-retrieval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ticketNumber: currentTicket.ticketNumber })
      });
      
      if (res.ok) {
        alert('Retrieval request sent to drivers');
        fetchTickets();
      } else {
        alert('Failed to send retrieval request');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending retrieval request');
    } finally {
      setRetrievalLoading(false);
    }
  };

  return (
    <div className="user-dashboard">
      <h2>Welcome, {user.name}</h2>

      {currentTicket && (
        <div className="current-ticket">
          <h3>Current Ticket</h3>
          <div className="ticket-card">
            <p><strong>Ticket:</strong> {currentTicket.ticketNumber}</p>
            <p><strong>Car:</strong> {currentTicket.car.brand} {currentTicket.car.model}</p>
            <p><strong>Parking:</strong> {currentTicket.parkingArea.name}</p>
            <p><strong>Status:</strong> <span className="status-badge">{currentTicket.status}</span></p>
            {currentTicket.status === 'PARKED' && !currentTicket.requests?.some(r => r.requestType === 'RETRIEVAL' && r.status === 'PENDING') && (
              <button onClick={handleRetrieval} className="btn-primary" disabled={retrievalLoading}>
                {retrievalLoading ? 'Requesting...' : 'Request Retrieval'}
              </button>
            )}
            {currentTicket.status === 'PARKED' && currentTicket.requests?.some(r => r.requestType === 'RETRIEVAL' && r.status === 'PENDING') && (
              <p className="info-text">Retrieval request sent, waiting for driver...</p>
            )}
            {currentTicket.status === 'CAR_ON_THE_WAY' && (
              <p className="info-text">Driver is on the way to retrieve your car!</p>
            )}
          </div>
        </div>
      )}

      <button onClick={() => navigate('/scan-qr')} className="btn-park">Park Now</button>

      <div className="ticket-history">
        <h3>Ticket History</h3>
        {tickets.filter(t => t.status === 'COMPLETED').map(ticket => (
          <div key={ticket.ticketNumber} className="ticket-item">
            <p><strong>{ticket.ticketNumber}</strong></p>
            <p>{ticket.car.brand} {ticket.car.model} - {ticket.parkingArea.name}</p>
            <span className="status-badge">{ticket.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
