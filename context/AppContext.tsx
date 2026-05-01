import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  avatarUrl: string;
  department: string;
  contact: string;
}

interface AppContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export const AppContext = createContext<AppContextProps | null>(null);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
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
    } else {
      await SecureStore.deleteItemAsync('user');
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
