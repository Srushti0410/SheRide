import { useState } from 'react';
import { ApiError } from '../utils/api-client';

export interface UseApiCallState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApiCall<T>() {
  const [state, setState] = useState<UseApiCallState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async (apiFunction: () => Promise<T>): Promise<T> => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'An unknown error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      throw err;
    }
  };

  const reset = () => {
    setState({ data: null, loading: false, error: null });
  };

  const setError = (error: string) => {
    setState((prev) => ({ ...prev, error }));
  };

  const setData = (data: T) => {
    setState((prev) => ({ ...prev, data }));
  };

  return {
    ...state,
    execute,
    reset,
    setError,
    setData,
  };
}
