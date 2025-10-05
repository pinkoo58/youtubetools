'use client'

import React, { createContext, useContext, useReducer, ReactNode, useMemo, useCallback } from 'react';

// Types
interface UIState {
  loading: Record<string, boolean>;
  errors: Record<string, string>;
  success: Record<string, string>;
  progress: Record<string, number>;
}

type UIAction =
  | { type: 'SET_LOADING'; key: string; loading: boolean }
  | { type: 'SET_ERROR'; key: string; error: string }
  | { type: 'SET_SUCCESS'; key: string; message: string }
  | { type: 'SET_PROGRESS'; key: string; progress: number }
  | { type: 'CLEAR_STATE'; key: string }
  | { type: 'CLEAR_ALL' };

interface UIContextType {
  state: UIState;
  setLoading: (key: string, loading: boolean) => void;
  setError: (key: string, error: string) => void;
  setSuccess: (key: string, message: string) => void;
  setProgress: (key: string, progress: number) => void;
  clearState: (key: string) => void;
  clearAll: () => void;
  isLoading: (key: string) => boolean;
  getError: (key: string) => string | null;
  getSuccess: (key: string) => string | null;
  getProgress: (key: string) => number;
}

// Initial state
const initialState: UIState = {
  loading: {},
  errors: {},
  success: {},
  progress: {},
};

// Reducer
function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.key]: action.loading },
        errors: { ...state.errors, [action.key]: '' }, // Clear error when loading starts
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.key]: action.error },
        loading: { ...state.loading, [action.key]: false },
        success: { ...state.success, [action.key]: '' },
      };
    case 'SET_SUCCESS':
      return {
        ...state,
        success: { ...state.success, [action.key]: action.message },
        loading: { ...state.loading, [action.key]: false },
        errors: { ...state.errors, [action.key]: '' },
      };
    case 'SET_PROGRESS':
      return {
        ...state,
        progress: { ...state.progress, [action.key]: action.progress },
      };
    case 'CLEAR_STATE':
      return {
        loading: { ...state.loading, [action.key]: false },
        errors: { ...state.errors, [action.key]: '' },
        success: { ...state.success, [action.key]: '' },
        progress: { ...state.progress, [action.key]: 0 },
      };
    case 'CLEAR_ALL':
      return initialState;
    default:
      return state;
  }
}

// Context
const UIContext = createContext<UIContextType | undefined>(undefined);

// Provider
export function UIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const setLoading = useCallback((key: string, loading: boolean) => 
    dispatch({ type: 'SET_LOADING', key, loading }), []);
  
  const setError = useCallback((key: string, error: string) => 
    dispatch({ type: 'SET_ERROR', key, error }), []);
  
  const setSuccess = useCallback((key: string, message: string) => 
    dispatch({ type: 'SET_SUCCESS', key, message }), []);
  
  const setProgress = useCallback((key: string, progress: number) => 
    dispatch({ type: 'SET_PROGRESS', key, progress }), []);
  
  const clearState = useCallback((key: string) => 
    dispatch({ type: 'CLEAR_STATE', key }), []);
  
  const clearAll = useCallback(() => 
    dispatch({ type: 'CLEAR_ALL' }), []);
  
  const isLoading = useCallback((key: string) => 
    Boolean(state.loading[key]), [state.loading]);
  
  const getError = useCallback((key: string) => 
    state.errors[key] || null, [state.errors]);
  
  const getSuccess = useCallback((key: string) => 
    state.success[key] || null, [state.success]);
  
  const getProgress = useCallback((key: string) => 
    state.progress[key] || 0, [state.progress]);

  const contextValue = useMemo((): UIContextType => ({
    state,
    setLoading,
    setError,
    setSuccess,
    setProgress,
    clearState,
    clearAll,
    isLoading,
    getError,
    getSuccess,
    getProgress,
  }), [state, setLoading, setError, setSuccess, setProgress, clearState, clearAll, isLoading, getError, getSuccess, getProgress]);

  return <UIContext.Provider value={contextValue}>{children}</UIContext.Provider>;
}

// Hook
export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}