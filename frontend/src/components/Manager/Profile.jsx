import { useEffect, useState } from 'react';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/manager/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading || !profile) return <p>Loading...</p>;

  const parkingArea = profile.parkingAreas && profile.parkingAreas.length > 0 ? profile.parkingAreas[0] : null;

  return (
    <div>
      <h2>Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p><strong>Parking Area:</strong> {parkingArea?.name || 'Not Assigned'}</p>
        <p><strong>Location:</strong> {parkingArea?.location || 'N/A'}</p>
      </div>
    </div>
  );
}

export default Profile;
