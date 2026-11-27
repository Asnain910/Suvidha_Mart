'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '@/lib/data';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Separate Customer and Admin sessions for complete concurrency
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [loading, setLoading] = useState(true);

  // Centralized fetch for registered users from backend API
  async function fetchUsers(authToken) {
    const currentToken =
      authToken ||
      adminToken ||
      (typeof window !== 'undefined' ? localStorage.getItem('sm_admin_token') : null) ||
      token ||
      (typeof window !== 'undefined' ? localStorage.getItem('sm_token') : null);

    if (!currentToken) return users;

    try {
      const res = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sm_users', JSON.stringify(data.users));
        }
        return data.users;
      }
    } catch (e) {
      console.warn('Could not fetch users from backend API:', e.message);
    }
    return users;
  }

  // Initialize both Customer and Admin sessions on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('sm_user');
    const savedToken = localStorage.getItem('sm_token');
    const savedAdminUser = localStorage.getItem('sm_admin_user');
    const savedAdminToken = localStorage.getItem('sm_admin_token');
    const savedUsers = localStorage.getItem('sm_users');

    if (savedUsers) {
      try {
        const parsed = JSON.parse(savedUsers);
        if (Array.isArray(parsed) && parsed.length > 0) setUsers(parsed);
      } catch (e) {}
    }

    // 1. Restore Customer session
    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {}
      }

      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('sm_user', JSON.stringify(data.user));
          } else {
            setUser(null);
            setToken(null);
            localStorage.removeItem('sm_token');
            localStorage.removeItem('sm_user');
          }
        })
        .catch(() => {});
    } else if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    // 2. Restore Admin session
    if (savedAdminToken) {
      setAdminToken(savedAdminToken);
      if (savedAdminUser) {
        try {
          const parsed = JSON.parse(savedAdminUser);
          if (parsed.role === 'admin') setAdminUser(parsed);
        } catch (e) {}
      }

      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedAdminToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user && data.user.role === 'admin') {
            setAdminUser(data.user);
            localStorage.setItem('sm_admin_user', JSON.stringify(data.user));
            fetchUsers(savedAdminToken);
          } else {
            setAdminUser(null);
            setAdminToken(null);
            localStorage.removeItem('sm_admin_token');
            localStorage.removeItem('sm_admin_user');
          }
        })
        .catch(() => {
          if (savedAdminToken) fetchUsers(savedAdminToken);
        });
    } else if (savedAdminUser) {
      try {
        const parsed = JSON.parse(savedAdminUser);
        if (parsed.role === 'admin') setAdminUser(parsed);
      } catch (e) {}
    }

    setLoading(false);
  }, []);

  // Admin Portal Login (strictly isolated from customer session)
  const adminLogin = async (email, password) => {
    const normEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normEmail, password: cleanPassword }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        if (data.user.role !== 'admin') {
          return { success: false, error: 'Access denied: Not an administrator account' };
        }
        setAdminUser(data.user);
        setAdminToken(data.token);
        localStorage.setItem('sm_admin_user', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('sm_admin_token', data.token);
          // Immediately fetch all users from backend database with the new admin token
          await fetchUsers(data.token);
        }
        return { success: true, user: data.user };
      }

      if (data.error) {
        return { success: false, error: data.error };
      }
    } catch (e) {
      console.warn('Admin API login network error:', e.message);
    }

    // Direct master admin credential fallback if network fails
    if (normEmail === 'admin@suvidhamart.com' && cleanPassword === 'admin123') {
      const adminObj = {
        id: 'admin',
        name: 'Suvidha Mart Admin',
        email: 'admin@suvidhamart.com',
        role: 'admin',
        phone: '9000000000',
        avatar: '🛡️',
        isDemo: false,
      };
      setAdminUser(adminObj);
      localStorage.setItem('sm_admin_user', JSON.stringify(adminObj));
      return { success: true, user: adminObj };
    }

    return {
      success: false,
      error: 'Invalid admin credentials. Please use admin@suvidhamart.com and password: admin123',
    };
  };

  const adminLogout = () => {
    setAdminUser(null);
    setAdminToken(null);
    localStorage.removeItem('sm_admin_user');
    localStorage.removeItem('sm_admin_token');
  };

  // Customer Storefront Login (does NOT overwrite admin session)
  const login = async (email, password) => {
    const normEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normEmail, password: cleanPassword }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('sm_user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('sm_token', data.token);
        return { success: true, user: data.user };
      }

      return {
        success: false,
        error: data.error || 'Invalid email or password',
      };
    } catch (err) {
      return {
        success: false,
        error: 'Network error. Please check your internet connection.',
      };
    }
  };

  // Customer Storefront Signup - Centralized Backend Database Registration
  const signup = async (name, email, password, phone) => {
    const normEmail = (email || '').trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: normEmail, password, phone: phone ? phone.trim() : '' }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('sm_user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('sm_token', data.token);

        // Keep local users state synced
        setUsers((prev) => [data.user, ...prev.filter((u) => u.id !== data.user.id && u.email !== data.user.email)]);

        return { success: true, user: data.user };
      }

      return {
        success: false,
        error: data.error || 'Registration failed. Please try again.',
      };
    } catch (err) {
      return {
        success: false,
        error: 'Unable to connect to server. Please check your internet connection and try again.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sm_user');
    localStorage.removeItem('sm_token');
  };

  const updateUser = async (data) => {
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('sm_user', JSON.stringify(updatedUser));

    const currentToken = token || localStorage.getItem('sm_token');
    if (currentToken) {
      try {
        await fetch('/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify(data),
        });
      } catch (e) {}
    }
  };

  const getAllUsers = () => {
    return users || [];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        adminUser,
        adminToken,
        users,
        loading,
        login,
        adminLogin,
        signup,
        logout,
        adminLogout,
        updateUser,
        getAllUsers,
        refreshUsers: fetchUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
