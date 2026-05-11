# Bank Licensing & Compliance Portal

A backend API for managing bank licensing applications with authentication, roles, and workflow handling.

## Tech Stack

Node.js
Express.js
Prisma ORM
PostgreSQL
JWT Authentication
## Features Implemented

Authentication
Account creation
User login (JWT-based)
Protected routes using middleware

## Roles

APPLICANT
REVIEWER
COMPLIANCE_OFFICER
ADMIN
AUDITOR

## Application Workflow

create an account ( APPLICANT only)
Applicant login
Create application (APPLICANT only)
Submit application
Reviewer/compliance officer login
Request correction (REVIEWER / COMPLIANCE_OFFICER)
Edit application when correction is requested (APPLICANT only)
Resubmit application(APPLICANT only)

## Security

JWT authentication
Role-based access control
Protected endpoints

## Setup Instructions

### 1. Install dependencies
```bash
cd backend
npm install
```
### 2. Configure environment

Create .env:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/bank_licensing_portal"
JWT_SECRET="your_secret"
```
### 3. Setup database
```bash
npm db:migrate
```
### 4. Seed database (IMPORTANT)

This creates test users automatically:
``` bash
npm db:seed
```
### 5. Run server
``` bash
npm run dev
```

Server runs on:
```bash
http://localhost:3000
How to Test the System
```

### 1. Login (use seeded users)
```bash
POST /api/auth/login
```

Example:

```bash
{
  "email": "applicant@test.com",
  "password": "Password123"
}
```

Copy the accessToken.

### 2. Create Application (APPLICANT)
```bash 
POST /api/applications
Authorization: Bearer <token>
```

### 3. Submit Application
```bash
PATCH /api/applications/:id/submit
Authorization: Bearer <token>
```
### 4. Request Correction (REVIEWER / COMPLIANCE_OFFICER)
```bash
PATCH /api/applications/:id/request-correction
Authorization: Bearer <token>

Body:

{
  "notes": "Fix missing documents"
}
```
### 5. Edit Application (only if NEEDS_CORRECTION)
```bash
PATCH /api/applications/:id
Authorization: Bearer <token>
```
### 6. Resubmit Application
```bash
PATCH /api/applications/:id/submit
Authorization: Bearer <token>
```
## Rules Summary
Only APPLICANT can create applications
Submitted applications are locked
Only NEEDS_CORRECTION allows editing
All routes require JWT
Role-based access enforced
Run Tests
npm test
## Notes for Reviewers
Seed file is used for test accounts
No manual user setup required
Workflow is role-based and secure
Focus is on backend architecture and authorization logic

## Future Improvements

Due to time constraints, the following features were not fully implemented below is how I would have approached them:

### Audit Logging System

For a complete system, every action performed on an application (create, submit, correction request, approval, rejection) would be recorded in an audit log.

Approach:

- Create an AuditLog table in the database
- Store:
  - userId
  - action type (CREATE, SUBMIT, APPROVE, etc.)
  - applicationId
  - timestamp
- Implement middleware or service layer to automatically capture actions

### File Upload System

Applicants would be able to attach supporting documents (financial statements, licenses, etc.).

#### Approach:

- Integrate file upload middleware (e.g. Multer)
- Store files in:
  - cloud storage (AWS S3) for production, or
  - local storage for development
- Save file metadata in the database linked to applications

### Advanced Workflow Validation Engine

A strict state machine would control all application transitions.

### How it would have been done:

- Define allowed transitions:
- DRAFT → SUBMITTED
- SUBMITTED → UNDER_REVIEW
- UNDER_REVIEW → NEEDS_CORRECTION / APPROVED / REJECTED
- Enforce transitions in a central service layer
- Block invalid updates at API level

### Frontend UI

A user interface would be built to interact with the backend system.

#### my approach would have been:

- Build a React (or similar) frontend dashboard
- Separate views for:
- Applicants (create/track applications)
- Reviewers (review and request corrections)
- Admin (system oversight)
- Connect via REST API


