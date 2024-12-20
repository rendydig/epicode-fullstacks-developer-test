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
} from '@mui/material'
import { createDirectus, rest, authentication } from '@directus/sdk'
import { useAuth } from '../contexts/AuthContext'

interface Course {
  id: string
  name: string
  description: string
  organization: {
    name: string
  }
}

const client = createDirectus(import.meta.env.VITE_API_URL)
  .with(authentication())
  .with(rest())

function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await client.request(
          rest.get('courses', {
            fields: ['id', 'name', 'description', 'organization.name'],
          })
        )
        setCourses(response.data || [])
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
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
