import { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
  Alert
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { useCourses } from '../hooks/useCourses'

interface Course {
  id: string
  name: string
  description: string
  organization: {
    name: string
  }
}

function Courses() {
  const { user } = useAuth()
  const { data: courses, isLoading, error } = useCourses()

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading courses: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Courses
      </Typography>
      <Grid container spacing={3}>
        {courses?.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Organization: {course.organization?.name}
                </Typography>
                <Typography variant="body2" paragraph>
                  {course.description}
                </Typography>
                {user?.role?.name === 'admin' && (
                  <Button variant="contained" color="primary" fullWidth>
                    Manage Enrollment
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Courses
