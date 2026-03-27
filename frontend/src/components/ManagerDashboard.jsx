import { useState } from 'react';
import DriverList from './Manager/DriverList';
import AddDriver from './Manager/AddDriver';
import Profile from './Manager/Profile';
import './SuperAdmin/admin.css';
import './Manager/manager.css';

function ManagerDashboard() {
  const [section, setSection] = useState('DASHBOARD');

  const renderSection = () => {
    switch (section) {
      case 'DASHBOARD':
        return <DriverList />;
      case 'ADD_DRIVER':
        return <AddDriver />;
      case 'PROFILE':
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h3>Manager Panel</h3>
        <p onClick={() => setSection('DASHBOARD')}>Dashboard</p>
        <p onClick={() => setSection('ADD_DRIVER')}>Add Driver</p>
        <p onClick={() => setSection('PROFILE')}>Profile</p>
      </div>

      <div className="admin-content">
        {renderSection()}
      </div>
    </div>
  );
}

export default ManagerDashboard;