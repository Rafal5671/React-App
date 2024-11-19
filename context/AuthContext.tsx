import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id:number;
  name: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  basketId: number | null;
  login: (userData: User, basketId: number) => void;
  logout: () => void;
  updateBasketId: (newBasketId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [basketId, setBasketId] = useState<number | null>(null);

  const login = (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setBasketId(null);
  };

  const updateBasketId = (newBasketId: number) => {
    setBasketId(newBasketId);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, basketId, login, logout, updateBasketId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
