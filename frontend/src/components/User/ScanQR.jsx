import { useState, useEffect } from 'react';

function ScanQR({ onBack, onParkingSelected }) {
  const [parkingAreas, setParkingAreas] = useState([]);
  const token = localStorage.getItem('authToken');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/parking-areas`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setParkingAreas(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  return (
    <div className="scan-qr">
      <button onClick={onBack} className="btn-back">← Back</button>
      <h2>Select Parking Area</h2>
      
      <div className="parking-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '24px' }}>
        {loading ? (<p>Loading parking areas...</p>):(parkingAreas.length === 0 ? (
          <p>No active parking areas available</p>
        ) : (
          parkingAreas.map(area => (
            <div key={area.id} className="parking-item" onClick={() => onParkingSelected(area)}>
              <h4>{area.name}</h4>
              <p>{area.location}</p>
              <p style={{ fontWeight: '600' }}>₹{area.amount}/hr</p>
              <p style={{fontSize: '12px', marginTop: '12px'}}>QR: {area.qrCode}</p>
            </div>
          ))
        ))}
      </div>
    </div>
  );
}

export default ScanQR;
