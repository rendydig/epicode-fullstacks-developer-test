# How to Run Epicode

This guide will help you run the Epicode application using Docker. The setup process is simplified and automated using Docker Compose.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Git

## Quick Start

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Epicode
   ```

2. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```
   Edit the `.env` file with your desired credentials (or keep the defaults for local development).

3. **Start the Application**
   ```bash
   docker compose up
   ```
   This single command will:
   - Start PostgreSQL database
   - Automatically restore the database with seed data
   - Start Directus CMS
   - Start the frontend application

   > Note: During the first run, the seeder service will automatically populate the database with initial data. This process is automatic and you don't need to do anything extra.

## Accessing the Application

Once all services are up and running:

- Frontend Application: http://localhost:5173
- Directus CMS: http://localhost:8055

## User Flows and Credentials

### Directus CMS Administrator
- Email: superadmin@example.com
- Password: admin123
- Access: Full administrative access to Directus CMS
- URL: http://localhost:8055/admin

### Application Users

1. **Administrator**
   - Email: admin@example.com
   - Password: password123
   - Role: Administrator
   - Capabilities:
     - Manage courses
     - View all enrollments
     - Manage users
     - Access administrative features

2. **Students**
   - Student 1
     - Email: student1@example.com
     - Password: password123
     - Role: Student
     - Capabilities:
       - View available courses
       - Enroll in courses
       - View enrolled courses
       - Track progress

   - Student 2
     - Email: student2@example.com
     - Password: password123
     - Role: Student
     - Capabilities:
       - View available courses
       - Enroll in courses
       - View enrolled courses
       - Track progress

## Testing Different User Flows

1. **Administrator Flow**
   - Log in as admin@example.com
   - View all student enrollments
   - View all courses
   

2. **Student Flow**
   - Log in as student1@example.com or student2@example.com
   - Browse available courses
   - Enroll in courses
   - View course materials


## Viewing Enrolled Courses

### For Students
1. **Access the Dashboard**
   - Log in with your student account (student1@example.com or student2@example.com)
   - You will be automatically redirected to the dashboard

2. **View Enrolled Courses**
   - Your enrolled courses are displayed on the dashboard
   - Each course card shows:
     - Course name
     - Course description
     - Organization name
     - Enrollment status
   - Click "Course Details" on any course card to view more information

3. **Course Details View**
   - Access detailed information about the course
   - View course materials and content


### For Administrators
1. **Access Admin Dashboard**
   - Log in with admin account (admin@example.com)
   - Navigate to the admin dashboard

2. **View All Courses**
   - See a complete list of all student enrollments
   - Filter and search through enrollments
   - View enrollment status and progress

3. **Manage Enrollments**
   - View detailed enrollment information
   - Add / remove students from courses

## Administrator Guide

### Managing Courses and Organizations

1. **View All Courses**
   - Log in as admin (admin@example.com)
   - Navigate to "Courses" in the main menu
   - You'll see a list of all courses with:
     - Course name
     - Organization
     - Number of enrolled students
     - Course status

2. **Course Details**
   - Click on any course to view detailed information
   - View and edit:
     - Course description
     - Course materials
     - Enrollment status
     - Associated organization
   - See list of enrolled students
   - Access course analytics and progress reports

3. **Organizations Management**
   - Access "Organizations" from the main menu
   - View all organizations in the system
   - For each organization:
     - See total number of courses
     - View organization details
     - Manage organization settings

### Managing Student Enrollments

1. **Enroll Students in Courses**
   - Navigate to the specific course
   - Click "Manage Enrollments" button
   - Choose "Add Student" option
   - You can:
     - Search for students by email or name
     - Select multiple students for batch enrollment
     - Set enrollment status (active/pending)
     - Add enrollment notes

2. **Monitor and Manage Enrollments**
   - View all current enrollments
   - Filter enrollments by:
     - Course
     - Organization
     - Enrollment status
     - Date range
   - Export enrollment data
   - Generate enrollment reports

## Docker Services

The application consists of several Docker services:

1. **PostgreSQL Database** (port 5432)
   - Stores all application data
   - Automatically initialized with seed data

2. **Database Seeder**
   - Runs automatically on first startup
   - Populates the database with initial data
   - Self-terminates after successful seeding

3. **Directus CMS** (port 8055)
   - Provides the backend API
   - Handles authentication and data management

4. **Frontend Application** (port 5173)
   - React-based user interface
   - Automatically connects to Directus

## Common Commands

```bash
# Start all services
docker compose up

# Start services in detached mode
docker compose up -d

# View logs
docker compose logs

# View logs for a specific service
docker compose logs [service-name]  # e.g., docker compose logs directus

# Stop all services
docker compose down

# Rebuild and start services
docker compose up --build

# Remove all data and start fresh
docker compose down -v
docker compose up
```

## Troubleshooting

1. **Services Not Starting**
   ```bash
   # Check service status
   docker compose ps
   
   # Check service logs
   docker compose logs
   ```

2. **Database Issues**
   - If the database isn't seeding properly:
     ```bash
     # Remove volumes and restart
     docker compose down -v
     docker compose up
     ```

3. **Port Conflicts**
   - Ensure ports 5432 (PostgreSQL), 8055 (Directus), and 5173 (Frontend) are available
   - Check for conflicts:
     ```bash
     netstat -ano | findstr "5432 8055 5173"
     ```

4. **Container Health**
   ```bash
   # Check container health status
   docker compose ps
   
   # Restart unhealthy containers
   docker compose restart [service-name]
   ```
