import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import UserStores from './pages/UserStores';
import OwnerDashboard from './pages/OwnerDashboard';

function AppContent() {
  const { user, logout } = useContext(AuthContext);
  console.log("app rendered"); // debug
  let btnStyle = { float: 'right', margin: '10px' };
  return (
    <div>
      {user && <button onClick={logout} style={btnStyle}>Logout</button>}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><AdminPanel /></PrivateRoute>} />
        <Route path="/user" element={<PrivateRoute allowedRoles={['user']}><UserStores /></PrivateRoute>} />
        <Route path="/owner" element={<PrivateRoute allowedRoles={['store_owner']}><OwnerDashboard /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;