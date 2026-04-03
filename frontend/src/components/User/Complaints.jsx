import { useState, useEffect } from 'react';

function Complaints() {
  const [complaint, setComplaint] = useState({ subject: '', description: '', ticketNumber: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchTickets();
    fetchComplaints();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };

  const fetchComplaints = async () => {
    try {
      setFetchLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/complaints/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setComplaints(data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!complaint.ticketNumber) {
      setError('Please select a ticket for your complaint');
      return;
    }
    if (!complaint.subject.trim()) {
      setError('Subject is required');
      return;
    }
    if (!complaint.description.trim() || complaint.description.trim().length < 5) {
      setError('Description must be at least 5 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ticketNumber: complaint.ticketNumber,
          subject: complaint.subject,
          description: complaint.description
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setComplaint({ subject: '', description: '', ticketNumber: '' });
        fetchComplaints();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit complaint');
      }
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseDescription = (desc) => {
    const match = desc.match(/^\[(.+?)\]\s(.+)$/s);
    if (match) return { subject: match[1], body: match[2] };
    return { subject: 'Complaint', body: desc };
  };

  return (
    <div className="section-container">
      <h2>Complaints & Feedback</h2>
      <p className="subtitle">Have an issue with a parking session? Select the ticket and let us know.</p>

      {submitted ? (
        <div className="success-banner glass-panel" style={{ marginTop: '24px', padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', color: 'var(--success)' }}>SUCCESS</div>
          <h3>Complaint Submitted</h3>
          <p>We've received your complaint and will get back to you shortly.</p>
          <button onClick={() => setSubmitted(false)} className="btn-secondary" style={{ marginTop: '20px', width: 'auto' }}>
            Submit Another
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ marginTop: '24px', padding: '30px' }}>
          <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: '100%', padding: 0, border: 'none', background: 'transparent' }}>
            {error && (
              <div style={{
                background: 'var(--error-soft, #fee2e2)',
                color: 'var(--error-text, #dc2626)',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Select Ticket <span style={{ color: 'var(--error-text, #dc2626)' }}>*</span></label>
              <select
                value={complaint.ticketNumber}
                onChange={(e) => setComplaint({ ...complaint, ticketNumber: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <option value="">-- Choose a ticket --</option>
                {tickets.map(ticket => (
                  <option key={ticket.ticketNumber} value={ticket.ticketNumber}>
                    #{ticket.ticketNumber} — {ticket.car?.brand} {ticket.car?.model} at {ticket.parkingArea?.name} ({ticket.status.replace(/_/g, ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subject <span style={{ color: 'var(--error-text, #dc2626)' }}>*</span></label>
              <input
                placeholder="Ex: Billing issue, Car damage, etc."
                value={complaint.subject}
                onChange={(e) => setComplaint({ ...complaint, subject: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Description <span style={{ color: 'var(--error-text, #dc2626)' }}>*</span></label>
              <textarea
                placeholder="Describe your issue in detail..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  minHeight: '150px',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                value={complaint.description}
                onChange={(e) => setComplaint({ ...complaint, description: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <h3>Your Recent Complaints</h3>
        {fetchLoading ? (
          <div className="loading-spinner" style={{ marginTop: '20px' }}>Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="empty-state-card glass-panel" style={{ marginTop: '20px' }}>
            <p className="text-secondary">No complaints found. Your past complaints will appear here.</p>
          </div>
        ) : (
          <div style={{ marginTop: '20px', display: 'grid', gap: '16px' }}>
            {complaints.map(c => {
              const parsed = parseDescription(c.description);
              return (
                <div key={c.id} className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--text-primary)' }}>{parsed.subject}</h4>
                      {c.ticketNumber && (
                        <span className="ticket-badge" style={{ fontSize: '11px', padding: '3px 10px' }}>
                          #{c.ticketNumber}
                        </span>
                      )}
                    </div>
                    <span className={`status-badge ${c.status.toLowerCase()}`} style={{
                      background: c.status === 'OPEN' ? 'var(--warning-soft, #fef3c7)' : 'var(--success-soft, #d1fae5)',
                      color: c.status === 'OPEN' ? 'var(--warning-text, #d97706)' : 'var(--success-text, #059669)',
                    }}>
                      {c.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5', margin: '10px 0' }}>
                    {parsed.body}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted, var(--text-secondary))' }}>
                    {c.ticket?.parkingArea?.name && <span>Location: {c.ticket.parkingArea.name}</span>}
                    <span>{new Date(c.createdAt).toLocaleDateString()} at {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Complaints;
