import { useState, useCallback } from 'react';

export interface LoadingState {
  [key: string]: boolean;
}

export const useLoadingState = (initialState: LoadingState = {}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>(initialState);

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingState(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const startLoading = useCallback((key: string) => {
    setLoading(key, true);
  }, [setLoading]);

  const stopLoading = useCallback((key: string) => {
    setLoading(key, false);
  }, [setLoading]);

  const isLoading = useCallback((key: string) => {
    return loadingState[key] || false;
  }, [loadingState]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingState).some(loading => loading);
  }, [loadingState]);

  const withLoading = useCallback(
    <T extends any[], R>(
      key: string,
      fn: (...args: T) => Promise<R>
    ) => {
      return async (...args: T): Promise<R> => {
        startLoading(key);
        try {
          const result = await fn(...args);
          return result;
        } finally {
          stopLoading(key);
        }
      };
    },
    [startLoading, stopLoading]
  );

  const withSyncLoading = useCallback(
    <T extends any[], R>(
      key: string,
      fn: (...args: T) => R
    ) => {
      return (...args: T): R => {
        startLoading(key);
        try {
          const result = fn(...args);
          return result;
        } finally {
          stopLoading(key);
        }
      };
    },
    [startLoading, stopLoading]
  );

  const resetLoading = useCallback(() => {
    setLoadingState({});
  }, []);

  return {
    loadingState,
    setLoading,
    startLoading,
    stopLoading,
    isLoading,
    isAnyLoading,
    withLoading,
    withSyncLoading,
    resetLoading
  };
};
