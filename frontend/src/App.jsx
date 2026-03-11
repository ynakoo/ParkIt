import { useEffect, useState } from 'react';
import HomePage from './components/HomePage';
import LoginScreen from './components/LoginScreen';
import Register from './components/Register';
import Dashboard from './components/User/Dashboard';
import ScanQR from './components/User/ScanQR';
import SelectCar from './components/User/SelectCar';
import MakePayment from './components/User/MakePayment';
import Ticket from './components/User/Ticket';
import DriverDashboard from './components/Driver/DriverDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import SuperAdminDashboard from './components/SuperAdmin/SuperAdminDashboard';
import Layout from './components/Layout';

const ROLE_SCREEN = {
  USER: 'USER_DASHBOARD',
  DRIVER: 'DRIVER_DASHBOARD',
  MANAGER: 'MANAGER_DASHBOARD',
  SUPERADMIN: 'SUPERADMIN_DASHBOARD'
};

function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('HOME');
  const [parkingData, setParkingData] = useState({ parkingArea: null, car: null });
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setScreen(ROLE_SCREEN[userData.role]);
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  const handleLogin = async (email, password) => {
    try{
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await res.json();
      if (data.error){
        return { success: false, message: data.error };
      }
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      setUser(data.user);
      setScreen(ROLE_SCREEN[data.user.role]);
      return { success: true };
    }
    catch(err){
      return { success: false, message: 'server error' };
    }
  };

  if (screen === 'HOME') {
    return <HomePage onNavigate={setScreen} />;
  }
  
  if (screen === 'LOGIN') {
    return <LoginScreen onLogin={handleLogin} onNavigate={setScreen} />;
  }
  
  if (screen === 'REGISTER') {
    return <Register onNavigate={setScreen} />;
  }

  if (screen === 'USER_DASHBOARD') {
    return (
      <Layout
        title="User Dashboard"
        onLogout={() => { localStorage.clear(); setUser(null); setScreen('LOGIN'); }}
        onDashboard={() => setScreen('USER_DASHBOARD')}
      >
        <Dashboard user={user} onNavigate={setScreen} />
      </Layout>
    );
  }

  if (screen === 'SCAN_QR') {
    return (
      <Layout
        title="Scan QR"
        onLogout={() => { localStorage.clear(); setUser(null); setScreen('LOGIN'); }}
        onDashboard={() => setScreen('USER_DASHBOARD')}
      >
        <ScanQR 
          onBack={() => setScreen('USER_DASHBOARD')} 
          onParkingSelected={(area) => {
            setParkingData({...parkingData, parkingArea: area});
            setScreen('SELECT_CAR');
          }} 
        />
      </Layout>
    );
  }

  if (screen === 'SELECT_CAR') {
    return (
      <Layout
        title="Select Car"
        onLogout={() => { localStorage.clear(); setUser(null); setScreen('LOGIN'); }}
        onDashboard={() => setScreen('USER_DASHBOARD')}
      >
        <SelectCar 
          onBack={() => setScreen('SCAN_QR')} 
          parkingArea={parkingData.parkingArea} 
          onCarSelected={(car) => {
            setParkingData({...parkingData, car});
            setScreen('MAKE_PAYMENT');
          }} 
        />
      </Layout>
    );
  }

  if (screen === 'MAKE_PAYMENT') {
    return (
      <Layout
        title="Payment"
        onLogout={() => { localStorage.clear(); setUser(null); setScreen('LOGIN'); }}
        onDashboard={() => setScreen('USER_DASHBOARD')}
      >
        <MakePayment 
          onBack={() => setScreen('SELECT_CAR')} 
          parkingArea={parkingData.parkingArea} 
          car={parkingData.car} 
          onPaymentComplete={() => {
            setParkingData({ parkingArea: null, car: null });
            setScreen('TICKET_VIEW');
          }} 
        />
      </Layout>
    );
  }

  if (screen === 'TICKET_VIEW') {
    return (
      <Layout
        title="Ticket"
        onLogout={() => { localStorage.clear(); setUser(null); setScreen('LOGIN'); }}
        onDashboard={() => setScreen('USER_DASHBOARD')}
      >
        <Ticket 
          ticket={{ticketNumber: 'TKT-' + Date.now(), status: 'REQUESTED'}} 
          onDone={() => setScreen('USER_DASHBOARD')} 
        />
      </Layout>
    );
  }

  if (screen === 'DRIVER_DASHBOARD') {
    return (
      <Layout
        title="Driver Dashboard"
        onLogout={() => { localStorage.clear(); setUser(null); setScreen('LOGIN'); }}
        onDashboard={() => setScreen('DRIVER_DASHBOARD')}
      >
        <DriverDashboard />
      </Layout>
    );
  }

  if (screen === 'MANAGER_DASHBOARD') {
    return (
      <Layout
        title="Manager Dashboard"
        onLogout={() => { localStorage.clear(); setUser(null); setScreen('LOGIN'); }}
        onDashboard={() => setScreen('MANAGER_DASHBOARD')}
      >
        <ManagerDashboard />
      </Layout>
    );
  }

  if (screen === 'SUPERADMIN_DASHBOARD') {
    return (
      <Layout
        title="Super Admin Dashboard"
        onLogout={() => { localStorage.clear(); setUser(null); setScreen('LOGIN'); }}
        onDashboard={() => setScreen('SUPERADMIN_DASHBOARD')}
      >
        <SuperAdminDashboard />
      </Layout>
    );
  }

  return <HomePage onNavigate={setScreen} />;
}

export default App;

