import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { isAdmin } from '../utils/roleChecks'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Epicode
        </Typography>
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAdmin(user) && (
              <Button 
                color="inherit" 
                component={Link} 
                to="/admin/courses"
              >
                Manage Courses
              </Button>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1">
                {user?.email}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
