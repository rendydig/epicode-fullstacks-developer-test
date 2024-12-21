import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Skeleton,
  Chip,
} from '@mui/material'
import { useEnrolledCourses } from '../hooks/useEnrolledCourses'
import { useNavigate } from 'react-router-dom'

export function EnrolledCourses() {
  const { data: enrollments, isLoading } = useEnrolledCourses()
  const navigate = useNavigate()
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((skeleton) => (
          <Grid item xs={12} sm={6} md={4} key={skeleton}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="40%" height={24} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <Grid container spacing={3}>
      {enrollments?.map((enrollment) => (
        <Grid item xs={12} sm={6} md={4} key={enrollment.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {enrollment.course_id.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {enrollment.course_id.description}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Organization: {enrollment.course_id.organization.name}
              </Typography>
              <Chip
                label={enrollment.status}
                size="small"
                color={enrollment.status === 'active' ? 'success' : 'default'}
                sx={{ mt: 1 }}
              />
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => navigate(`/courses/${enrollment.course_id.id}`)}
                sx={{ mt: 1 }}
              >
                Course Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
