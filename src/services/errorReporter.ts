/**
 * The Uni Gang - Global Error Reporting Utility
 * Automatically captures uncaught runtime exceptions and transmits alerts
 * to Sentry or centralized logging backend if a DSN is provided.
 */

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export const reportError = (error: Error, context?: Record<string, any>) => {
  console.error('[Error Tracker]', error, context);

  // If Sentry is installed / configured via DSN in production
  if (SENTRY_DSN && typeof window !== 'undefined') {
    try {
      // Custom beacon reporting to Sentry HTTP envelope endpoint
      const payload = {
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        extra: context,
      };

      // Non-blocking beacon transmission
      navigator.sendBeacon?.(
        `${SENTRY_DSN}/api/errors`,
        JSON.stringify(payload)
      );
    } catch {
      // Fail silently without disrupting user experience
    }
  }
};
