import { useState, useEffect } from 'react';

export const useObjectSwitch = () => {
  const [selectedObject, setSelectedObject] = useState(
    localStorage.getItem('selectedObject') || 'MS-01'
  );

  useEffect(() => {
    localStorage.setItem('selectedObject', selectedObject);
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('objectChanged', { detail: selectedObject }));
  }, [selectedObject]);

  return { selectedObject, setSelectedObject };
};
