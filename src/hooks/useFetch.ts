//import { useState, useEffect, useCallback } from 'react';
import { useState, useCallback } from 'react';


import { useRefetchStore } from '@/store/useRefetchStore';

interface UseFetchOptions {
  enabled?: boolean;  // ✅ Condition-based fetching
  dependencies?: any[];
  initialData?: any;  // ✅ Store se aane wala data
}

export default function useFetch<T>(
  fetchFunction: () => Promise<T>,
  key: string,
  options: UseFetchOptions = {}
) {
  const [data, setData] = useState<T | null>(options.initialData || null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!options.initialData);

  const trigger = useRefetchStore((state) => state.triggers[key] || 0);
  const dependencies = options.dependencies ?? [];

  const fetchData = useCallback(async () => {
    if (options.enabled === false || !key || key?.trim() === '') {
      console.warn(`⚠️ Fetch skipped due to invalid or missing key: '${key}'`);
      setIsLoading(false);
      return { data: null, error: 'Invalid key provided', isLoading: false };
    }

    console.log(`🔁 Fetching data for key: ${key}, Trigger: ${trigger}`);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchFunction();
      setData(response);
      return { data: response, error: null, isLoading: false };
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      return { data: null, error: err.message || 'Something went wrong', isLoading: false };
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, key, trigger, options.enabled, ...dependencies]);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  return { data, error, isLoading, refetch: fetchData };
}
