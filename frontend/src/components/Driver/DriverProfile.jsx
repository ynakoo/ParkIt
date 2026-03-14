import { useEffect, useState } from 'react';

function DriverProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/driver/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  
  if (error) return <p style={{color: 'red'}}>{error}</p>;
  
  if (!profile) return <p>No profile data available</p>;

  return (
    <div>
      <h2>Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {profile.user?.name || 'N/A'}</p>
        <p><strong>Email:</strong> {profile.user?.email || 'N/A'}</p>
        <p><strong>DL Number:</strong> {profile.dlNumber || 'N/A'}</p>
        <p><strong>Parking Area:</strong> {profile.parkingArea?.name || 'N/A'}</p>
        <p><strong>Location:</strong> {profile.parkingArea?.location || 'N/A'}</p>
        <p><strong>Status:</strong> <span className={`status-badge ${profile.status?.toLowerCase() || ''}`}>{profile.status || 'N/A'}</span></p>
      </div>
    </div>
  );
}

export default DriverProfile;
