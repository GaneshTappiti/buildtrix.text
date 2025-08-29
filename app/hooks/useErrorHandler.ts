import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ErrorState {
  hasError: boolean;
  error?: Error;
  message?: string;
  code?: string;
}

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorState>({ hasError: false });
  const { toast } = useToast();

  const handleError = useCallback((error: unknown, customMessage?: string) => {
    console.error('Error handled:', error);

    let errorMessage = customMessage || 'An unexpected error occurred';
    let errorCode: string | undefined;

    if (error instanceof Error) {
      errorMessage = customMessage || error.message;
      errorCode = (error as any).code;
    } else if (typeof error === 'string') {
      errorMessage = customMessage || error;
    }

    const newErrorState: ErrorState = {
      hasError: true,
      error: error instanceof Error ? error : new Error(String(error)),
      message: errorMessage,
      code: errorCode
    };

    setErrorState(newErrorState);

    // Show toast notification
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive'
    });

    return newErrorState;
  }, [toast]);

  const clearError = useCallback(() => {
    setErrorState({ hasError: false });
  }, []);

  const withErrorHandling = useCallback(
    <T extends any[], R>(
      fn: (...args: T) => Promise<R>,
      customMessage?: string
    ) => {
      return async (...args: T): Promise<R | null> => {
        try {
          clearError();
          return await fn(...args);
        } catch (error) {
          handleError(error, customMessage);
          return null;
        }
      };
    },
    [handleError, clearError]
  );

  const withSyncErrorHandling = useCallback(
    <T extends any[], R>(
      fn: (...args: T) => R,
      customMessage?: string
    ) => {
      return (...args: T): R | null => {
        try {
          clearError();
          return fn(...args);
        } catch (error) {
          handleError(error, customMessage);
          return null;
        }
      };
    },
    [handleError, clearError]
  );

  return {
    errorState,
    handleError,
    clearError,
    withErrorHandling,
    withSyncErrorHandling
  };
};
