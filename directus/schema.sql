-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(255) NOT NULL,
    description text,
    status varchar(50) DEFAULT 'active',
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

CREATE INDEX IF NOT EXISTS idx_org_name ON organizations(name);
CREATE INDEX IF NOT EXISTS idx_org_status ON organizations(status);

-- User Organizations table (junction table for many-to-many)
CREATE TABLE IF NOT EXISTS user_organizations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES directus_users(id) ON DELETE CASCADE,
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role varchar(50) DEFAULT 'member',
    status varchar(50) DEFAULT 'active',
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_org_unique UNIQUE(user_id, organization_id),
    CONSTRAINT status_check CHECK (status IN ('active', 'inactive')),
    CONSTRAINT role_check CHECK (role IN ('member', 'admin'))
);

CREATE INDEX IF NOT EXISTS idx_user_org_user ON user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_org_org ON user_organizations(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_org_status ON user_organizations(status);
CREATE INDEX IF NOT EXISTS idx_user_org_composite ON user_organizations(user_id, organization_id, status);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(255) NOT NULL,
    description text,
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    status varchar(50) DEFAULT 'active',
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    max_students integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT status_check CHECK (status IN ('draft', 'active', 'completed', 'archived')),
    CONSTRAINT date_check CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS idx_course_org ON courses(organization_id);
CREATE INDEX IF NOT EXISTS idx_course_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_course_dates ON courses(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_course_name ON courses USING gin (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_course_description ON courses USING gin (to_tsvector('english', description));

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES directus_users(id) ON DELETE CASCADE,
    course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status varchar(50) DEFAULT 'enrolled',
    progress integer DEFAULT 0,
    enrolled_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp with time zone,
    last_accessed_at timestamp with time zone,
    CONSTRAINT user_course_unique UNIQUE(user_id, course_id),
    CONSTRAINT status_check CHECK (status IN ('enrolled', 'completed', 'dropped', 'suspended')),
    CONSTRAINT progress_check CHECK (progress >= 0 AND progress <= 100)
);

CREATE INDEX IF NOT EXISTS idx_enrollment_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollment_dates ON enrollments(enrolled_at, completed_at);
CREATE INDEX IF NOT EXISTS idx_enrollment_composite ON enrollments(user_id, course_id, status);

-- Create trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for tables with updated_at
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
