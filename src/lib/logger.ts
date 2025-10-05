/**
 * Structured logging utility for the application
 * Provides different log levels and structured output
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private level: LogLevel;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (level > this.level) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      message,
    };

    if (context) {
      entry.context = context;
    }

    if (error) {
      try {
        entry.error = {
          name: error.name?.substring(0, 100) || 'Error',
          message: error.message?.substring(0, 500) || 'Unknown error',
          stack: error.stack?.substring(0, 1000),
        };
      } catch (e) {
        entry.error = {
          name: 'Error',
          message: 'Failed to serialize error',
          stack: undefined,
        };
      }
    }

    // In production, you might want to send logs to a service like CloudWatch
    if (process.env.NODE_ENV === 'production') {
      const logStr = JSON.stringify(entry);
      console.log(logStr.length > 1000 ? logStr.substring(0, 1000) + '...' : logStr);
    } else {
      // Pretty print for development
      console.log(`[${entry.timestamp}] ${entry.level}: ${entry.message}`);
      if (entry.context) {
        const contextStr = JSON.stringify(entry.context);
        console.log('Context:', contextStr.length > 500 ? contextStr.substring(0, 500) + '...' : entry.context);
      }
      if (entry.error) {
        console.error('Error:', entry.error);
      }
    }
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    // Sanitize message to prevent log injection
    const sanitizedMessage = message.replace(/[\r\n]/g, ' ').substring(0, 500);
    this.log(LogLevel.ERROR, sanitizedMessage, context, error);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }
}

// Global logger instance
export const logger = new Logger(
  process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
);