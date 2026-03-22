import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | undefined;
  errorInfo: ErrorInfo | undefined;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Store error info in state for display
    this.setState({ errorInfo });

    // In production, you could send to error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center" dir="rtl">
          <div className="p-4 rounded-2xl bg-destructive/10 mb-4">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h3 className="font-bold text-xl mb-2">حدث خطأ غير متوقع</h3>
          <p className="text-sm text-muted-foreground mb-2 max-w-md">
            {this.state.error?.message || 'يرجى المحاولة مرة أخرى'}
          </p>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="mt-4 mb-4 max-w-2xl text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                تفاصيل الخطأ (للمطورين)
              </summary>
              <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-60 text-left" dir="ltr">
                {this.state.error?.stack}
                {'\n\nComponent Stack:'}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <div className="flex gap-3 mt-4">
            <Button
              onClick={this.handleRetry}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" /> إعادة المحاولة
            </Button>
            <Button
              onClick={this.handleGoHome}
              variant="secondary"
              className="gap-2"
            >
              <Home className="w-4 h-4" /> الصفحة الرئيسية
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
