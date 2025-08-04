const LOGGING_PROBABILITY = Number(process.env.LOGGING_PROBABILITY || 100);

export function isSelectiveAction(): boolean {
  return Math.random() < LOGGING_PROBABILITY / 100;
}

export const makeSelective = <T extends (...args: any[]) => any>(fn: T): T => {
  return ((...args: Parameters<T>): ReturnType<T> => {
    if (isSelectiveAction()) {
      return fn(...args); 
    }
  
    return undefined as ReturnType<T>;
  }) as T;
};
