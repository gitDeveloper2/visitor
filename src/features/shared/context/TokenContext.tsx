"use client";

import { decrypt, encrypt } from "@/features/githubstars/utils/encryptionutils";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface TokenContextType {
  token: string | null;
  status: "loading" | "ready";
  setToken: (newToken: string) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
};

interface TokenProviderProps {
  children: ReactNode;
}

export const TokenProvider = ({ children }: TokenProviderProps) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    const encrypted = localStorage.getItem("github_token_encrypted");
    if (encrypted) {
      decrypt(encrypted)
        .then(setTokenState)
        .catch(() => setTokenState(null))
        .finally(() => setStatus("ready"));
    } else {
      setStatus("ready");
    }
  }, []);

  const setToken = (newToken: string) => {
    setTokenState(newToken); // ✅ immediately available
    if (newToken) {
      encrypt(newToken).then((encrypted) => {
        localStorage.setItem("github_token_encrypted", encrypted);
      });
    } else {
      localStorage.removeItem("github_token_encrypted");
    }
  };
  

  return (
    <TokenContext.Provider value={{ token, status, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};
