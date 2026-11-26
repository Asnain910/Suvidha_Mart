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

  async function fetchUsers(authToken) {
    const currentToken = authToken || adminToken || token || localStorage.getItem('sm_admin_token') || localStorage.getItem('sm_token');
    if (!currentToken) return;
    try {
      const res = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
        localStorage.setItem('sm_users', JSON.stringify(data.users));
      }
    } catch (e) { }
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
        setUsers(JSON.parse(savedUsers));
      } catch (e) { }
    }

    // 1. Restore Customer session
    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) { }
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
        .catch(() => { });
    } else if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) { }
    }

    // 2. Restore Admin session
    if (savedAdminToken) {
      setAdminToken(savedAdminToken);
      if (savedAdminUser) {
        try {
          const parsed = JSON.parse(savedAdminUser);
          if (parsed.role === 'admin') setAdminUser(parsed);
        } catch (e) { }
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
      } catch (e) { }
    }

    setLoading(false);
  }, []);

  // Admin Portal Login (strictly isolated from customer session)
  const adminLogin = async (email, password) => {
    const normEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 1. Direct master admin credential check (works instantly offline & online)
    if (normEmail === 'admin@suvidhamart.com' && cleanPassword === 'admin123') {
      const adminObj = {
        id: 'admin',
        name: 'Suvidha Mart Admin',
        email: 'admin@suvidhamart.com',
        role: 'admin',
        phone: '9000000000',
        avatar: '🛡️',
        isDemo: true,
      };
      setAdminUser(adminObj);
      localStorage.setItem('sm_admin_user', JSON.stringify(adminObj));
      return { success: true, user: adminObj };
    }

    // 2. Try API login if server has active MongoDB
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
        if (data.token) localStorage.setItem('sm_admin_token', data.token);
        return { success: true, user: data.user };
      }
    } catch (e) { }

    // 3. Check INITIAL_USERS or sm_users for any other configured admins
    const localUsers = JSON.parse(localStorage.getItem('sm_users') || '[]');
    const combined = [...INITIAL_USERS, ...localUsers];
    const foundAdmin = combined.find(
      (u) => u.email.toLowerCase() === normEmail && u.password === cleanPassword && u.role === 'admin'
    );
    if (foundAdmin) {
      setAdminUser(foundAdmin);
      localStorage.setItem('sm_admin_user', JSON.stringify(foundAdmin));
      return { success: true, user: foundAdmin };
    }

    if (normEmail === 'admin@suvidhamart.com') {
      return {
        success: false,
        error: 'Incorrect password for admin account. Password is: admin123',
      };
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

    // 1. Try API login first if backend DB is connected
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
    } catch (err) { }

    // 2. Local authentication fallback: Combine INITIAL_USERS (has passwords) with locally registered users
    const localUsers = JSON.parse(localStorage.getItem('sm_users') || '[]');
    const allUsers = [...INITIAL_USERS, ...localUsers];

    const userMatch = allUsers.find((u) => u.email.toLowerCase() === normEmail);
    if (!userMatch) {
      return {
        success: false,
        error: `No account found for "${normEmail}". Please click 'Create one free' below to sign up.`,
      };
    }

    if (userMatch.password && userMatch.password !== cleanPassword) {
      return {
        success: false,
        error: 'Incorrect password. Please try again.',
      };
    }

    setUser(userMatch);
    localStorage.setItem('sm_user', JSON.stringify(userMatch));
    return { success: true, user: userMatch };
  };

  // Customer Storefront Signup
  const signup = async (name, email, password, phone) => {
    const normEmail = (email || '').trim().toLowerCase();
    const allUsers = JSON.parse(localStorage.getItem('sm_users') || JSON.stringify(INITIAL_USERS));

    const registerLocally = () => {
      if (allUsers.find((u) => u.email.toLowerCase() === normEmail)) {
        return { success: false, error: 'An account with this email already exists. Please sign in.' };
      }
      const newUser = {
        id: `u${Date.now()}`,
        name: name.trim(),
        email: normEmail,
        password,
        phone: phone ? phone.trim() : '',
        role: 'customer',
        address: '',
        avatar: name.trim().charAt(0).toUpperCase(),
        isDemo: false,
      };
      const updated = [...allUsers, newUser];
      localStorage.setItem('sm_users', JSON.stringify(updated));
      setUser(newUser);
      localStorage.setItem('sm_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: normEmail, password, phone }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('sm_user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('sm_token', data.token);
        return { success: true, user: data.user };
      }

      if (data.error && data.error.includes('already exists')) {
        return { success: false, error: data.error };
      }

      return registerLocally();
    } catch (err) {
      return registerLocally();
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
      } catch (e) { }
    }
  };

  const getAllUsers = () => {
    return users && users.length > 0
      ? users
      : JSON.parse(localStorage.getItem('sm_users') || JSON.stringify(INITIAL_USERS));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        adminUser,
        adminToken,
        loading,
        login,
        adminLogin,
        signup,
        logout,
        adminLogout,
        updateUser,
        getAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
