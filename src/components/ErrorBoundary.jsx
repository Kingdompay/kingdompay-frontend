import React from 'react';
import ErrorMessage from './ErrorMessage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    this.setState({
      error,
      errorInfo
    });

    // TODO: Log to error reporting service (e.g., Sentry) in production
    // if (import.meta.env.PROD) {
    //   logErrorToService(error, errorInfo);
    // }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-[#E5EBE3] dark:bg-[#0D1B0F] flex items-center justify-center p-4">
          <ErrorMessage
            message={this.props.message || 'Something went wrong. Please refresh the page or try again.'}
            onRetry={this.handleReset}
            showRetry={this.props.showRetry !== false}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
