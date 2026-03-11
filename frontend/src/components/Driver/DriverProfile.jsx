import { useEffect, useState } from 'react';

function DriverProfile() {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/driver/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {profile.user.name}</p>
        <p><strong>Email:</strong> {profile.user.email}</p>
        <p><strong>DL Number:</strong> {profile.dlNumber}</p>
        <p><strong>Parking Area:</strong> {profile.parkingArea.name}</p>
        <p><strong>Location:</strong> {profile.parkingArea.location}</p>
        <p><strong>Status:</strong> <span className={`status-badge ${profile.status.toLowerCase()}`}>{profile.status}</span></p>
      </div>
    </div>
  );
}

export default DriverProfile;
