import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material'

interface ApiKeyInputProps {
  open: boolean
  onClose: () => void
  onSubmit: (apiKey: string) => void
  error?: string | null
  isValidating?: boolean
}

export default function ApiKeyInput({ 
  open, 
  onClose, 
  onSubmit, 
  error,
  isValidating = false 
}: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      onSubmit(apiKey.trim())
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Enter OpenRouter API Key</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="API Key"
            type="password"
            fullWidth
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            disabled={isValidating}
            helperText={
              <span>
                Visit{' '}
                <Link href="https://openrouter.ai/keys" target="_blank" rel="noopener">
                  openrouter.ai
                </Link>
                {' '}to get your API key
              </span>
            }
          />
        </DialogContent>
        <DialogActions>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={!apiKey.trim() || isValidating}
            startIcon={isValidating ? <CircularProgress size={20} /> : null}
            fullWidth
          >
            {isValidating ? 'Validating...' : 'Submit'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
} 