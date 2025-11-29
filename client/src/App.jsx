import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import FlightList from './components/FlightList';
import FlightDetail from './components/FlightDetail';
import FlightManagement from './components/FlightManagement';

// 🔹 Navbar dengan Logout
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/flights" className="text-xl font-bold hover:text-blue-200">
          TiketGo
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-sm">
            Hi, <span className="font-semibold">{user.username}</span> ({user.role})
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

// 🔹 Hanya untuk pengguna yang sudah login
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// 🔹 Hanya untuk admin
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
}

// 🔹 App Utama
function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar /> {/* 🔹 Navbar di atas */}
        <div className="flex-grow">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/flights"
              element={
                <ProtectedRoute>
                  <FlightList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flights/:id"
              element={
                <ProtectedRoute>
                  <FlightDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <AdminRoute>
                  <FlightManagement />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;