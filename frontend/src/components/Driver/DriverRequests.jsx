import { useState, useEffect } from 'react';

function DriverRequests() {
  const [requests, setRequests] = useState([]);
  const [activeTickets, setActiveTickets] = useState([]);
  const [_loading, setLoading] = useState(true);
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
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchRequests();
        await fetchActiveTickets();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    const interval = setInterval(() => {
      loadData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);


  const handleAccept = async (requestId) => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleCompleteParking = async (ticketNumber) => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleCompleteRetrieval = async (ticketNumber) => {
    try {
      setLoading(true);
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
      setLoading(false);
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
              {req.requestType === 'PARKING' && req?.ticket?.status === 'DRIVER_ASSIGNED' && (
                <button onClick={() => handleCompleteParking(req.ticket.ticketNumber)} className="btn-complete">
                  Complete Parking
                </button>
              )}
              {req.requestType === 'RETRIEVAL' && req?.ticket?.status === 'CAR_ON_THE_WAY' && (
                <button onClick={() => handleCompleteRetrieval(req.ticket.ticketNumber)} className="btn-complete">
                  Complete Retrieval
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
              <button onClick={() => handleAccept(req.id)} className="btn-accept">
                Accept Request
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DriverRequests;
