import { useState, useEffect } from 'react';
import './user.css';

function Dashboard({ user, onNavigate }) {
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const res = await fetch('http://localhost:3000/api/user/tickets', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setTickets(data);
    const active = data.find(t => !['COMPLETED'].includes(t.status));
    setCurrentTicket(active);
  };

  const handleRetrieval = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/user/request-retrieval', {
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
              <button onClick={handleRetrieval} className="btn-primary">Request Retrieval</button>
            )}
            {currentTicket.status === 'PARKED' && currentTicket.requests?.some(r => r.requestType === 'RETRIEVAL' && r.status === 'PENDING') && (
              <p className="info-text">Retrieval request sent, waiting for driver...</p>
            )}
            {currentTicket.status === 'CAR_ON_THE_WAY' && (
              <p className="info-text">Driver is on the way to retrieve your car</p>
            )}
          </div>
        </div>
      )}

      <button onClick={() => onNavigate('SCAN_QR')} className="btn-park">🅿️ Park Now</button>

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
