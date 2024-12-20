import React from 'react'
import { useParams } from 'react-router-dom'
import { useCourseDetail } from '../hooks/useCourseDetail'
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  PlayCircleOutline as VideoIcon,
  Description as DocumentIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material'

const contentTypeIcons = {
  video: VideoIcon,
  document: DocumentIcon,
  quiz: QuizIcon,
  assignment: AssignmentIcon,
}

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: course, isLoading, error } = useCourseDetail(courseId!)

  if (isLoading) {
    return (
      <Container sx={{ py: 6 }}>
        <Skeleton variant="text" width="50%" height={60} />
        <Skeleton variant="text" width="70%" height={40} />
        <Box sx={{ mt: 4 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={100} sx={{ mb: 2 }} />
          ))}
        </Box>
      </Container>
    )
  }

  if (error || !course) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography color="error">
          Error loading course: {error instanceof Error ? error.message : 'Unknown error'}
        </Typography>
      </Container>
    )
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {course.name}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Organization: {course.organization_id.name}
      </Typography>
      <Typography variant="body1" paragraph>
        {course.description}
      </Typography>

      <Box sx={{ mt: 4 }}>
        {course.sections
          .sort((a, b) => a.order_index - b.order_index)
          .map((section) => (
            <Accordion key={section.id} defaultExpanded={section.order_index === 1}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box>
                  <Typography variant="h6">
                    {section.order_index}. {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {section.content_items
                    .sort((a, b) => a.order_index - b.order_index)
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
              </AccordionDetails>
            </Accordion>
          ))}
      </Box>
    </Container>
  )
}
