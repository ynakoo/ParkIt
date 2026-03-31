import { useState, useEffect } from 'react';

function History() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/tickets`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setTickets(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [token]);

  if (loading) return <div className="loading-spinner">Loading ticket history...</div>;

  return (
    <div className="section-container">
      <h2>Parking History</h2>
      <p className="subtitle">A complete log of all your parking sessions.</p>

      {tickets.length === 0 ? (
        <div className="empty-state-card glass-panel">
          <p>No parking history found.</p>
        </div>
      ) : (
        <div className="history-list" style={{ marginTop: '24px' }}>
          {tickets.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(ticket => (
            <div key={ticket.ticketNumber} className="history-item glass-panel" style={{ marginBottom: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="ticket-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span className="ticket-badge" style={{ fontSize: '12px' }}>#{ticket.ticketNumber}</span>
                  <span className={`status-badge ${ticket.status.toLowerCase()}`} style={{ fontSize: '11px', textTransform: 'capitalize' }}>
                    {ticket.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h4 style={{ margin: '8px 0' }}>{ticket.car.brand} {ticket.car.model}</h4>
                <p className="text-secondary" style={{ fontSize: '13px' }}>📍 {ticket.parkingArea.name}</p>
              </div>
              <div className="ticket-meta" style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: '500', marginBottom: '4px' }}>{new Date(ticket.createdAt).toLocaleDateString()}</p>
                <p className="text-secondary" style={{ fontSize: '13px' }}>{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                {ticket.price && <p className="price-tag" style={{ marginTop: '8px', fontWeight: 'bold', color: 'var(--primary)' }}>₹{ticket.price}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
