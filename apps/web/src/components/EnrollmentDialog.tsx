import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Autocomplete,
  Alert
} from '@mui/material'
import { useManageEnrollment } from '../hooks/useManageEnrollment'
import { useSearchStudents } from '../hooks/useSearchStudents'

interface Student {
  id: string
  first_name: string
  last_name: string
  email: string
}

interface EnrollmentDialogProps {
  open: boolean
  courseId: string
  onClose: () => void
}

export function EnrollmentDialog({ open, courseId, onClose }: EnrollmentDialogProps) {
  const [searchEmail, setSearchEmail] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null)
  const { enrollStudent, isLoading: isEnrolling } = useManageEnrollment()
  const { data: students, isLoading: isSearching } = useSearchStudents(searchEmail)

  const handleEnroll = async () => {
    if (courseId && selectedStudent) {
      try {
        await enrollStudent({
          course_id: courseId,
          user_id: selectedStudent.id,
          status: 'active'
        })
        onClose()
        setSelectedStudent(null)
        setSearchEmail('')
        setEnrollmentError(null)
      } catch (error: any) {
        if (error?.response?.data?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
          setEnrollmentError('This student is already enrolled in the course.')
        } else {
          setEnrollmentError('An error occurred while enrolling the student. Please try again.')
        }
      }
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedStudent(null)
    setSearchEmail('')
    setEnrollmentError(null)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Enroll Student</DialogTitle>
      <DialogContent sx={{ minWidth: 400 }}>
        {enrollmentError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {enrollmentError}
          </Alert>
        )}
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
          onChange={(_, newValue) => {
            setSelectedStudent(newValue)
            setEnrollmentError(null)
          }}
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
          variant="contained"
          disabled={!selectedStudent || isEnrolling}
        >
          {isEnrolling ? <CircularProgress size={24} /> : 'Enroll'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
