# Project Overview
The main objective of this project is to provide an end-to-end web-based timetable scheduling platform for colleges and universities that need reliable weekly planning. The system helps administrators manage classrooms, teachers, subjects, and division-specific schedules from one dashboard. Instead of manually creating timetables in spreadsheets, users can build or auto-generate schedules with built-in rule validation. The platform is designed to reduce scheduling errors, save planning time, and keep academic operations consistent. It also supports practical output formats, including PDF and Excel exports, so generated schedules can be shared with faculty and departments quickly and in a professional format.

# Problem Statement
Academic timetable planning is usually complex because many constraints must be satisfied at the same time. A teacher cannot teach two classes in the same slot, a class cannot have multiple subjects simultaneously, and subject period limits must be respected. Manual planning often causes conflicts, repeated revisions, and poor visibility across divisions. This system solves those issues by centralizing scheduling and automatically validating each entry before it is saved. It also handles holiday constraints, break slots, and workload limits in a structured manner. The result is a predictable planning workflow where administrators can focus on decisions instead of repeatedly correcting avoidable scheduling mistakes.

# Technologies Used
This project uses a modern TypeScript-first stack to balance productivity, reliability, and maintainability. Key choices include:
- Next.js 14 with App Router for full-stack web architecture in one codebase.
- React 18 for interactive UI components and real-time scheduling actions.
- MongoDB with Mongoose for flexible schema modeling and fast iterative development.
- JWT + HTTP-only cookies for stateless, secure authentication.
- bcryptjs for password hashing, and Nodemailer for OTP email delivery.
- Zustand for lightweight client state persistence.
- Tailwind CSS and reusable UI components for consistent design.
- html2canvas, jsPDF, and ExcelJS for professional PDF/Excel timetable exports.
These tools were selected for scalability, rapid development, and production readiness.

# System Architecture
The system follows a layered full-stack architecture built inside a single Next.js project. The frontend includes role-aware pages (`/dashboard`, `/timetable`, `/login`, `/register`) and modular components for timetable building, management panels, and global previews. The backend is implemented through API route handlers under `app/api`, where business rules, authentication checks, and data validation are executed. The database layer uses Mongoose models for `User`, `Teacher`, `Subject`, `Classroom`, `Timetable`, and weekly configuration documents. Utility modules handle token management, workload computation, conflict validation, auto-generation, and email OTP flows. This separation keeps UI, domain logic, and persistence responsibilities clear and maintainable.

# Scheduling Engine Workflow
Timetable generation works in two modes: `fill` (populate only empty slots) and `full` (clear and regenerate for the selected division context). The auto-generator first loads subjects, teachers, existing entries, and holiday settings. It creates a pool of valid day/time slots by excluding holidays and break periods, then applies deterministic hash-based shuffling for fair distribution. Subjects are prioritized using remaining required periods, and teacher availability is evaluated using dynamic workload computation. Before creating any slot, the engine checks class conflicts, teacher conflicts, same-day repetition limits, and consecutive lecture constraints. Every candidate slot passes through the validation engine, ensuring generated results remain consistent with manual scheduling rules.

# Conflict Prevention
Conflict prevention is implemented as a multi-layer validation strategy. At entry creation, the API blocks duplicate class-slot assignments and checks classroom collisions when a room is present. The validation engine enforces teacher availability per time slot, workload limits, and subject period limits for the selected program/class/semester/division context. It also rejects scheduling during break slots and supports full timetable validation before save. Weekly validation adds day-level rules such as maximum active lectures and holiday restrictions. Because workloads are computed dynamically from timetable entries, the system always validates against current data instead of stale counters. This design significantly reduces invalid allocations and makes conflict detection consistent across manual and auto-generated scheduling.

# Database Design
The database uses normalized document relationships with targeted indexes for fast scheduling queries. Core collections are:
- `users`: authentication identity, role, verification status, OTP metadata.
- `teachers`: teacher profile and teaching capacity.
- `subjects`: subject metadata, required periods, teacher reference.
- `classrooms`: unique academic context mapping (program + class + semester + division).
- `timetables`: slot-level schedule entries with references to subject, teacher, creator, and optional classroom.
- `weeklyconfigs` and `weeklytimetables`: holiday and weekly snapshot configuration.
The design favors references over denormalized duplication. Workload and allotted periods are computed from timetable entries, improving consistency and minimizing synchronization errors between collections.

