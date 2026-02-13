import { useEffect, useState } from 'react';
import LoginScreen from './components/LoginScreen';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DriverDashboard from './components/DriverDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import Layout from './components/Layout';

const ROLE_SCREEN = {
  USER: 'USER_DASHBOARD',
  DRIVER: 'DRIVER_DASHBOARD',
  MANAGER: 'MANAGER_DASHBOARD',
  SUPERADMIN: 'SUPERADMIN_DASHBOARD'
};

function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('LOGIN');
  const renderScreen = () => {
    switch (screen) {
      case "USER_DASHBOARD":
        return <Dashboard user={user} onNavigate={setScreen} />;
      case "DRIVER_DASHBOARD":
        return <DriverDashboard />;
      case "MANAGER_DASHBOARD":
        return <ManagerDashboard user={user} />;
      case "SUPERADMIN_DASHBOARD":
        return <SuperAdminDashboard />;
      default:
        return null;
    }
  };
  const handleLogin = async (email, password) => {
    try{
      const res = await fetch(`http://localhost:3000/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await res.json();
      if (data.error){
        return { success: false, message: data.error };
      }
      console.log(data)
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      setUser(data.user);
      setScreen(ROLE_SCREEN[data.user.role]);
      return { success: true };
    }
    catch(err){
      console.log('error received')
      return { success: false, message: 'server error' };
    }
  };
  if (screen === 'LOGIN') return <LoginScreen onLogin={handleLogin} onNavigate={setScreen} />;
  if (screen === 'REGISTER') return <Register onNavigate={setScreen} />;
  return (
    <Layout
      title={`${user.role} Dashboard`}
      onLogout={() => { localStorage.clear(); setScreen('LOGIN'); }}
      onDashboard={() => setScreen(ROLE_SCREEN[user.role])}
    >
      {renderScreen()}
    </Layout>
  );
}

export default App;

