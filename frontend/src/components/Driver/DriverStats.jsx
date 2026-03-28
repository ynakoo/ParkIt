import { useState, useEffect } from 'react';

function DriverStats() {
  const [stats, setStats] = useState({
    todayParking: 0
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/driver/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/driver/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load stats');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchProfile(), fetchStats()]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  
  if (loading) {
    return (
      <div>
        <h2>Dashboard</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Dashboard</h2>
        <p style={{color: 'red'}}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Dashboard</h2>
      
      {profile && profile.parkingArea && (
        <div className="driver-info-card">
          <p><strong>Parking Area:</strong> {profile.parkingArea.name}</p>
          <p><strong>Location:</strong> {profile.parkingArea.location}</p>
          <p><strong>Status:</strong> <span className={`status-badge ${profile.status.toLowerCase()}`}>{profile.status}</span></p>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <h3>{stats.todayParking}</h3>
            <p>Today's Parking</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverStats;
