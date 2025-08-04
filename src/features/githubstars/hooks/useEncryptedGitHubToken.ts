"use client"
import { useEffect, useState } from "react"
import { decrypt, encrypt } from "../utils/encryptionutils"




export const useEncryptedGitHubToken = (): [string, (token: string) => Promise<void>] => {
  const [token, setToken] = useState("")

  useEffect(() => {
    const loadToken = async () => {
      const encrypted = localStorage.getItem("github_token")
      if (encrypted) {
        try {
          const decrypted = await decrypt(encrypted)
          setToken(decrypted)
        } catch (err) {
          console.error("Failed to decrypt token", err)
          localStorage.removeItem("github_token")
        }
      }
    }
    loadToken()
  }, [])

  const storeToken = async (plainText: string) => {
    const encrypted = await encrypt(plainText)
    localStorage.setItem("github_token", encrypted)
    setToken(plainText)
  }

  return [token, storeToken]
}
