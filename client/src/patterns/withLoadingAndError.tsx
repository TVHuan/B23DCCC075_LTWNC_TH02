import React, { ComponentType } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface WithLoadingAndErrorProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

/**
 * Higher-Order Component (HOC) Pattern
 * Wraps any component with an accessible skeleton loading state and error handling with retry.
 */
export function withLoadingAndError<P extends object>(
  WrappedComponent: ComponentType<P>
): React.FC<P & WithLoadingAndErrorProps> {
  return function WithLoadingAndErrorComponent({
    loading,
    error,
    onRetry,
    ...props
  }: WithLoadingAndErrorProps & P) {
    if (loading) {
      return (
        <div className="space-y-3 py-4 w-full" aria-busy="true" aria-live="polite">
          <div className="h-20 bg-slate-200/80 rounded-xl animate-pulse" />
          <div className="h-20 bg-slate-200/80 rounded-xl animate-pulse" />
          <div className="h-20 bg-slate-200/80 rounded-xl animate-pulse" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-5 my-4 text-center">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <p className="font-medium text-sm mb-1">{error}</p>
          <p className="text-xs text-rose-600 mb-3">Không thể tải dữ liệu từ máy chủ.</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Thử lại
            </button>
          )}
        </div>
      );
    }

    return <WrappedComponent {...(props as P)} />;
  };
}
