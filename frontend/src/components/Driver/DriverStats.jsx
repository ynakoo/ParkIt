import { useState, useEffect } from 'react';

function DriverStats() {
  const [stats, setStats] = useState({
    todayParking: 0,
    todayRetrieval: 0,
    totalParking: 0,
    totalRetrieval: 0
  });
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch('${import.meta.env.VITE_API_URL}/api/driver/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setProfile(data);
  };

  const fetchStats = async () => {
    const res = await fetch('${import.meta.env.VITE_API_URL}/api/driver/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setStats(data);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      
      {profile && (
        <div className="driver-info-card">
          <p><strong>Parking Area:</strong> {profile.parkingArea.name}</p>
          <p><strong>Location:</strong> {profile.parkingArea.location}</p>
          <p><strong>Status:</strong> <span className={`status-badge ${profile.status.toLowerCase()}`}>{profile.status}</span></p>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🅿️</div>
          <div className="stat-info">
            <h3>{stats.todayParking}</h3>
            <p>Today's Parking</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-info">
            <h3>{stats.todayRetrieval}</h3>
            <p>Today's Retrieval</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.totalParking}</h3>
            <p>Total Parking</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>{stats.totalRetrieval}</h3>
            <p>Total Retrieval</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverStats;
