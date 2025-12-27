import { useState, useEffect } from 'react';

interface User {
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    // Demo credentials - in production, use proper authentication
    if (email && password.length >= 6) {
      const userData = { email };
      localStorage.setItem('admin_user', JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  };

  const signup = (email: string, password: string): boolean => {
    if (email && password.length >= 6) {
      const userData = { email };
      localStorage.setItem('admin_user', JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  return { user, isLoading, login, signup, logout };
};
