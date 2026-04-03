import { useState, useEffect } from 'react';

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/complaints/manager/tickets`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <div className="loading-spinner">Loading tickets...</div>;

  return (
    <div>
      <h2>All Tickets</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        All parking tickets for your area with customer and driver details.
      </p>

      {tickets.length === 0 ? (
        <div className="driver-list" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No tickets found for your parking area.</p>
        </div>
      ) : (
        <div className="parking-grid">
          {tickets.map(ticket => {
            const assignedDriver = ticket.requests?.find(r => r.status === 'APPROVED')?.driver;
            return (
              <div key={ticket.ticketNumber} className="parking-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>#{ticket.ticketNumber}</h3>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    background: ticket.status === 'COMPLETED' ? 'var(--success-soft, #d1fae5)' : 'var(--primary-soft, #e0e7ff)',
                    color: ticket.status === 'COMPLETED' ? 'var(--success-text, #059669)' : 'var(--primary-hover, #4f46e5)',
                  }}>
                    {ticket.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div style={{ fontSize: '14px', display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Customer</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{ticket.user?.name || 'Unknown'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Vehicle</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                      {ticket.car?.brand} {ticket.car?.model}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Plate</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                      {ticket.car?.plateNumber}
                    </span>
                  </div>
                  {assignedDriver && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Driver</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{assignedDriver.user?.name || 'N/A'}</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Date</span>
                    <span style={{ color: 'var(--text-primary)', fontSize: '13px' }}>
                      {new Date(ticket.createdAt).toLocaleDateString()} {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Tickets;
