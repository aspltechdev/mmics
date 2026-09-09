import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

import { authAPI, memberAuthAPI, clearSession, getAccountType } from '../services/api';

/**
 * =========================================================
 * AUTH CONTEXT
 * =========================================================
 *
 * Handles two independent kinds of session:
 *
 *   accountType "admin"  -> users table   (SUPER_ADMIN / ADMIN / EDITOR)
 *   accountType "member" -> members table (portal members)
 *
 * They are separate tables with separate endpoints, so the
 * context tracks which one is signed in and sends the person
 * to the matching login screen when the session ends.
 */

const AuthContext = createContext();

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accountType, setAccountType] = useState('admin');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* -------------------------------------------------------
     RESTORE AN EXISTING SESSION
     ------------------------------------------------------- */

  useEffect(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (token && storedUser) {
        const userData = JSON.parse(storedUser);

        if (userData?.id && userData?.email) {
          setUser(userData);
          setAccountType(getAccountType());
          setIsAuthenticated(true);
        } else {
          clearSession();
        }
      }
    } catch {
      clearSession();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  /* -------------------------------------------------------
     SHARED LOGIN HANDLER
     ------------------------------------------------------- */

  const performLogin = useCallback(async (loginFn, type, email, password) => {
    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }

    try {
      const response = await loginFn(email.trim(), password);

      if (!response?.success) {
        return {
          success: false,
          message: response?.message || 'Invalid email or password',
        };
      }

      const token = response.data?.token;
      const userData = response.data?.user;

      if (!token || !userData) {
        return {
          success: false,
          message: 'Login succeeded but the server response was incomplete',
        };
      }

      setUser(userData);
      setAccountType(type);
      setIsAuthenticated(true);

      return { success: true, user: userData, accountType: type };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          'Unable to reach the server. Please try again.',
      };
    }
  }, []);

  /** Admin / staff login. */
  const login = useCallback(
    (email, password) => performLogin(authAPI.login, 'admin', email, password),
    [performLogin]
  );

  /** Member portal login. */
  const memberLogin = useCallback(
    (email, password) => performLogin(memberAuthAPI.login, 'member', email, password),
    [performLogin]
  );

  /* -------------------------------------------------------
     LOGOUT
     ------------------------------------------------------- */

  const logout = useCallback(() => {
    const target = accountType === 'member' ? '/member/login' : '/login';

    clearSession();
    setUser(null);
    setIsAuthenticated(false);

    window.location.href = target;
  }, [accountType]);

  /* -------------------------------------------------------
     UPDATE THE CACHED USER
     -------------------------------------------------------
     Called after a member edits their own profile so the
     header and dashboard reflect the change immediately.
     ------------------------------------------------------- */

  const updateUser = useCallback((partial) => {
    setUser((previous) => {
      const next = { ...previous, ...partial };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  /* -------------------------------------------------------
     ROLE HELPERS
     ------------------------------------------------------- */

  const isMember = accountType === 'member' || user?.role === 'MEMBER';
  const isAdmin = !isMember && ['SUPER_ADMIN', 'ADMIN'].includes(user?.role);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const hasRole = useCallback(
    (role) => {
      if (!user?.role) {
        return false;
      }

      const hierarchy = {
        SUPER_ADMIN: ['SUPER_ADMIN'],
        ADMIN: ['SUPER_ADMIN', 'ADMIN'],
        EDITOR: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
        MEMBER: ['MEMBER'],
      };

      return (hierarchy[role] || []).includes(user.role);
    },
    [user]
  );

  const value = {
    user,
    accountType,
    loading,
    isAuthenticated,
    isMember,
    isAdmin,
    isSuperAdmin,
    login,
    memberLogin,
    logout,
    updateUser,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
