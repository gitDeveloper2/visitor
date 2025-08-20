import { Types } from "mongoose";

export function stringifyID<T extends {_id:Types.ObjectId;}>(document:T):T&{_id:string}{
    return {...document,_id:document._id.toString()}
    }

    export function deepSerialize(obj: any): any {
        if (Array.isArray(obj)) return obj.map(deepSerialize);
      
        if (obj && typeof obj === 'object') {
          const result: Record<string, any> = {};
          for (const [key, value] of Object.entries(obj)) {
            if (value instanceof Date) {
              result[key] = value.toISOString();
            } else if (
              key === '_id' &&
              value &&
              typeof value === 'object' &&
              typeof value.toString === 'function'
            ) {
              result[key] = value.toString();
            } else {
              result[key] = deepSerialize(value);
            }
          }
          return result;
        }
      
        return obj;
      }
      
      