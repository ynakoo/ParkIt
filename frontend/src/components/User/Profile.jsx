import { useEffect, useState } from 'react';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <div className="loading-spinner">Loading profile...</div>;
  if (!profile) return <div className="error-message">Failed to load profile.</div>;

  return (
    <div className="section-container">
      <h2>My Profile</h2>
      <div className="profile-card glass-panel">
        <div className="profile-info">
          <div className="info-group">
            <label>Full Name</label>
            <p>{profile.name}</p>
          </div>
          <div className="info-group">
            <label>Email Address</label>
            <p>{profile.email}</p>
          </div>
          <div className="info-group">
            <label>Role</label>
            <p className="role-badge">{profile.role}</p>
          </div>
          <div className="info-group">
            <label>Member Since</label>
            <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
