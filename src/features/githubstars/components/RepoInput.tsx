"use client"

import { useState } from "react"
import {
  TextField,
  Button,
  Box,
  Chip,
  Stack,
  Typography
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import CircularProgress from "@mui/material/CircularProgress"
import { Replay } from "@mui/icons-material"

interface Props {
  loading: boolean
  repos: string[]
  onAdd: (repo: string) => void
  onRemove: (repo: string) => void
  onSubmit: () => void
}


export default function RepoInput({ loading, repos, onAdd, onRemove,onSubmit }: Props) {
  const [input, setInput] = useState("")

  const handleAdd = () => {
    const trimmed = input.trim()
    if (!trimmed || repos.includes(trimmed)) return
    onAdd(trimmed)
    setInput("")
  }

  return (
    <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #ddd', }}>
      <Typography variant="subtitle2" gutterBottom>
        Add GitHub Repository
      </Typography>
      <Stack >
        <TextField
          size="small"
          label="GitHub Repo (e.g. https://github.com/vercel/next.js)"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {repos.map((repo) => (
            <Chip
              key={repo}
              label={repo}
              onDelete={() => onRemove(repo)}
              color="secondary"
              size="small"
              variant="outlined"
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
  <Button
    variant="contained"
    size="small"
    onClick={handleAdd}
    disabled={!input.trim() || loading}
    startIcon={
      loading ? (
        <CircularProgress size={16} color="inherit" />
      ) : (
        <AddIcon fontSize="small" />
      )
    }
  >
    {loading ? "Loading..." : "Add Repo"}
  </Button>

  {repos.length > 0 && (
    <Button
    variant="outlined"
    size="small"
    onClick={onSubmit}
    disabled={loading}
    startIcon={
      loading ? (
        <CircularProgress size={16} color="inherit" />
      ) : (
        <Replay fontSize="small" />
      )
    }
  >
    {loading ? "Loading..." : "Refetch All"}
  </Button>
  
  )}
</Stack>

      </Stack>
    </Box>
  )
}
