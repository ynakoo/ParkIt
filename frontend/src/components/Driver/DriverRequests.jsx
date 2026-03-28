import { useState, useEffect } from 'react';

function DriverRequests() {
  const [requests, setRequests] = useState([]);
  const [activeTickets, setActiveTickets] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const token = localStorage.getItem('authToken');

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/driver/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRequests([]);
    }
  };
  const fetchActiveTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/driver/active-tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setActiveTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setActiveTickets([]);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let timerId = null;

    const pollData = async () => {
      if (!isMounted) return;
      try {
        await fetchRequests();
        await fetchActiveTickets();
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
      await pollData();
      if (isMounted) {
        setLoading(false);
      }
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
      await fetch(`${import.meta.env.VITE_API_URL}/api/driver/accept-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requestId })
      });
      fetchRequests();
      fetchActiveTickets();
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(prev => ({ ...prev, [`accept-${requestId}`]: false }));
    }
  };

  const handleCompleteParking = async (ticketNumber) => {
    try {
      setActionLoading(prev => ({ ...prev, [`parking-${ticketNumber}`]: true }));
      await fetch(`${import.meta.env.VITE_API_URL}/api/driver/complete-parking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ticketNumber })
      });
      fetchActiveTickets();
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(prev => ({ ...prev, [`parking-${ticketNumber}`]: false }));
    }
  };

  const handleCompleteRetrieval = async (ticketNumber) => {
    try {
      setActionLoading(prev => ({ ...prev, [`retrieval-${ticketNumber}`]: true }));
      await fetch(`${import.meta.env.VITE_API_URL}/api/driver/complete-retrieval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ticketNumber })
      });
      fetchActiveTickets();
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(prev => ({ ...prev, [`retrieval-${ticketNumber}`]: false }));
    }
  };

  return (
    <div>
      <h2>Requests</h2>

      {activeTickets.length > 0 && (
        <div className="active-section">
          <h3>Active Tasks</h3>
          {activeTickets.map(req => (
            <div key={req.id} className="request-card active">
              <h4>{req.requestType} Request</h4>
              <p><strong>Ticket:</strong> {req?.ticket?.ticketNumber}</p>
              <p><strong>Car:</strong> {req?.ticket?.car?.brand} {req?.ticket?.car?.model} ({req?.ticket?.car?.plateNumber})</p>
              <p><strong>Customer:</strong> {req?.ticket?.user?.name}</p>
              <p><strong>Location:</strong> {req?.ticket?.parkingArea?.name}</p>
              {req.requestType === 'PARKING' && (
                <button
                  onClick={() => handleCompleteParking(req.ticket.ticketNumber)}
                  className="btn-complete"
                  disabled={actionLoading[`parking-${req.ticket.ticketNumber}`]}
                >
                  {actionLoading[`parking-${req.ticket.ticketNumber}`] ? 'Completing...' : 'Complete Parking'}
                </button>
              )}
              {req.requestType === 'RETRIEVAL' && (
                <button
                  onClick={() => handleCompleteRetrieval(req.ticket.ticketNumber)}
                  className="btn-complete"
                  disabled={actionLoading[`retrieval-${req.ticket.ticketNumber}`]}
                >
                  {actionLoading[`retrieval-${req.ticket.ticketNumber}`] ? 'Completing...' : 'Complete Retrieval'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="requests-section">
        <h3>New Requests ({requests.length})</h3>
        {requests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          requests.map(req => (
            <div key={req.id} className="request-card">
              <h4>{req.requestType} Request</h4>
              <p><strong>Ticket:</strong> {req?.ticket?.ticketNumber}</p>
              <p><strong>Car:</strong> {req?.ticket?.car?.brand} {req?.ticket?.car?.model}</p>
              <p><strong>Customer:</strong> {req?.ticket?.user?.name}</p>
              <p><strong>Location:</strong> {req?.ticket?.parkingArea?.name}</p>
              <button
                onClick={() => handleAccept(req.id)}
                className="btn-accept"
                disabled={actionLoading[`accept-${req.id}`]}
              >
                {actionLoading[`accept-${req.id}`] ? 'Accepting...' : 'Accept Request'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DriverRequests;
