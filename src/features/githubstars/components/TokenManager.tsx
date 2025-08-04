"use client"

import { useState, useEffect, useRef } from "react"
import {
  TextField,
  Alert,
  Stack,
  Typography,
  Button,
  IconButton,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import { useEncryptedGitHubToken } from "../hooks/useEncryptedGitHubToken"
import { useToken } from "@/features/shared/context/TokenContext"

// Validate GitHub Token pattern
const isValidGitHubToken = (token: string): boolean =>
  /^ghp_[a-zA-Z0-9]{36}$/.test(token)

export default function TokenManager({contentReady}:{contentReady:boolean}) {
  const { token, setToken } = useToken();
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement | null>(null) // Create a ref for the input field
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Sync inputValue with stored token when not editing
  useEffect(() => {
    if (!isEditing) {
      setInputValue(token ?? "")
    } else {
      // Focus the input field when editing mode starts
      inputRef.current?.focus()
    }
  }, [token, isEditing])

const hasValidToken = token && isValidGitHubToken(token)
  const tokenInvalid = inputValue && !isValidGitHubToken(inputValue)

  // Mask token for display
  const maskToken = (token: string) =>
    token.length > 10 ? `${token.slice(0, 6)}••••••${token.slice(-4)}` : ""

  // Handle save action
  const handleSave = async () => {
    if (isValidGitHubToken(inputValue)) {
      await setToken(inputValue)  // Store the encrypted token asynchronously
      setIsEditing(false)
    }
  }

  // Handle clear action
  const handleClear = () => {
    localStorage.removeItem("github_token")
    setInputValue("")
    setIsEditing(false)
    setToken("") // reset internal state
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false)
      }
    }
  
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside)
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditing])
  

  return (
    <>
    <div ref={containerRef}>

      {isEditing ? (
        <TextField
          size="small"
          label="GitHub Token"
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.trimStart())}
          type="password"
          inputRef={inputRef} // Attach the ref to the input field
          InputProps={{
            endAdornment: (
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton
                  onClick={() => {
                    setInputValue(token ?? "")
                    setIsEditing(false)
                  }}
                  size="small"
                  title="Revert"
                >
                  <RestartAltIcon fontSize="small" />
                </IconButton>
                <Button
                  onClick={handleSave}
                  size="small"
                  variant="contained"
                  disabled={Boolean(!inputValue || tokenInvalid)}
                >
                  Save
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  size="small"
                  variant="text"
                >
                  Close
                </Button>
              </Stack>
            ),
          }}
        />
      ) : (
        <div onClick={() => setIsEditing(true)} style={{ cursor: "pointer" }}>
        <TextField
          size="small"
          label="GitHub Token (optional)"
          fullWidth
          value={token && hasValidToken ? maskToken(token) : ""}
          type="text"
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton onClick={() => setIsEditing(true)} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            ),
          }}
        />
      </div>
      
      )}

      {isEditing && tokenInvalid && (
        <Alert severity="error" sx={{ mt: 1 }}>
          This doesn&apos;t look like a valid GitHub token. Make sure it starts with <code>ghp_</code> and is 40 characters long.
        </Alert>
      )}

      {(!token || !hasValidToken)&& contentReady ? (
        <Alert severity="info" sx={{ fontSize:"0.85rem" }}>
          Using this tool without a token may quickly hit GitHub&rsquo;s 60 requests/hour limit.<br />
          <strong>No scopes are required.</strong><br/>
          <Button
            size="small"
            sx={{ mt: 1 }}
            onClick={() => window.open("https://github.com/settings/tokens", "_blank")}
          >
            Create Token
          </Button>
        </Alert>
      ) : (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: {md:2,xs:0} }}>
          <Button onClick={handleClear} size="small" variant="outlined">
            Clear Token
          </Button>
          <Typography color="success.main"> Token saved.</Typography>
        </Stack>
      )}
      </div>
    </>
  )
}
