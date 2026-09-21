import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMeta } from '../api/services';

export const useObject = () => {
  // Получаем сохраненный объект или используем первый по умолчанию
  const [selectedObject, setSelectedObject] = useState(() => {
    return localStorage.getItem('selectedObject') || null;
  });

  // Загружаем метаданные объектов
  const { data: meta, isLoading, error } = useQuery({
    queryKey: ['meta'],
    queryFn: getMeta,
    staleTime: Infinity, // Мета данные не меняются
  });

  // Обновляем selectedObject если он не установлен и данные загрузились
  useEffect(() => {
    if (meta && !selectedObject && meta.locations?.length > 0) {
      const firstLocation = meta.locations[0].id;
      setSelectedObject(firstLocation);
      localStorage.setItem('selectedObject', firstLocation);
    }
  }, [meta, selectedObject]);

  const setObject = (locationId) => {
    setSelectedObject(locationId);
    localStorage.setItem('selectedObject', locationId);
  };

  return {
    selectedObject,
    setObject,
    locations: meta?.locations || [],
    isLoading,
    error,
  };
};

export default useObject;
