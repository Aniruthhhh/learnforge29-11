import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserProfile {
  name: string;
  email: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  score: number;
  streak: number;
  joinedWeeksAgo: number;
}

interface AppState {
  isOnboarded: boolean;
  isLoggedIn: boolean;
  user: UserProfile;
  setIsOnboarded: (v: boolean) => void;
  setIsLoggedIn: (v: boolean) => void;
  setUser: (u: UserProfile) => void;
  login: (name: string, email: string) => void;
  logout: () => void;
  completeOnboarding: (level: 'Beginner' | 'Intermediate' | 'Advanced', score: number) => void;
}

const defaultUser: UserProfile = {
  name: 'Alex Chen',
  email: 'alex@example.com',
  level: 'Intermediate',
  score: 68,
  streak: 12,
  joinedWeeksAgo: 8,
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile>(defaultUser);

  const login = (name: string, email: string) => {
    setUser(prev => ({ ...prev, name, email }));
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsOnboarded(false);
  };

  const completeOnboarding = (level: 'Beginner' | 'Intermediate' | 'Advanced', score: number) => {
    setUser(prev => ({ ...prev, level, score }));
    setIsOnboarded(true);
  };

  return (
    <AppContext.Provider value={{ isOnboarded, isLoggedIn, user, setIsOnboarded, setIsLoggedIn, setUser, login, logout, completeOnboarding }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
