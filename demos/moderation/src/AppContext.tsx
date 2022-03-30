import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type CurrentTimeProps = {
  currentTime: number;
  setCurrentTime: (ms: number) => void;
};

type ProviderProps = {
  children: ReactNode;
};

export const AppContext = createContext<CurrentTimeProps | undefined>(undefined);

export const AppContextProvider = ({ children }: ProviderProps) => {
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    if (currentTime) setCurrentTime(currentTime);
  }, [currentTime]);

  return (
    <AppContext.Provider value={{ currentTime, setCurrentTime }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used inside AppContext');
  }
  return context;
};
