import React, { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import {
  Container,
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { isAdmin } from '../utils/roleChecks'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login, isLoading, error, isAuthenticated, user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
  
    } catch (err) {
      console.error({error: err})
    }
  }
  
  if (!isLoading && isAuthenticated) {
    return <Navigate to={isAdmin(user) ? '/admin/courses' : '/courses'} replace />
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                required
                autoFocus
              />
            </FormControl>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                required
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login
