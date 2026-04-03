import { useState, useEffect } from 'react';

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/complaints/manager`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) setComplaints(data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const parseDescription = (desc) => {
    const match = desc.match(/^\[(.+?)\]\s(.+)$/s);
    if (match) return { subject: match[1], body: match[2] };
    return { subject: 'Complaint', body: desc };
  };

  if (loading) return <div className="loading-spinner">Loading complaints...</div>;

  return (
    <div>
      <h2>Complaints</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        All complaints raised by users for your parking area.
      </p>

      {complaints.length === 0 ? (
        <div className="driver-list" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No complaints found for your parking area.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {complaints.map(c => {
            const parsed = parseDescription(c.description);
            return (
              <div key={c.id} className="parking-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>{parsed.subject}</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                      By: <strong>{c.user?.name || 'Unknown'}</strong> ({c.user?.email || ''})
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: c.status === 'OPEN' ? 'var(--warning-soft, #fef3c7)' : 'var(--success-soft, #d1fae5)',
                    color: c.status === 'OPEN' ? 'var(--warning-text, #d97706)' : 'var(--success-text, #059669)',
                  }}>
                    {c.status}
                  </span>
                </div>

                <p style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.6', margin: '12px 0' }}>
                  {parsed.body}
                </p>

                <div style={{
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border)'
                }}>
                  {c.ticketNumber && (
                    <span>Ticket: <strong>#{c.ticketNumber}</strong></span>
                  )}
                  {c.ticket?.car && (
                    <span>Vehicle: {c.ticket.car.brand} {c.ticket.car.model} ({c.ticket.car.plateNumber})</span>
                  )}
                  <span>{new Date(c.createdAt).toLocaleDateString()} at {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Complaints;
