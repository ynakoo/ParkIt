import { useEffect, useState } from 'react';

function Profile() {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/manager/profile', {
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
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p><strong>Parking Area:</strong> {profile.parkingArea?.name || 'Not Assigned'}</p>
        <p><strong>Location:</strong> {profile.parkingArea?.location || 'N/A'}</p>
      </div>
    </div>
  );
}

export default Profile;
