import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ScanQR() {
  const [parkingAreas, setParkingAreas] = useState([]);
  const token = localStorage.getItem('authToken');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  }, [token]);

  return (
    <div className="scan-qr" style={{maxWidth: '1000px', margin: '0 auto', padding: '20px'}}>
      
      <div className="dashboard-header glass-panel" style={{marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h2>Step 1: <span className="text-gradient">Select Target Venue</span></h2>
          <p className="subtitle" style={{marginBottom: 0}}>Choose where you would like us to park your vehicle.</p>
        </div>
        <button onClick={() => navigate(-1)} className="btn-back" style={{margin: 0}}>Go Back</button>
      </div>
      
      {loading ? (
        <div className="glass-panel" style={{padding: '40px', textAlign: 'center'}}>
          <p>Loading available locations...</p>
        </div>
      ) : parkingAreas.length === 0 ? (
        <div className="empty-state-card glass-panel">
          <h3>No Locations Found</h3>
          <p>There are currently no active parking locations available in your region.</p>
        </div>
      ) : (
        <div className="parking-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {parkingAreas.map(area => (
            <div 
              key={area.id} 
              className="parking-item glass-panel" 
              onClick={() => navigate('/select-car', { state: { parkingArea: area } })}
              style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}
            >
              <h3 style={{fontSize: '22px', marginBottom: '8px', color: 'var(--text-primary)'}}>{area.name}</h3>
              <p style={{color: 'var(--text-secondary)', marginBottom: 'auto'}}>{area.location}</p>
              
              <div style={{marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--border-solid)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{ fontWeight: '700', fontSize: '18px', color: 'var(--primary)' }}>₹{area.amount}<span style={{fontSize: '14px', color: 'var(--text-muted)'}}>/hr</span></span>
                <span className="status-badge">Select</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScanQR;