# Authentication Workflow
Authentication is built around API-based session checks and secure cookies. Registration creates a user in unverified state and stores OTP details with expiration. Login validates credentials using bcrypt and issues a signed JWT token, stored in an HTTP-only cookie (`auth-token`). Protected routes call `/api/auth/me` to verify token validity and account verification status before returning user context. Middleware guards web pages (`/dashboard`, `/timetable`) from unauthenticated access, while API handlers use a reusable `authenticateRequest` helper. Logout clears the cookie immediately. This flow provides secure stateless sessions, prevents client-side token leakage, and keeps access checks centralized for both frontend navigation and backend operations.

# JWT in This System
JWT (JSON Web Token) is a compact signed token format used to represent authenticated user identity without storing session state on the server. In this project, JWT payload includes `userId`, `email`, and `role`, then is signed with `JWT_SECRET` and expires after seven days. The token is stored in an HTTP-only cookie, reducing XSS exposure compared with localStorage tokens. On each protected request, the server verifies signature and expiration to reconstruct user context. JWT is used because it simplifies scaling, supports stateless APIs, and works naturally with Next.js route handlers. It also enables consistent role checks and authorization logic across multiple endpoints.

# Role-Based Access Control (RBAC)
RBAC controls which features each user role can access. This project defines two roles: `admin` and `user`. Admin-only operations include creating and modifying teachers, subjects, classrooms, and timetable entries. Regular users are mainly allowed to view timetable data and use non-destructive interfaces. RBAC is implemented in two places: UI routing and backend authorization. On the frontend, dashboard access is conditionally redirected based on role. On the backend, protected routes call `authenticateRequest(req, { requireAdmin: true })`, which blocks non-admin users with `403 Forbidden`. This dual enforcement ensures unauthorized requests are rejected even if someone bypasses client-side controls.

# OTP Email Verification
The OTP verification system ensures that only users with valid email ownership can activate an account. During registration, the system generates a six-digit OTP and stores it with a five-minute expiry timestamp in the user document. It sends the code through Gmail SMTP using Nodemailer and credentials from environment variables. The user then submits OTP on the verification screen. The server checks email, OTP existence, expiry status, and exact code match before setting `isVerified = true` and clearing OTP fields. Resend support generates a new OTP for unverified users. This process strengthens account integrity, reduces fake signups, and improves trust in authenticated user identities.

# Timetable Preview and Filtering
The timetable preview module supports multi-perspective exploration of schedule data. Users can switch between division view, teacher view, and subject view, then apply dynamic filters for program, class, semester, division, teacher, or subject. The preview API uses an aggregation pipeline to join teacher and subject data and dynamically resolve classroom details by matching academic context fields. This allows accurate room display even when classrooms are managed separately. The grid marks breaks, holidays, empty cells, and populated slots with clear visual states. Results can be exported as PDF or Excel with contextual titles. This feature improves transparency for faculty planning, administrative audits, and schedule communication.

# Why MongoDB Over SQL
MongoDB was chosen because the timetable domain requires flexible, evolving document structures with fast iteration during development. Academic scheduling entities share relationships but also include variable metadata such as holiday arrays, optional classroom fields, and evolving validation artifacts. Using Mongoose enables schema-level validation, references, middleware hooks, and indexing while still allowing incremental schema updates without heavy migration overhead. For this project’s complexity and pace, document modeling reduced friction compared with rigid relational migrations. MongoDB Atlas also provides easy cloud deployment, connection pooling, and operational simplicity. With proper indexes and query design, it supports the required read/write patterns effectively for timetable-centric workloads.

# Development Challenges
Several non-trivial challenges were addressed during implementation. One major issue was ObjectId casting in `createdBy` fields, solved by introducing centralized user ID utilities and consistent ObjectId handling. Another challenge was avoiding stale workload counters; the solution shifted to dynamic computation from timetable entries, improving data integrity. Preview accuracy across divisions required aggregation-based joins and context-aware classroom resolution. Holiday handling also needed safe deletion and recalculation behavior when days are marked unavailable. Additional complexity came from balancing UX responsiveness with strict validation rules. Finally, migration from local MongoDB to Atlas required robust connection management, caching, and clearer operational error reporting for stable development and deployment.

# Future Improvements
The current platform is production-capable but can be enhanced with advanced planning and governance features. Recommended next improvements include:
- Constraint-priority scheduling (hard/soft constraints with optimization scoring).
- Multi-campus and multi-academic-year configuration support.
- Advanced analytics dashboards for teacher load trends and utilization.
- Notification workflows for schedule changes via email and in-app alerts.
- Audit trails with versioned timetable snapshots and rollback support.
- Bulk edit tools and conflict simulation before commit.
- Stronger test coverage (unit, integration, and API contract testing).
- Optional WebSocket updates for collaborative live scheduling.
These additions would increase scalability, collaboration, and enterprise readiness while preserving the current architecture.
