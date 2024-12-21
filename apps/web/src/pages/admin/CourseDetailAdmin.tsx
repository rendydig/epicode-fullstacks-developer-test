import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Divider,
  Box,
  CircularProgress,
  Button,
  IconButton,
  ListItemIcon
} from '@mui/material'
import { PersonOutline, Delete, PlayCircleOutline as VideoIcon, Description as DocumentIcon, Quiz as QuizIcon, Assignment as AssignmentIcon } from '@mui/icons-material'
import { useCourseDetail } from '../../hooks/useCourseDetail'
import { useEnrolledStudents } from '../../hooks/useEnrolledStudents'
import { useManageEnrollment } from '../../hooks/useManageEnrollment'
import { EnrollmentDialog } from '../../components/EnrollmentDialog'
import { ConfirmDialog } from '../../components/ConfirmDialog'

export function CourseDetailAdmin() {
  const { courseId } = useParams<{ courseId: string }>()
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false)
  const [studentToRemove, setStudentToRemove] = useState<{ id: string; name: string } | null>(null)
  const { data: course, isLoading: isLoadingCourse } = useCourseDetail(courseId!)
  const { data: students, isLoading: isLoadingStudents } = useEnrolledStudents(courseId!)
  const { removeStudent, isLoading: isRemoving } = useManageEnrollment()

  const handleRemoveStudent = async () => {
    if (studentToRemove && courseId) {
      try {
        await removeStudent({ courseId, userId: studentToRemove.id })
        setStudentToRemove(null)
      } catch (error) {
        console.error('Error removing student:', error)
      }
    }
  }

  if (isLoadingCourse || isLoadingStudents) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!course) {
    return (
      <Container>
        <Typography variant="h5" color="error">Course not found</Typography>
      </Container>
    )
  }

  const contentTypeIcons = {
    video: VideoIcon,
    document: DocumentIcon,
    quiz: QuizIcon,
    assignment: AssignmentIcon,
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Course Details Section - 60% */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h4">
                {course.name}
              </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Organization: {course?.organization?.name}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>
              {course.description}
            </Typography>
            {course.sections?.map((section) => (
              <Box key={section.id} sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {section.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {section.description}
                </Typography>
                <List>
                  {section.content_items
                    ?.sort((a, b) => a.order_index - b.order_index)
                    .map((item) => {
                      const Icon = contentTypeIcons[item.type]
                      return (
                        <ListItem key={item.id} sx={{ py: 1 }}>
                          <ListItemIcon>
                            <Icon />
                          </ListItemIcon>
                          <ListItemText
                            primary={item.title}
                            secondary={
                              <>
                                {item.description}
                                {item.duration && (
                                  <Box component="span" sx={{ ml: 1 }}>
                                    • {Math.floor(item.duration / 60)} minutes
                                  </Box>
                                )}
                              </>
                            }
                          />
                        </ListItem>
                      )
                    })}
                </List>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Enrolled Students Section - 40% */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">
                Enrolled Students ({students?.length || 0})
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEnrollDialogOpen(true)}
              >
                Enroll Student
              </Button>
            </Box>
            <List>
              {students?.map((student) => (
                <React.Fragment key={student.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonOutline />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${student.first_name} ${student.last_name}`}
                      secondary={student.email}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="remove"
                        onClick={() => setStudentToRemove({
                          id: student.id,
                          name: `${student.first_name} ${student.last_name}`
                        })}
                        disabled={isRemoving}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <EnrollmentDialog
        open={isEnrollDialogOpen}
        courseId={courseId!}
        onClose={() => setIsEnrollDialogOpen(false)}
      />

      <ConfirmDialog
        open={!!studentToRemove}
        onClose={() => setStudentToRemove(null)}
        onConfirm={handleRemoveStudent}
        title="Remove Student"
        content={`Are you sure you want to remove ${studentToRemove?.name} from this course?`}
      />
    </Container>
  )
}
