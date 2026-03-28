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
      
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch tickets');
      }
      
      const data = await res.json();
      if (Array.isArray(data)) {
        setTickets(data);
        const active = data.find(t => !['COMPLETED'].includes(t.status));
        setCurrentTicket(active);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error(error);
      setTickets([]);
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

  const STEPS = ['REQUESTED', 'DRIVER_ASSIGNED', 'PARKED', 'CAR_ON_THE_WAY'];
  const getStepIndex = (status) => STEPS.indexOf(status);

  return (
    <div className="user-dashboard">
      <div className="dashboard-header glass-panel">
        <h2>Welcome back, <span className="text-gradient">{user.name}</span></h2>
        <p className="subtitle" style={{marginBottom: 0}}>Your central hub for seamless parking management.</p>
      </div>

      {!currentTicket && !loading && (
        <div className="empty-state-card glass-panel">
          <div className="empty-icon">📍</div>
          <h3>Ready to Park?</h3>
          <p>You currently don't have any active parking sessions. To get started, select your destination's parking area.</p>
          <button onClick={() => navigate('/scan-qr')} className="btn-primary" style={{marginTop: '20px'}}>
            Find Parking Area
          </button>
        </div>
      )}

      {currentTicket && (
        <div className="current-ticket glass-panel">
          <div className="ticket-header">
            <h3>Active Parking Status</h3>
            <span className="ticket-badge">#{currentTicket.ticketNumber.slice(-6)}</span>
          </div>
          
          <div className="lifecycle-stepper">
            {STEPS.map((step, index) => {
              const currentStepIndex = getStepIndex(currentTicket.status);
              let stepClass = 'stepper-step';
              if (index < currentStepIndex) stepClass += ' completed';
              if (index === currentStepIndex) stepClass += ' active pulse';
              
              const stepLabels = ['Requested', 'Assigned', 'Parked', 'Retrieving'];

              return (
                <div key={step} className={stepClass}>
                  <div className="step-dot"></div>
                  <p>{stepLabels[index]}</p>
                </div>
              );
            })}
          </div>

          <div className="ticket-details">
            <div className="detail-row">
              <span className="label">Vehicle</span>
              <span className="value">{currentTicket.car.brand} {currentTicket.car.model}</span>
            </div>
            <div className="detail-row">
              <span className="label">Location</span>
              <span className="value">{currentTicket.parkingArea.name}</span>
            </div>
            
            <div className="ticket-actions">
              {currentTicket.status === 'PARKED' && !currentTicket.requests?.some(r => r.requestType === 'RETRIEVAL' && r.status === 'PENDING') && (
                <button onClick={handleRetrieval} className="btn-primary full-width" disabled={retrievalLoading}>
                  {retrievalLoading ? 'Requesting...' : 'Request Retrieval Now'}
                </button>
              )}
              {currentTicket.status === 'PARKED' && currentTicket.requests?.some(r => r.requestType === 'RETRIEVAL' && r.status === 'PENDING') && (
                <div className="info-banner">⏳ Retrieval request sent. Waiting for a driver...</div>
              )}
              {currentTicket.status === 'CAR_ON_THE_WAY' && (
                <div className="success-banner">🚗 Driver is on the way to retrieve your car!</div>
              )}
            </div>
          </div>
        </div>
      )}

      {tickets.filter(t => t.status === 'COMPLETED').length > 0 && (
        <div className="ticket-history">
          <h3 style={{marginBottom: '20px'}}>Past Parking History</h3>
          <div className="history-grid">
            {tickets.filter(t => t.status === 'COMPLETED').map(ticket => (
              <div key={ticket.ticketNumber} className="history-item glass-panel">
                <div className="history-top">
                  <strong>#{ticket.ticketNumber.slice(-6)}</strong>
                  <span className="status-badge completed">Completed</span>
                </div>
                <p>{ticket.car.brand} {ticket.car.model}</p>
                <p className="text-muted">{ticket.parkingArea.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
