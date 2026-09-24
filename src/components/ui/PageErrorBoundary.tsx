import { Component, ErrorInfo, ReactNode } from 'react';
import { LuRefreshCw, LuTriangleAlert, LuHouse } from 'react-icons/lu';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class PageErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Page render error caught by PageErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const isChunkError =
        this.state.error?.message?.includes('dynamically imported module') ||
        this.state.error?.message?.includes('Failed to fetch') ||
        this.state.error?.name === 'ChunkLoadError';

      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <LuTriangleAlert className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              {isChunkError ? 'Page Update Available' : 'Something went wrong'}
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {isChunkError
                ? 'A new version or component update was applied. Please refresh to load the latest version.'
                : (this.state.error?.message || 'An unexpected error occurred while loading this page.')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer border-none"
              >
                <LuRefreshCw className="w-4 h-4" />
                Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer border-none"
              >
                <LuHouse className="w-4 h-4" />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
