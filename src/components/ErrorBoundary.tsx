import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 mb-2">⚠️ Something went wrong</div>
          <div className="text-gray-600 text-sm">
            {this.state.error?.message || 'An unexpected error occurred'}
          </div>
          <button 
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;