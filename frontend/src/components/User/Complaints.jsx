import { useState } from 'react';

function Complaints() {
  const [complaint, setComplaint] = useState({ subject: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setComplaint({ subject: '', description: '' });
    }, 1000);
  };

  return (
    <div className="section-container">
      <h2>Complaints & Feedback</h2>
      <p className="subtitle">Have an issue? Let us know and we'll fix it.</p>

      {submitted ? (
        <div className="success-banner glass-panel" style={{ marginTop: '24px', padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>✅</div>
          <h3>Complaint Submitted</h3>
          <p>We've received your complaint and will get back to you shortly.</p>
          <button onClick={() => setSubmitted(false)} className="btn-secondary" style={{ marginTop: '20px' }}>
            Submit Another
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ marginTop: '24px', padding: '30px' }}>
          <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: '100%', padding: 0 }}>
            <div className="form-group">
              <label>Subject</label>
              <input
                placeholder="Ex: Billing issue, Car damage, etc."
                value={complaint.subject}
                onChange={(e) => setComplaint({ ...complaint, subject: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
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
                  fontFamily: 'inherit'
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
        <div className="empty-state-card glass-panel" style={{ marginTop: '20px' }}>
          <p className="text-secondary">No recent complaints found.</p>
        </div>
      </div>
    </div>
  );
}

export default Complaints;
