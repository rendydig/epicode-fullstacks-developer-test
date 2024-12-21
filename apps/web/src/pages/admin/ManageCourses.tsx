import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Paper,
  CircularProgress
} from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useAdminCourses } from '../../hooks/useAdminCourses'
import { useUserOrganizations } from '../../hooks/useUserOrganizations'
import { EnrollmentDialog } from '../../components/EnrollmentDialog'

export function ManageCourses() {
  const navigate = useNavigate()
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false)
  const { data: courses, isLoading: isLoadingCourses } = useAdminCourses()
  const { data: userOrganizations, isLoading: isLoadingOrgs } = useUserOrganizations()

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: 'Course Name', flex: 1 },
      { field: 'description', headerName: 'Description', flex: 2 },
      {
        field: 'organization',
        headerName: 'Organization',
        flex: 1,
        valueGetter: (organization:any) => organization.name
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        renderCell: (params: any) => (
          <Stack direction="row" spacing={1} alignItems="center" height="100%">
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/admin/courses/${params.id}`)}
            >
              Details
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setSelectedCourseId(params.id)
                setIsEnrollDialogOpen(true)
              }}
            >
              Enroll Student
            </Button>
          </Stack>
        )
      }
    ],
    [navigate]
  )

  if (isLoadingOrgs) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Manage Courses
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          All Courses
        </Typography>
        <DataGrid
          rows={courses || []}
          columns={columns}
          autoHeight
          loading={isLoadingCourses}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } }
          }}
        />
      </Paper>

      <EnrollmentDialog
        open={isEnrollDialogOpen}
        courseId={selectedCourseId!}
        onClose={() => {
          setIsEnrollDialogOpen(false)
          setSelectedCourseId(null)
        }}
      />
    </Container>
  )
}
