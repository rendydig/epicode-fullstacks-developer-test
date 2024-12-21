import React from 'react'
import {
  Container,
  Typography,
} from '@mui/material'
import { EnrolledCourses } from '../components/EnrolledCourses'

function Courses() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Courses
      </Typography>
      <EnrolledCourses />
    </Container>
  )
}

export default Courses
