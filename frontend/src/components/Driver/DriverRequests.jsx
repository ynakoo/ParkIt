import { useState, useEffect } from 'react';

function DriverRequests() {
  const [requests, setRequests] = useState([]);
  const [activeTickets, setActiveTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const token = localStorage.getItem('authToken');

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/driver/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const requestsData = Array.isArray(data) ? data : [];
      setRequests(requestsData);
      return requestsData;
    } catch (err) {
      console.error(err);
      setRequests([]);
      return [];
    }
  };

  const fetchActiveTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/driver/active-tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const ticketsData = Array.isArray(data) ? data : [];
      setActiveTickets(ticketsData);
      return ticketsData;
    } catch (err) {
      console.error(err);
      setActiveTickets([]);
      return [];
    }
  };

  const refreshAll = async () => {
    await Promise.all([fetchRequests(), fetchActiveTickets()]);
  };

  useEffect(() => {
    let isMounted = true;
    let timerId = null;

    const pollData = async () => {
      if (!isMounted) return;
      try {
        await refreshAll();
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          timerId = setTimeout(pollData, 5000);
        }
      }
    };

    const initialLoad = async () => {
      setLoading(true);
      await refreshAll();
      if (isMounted) {
        setLoading(false);
      }
      pollData();
    };

    initialLoad();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  const handleAccept = async (requestId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`accept-${requestId}`]: true }));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/driver/accept-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requestId })
      });
      
      if (res.ok) {
        // Immediately fetch to update UI
        await refreshAll();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to accept request');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(prev => ({ ...prev, [`accept-${requestId}`]: false }));
    }
  };

  const handleCompleteParking = async (ticketNumber) => {
    try {
      setActionLoading(prev => ({ ...prev, [`parking-${ticketNumber}`]: true }));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/driver/complete-parking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ticketNumber })
      });
      
      if (res.ok) {
        await refreshAll();
      } else {
        alert('Failed to complete parking');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(prev => ({ ...prev, [`parking-${ticketNumber}`]: false }));
    }
  };

  const handleCompleteRetrieval = async (ticketNumber) => {
    try {
      setActionLoading(prev => ({ ...prev, [`retrieval-${ticketNumber}`]: true }));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/driver/complete-retrieval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ticketNumber })
      });
      
      if (res.ok) {
        await refreshAll();
      } else {
        alert('Failed to complete retrieval');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(prev => ({ ...prev, [`retrieval-${ticketNumber}`]: false }));
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading requests...</p>
      </div>
    );
  }

  const hasActiveTask = activeTickets.length > 0;

  return (
    <div className="driver-requests">
      <h2>Driver Dashboard</h2>

      {activeTickets.length > 0 && (
        <div className="active-section">
          <h3>Current Active Task</h3>
          {activeTickets.map(req => (
            <div key={req.id} className="request-card active glass-panel">
              <div className="card-header">
                <h4>{req.requestType} Request</h4>
                <span className="badge processing">Active</span>
              </div>
              <div className="card-body">
                <p><strong>Ticket:</strong> #{req?.ticket?.ticketNumber}</p>
                <p><strong>Car:</strong> {req?.ticket?.car?.brand} {req?.ticket?.car?.model} ({req?.ticket?.car?.plateNumber})</p>
                <p><strong>Customer:</strong> {req?.ticket?.user?.name}</p>
                <p><strong>Location:</strong> {req?.ticket?.parkingArea?.name}</p>
              </div>
              <div className="card-actions">
                {req.requestType === 'PARKING' && (
                  <button
                    onClick={() => handleCompleteParking(req.ticket.ticketNumber)}
                    className="btn-primary full-width"
                    disabled={actionLoading[`parking-${req.ticket.ticketNumber}`]}
                  >
                    {actionLoading[`parking-${req.ticket.ticketNumber}`] ? 'Completing...' : 'Complete Parking'}
                  </button>
                )}
                {req.requestType === 'RETRIEVAL' && (
                  <button
                    onClick={() => handleCompleteRetrieval(req.ticket.ticketNumber)}
                    className="btn-primary full-width"
                    disabled={actionLoading[`retrieval-${req.ticket.ticketNumber}`]}
                  >
                    {actionLoading[`retrieval-${req.ticket.ticketNumber}`] ? 'Completing...' : 'Complete Retrieval'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="requests-section" style={{ marginTop: activeTickets.length > 0 ? '40px' : '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Available Requests ({requests.length})</h3>
          {hasActiveTask && <span className="warning-text">Finish your active task to accept new ones</span>}
        </div>
        
        {requests.length === 0 ? (
          <div className="empty-state glass-panel">
            <p>No pending requests right now.</p>
          </div>
        ) : (
          <div className="requests-grid">
            {requests.map(req => (
              <div key={req.id} className={`request-card glass-panel ${hasActiveTask ? 'disabled' : ''}`}>
                <h4>{req.requestType} Request</h4>
                <p><strong>Car:</strong> {req?.ticket?.car?.brand} {req?.ticket?.car?.model}</p>
                <p><strong>Location:</strong> {req?.ticket?.parkingArea?.name}</p>
                <button
                  onClick={() => handleAccept(req.id)}
                  className="btn-secondary full-width"
                  disabled={hasActiveTask || actionLoading[`accept-${req.id}`]}
                >
                  {actionLoading[`accept-${req.id}`] ? 'Accepting...' : hasActiveTask ? 'Already Busy' : 'Accept Request'}
                </button>
              </div>
            ))}
          </div>
        ) }
      </div>
    </div>
  );
}

export default DriverRequests;
