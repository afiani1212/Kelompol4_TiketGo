// client/src/components/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');
  const { login, dispatch, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const success = await login(username, password);
    if (success) {
      const user = JSON.parse(localStorage.getItem('user'));
      navigate(user.role === 'admin' ? '/' : '/flights');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      navigate('/flights');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/blue sky.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative bg-white p-8 rounded-xl shadow-xl w-full max-w-md z-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isRegistering ? 'Buat Akun' : 'Login'}
        </h2>

        {message && <div className="mb-4 text-green-500 bg-green-100 p-2 rounded">{message}</div>}
        {error && <div className="mb-4 text-red-500 bg-red-100 p-2 rounded">{error}</div>}

        <form onSubmit={isRegistering ? handleRegister : handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {loading ? 'Memproses...' : (isRegistering ? 'Daftar' : 'Login')}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-600">
          {isRegistering ? 'Sudah punya akun? ' : 'Belum punya akun? '}
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setMessage('');
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            {isRegistering ? 'Login' : 'Daftar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;