import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('myapp_token');
    const userData = localStorage.getItem('myapp_user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('myapp_token', token);
    localStorage.setItem('myapp_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('myapp_token');
      localStorage.removeItem('myapp_user');
      setUser(null);
    }
  };

  const updatePassword = async (oldPassword, newPassword) => {
    await api.put('/auth/password', { oldPassword, newPassword });
  };

  if (loading) {
    return <Loader message="Authenticating..." />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};