import { useState, useEffect } from 'react';

function ScanQR({ onBack, onParkingSelected }) {
  const [parkingAreas, setParkingAreas] = useState([]);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchAreas = async () => {
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/user/parking-areas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setParkingAreas(data);
    };
    fetchAreas();
  }, []);

  return (
    <div className="scan-qr">
      <button onClick={onBack} className="btn-back">← Back</button>
      <h2>Select Parking Area</h2>
      
      <div className="parking-list">
        {parkingAreas.length === 0 ? (
          <p>No active parking areas available</p>
        ) : (
          parkingAreas.map(area => (
            <div key={area.id} className="parking-item" onClick={() => onParkingSelected(area)}>
              <h4>{area.name}</h4>
              <p>{area.location}</p>
              <p>${area.amount}/hr</p>
              <p style={{fontSize: '12px', color: '#666'}}>QR: {area.qrCode}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ScanQR;
