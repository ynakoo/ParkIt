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
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setScreen(ROLE_SCREEN[userData.role]);
    }
  }, []);
  const renderScreen = () => {
    switch (screen) {
      case "USER_DASHBOARD":
        return <Dashboard user={user} onNavigate={setScreen} />;
      case "SCAN_QR":
        return <ScanQR onBack={() => setScreen('USER_DASHBOARD')} onParkingSelected={(area) => {
          setParkingData({...parkingData, parkingArea: area});
          setScreen('SELECT_CAR');
        }} />;
      case "SELECT_CAR":
        return <SelectCar onBack={() => setScreen('SCAN_QR')} parkingArea={parkingData.parkingArea} onCarSelected={(car) => {
          setParkingData({...parkingData, car});
          setScreen('MAKE_PAYMENT');
        }} />;
      case "MAKE_PAYMENT":
        return <MakePayment onBack={() => setScreen('SELECT_CAR')} parkingArea={parkingData.parkingArea} car={parkingData.car} onPaymentComplete={(ticket) => {
          setParkingData({ parkingArea: null, car: null });
          setScreen('TICKET_VIEW');
        }} />;
      case "TICKET_VIEW":
        return <Ticket ticket={{ticketNumber: 'TKT-' + Date.now(), status: 'REQUESTED'}} onDone={() => setScreen('USER_DASHBOARD')} />;
      case "DRIVER_DASHBOARD":
        return <DriverDashboard />;
      case "MANAGER_DASHBOARD":
        return <ManagerDashboard />;
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
  if (screen === 'HOME') return <HomePage onNavigate={setScreen} />;
  if (screen === 'LOGIN') return <LoginScreen onLogin={handleLogin} onNavigate={setScreen} />;
  if (screen === 'REGISTER') return <Register onNavigate={setScreen} />;
  
  return (
    <Layout
      title={`${user?.role || ''} Dashboard`}
      onLogout={() => { localStorage.clear(); setScreen('LOGIN'); }}
      onDashboard={() => setScreen(ROLE_SCREEN[user.role])}
    >
      {renderScreen()}
    </Layout>
  );
}

export default App;

