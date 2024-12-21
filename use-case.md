# Use Cases and Test Scenarios

## Admin Role Test Cases

### 1. Course Management
#### Pass Cases 
- [x] Admin can view all courses across all organizations
- [x] Admin can access course details page for any course
- [x] Admin can see enrolled students in a course
- [x] Admin can enroll new students in a course
- [x] Admin can remove students from a course
- [x] Admin is automatically redirected to admin dashboard when accessing root URL
- [x] Admin can access `/items/epicode_courses` API endpoint
- [x] Admin can access `/items/enrollments` API endpoint
- [x] Admin can modify course and enrollment data via API

#### Fail Cases 
- [ ] Admin should not be able to enroll a student in a course twice
- [ ] Admin should not be able to remove a student that isn't enrolled
- [ ] Admin should not be able to access non-existent course details
- [ ] Admin should see appropriate error messages for failed operations
- [ ] Admin API requests should fail with invalid token

### 2. Navigation & Access
#### Pass Cases 
- [ ] Admin can access /admin/courses route
- [ ] Admin can access /admin/courses/:courseId route
- [ ] Admin can see the "Manage Courses" button in header
- [ ] Admin is redirected to admin dashboard after login

#### Fail Cases 
- [ ] Admin should not see student-specific UI elements
- [ ] Admin should not be able to access invalid course IDs
- [ ] Admin should see 404 page for non-existent routes

## Student Role Test Cases

### 1. Course Access
#### Pass Cases 
- [ ] Student can view only courses they are enrolled in
- [ ] Student can access course details for enrolled courses
- [ ] Student can see course content and materials
- [ ] Student is automatically redirected to student dashboard when accessing root URL

#### Fail Cases 
- [ ] Student should not be able to access admin routes (/admin/*)
- [ ] Student should not see admin UI elements (e.g., "Manage Courses" button)
- [ ] Student should not be able to modify course enrollments
- [ ] Student should not be able to access courses they aren't enrolled in

### 2. Navigation & Access
#### Pass Cases 
- [ ] Student can access /courses route
- [ ] Student can access /courses/:courseId for enrolled courses
- [ ] Student is redirected to courses page after login

#### Fail Cases 
- [ ] Student should not see admin navigation options
- [ ] Student should not be able to access admin dashboard
- [ ] Student should see access denied message for admin routes
- [ ] Student should see 404 page for non-existent routes

### 3. API Access Restrictions
#### Pass Cases 
- [ ] Student can read their own enrollment data
- [ ] Student can view details of enrolled courses
- [ ] Student can access course content for enrolled courses

#### Fail Cases 
- [ ] Student should get 403 when accessing `/items/epicode_courses` directly
- [ ] Student should get 403 when accessing `/items/enrollments` directly
- [ ] Student should get 403 when trying to modify any enrollment data
- [ ] Student should get 403 when accessing other students' data
- [ ] Student should get 403 when trying to access admin-only endpoints
- [ ] Student API requests should fail with invalid token
- [ ] Student should get 403 when trying to create new courses
- [ ] Student should get 403 when trying to modify course data
- [ ] Student should get 403 when accessing organization management endpoints

## Common Test Cases

### 1. Authentication
#### Pass Cases 
- [ ] Users can log in with valid credentials
- [ ] Users are redirected to appropriate dashboard based on role
- [ ] Users can log out successfully
- [ ] Authentication token is properly managed
- [ ] API requests include proper authorization headers

#### Fail Cases 
- [ ] Users should not be able to log in with invalid credentials
- [ ] Users should see appropriate error messages for login failures
- [ ] Expired sessions should redirect to login page
- [ ] Invalid tokens should be handled gracefully
- [ ] API requests should fail with missing authorization headers

### 2. Error Handling
#### Pass Cases 
- [ ] Users see loading states during data fetching
- [ ] Users see error messages for failed operations
- [ ] Users can retry failed operations
- [ ] Network errors are handled gracefully

#### Fail Cases 
- [ ] Users should not see raw error messages/stack traces
- [ ] Users should not be able to perform actions while loading
- [ ] Users should not see inconsistent UI states during errors
- [ ] Failed operations should not leave system in inconsistent state

### 3. API Security
#### Pass Cases 
- [ ] All API endpoints require valid authentication
- [ ] Role-based permissions are properly enforced
- [ ] API responses don't expose sensitive data
- [ ] Rate limiting is implemented for API endpoints

#### Fail Cases 
- [ ] API should reject requests with invalid tokens
- [ ] API should reject requests with expired tokens
- [ ] API should not expose internal error details
- [ ] API should not allow role escalation
- [ ] API should not allow unauthorized data access
- [ ] API should validate all input data
- [ ] API should sanitize all output data
