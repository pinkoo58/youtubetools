import React from 'react';
import { Button, buttonVariants } from './button';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';

interface LoadingButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    children, 
    loading = false, 
    loadingText, 
    icon, 
    loadingIcon, 
    disabled, 
    className,
    variant,
    size,
    ...props 
  }, ref) => {
    const defaultLoadingIcon = (
      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const displayIcon = loading ? (loadingIcon || defaultLoadingIcon) : icon;
    const displayText = loading ? (loadingText || 'Loading...') : children;
    const isDisabled = disabled || loading;

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        variant={variant}
        size={size}
        className={cn(
          'relative transition-all duration-200',
          loading && 'cursor-not-allowed',
          className
        )}
        {...props}
      >
        <span className={cn(
          'flex items-center justify-center space-x-2',
          loading && 'opacity-90'
        )}>
          {displayIcon && (
            <span className="flex-shrink-0">
              {displayIcon}
            </span>
          )}
          <span>{displayText}</span>
        </span>
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };