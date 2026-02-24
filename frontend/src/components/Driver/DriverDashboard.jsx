import { useState } from 'react';
import DriverStats from './DriverStats';
import DriverRequests from './DriverRequests';
import DriverProfile from './DriverProfile';
import '../SuperAdmin/admin.css';
import './driver.css';

function DriverDashboard() {
  const [section, setSection] = useState('DASHBOARD');

  const renderSection = () => {
    switch (section) {
      case 'DASHBOARD':
        return <DriverStats />;
      case 'REQUESTS':
        return <DriverRequests />;
      case 'PROFILE':
        return <DriverProfile />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h3>🚗 Driver Panel</h3>
        <p onClick={() => setSection('DASHBOARD')}>📊 Dashboard</p>
        <p onClick={() => setSection('REQUESTS')}>📋 Requests</p>
        <p onClick={() => setSection('PROFILE')}>⚙️ Profile</p>
      </div>

      <div className="admin-content">
        {renderSection()}
      </div>
    </div>
  );
}

export default DriverDashboard;
