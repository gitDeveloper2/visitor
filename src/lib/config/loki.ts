// import { LogLevel } from "@/utils/logger/customLogger";

import { LogLevel } from "../../utils/logger/customLogger";

// Replace these with your actual Grafana Cloud Loki details
const GRAFANA_CLOUD_LOKI_ENDPOINT = process.env.GRAFANA_CLOUD_LOKI_ENDPOINT as string;
const GRAFANA_CLOUD_USERNAME = process.env.GRAFANA_CLOUD_LOKI_USERNAME as string;  // Your Grafana Cloud User ID
const GRAFANA_CLOUD_API_KEY = process.env.GRAFANA_CLOUD_LOKI_PASSWORD as string; // Your Grafana Cloud API key (Password)
const environment=process.env.ENVIRONMENT as string||"production"
const appName=process.env.APPNAME as string || "basicutils.com"
interface LokiLog {
  level: LogLevel;
  message: string;
  detail:{[key:string]:any},
  traceId:string|undefined,
  spanId:string|undefined,
  timestamp:string
}

let logBuffer:LokiLog[]=[]
const MAX_BUFFER_SIZE=parseInt(process.env.MAX_BUFFER_SIZE as string||'50',10)
const SEND_INTERVAL_MS=parseInt(process.env.SEND_INTERVAL_MS as string || '3600000',10)




export const sendLogToLoki = async (log: LokiLog) => {
  logBuffer.push(log)
  if(logBuffer.length>=MAX_BUFFER_SIZE){
// sendBufferToLoki()
  }
  // Generate a timestamp in nanoseconds
}


const sendBufferToLoki=async ()=>{
  if(logBuffer.length===0) return
    const payload = {
    streams: [
      {
        stream: {
          app: appName,  // Label to identify the source of logs
          environment:environment
        
        },
        values: logBuffer.map(log=>[log.timestamp,  JSON.stringify({
          level: LogLevel[log.level],
          message: log.message,
          traceid:log.traceId,
          spanid:log.spanId,
          detail: log.detail
        })]) 
      },
    ],
  };

  try {
    const res = await fetch(GRAFANA_CLOUD_LOKI_ENDPOINT as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${GRAFANA_CLOUD_USERNAME}:${GRAFANA_CLOUD_API_KEY}`).toString("base64")}`,  // Basic Auth
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      
      logBuffer=[]
    } else {
      console.error("Failed to send log to Loki:", res.status, res.statusText, await res.text());
    }
  } catch (error) {
    console.error("Error sending log to Loki:", error);
  }

}

setInterval(sendBufferToLoki,SEND_INTERVAL_MS)

