// import winston from "winston";
// import { LoggingWinston } from "@google-cloud/logging-winston";
// import { isSelectiveAction } from "../selective";
// // import LokiTransport from 'winston-loki';
// import {  sendLogToLoki } from "@/lib/config/loki";
// import { generateTimestamp } from "../generators/dateTime";
// import { info } from "console";
// // utils/logger.ts
// export enum LogLevel {
//   INFO = "info",
//   ERROR = "error",
//   DEBUG = "debug",
//   WARN="warn"
// }



// const loggingWinston = new LoggingWinston();

// const log = winston.createLogger({
//   level: process.env.ENVIRONMENT === "production" ? "info" : "debug",
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json(),
//     winston.format.colorize()
//   ),
//   // transports: [new winston.transports.Console(),  new LokiTransport({
//   //   host: 'https://logs-prod-006.grafana.net/loki/api/v1/push',  // Loki URL
//   //   basicAuth: "998819:glc_eyJvIjoiMTIyNTAwMyIsIm4iOiJzdGFjay0xMDQxMDM4LWhsLXdyaXRlLXNkZmxzZGYiLCJrIjoicFg5Z2Y2SXU3OXIxbXBEQTVGcDUxczA1IiwibSI6eyJyIjoicHJvZC11cy1lYXN0LTAifX0=",
//   //   labels: { app: 'jobportal.co.ke' }, 
//   //   replaceTimestamp: true,
//   // }),],
// });
// if (process.env.ENVIRONMENT === "production") log.add(loggingWinston);

// export function shouldLog(): boolean {
//   return isSelectiveAction();
// }




// export const logger = 
// (
//  ()=>{
//   const log =(

//     message: string,
//     detail: { [key: string]: any } = {}, // Default to an empty object
//     level?: LogLevel, // Optional parameter
//   ) =>{
//   // Set default value for level if not provided
//   const logLevel = level ?? LogLevel.DEBUG; // Use nullish coalescing to assign default value

//   // Construct the detail string
//   const detailString = Object.entries(detail)
//       .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
//       .join(', ');

//   console.log(`[${logLevel.toUpperCase()}] ${message} ${detailString}`); // Log all details
  
//   if (shouldLog()) {
//       sendLogToLoki({ level: logLevel, message, timestamp: generateTimestamp(), detail });
//   }
// }
//   return{
// info:(message: string, detail?: { [key: string]: any }) =>{
//  log(message,detail,LogLevel.INFO) 
// },
// error:(message: string, detail?: { [key: string]: any }) =>{
//   log(message,detail,LogLevel.ERROR) 
//  },
//  debug:(message: string, detail?: { [key: string]: any }) =>{
//   log(message,detail,LogLevel.DEBUG) 
//  },
//  warn:(message: string, detail?: { [key: string]: any }) =>{
//   log(message,detail,LogLevel.WARN) 
//  }
// }}
// )()
// ;

// export default logger;
