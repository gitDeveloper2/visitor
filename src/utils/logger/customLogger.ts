

// import { context, trace } from '@opentelemetry/api';
import { isSelectiveAction, makeSelective } from "../selective";
import { generateTimestamp } from '../generators/dateTime';
import { sendLogToLoki } from '../../lib/config/loki';


export function shouldLog(): boolean {
  return isSelectiveAction();
}

// Enum for Log Levels with Numeric Values
export enum LogLevel {
  ERROR = 0, // Lowest
  WARN = 1,
  INFO = 2,
  DEBUG = 3, // Highest
}


// Function to get the default log level from environment variable
const getDefaultLogLevel = (): LogLevel => {
  const logLevel = process.env.LOG_LEVEL?.toUpperCase(); // Get env var and convert to uppercase

  // Map string to LogLevel enum
  switch (logLevel) {
    case 'ERROR':
      return LogLevel.ERROR;
    case 'WARN':
      return LogLevel.WARN;
    case 'INFO':
      return LogLevel.INFO;
    case 'DEBUG':
      return LogLevel.DEBUG;
    default:
      return LogLevel.DEBUG; // Default to DEBUG if undefined or invalid
  }
};

const defaultLogLevel = getDefaultLogLevel();

export const logger = {
  log: (
    message: string,
   
    detail: Record<string, any> = {},
    level: LogLevel = LogLevel.DEBUG
  ) => {
    let traceId:string|undefined
    let spanId: string|undefined

    // const span = trace.getSpan(context.active());
    // if (span) {
    //   traceId = span.spanContext().traceId; // Get the trace ID
    // spanId = span.spanContext().spanId; // Get the span ID
  
    // } 
    // Check if the log level is allowed based on the default level
   
    if (level <= defaultLogLevel) {
      const detailString = Object.entries(detail)

        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(", ");

      console.log(`[${LogLevel[level]}] ${message} ${detailString}`); // Log to console

      // if (shouldLog()) { 
        // sendLogToLoki({
        //   level: level,
        //   message,
        //   timestamp: generateTimestamp(),
        //   traceId:traceId??undefined,
        //   spanId:spanId??undefined,
        //   detail,
        // });
      // }
    }
  },

  info: (message: string, detail?: Record<string, any>) =>
    logger.log(message, detail, LogLevel.INFO),
  error: (message: string, detail?: Record<string, any>) =>
    logger.log(message, detail, LogLevel.ERROR),
  debug: (message: string, detail?: Record<string, any>) =>
    logger.log(message, detail, LogLevel.DEBUG),
  warn: (message: string, detail?: Record<string, any>) =>
    logger.log(message, detail, LogLevel.WARN),
};

export const selectiveLogger = {
  info: makeSelective(logger.info),
  error: makeSelective(logger.error),
  debug: makeSelective(logger.debug),
  warn: makeSelective(logger.warn),
};
export default logger;
