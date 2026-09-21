import { createContext, useContext, useState } from 'react';

const ObjectContext = createContext(null);

export function ObjectProvider({ children }) {
  const [selectedObject, setSelectedObject] = useState(() => {
    return localStorage.getItem('selectedObject') || 'MS-01';
  });

  const changeObject = (objectId) => {
    setSelectedObject(objectId);
    localStorage.setItem('selectedObject', objectId);
  };

  return (
    <ObjectContext.Provider value={{ selectedObject, changeObject }}>
      {children}
    </ObjectContext.Provider>
  );
}

export function useObject() {
  const context = useContext(ObjectContext);
  if (!context) {
    throw new Error('useObject must be used within an ObjectProvider');
  }
  return context;
}

export default ObjectProvider;
