import { useEffect, useState } from 'react';

function ParkingDetails({ area, onBack }) {
  const [details, setDetails] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/superAdmin/parking-areas/${area.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await res.json();
      setDetails(data);
    };
    fetchDetails();
  }, [area.id,token]);

  if (!details) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: '20px' }}>← Back</button>
      
      <h2>{details.name}</h2>
      
      <div className="profile-card" style={{ maxWidth: '600px' }}>
        <p><strong>Location:</strong> {details.location}</p>
        <p><strong>QR Code:</strong> {details.qrCode}</p>
        <p><strong>Rate:</strong> ${details.amount}/hr</p>
        <p><strong>Manager:</strong> {details.manager?.name || 'Not Assigned'}</p>
        <p><strong>Status:</strong> {details.status}</p>
      </div>

      <h3 style={{ marginTop: '30px' }}>Drivers ({details.drivers.length})</h3>
      <div className="driver-list">
        {details.drivers.length === 0 ? (
          <p>No drivers assigned</p>
        ) : (
          details.drivers.map((driver) => (
            <div key={driver.userId} className="driver-item">
              <div>
                <strong>{driver.user.name}</strong>
                <p style={{margin: '4px 0', color: '#666'}}>{driver.user.email}</p>
                <p style={{margin: '4px 0', color: '#666'}}>DL: {driver.dlNumber}</p>
              </div>
              <span className={`status-badge ${driver.status.toLowerCase()}`}>
                {driver.status}
              </span>
            </div>
          ))
        )}
      </div>

      <h3 style={{ marginTop: '30px' }}>Tickets ({details.tickets.length})</h3>
      <div className="driver-list">
        {details.tickets.length === 0 ? (
          <p>No tickets yet</p>
        ) : (
          details.tickets.map((ticket) => (
            <div key={ticket.ticketNumber} className="driver-item">
              <div>
                <strong>Ticket #{ticket.ticketNumber}</strong>
                <p style={{margin: '4px 0', color: '#666'}}>Status: {ticket.status}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ParkingDetails;
