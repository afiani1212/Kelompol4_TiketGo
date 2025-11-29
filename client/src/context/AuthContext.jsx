// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START': return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS': return { ...state, loading: false, user: action.payload.user, token: action.payload.token, error: null };
    case 'LOGIN_FAILURE': return { ...state, loading: false, user: null, token: null, error: action.payload };
    case 'LOGOUT': return { ...state, user: null, token: null };
    default: return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (state.token) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        dispatch({ type: 'LOGIN_SUCCESS', payload: { token: state.token, user } });
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
      }
    }
  }, [state.token]);

  const login = async (username, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      return true;
    } catch (err) {
      dispatch({ type: 'LOGIN_FAILURE', payload: err.message });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};