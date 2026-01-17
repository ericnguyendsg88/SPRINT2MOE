import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccountHolders } from '@/hooks/useAccountHolders';

interface CurrentUserContextType {
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  isInitialized: boolean;
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: accountHolders = [] } = useAccountHolders();

  // Set the first account holder as the default user once data loads
  useEffect(() => {
    if (!isInitialized && accountHolders.length > 0) {
      // Check if currentUserId is still the default empty string or doesn't exist in account holders
      const userExists = accountHolders.some(a => a.id === currentUserId);
      if (!userExists) {
        setCurrentUserId(accountHolders[0].id);
      }
      setIsInitialized(true);
    }
  }, [accountHolders, currentUserId, isInitialized]);

  return (
    <CurrentUserContext.Provider value={{ currentUserId, setCurrentUserId, isInitialized }}>
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
