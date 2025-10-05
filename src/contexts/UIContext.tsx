'use client'

import React, { createContext, useContext, useReducer, ReactNode, useMemo, useCallback } from 'react';

// Types
interface UIState {
  loading: Map<string, boolean>;
  errors: Map<string, string>;
  success: Map<string, string>;
  progress: Map<string, number>;
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
  loading: new Map(),
  errors: new Map(),
  success: new Map(),
  progress: new Map(),
};

// Reducer
function uiReducer(state: UIState, action: UIAction): UIState {
  const { key } = action as { key: string };
  
  switch (action.type) {
    case 'SET_LOADING': {
      const newLoading = new Map(state.loading);
      const newErrors = new Map(state.errors);
      newLoading.set(key, (action as any).loading);
      newErrors.set(key, '');
      return { ...state, loading: newLoading, errors: newErrors };
    }
    case 'SET_ERROR': {
      const newErrors = new Map(state.errors);
      const newLoading = new Map(state.loading);
      const newSuccess = new Map(state.success);
      newErrors.set(key, (action as any).error);
      newLoading.set(key, false);
      newSuccess.set(key, '');
      return { ...state, errors: newErrors, loading: newLoading, success: newSuccess };
    }
    case 'SET_SUCCESS': {
      const newSuccess = new Map(state.success);
      const newLoading = new Map(state.loading);
      const newErrors = new Map(state.errors);
      newSuccess.set(key, (action as any).message);
      newLoading.set(key, false);
      newErrors.set(key, '');
      return { ...state, success: newSuccess, loading: newLoading, errors: newErrors };
    }
    case 'SET_PROGRESS': {
      const newProgress = new Map(state.progress);
      newProgress.set(key, (action as any).progress);
      return { ...state, progress: newProgress };
    }
    case 'CLEAR_STATE': {
      const newLoading = new Map(state.loading);
      const newErrors = new Map(state.errors);
      const newSuccess = new Map(state.success);
      const newProgress = new Map(state.progress);
      newLoading.set(key, false);
      newErrors.set(key, '');
      newSuccess.set(key, '');
      newProgress.set(key, 0);
      return { ...state, loading: newLoading, errors: newErrors, success: newSuccess, progress: newProgress };
    }
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
    Boolean(state.loading.get(key)), [state.loading]);
  
  const getError = useCallback((key: string) => 
    state.errors.get(key) || null, [state.errors]);
  
  const getSuccess = useCallback((key: string) => 
    state.success.get(key) || null, [state.success]);
  
  const getProgress = useCallback((key: string) => 
    state.progress.get(key) || 0, [state.progress]);

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