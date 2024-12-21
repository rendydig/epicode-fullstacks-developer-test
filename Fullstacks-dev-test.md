# Educational Enrollment System

## Overview
Build a multi-tenant enrollment system using:
- Nx/Turborepo
- Directus headless CMS
- PostgreSQL
- Docker
- Bun package manager
- React + Vite frontend

**Time Frame:** 2 days

## Core Requirements

### 1. Setup Requirements
- Complete docker-compose configuration
- Directus schema snapshot included
- Initial seed data for testing
- Clear README.md with setup instructions
- .env.example file

### 2. Database Architecture
Multi-tenant enrollment system with:
- Organizations
- Users (with multi-organization membership)
- Courses
- Enrollments

### 3. User Roles & Permissions
- Admin Role:
  - Can enroll students in courses
  - Can unenroll students from courses
  - Can view all courses
- Student Role:
  - Can only view courses they have access to
  - Cannot modify enrollments

### 4. Directus Implementation
- Custom TypeScript Extensions:
  1. Protected API Endpoints:
     - List available courses (both roles)
     - Enroll in a course (admin only)
     - Unenroll from a course (admin only)
     - JWT authentication required
  2. Hook for Enrollment Events:
     - Email notification simulation
     - Trigger on enrollment/unenrollment

### 5. Frontend Implementation
React + Vite application with:
- Login page
- Protected courses page showing:
  - List of courses available to logged-in student
  - Course details (name, description, organization)
- JWT authentication integration
- TypeScript
- Basic styling (any UI library allowed)

### 6. Deployment
System must be ready to run with single command:
```bash
docker-compose up
```

## Sample Data

The application comes with pre-configured sample data for testing:

### Organizations
- Tech Academy
- Code School
- Data Science Institute

### Users
1. Admin User
   - Email: admin@example.com
   - Password: password123
   - Role: Administrator

2. Student Users
   - student1@example.com (password: password123)
   - student2@example.com (password: password123)

### Courses
1. Introduction to Programming (Tech Academy)
2. Web Development Fundamentals (Tech Academy)
3. Advanced React (Code School)
4. Data Science Basics (Data Science Institute)

To reset the database with sample data:
1. Stop all containers: `docker-compose down -v`
2. Start the services again: `docker-compose up -d`

The sample data will be automatically loaded when the PostgreSQL container initializes for the first time.

# Evaluation Points

-  One-command setup functionality
-  Schema automation
-  Role-based access control
-  Frontend authentication flow
-  Documentation clarity
-  Code organization
-  Error handling

## Submit to:

-  ubeyt.demir@epicode.com
-  diego.banovaz@epicode.com

## Important Notes

-  Include schema snapshots for automatic table creation
-  Provide seed data for immediate testing
-  Clear `README.md` with setup instructions
-  Working role-based permissions on first launch
-  All configurations should work out of the box
-  Frontend should be accessible via [http://localhost:5173](http://localhost:5173)
-  Directus admin panel at [http://localhost:8055](http://localhost:8055)