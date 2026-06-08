# 📑 Project File Index

Complete reference of all files and directories in the School Management System project.

## Root Directory Files

### Main Documentation
- **[README.md](./README.md)** - Main project documentation with features, setup, and API overview
- **[SETUP.md](./SETUP.md)** - Comprehensive setup guide for different installation methods
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide for getting running in minutes

### Docker Configuration
- **[docker-compose.yml](./docker-compose.yml)** - Docker Compose configuration for all services (MongoDB, Backend, Frontend)
- **[.github/](./github/)** - GitHub configuration directory

---

## Frontend Directory (`frontend/`)

### Configuration Files
- **[package.json](./frontend/package.json)** - Dependencies and scripts for Next.js project
- **[tsconfig.json](./frontend/tsconfig.json)** - TypeScript configuration
- **[next.config.js](./frontend/next.config.js)** - Next.js configuration
- **[tailwind.config.js](./frontend/tailwind.config.js)** - Tailwind CSS theme configuration
- **[postcss.config.js](./frontend/postcss.config.js)** - PostCSS configuration
- **[.eslintrc.json](./frontend/.eslintrc.json)** - ESLint configuration
- **[.env.example](./frontend/.env.example)** - Environment variables template
- **[.gitignore](./frontend/.gitignore)** - Git ignore rules
- **[.dockerignore](./frontend/.dockerignore)** - Docker ignore rules
- **[Dockerfile](./frontend/Dockerfile)** - Docker build configuration

### Application Structure (`app/`)
#### Root Layout
- **[app/layout.tsx](./frontend/app/layout.tsx)** - Root layout with Sidebar and Navbar
- **[app/page.tsx](./frontend/app/page.tsx)** - Home/Dashboard page

#### Feature Pages
- **[app/students/page.tsx](./frontend/app/students/page.tsx)** - Students management page
- **[app/teachers/page.tsx](./frontend/app/teachers/page.tsx)** - Teachers management page
- **[app/attendance/page.tsx](./frontend/app/attendance/page.tsx)** - Attendance tracking page
- **[app/grades/page.tsx](./frontend/app/grades/page.tsx)** - Grades/Results page
- **[app/fees/page.tsx](./frontend/app/fees/page.tsx)** - Fee management page
- **[app/timetable/page.tsx](./frontend/app/timetable/page.tsx)** - Timetable/Schedule page
- **[app/library/page.tsx](./frontend/app/library/page.tsx)** - Library management page

### Components (`components/`)

#### Common Components
- **[components/Common/Navbar.tsx](./frontend/components/Common/Navbar.tsx)** - Top navigation bar
- **[components/Common/Sidebar.tsx](./frontend/components/Common/Sidebar.tsx)** - Left navigation sidebar
- **[components/Common/UIComponents.tsx](./frontend/components/Common/UIComponents.tsx)** - Reusable UI components (Card, Button, StatBox)
- **[components/Common/Effects.tsx](./frontend/components/Common/Effects.tsx)** - Visual effects (Particles, Glow, Gradient)

#### Feature Components
- **[components/Dashboard/Dashboard.tsx](./frontend/components/Dashboard/Dashboard.tsx)** - Dashboard overview with statistics
- **[components/Students/](./frontend/components/Students/)** - Student management components
- **[components/Teachers/](./frontend/components/Teachers/)** - Teacher management components
- **[components/Attendance/](./frontend/components/Attendance/)** - Attendance components
- **[components/Grades/](./frontend/components/Grades/)** - Grade management components
- **[components/Fees/](./frontend/components/Fees/)** - Fee management components
- **[components/Timetable/](./frontend/components/Timetable/)** - Timetable components
- **[components/Library/](./frontend/components/Library/)** - Library management components

### Utilities & Libraries (`lib/`)
- **[lib/api.ts](./frontend/lib/api.ts)** - Axios API client with endpoints

### Styling (`styles/`)
- **[styles/globals.css](./frontend/styles/globals.css)** - Global CSS with animations and utility classes

### Assets (`public/`)
- **[public/](./frontend/public/)** - Static files and assets directory

---

## Backend Directory (`backend/`)

