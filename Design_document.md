# Bank Licensing & Compliance Portal
Design Document
## 1. Overview
Problem
The current bank licensing process is manual and spread across emails, spreadsheets, and informal approvals. This causes:
    • slow processing,
    • poor tracking,
    • limited visibility,
    • weak audit history.
Solution
This system provides a centralized portal to manage the full licensing workflow from application submission to approval and auditing.
The system focuses on:
    • secure workflows,
    • clear role separation,
    • audit tracking,
    • regulatory accountability.

## 2. System Architecture
The system has 4 main parts:
    • React frontend
    • Node.js + Express backend
    • PostgreSQL database
    • Local file storage
The frontend communicates with the backend using HTTPS.
Frontend (React)
Handles:
    • login,
    • application submission,
    • document uploads,
    • dashboards,
    • workflow actions,
    • role-based views.
The UI is designed to be simple and easy to use.
Backend (Node.js + Express)
Handles:
    • authentication,
    • authorization,
    • business logic,
    • workflow rules,
    • audit logging,
    • file handling,
    • validation,
    • concurrency control.
Node.js and Express were chosen because they are simple, fast, and good for API development.
PostgreSQL Database
Stores:
    • users,
    • applications,
    • documents,
    • reviews,
    • workflow states,
    • audit logs.
PostgreSQL was selected because it provides:
    • strong consistency,
    • transaction support,
    • row locking,
    • JSON support for audit logs.
File Storage
Files are stored locally for simplicity.
Tradeoff:
    • easier to develop,
    • less scalable than cloud storage.
Future improvement:
    • move files to AWS S3 or another cloud storage service.
      
## 3. Authentication & Authorization
Authentication
The system uses JWT authentication.
Passwords are:
    • hashed with bcrypt,
    • never stored as plain text.
Future improvements:
    • multi-factor authentication,
    • refresh tokens,
    • token revocation.
Only applicants can self-register. Internal roles are created by admins or seeded accounts are created to prevent privilege escalation and unauthorized access to sensitive review workflows.
Role-Based Access Control (RBAC)
Authorization is enforced in the backend.
Examples:
    • Applicant → cannot approve applications
    • Reviewer → cannot perform final approval
    • Compliance Officer → can approve/reject
    • Auditor → read-only access
    • Admin → manages the system
Every protected API checks:
    • authentication,
    • user role,
    • workflow state.
Separation of Duties
The reviewer and final approver cannot be the same person.
Example:
reviewed_by != approved_by
This prevents conflicts of interest.

## 4. User Roles
Applicant
Can:
    • create applications,
    • upload documents,
    • submit applications,
    • view status,
    • respond to corrections.
Cannot:
    • approve applications,
    • view internal comments,
    • manage users.
Reviewer
Can:
    • review applications,
    • request corrections,
    • add comments.
Cannot:
    • approve applications,
    • manage users,
    • edit audit logs.
Compliance Officer
Can:
    • approve or reject applications,
    • perform compliance reviews.
Cannot:
    • modify audit logs,
    • impersonate users.
Auditor
Can:
    • view applications,
    • view audit logs,
    • generate reports.
Cannot:
    • edit applications,
    • approve/reject applications,
    • modify audit logs.
Admin
Can:
    • manage users,
    • assign roles,
    • configure workflows.
Cannot:
    • edit completed audit records,
    • bypass approvals.
      
5. Data Model
Main tables:
    • Users
    • Applications
    • Documents
    • Reviews
    • Audit Logs
UUIDs are used instead of numeric IDs to improve security and reduce predictability.
Audit logs store:
    • user actions,
    • timestamps,
    • before and after states.
      
## 6. Workflow
Application States
    • Draft
    • Submitted
    • Under Review
    • Needs Correction
    • Compliance Review
    • Approved
    • Rejected
Workflow Rules
    • Only applicants can edit draft applications.
    • Approved or rejected applications cannot be changed.
    • Invalid workflow actions are rejected.
    • Every workflow change creates an audit log.
    • Reviewer and approver must be different users.

## 7. Concurrency & Consistency
The system prevents multiple users from changing the same application at the same time.
Example:
    • Reviewer A approves,
    • Reviewer B rejects,
    • both actions happen together.
PostgreSQL row-level locking is used to prevent inconsistent states.
Example:
SELECT * FROM applications FOR UPDATE;

## 8. Audit Trail
Every important action is permanently logged.
Each audit log stores:
    • user,
    • action,
    • timestamp,
    • before state,
    • after state.
Audit logs are immutable:
    • they cannot be updated or deleted.
This helps with:
    • compliance,
    • accountability,
    • legal traceability.
      
## 9. Document Handling
Applicants can upload supporting documents.
Stored metadata:
    • file name,
    • file size,
    • mime type,
    • upload date,
    • version number.
Rules:
    • max file size is 5MB,
    • old versions are preserved after resubmission.

## 10. API Design
The API is:
    • RESTful,
    • role-aware,
    • workflow-driven.
Example endpoints:
POST api/auth/register  (for applicants)
POST /api/auth/login
POST /api/applications
GET /api/applications/:id
POST /api/applications/:id/review
POST /api/applications/:id/approve
Errors return structured JSON responses.
Unauthorized requests return:
403 Forbidden

## 11. Frontend Design
The frontend focuses on:
    • workflow clarity,
    • simplicity,
    • usability.
The UI only shows actions allowed for the logged-in user role.
Example:
    • applicants do not see approval buttons,
    • auditors do not see edit controls.

## 12. Tradeoffs & Decisions
Express Backend
Chosen for simplicity and fast development.
Future:
    • split into microservices if needed.
Local File Storage
Chosen for easier development.
Future:
    • move to cloud storage.
JWT Authentication
Chosen for simple stateless authentication.
Future:
    • add MFA and refresh tokens.
Audit Logging
All workflow actions create immutable audit entries.
Tradeoff:
    • more database storage is required.
      
## 13. Future Improvements
Possible future features:
    • MFA,
    • email notifications,
    • cloud storage,
    • digital signatures,
    • OCR validation,
    • advanced reports,
    • Docker deployment,
    • real-time notifications,
    • improved UI.
      
## 14. Conclusion
This system replaces manual bank licensing processes with a centralized platform that improves:
    • transparency,
    • accountability,
    • auditability,
    • compliance,
    • operational efficiency.
The design focuses on:
    • secure workflows,
    • role separation,
    • audit tracking,
    • backend security,
    • maintainable architecture.
The system is intentionally simple while still supporting future scalability and improvements.
