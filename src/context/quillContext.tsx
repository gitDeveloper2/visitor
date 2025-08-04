
import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode, RefObject } from "react";

// types.ts
export interface QuillContextType {
  registerField: <K extends keyof SharedData>(key: K, value: SharedData[K]) => void;
  get: () => SharedData;
}
  
  export interface SharedData {
   
  }
  




const QuillContext = createContext<QuillContextType | null>(null);

export const QuillProvider = ({ children }: { children: ReactNode }) => {
  const [store, setStore] = useState<SharedData>({});

  const registerField = useCallback(
    <K extends keyof SharedData>(key: K, value: SharedData[K]) => {
      setStore((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const get = useCallback(() => store, [store]);

  return (
    <QuillContext.Provider value={{ registerField, get }}>
      {children}
    </QuillContext.Provider>
  );
};

export const useQuillContext = () => {
  const context = useContext(QuillContext);
  if (!context) {
    throw new Error("useQuillContext must be used within a QuillProvider");
  }
  return context;
};