### Configuration Files
- **[package.json](./backend/package.json)** - Dependencies and scripts for Express.js project
- **[tsconfig.json](./backend/tsconfig.json)** - TypeScript configuration
- **[.eslintrc.json](./backend/.eslintrc.json)** - ESLint configuration
- **[.env.example](./backend/.env.example)** - Environment variables template
- **[.gitignore](./backend/.gitignore)** - Git ignore rules
- **[.dockerignore](./backend/.dockerignore)** - Docker ignore rules
- **[Dockerfile](./backend/Dockerfile)** - Docker build configuration

### Source Code (`src/`)

#### Main Entry Point
- **[src/index.ts](./backend/src/index.ts)** - Server initialization and route setup

#### Models (`src/models/`)
- **[src/models/Student.ts](./backend/src/models/Student.ts)** - Student data schema
- **[src/models/Teacher.ts](./backend/src/models/Teacher.ts)** - Teacher data schema
- **[src/models/Class.ts](./backend/src/models/Class.ts)** - Class organization schema
- **[src/models/Attendance.ts](./backend/src/models/Attendance.ts)** - Attendance record schema
- **[src/models/Grade.ts](./backend/src/models/Grade.ts)** - Grade/Result schema
- **[src/models/Fee.ts](./backend/src/models/Fee.ts)** - Fee transaction schema
- **[src/models/Timetable.ts](./backend/src/models/Timetable.ts)** - Class schedule schema
- **[src/models/LibraryBook.ts](./backend/src/models/LibraryBook.ts)** - Book inventory schema
- **[src/models/LibraryIssue.ts](./backend/src/models/LibraryIssue.ts)** - Book issue/return schema

#### Controllers (`src/controllers/`)
- **[src/controllers/studentController.ts](./backend/src/controllers/studentController.ts)** - Student CRUD operations
- **[src/controllers/teacherController.ts](./backend/src/controllers/teacherController.ts)** - Teacher CRUD operations
- **[src/controllers/attendanceController.ts](./backend/src/controllers/attendanceController.ts)** - Attendance management
- **[src/controllers/gradeController.ts](./backend/src/controllers/gradeController.ts)** - Grade management

#### Routes (`src/routes/`)
- **[src/routes/studentRoutes.ts](./backend/src/routes/studentRoutes.ts)** - /api/students endpoints
- **[src/routes/teacherRoutes.ts](./backend/src/routes/teacherRoutes.ts)** - /api/teachers endpoints
- **[src/routes/attendanceRoutes.ts](./backend/src/routes/attendanceRoutes.ts)** - /api/attendance endpoints
- **[src/routes/gradeRoutes.ts](./backend/src/routes/gradeRoutes.ts)** - /api/grades endpoints

#### Middleware (`src/middleware/`)
- **[src/middleware/](./backend/src/middleware/)** - Authentication, validation, error handling (to be created)

#### Utilities (`src/utils/`)
- **[src/utils/](./backend/src/utils/)** - Helper functions and utilities (to be created)

---

## Documentation Directory (`docs/`)

### Technical Documentation
- **[docs/API.md](./docs/API.md)** - Complete API documentation with endpoints and examples
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)** - Contributing guidelines for developers

---

## Directory Structure Summary

