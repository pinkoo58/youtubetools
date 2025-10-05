'use client'

import React, { useEffect, useState } from 'react';
import { useUI } from '@/contexts/UIContext';
import { useIsClient } from '@/hooks/useIsClient';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = 'fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4 transition-all duration-300 transform';
    const visibilityStyles = isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0';
    
    const typeStyles = {
      success: 'border-green-500',
      error: 'border-red-500',
      info: 'border-blue-500'
    };
    
    const borderStyle = typeStyles[type] || 'border-gray-500';
    
    return `${baseStyles} ${borderStyle} ${visibilityStyles}`;
  };

  const getIcon = () => {
    const iconProps = {
      className: "w-5 h-5",
      fill: "currentColor",
      viewBox: "0 0 20 20"
    };
    
    const icons = {
      success: (
        <svg {...iconProps} className="w-5 h-5 text-green-500">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      error: (
        <svg {...iconProps} className="w-5 h-5 text-red-500">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      info: (
        <svg {...iconProps} className="w-5 h-5 text-blue-500">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    };
    
    return icons[type] || icons.info;
  };

  return (
    <div className={getToastStyles()} role="alert" aria-live="polite" suppressHydrationWarning>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const { state } = useUI();
  const isClient = useIsClient();
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([]);

  useEffect(() => {
    if (!isClient) return;
    
    const newToasts: Array<{ id: string; message: string; type: 'success' | 'error' }> = [];

    // Process errors and success messages more efficiently
    for (const [key, message] of Object.entries(state.errors)) {
      if (message) {
        newToasts.push({ id: `error-${key}`, message, type: 'error' });
      }
    }

    for (const [key, message] of Object.entries(state.success)) {
      if (message) {
        newToasts.push({ id: `success-${key}`, message, type: 'success' });
      }
    }

    setToasts(newToasts);
  }, [state.errors, state.success, isClient]);

  const removeToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2" suppressHydrationWarning>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ top: `${index * 80}px` }} suppressHydrationWarning>
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}