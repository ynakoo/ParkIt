import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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

const ROLE_DASHBOARD = {
  USER: '/dashboard',
  DRIVER: '/driver',
  MANAGER: '/manager',
  SUPERADMIN: '/admin'
};

function getUser() {
  try {
    const token = localStorage.getItem('authToken');
    const saved = localStorage.getItem('currentUser');
    if (token && saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
    localStorage.clear();
  }
  return null;
}

function ProtectedRoute({ allowedRoles, children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_DASHBOARD[user.role] || '/login'} replace />;
  }
  return children;
}

function PublicOnly({ children }) {
  const user = getUser();
  if (user) return <Navigate to={ROLE_DASHBOARD[user.role] || '/dashboard'} replace />;
  return children;
}

function UserLayout({ title, children }) {
  return (
    <Layout title={title}>
      {children}
    </Layout>
  );
}

function AutoRedirect() {
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname === '/') {
      navigate(ROLE_DASHBOARD[user.role] || '/dashboard', { replace: true });
    }
  }, []);

  if (user) return null;
  return <HomePage />;
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<AutoRedirect />} />
      <Route path="/login" element={<PublicOnly><LoginScreen /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

      {/* User routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['USER']}>
          <UserLayout title="User Dashboard"><Dashboard /></UserLayout>
        </ProtectedRoute>
      } />
      <Route path="/scan-qr" element={
        <ProtectedRoute allowedRoles={['USER']}>
          <UserLayout title="Scan QR"><ScanQR /></UserLayout>
        </ProtectedRoute>
      } />
      <Route path="/select-car" element={
        <ProtectedRoute allowedRoles={['USER']}>
          <UserLayout title="Select Car"><SelectCar /></UserLayout>
        </ProtectedRoute>
      } />
      <Route path="/payment" element={
        <ProtectedRoute allowedRoles={['USER']}>
          <UserLayout title="Payment"><MakePayment /></UserLayout>
        </ProtectedRoute>
      } />
      <Route path="/ticket" element={
        <ProtectedRoute allowedRoles={['USER']}>
          <UserLayout title="Ticket"><Ticket /></UserLayout>
        </ProtectedRoute>
      } />

      {/* Driver route */}
      <Route path="/driver" element={
        <ProtectedRoute allowedRoles={['DRIVER']}>
          <UserLayout title="Driver Dashboard"><DriverDashboard /></UserLayout>
        </ProtectedRoute>
      } />

      {/* Manager route */}
      <Route path="/manager" element={
        <ProtectedRoute allowedRoles={['MANAGER']}>
          <UserLayout title="Manager Dashboard"><ManagerDashboard /></UserLayout>
        </ProtectedRoute>
      } />

      {/* SuperAdmin route */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['SUPERADMIN']}>
          <UserLayout title="Super Admin Dashboard"><SuperAdminDashboard /></UserLayout>
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
