import { createContext, useContext } from 'react';
import { useObject } from '../hooks/useObject';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const objectState = useObject();

  return (
    <AppContext.Provider value={objectState}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export default AppContext;
