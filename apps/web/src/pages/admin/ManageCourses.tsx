import React, { useState, useMemo } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  Paper,
  Autocomplete,
  CircularProgress
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useAdminCourses } from '../../hooks/useAdminCourses'
import { useEnrolledCourses } from '../../hooks/useEnrolledCourses'
import { useManageEnrollment } from '../../hooks/useManageEnrollment'
import { useUserOrganizations } from '../../hooks/useUserOrganizations'
import { useSearchStudents } from '../../hooks/useSearchStudents'

interface Student {
  id: string
  first_name: string
  last_name: string
  email: string
}

interface EnrollmentDialogProps {
  open: boolean
  courseId: string | null
  onClose: () => void
}

function EnrollmentDialog({ open, courseId, onClose }: EnrollmentDialogProps) {
  const [searchEmail, setSearchEmail] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const { enrollStudent, isLoading: isEnrolling } = useManageEnrollment()
  const { data: students, isLoading: isSearching } = useSearchStudents(searchEmail)

  const handleEnroll = () => {
    if (courseId && selectedStudent) {
      enrollStudent({
        course_id: courseId,
        user_id: selectedStudent.id,
        status: 'active'
      })
      onClose()
      setSelectedStudent(null)
      setSearchEmail('')
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedStudent(null)
    setSearchEmail('')
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Enroll Student</DialogTitle>
      <DialogContent sx={{ minWidth: 400 }}>
        <Autocomplete
          fullWidth
          options={students || []}
          getOptionLabel={(option) => option.email}
          renderOption={(props, option) => (
            <li {...props}>
              <Box>
                <Typography>{option.email}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.first_name} {option.last_name}
                </Typography>
              </Box>
            </li>
          )}
          loading={isSearching}
          value={selectedStudent}
          onChange={(_, newValue) => setSelectedStudent(newValue)}
          onInputChange={(_, value) => setSearchEmail(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Student by Email"
              margin="normal"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isSearching && <CircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleEnroll} 
          disabled={isEnrolling || !selectedStudent}
        >
          Enroll
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function ManageCourses() {
  const { data: courses, isLoading: isLoadingCourses } = useAdminCourses()
  const { data: userOrganizations, isLoading: isLoadingOrgs } = useUserOrganizations()
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false)

  const handleEnrollClick = (courseId: string) => {
    setSelectedCourseId(courseId)
    setEnrollDialogOpen(true)
  }

  const courseColumns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Course Name', 
      flex: 1,
      valueGetter: (params) => params
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      flex: 2,
      valueGetter: (params) => params
    },
    { 
      field: 'organization',
      headerName: 'Organization',
      flex: 1,
      valueGetter: (params) => params.organization?.name || 'N/A'
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      valueGetter: (params) => params,
      renderCell: (params) => (
        <Chip
          label={params.value || 'N/A'}
          color={params.value === 'active' ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleEnrollClick(params.row.id)}
          disabled={params.row.status !== 'active'}
        >
          Enroll Student
        </Button>
      )
    }
  ]

  if (isLoadingOrgs) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading organizations...</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Manage Courses
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Your Organizations:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {userOrganizations?.map((userOrg) => (
            <Chip
              key={userOrg.organization_id.id}
              label={userOrg.organization_id.name}
              color="primary"
              variant="outlined"
              title={userOrg.organization_id.description || ''}
            />
          ))}
        </Stack>
      </Box>

      <Paper sx={{ mb: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          All Courses
        </Typography>
        <DataGrid
          rows={courses || []}
          columns={courseColumns}
          autoHeight
          loading={isLoadingCourses}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
        />
      </Paper>

      <EnrollmentDialog
        open={enrollDialogOpen}
        courseId={selectedCourseId}
        onClose={() => {
          setEnrollDialogOpen(false)
          setSelectedCourseId(null)
        }}
      />
    </Container>
  )
}
