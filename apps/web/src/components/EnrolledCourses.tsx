import React from 'react'
import {
  Box,
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
      <Box display="flex" flexWrap="wrap" gap={3}>
        {[1, 2, 3].map((skeleton) => (
          <Box key={skeleton} flexBasis={{ xs: '100%', sm: '45%', md: '30%' }}>
            <Card>
              <CardContent>
                <Skeleton key={`skeleton-title-${skeleton}`} variant="text" width="60%" height={32} />
                <Skeleton key={`skeleton-desc-${skeleton}`} variant="text" width="80%" height={24} />
                <Skeleton key={`skeleton-org-${skeleton}`} variant="text" width="40%" height={24} />
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Box display="flex" flexWrap="wrap" gap={3}>
      {enrollments?.map((enrollment) => (
        <Box key={enrollment.id + enrollment.course_id.id} flexBasis={{ xs: '100%', sm: '45%', md: '30%' }}>
          <Card>
            <CardContent>
              <Typography key={`title-${enrollment.id}`} variant="h6" gutterBottom>
                {enrollment.course_id.name}
              </Typography>
              <Typography key={`description-${enrollment.id}`} variant="body2" color="text.secondary">
                {enrollment.course_id.description}
              </Typography>
              <Typography key={`org-${enrollment.id}`} variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
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
        </Box>
      ))}
    </Box>
  )
}