```
SMS/
├── frontend/                          # Next.js React Application
│   ├── app/                          # Next.js app router
│   │   ├── students/                 # Students feature
│   │   ├── teachers/                 # Teachers feature
│   │   ├── attendance/               # Attendance feature
│   │   ├── grades/                   # Grades feature
│   │   ├── fees/                     # Fees feature
│   │   ├── timetable/                # Timetable feature
│   │   ├── library/                  # Library feature
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── components/                   # React components
│   │   ├── Common/                   # Shared components
│   │   ├── Dashboard/                # Dashboard components
│   │   ├── Students/                 # Student components
│   │   ├── Teachers/                 # Teacher components
│   │   ├── Attendance/               # Attendance components
│   │   ├── Grades/                   # Grade components
│   │   ├── Fees/                     # Fee components
│   │   ├── Timetable/                # Timetable components
│   │   └── Library/                  # Library components
│   ├── lib/                          # Utilities and helpers
│   │   └── api.ts                    # API client
│   ├── styles/                       # Global styles
│   │   └── globals.css               # Global CSS
│   ├── public/                       # Static files
│   ├── package.json                  # Dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── next.config.js                # Next.js config
│   ├── tailwind.config.js            # Tailwind config
│   ├── .env.example                  # Environment template
│   ├── Dockerfile                    # Docker build
│   └── .gitignore                    # Git ignore
│
├── backend/                          # Express.js API Server
│   ├── src/
│   │   ├── models/                   # MongoDB schemas
│   │   │   ├── Student.ts
│   │   │   ├── Teacher.ts
│   │   │   ├── Class.ts
│   │   │   ├── Attendance.ts
│   │   │   ├── Grade.ts
│   │   │   ├── Fee.ts
│   │   │   ├── Timetable.ts
│   │   │   ├── LibraryBook.ts
│   │   │   └── LibraryIssue.ts
│   │   ├── controllers/              # Business logic
│   │   │   ├── studentController.ts
│   │   │   ├── teacherController.ts
│   │   │   ├── attendanceController.ts
│   │   │   └── gradeController.ts
│   │   ├── routes/                   # API routes
│   │   │   ├── studentRoutes.ts
│   │   │   ├── teacherRoutes.ts
│   │   │   ├── attendanceRoutes.ts
│   │   │   └── gradeRoutes.ts
│   │   ├── middleware/               # Middleware functions
│   │   ├── utils/                    # Helper functions
│   │   └── index.ts                  # Server entry point
│   ├── dist/                         # Compiled JavaScript
│   ├── package.json                  # Dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── .env.example                  # Environment template
│   ├── Dockerfile                    # Docker build
│   └── .gitignore                    # Git ignore
│
├── docs/                             # Documentation
│   ├── API.md                        # API documentation
│   ├── ARCHITECTURE.md               # Architecture documentation
│   └── CONTRIBUTING.md               # Contributing guide
│
├── .github/                          # GitHub configuration
├── README.md                         # Main documentation
├── SETUP.md                          # Setup guide
├── QUICKSTART.md                     # Quick start guide
└── docker-compose.yml                # Docker orchestration
```

---

## File Purposes at a Glance

### Configuration Files
| File | Purpose |
|------|---------|
| `package.json` | Project dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.js` | Tailwind CSS customization |
| `next.config.js` | Next.js customization |
| `.env.example` | Environment variables template |
| `.eslintrc.json` | Code linting rules |
| `Dockerfile` | Docker container build |
| `docker-compose.yml` | Multi-container orchestration |

### Documentation Files
| File | Content |
|------|---------|
| `README.md` | Project overview and features |
| `SETUP.md` | Detailed installation guide |
| `QUICKSTART.md` | Fast setup and first steps |
| `docs/API.md` | API endpoint documentation |
| `docs/ARCHITECTURE.md` | System design and structure |
| `docs/CONTRIBUTING.md` | Developer contribution guide |

### Source Code Structure
| Directory | Contains |
|-----------|----------|
| `frontend/app/` | Next.js pages and routes |
| `frontend/components/` | React components |
| `frontend/lib/` | Utilities and API client |
| `backend/src/models/` | MongoDB schemas |
| `backend/src/controllers/` | Business logic |
| `backend/src/routes/` | API endpoints |

---

## How to Use This Index

1. **Finding a Feature**
   - Student Management → `frontend/app/students/` & `backend/src/models/Student.ts`
   - Teacher Management → `frontend/app/teachers/` & `backend/src/models/Teacher.ts`
   - etc.

2. **Understanding Architecture**
   - Read `docs/ARCHITECTURE.md` for system design
   - Follow the code flow using this index

3. **Adding New Features**
   - Create new model in `backend/src/models/`
   - Create controller in `backend/src/controllers/`
   - Create routes in `backend/src/routes/`
   - Create components in `frontend/components/`
   - Create page in `frontend/app/`

4. **API Development**
   - Reference `docs/API.md` for existing endpoints
   - Check `backend/src/controllers/` for examples
   - Update routes in `backend/src/routes/`

5. **Frontend Development**
   - See `frontend/components/` for component examples
   - Check `frontend/lib/api.ts` for API calls
   - Use `frontend/styles/globals.css` for animations

---

## Next Steps

- **To Get Started**: Read [QUICKSTART.md](./QUICKSTART.md)
- **For Setup Details**: Check [SETUP.md](./SETUP.md)
- **For API Usage**: See [docs/API.md](./docs/API.md)
- **For Architecture**: Study [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **To Contribute**: Follow [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)

---

**This index will help you navigate the project efficiently!** ✨
