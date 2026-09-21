import { useState, useEffect } from 'react';
import { getMeta } from '../api/services';
import { useQuery } from '@tanstack/react-query';

export const useObjects = () => {
  const { data: meta, isLoading, error } = useQuery({
    queryKey: ['meta'],
    queryFn: getMeta,
  });

  const objects = meta?.data?.locations || [];
  
  return {
    objects,
    isLoading,
    error,
  };
};
