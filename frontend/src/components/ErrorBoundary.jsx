import { Component } from "react";
import * as Sentry from "@sentry/react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { extra: errorInfo }); // ✅ sends to Sentry
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <button
            className="btn btn-primary"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
