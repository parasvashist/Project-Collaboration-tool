import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Check token on page load or refresh
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await getCurrentUser();
          setUser(res.data);
        } catch (err) {
          console.error('Error fetching user info:', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // 🔹 Called after login/signup success
  const login = async (token) => {
    localStorage.setItem('token', token);
    try {
      const res = await getCurrentUser();
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user after login');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
