/**
 * Logging abstraction - suppresses console output in production builds.
 * Use this instead of console.log/warn/error for debug messages.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  debug: (...args) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },
  info: (...args) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  },
  warn: (...args) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },
  error: (...args) => {
    // Always log errors - they're important for debugging production issues
    // eslint-disable-next-line no-console
    console.error(...args);
  },
};
