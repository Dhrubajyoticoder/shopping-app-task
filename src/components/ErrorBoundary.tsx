import React, { Component, ReactNode } from 'react';

// Define the props interface for ErrorBoundary
interface ErrorBoundaryProps {
  children: ReactNode; // React children components
}

// Define the state interface to track errors
interface ErrorBoundaryState {
  hasError: boolean; // Indicates if an error has occurred
  error: Error | null; // Stores the error object if an error occurs
}

/**
 * ErrorBoundary component to catch JavaScript errors in child components.
 * It prevents the entire app from crashing by displaying a fallback UI.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Lifecycle method that updates state when an error is thrown in child components.
   * @param error - The error object that was thrown
   */
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  /**
   * Lifecycle method that logs the error details to the console.
   * It can be extended to log errors to an external monitoring service.
   * @param error - The error object
   * @param errorInfo - Additional error details
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught in boundary:', error, errorInfo);
    // You can send error logs to an external service here
  }

  /**
   * Renders either the child components or an error fallback UI.
   */
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center text-red-600">
          <h2 className="text-lg font-bold">Something went wrong!</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children; // Render child components if no error
  }
}

export default ErrorBoundary;
