import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/constants/Config';

axios.defaults.baseURL = API_URL;

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  avatarUrl: string;
  department: string;
  contact: string;
  token?: string;
}

interface AppContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const setAuthHeader = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

export const AppContext = createContext<AppContextProps | null>(null);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
          setAuthHeader(parsedUser.token ?? null);
        }
      } catch (e) {
        console.error('Failed to load user', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const saveUser = async (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      await SecureStore.setItemAsync('user', JSON.stringify(newUser));
      setAuthHeader(newUser.token ?? null);
    } else {
      await SecureStore.deleteItemAsync('user');
      setAuthHeader(null);
    }
  };

  const logout = async () => {
    await saveUser(null);
  };

  return (
    <AppContext.Provider value={{ user, setUser: saveUser, isLoading, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
