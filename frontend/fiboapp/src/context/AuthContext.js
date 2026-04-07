import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import client from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = await SecureStore.getItemAsync('token');
      const userData = await SecureStore.getItemAsync('user');
      if (token && userData) setUser(JSON.parse(userData));
      setLoading(false);
    };
    load();
  }, []);

  const login = async (phone_number, pin) => {
    const res = await client.post('/auth/login', { phone_number, pin });
    await SecureStore.setItemAsync('token', res.data.token);
    await SecureStore.setItemAsync('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (payload) => {
    const res = await client.post('/auth/register', payload);
    await SecureStore.setItemAsync('token', res.data.token);
    await SecureStore.setItemAsync('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    setUser(null);
  };

  const refreshUser = async () => {
    const res = await client.get('/users/me');
    setUser(res.data);
    await SecureStore.setItemAsync('user', JSON.stringify(res.data));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);