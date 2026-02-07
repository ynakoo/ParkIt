import { useEffect, useState } from 'react';
import LoginScreen from './components/LoginScreen';
import Register from './components/Register';
// import Dashboard from './components/Dashboard';
// import DriverDashboard from './components/DriverDashboard';
// import ManagerDashboard from './components/ManagerDashboard';
// import SuperAdminDashboard from './components/SuperAdminDashboard';
// import Layout from './components/Layout';

const ROLE_SCREEN = {
  USER: 'USER_DASHBOARD',
  DRIVER: 'DRIVER_DASHBOARD',
  MANAGER: 'MANAGER_DASHBOARD',
  SUPERADMIN: 'SUPERADMIN_DASHBOARD'
};

function App() {
  const [screen, setScreen] = useState('LOGIN');

  if (screen === 'LOGIN') return <LoginScreen onNavigate={setScreen} />;
  if (screen === 'REGISTER') return <Register onNavigate={setScreen} />;

}

export default App;

