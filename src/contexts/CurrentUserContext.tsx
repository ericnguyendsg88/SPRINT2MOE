import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CurrentUserContextType {
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string>('1');

  return (
    <CurrentUserContext.Provider value={{ currentUserId, setCurrentUserId }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
}
