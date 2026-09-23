import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  initials: string;
}

const DEFAULT_USER: User = {
  id: 'u-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'user',
  initials: 'JD',
};

const AUTH_STORAGE_KEY = 'efik_hymns_auth_user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, name?: string, role?: 'user' | 'admin') => void;
  logout: () => void;
  setAdminRole: (isAdmin: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    // Default to signed-in John Doe as shown in mockups
    return DEFAULT_USER;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // storage quota or private mode
    }
  }, [user]);

  const login = useCallback((email: string, name?: string, role: 'user' | 'admin' = 'user') => {
    const resolvedName = name || (email.includes('@') ? email.split('@')[0] : 'Worshipper');
    const parts = resolvedName.trim().split(' ');
    const initials = parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : resolvedName.substring(0, 2).toUpperCase();

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: resolvedName,
      email,
      role,
      initials,
    };
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const setAdminRole = useCallback((isAdmin: boolean) => {
    setUser((prev) => {
      if (!prev) {
        return {
          id: 'admin-1',
          name: 'Admin Worshipper',
          email: 'admin@efikhymns.org',
          role: 'admin',
          initials: 'AD',
        };
      }
      return {
        ...prev,
        role: isAdmin ? 'admin' : 'user',
        initials: isAdmin ? 'AD' : prev.initials,
      };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        login,
        logout,
        setAdminRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
