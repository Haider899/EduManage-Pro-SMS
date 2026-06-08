# 🔗 Quick Reference Guide

## Essential URLs

### Development URLs
| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:5000/api |
| **Health Check** | http://localhost:5000/api/health |
| **MongoDB** | mongodb://admin:admin123@localhost:27017 |

### Feature Pages
| Feature | URL |
|---------|-----|
| Dashboard | http://localhost:3000 |
| Students | http://localhost:3000/students |
| Teachers | http://localhost:3000/teachers |
| Attendance | http://localhost:3000/attendance |
| Grades | http://localhost:3000/grades |
| Fees | http://localhost:3000/fees |
| Timetable | http://localhost:3000/timetable |
| Library | http://localhost:3000/library |

---

## Terminal Commands

### Docker Commands
```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Check status
docker-compose ps

# Stop everything
docker-compose down

# Stop and remove data
docker-compose down -v

# Rebuild containers
docker-compose up -d --build

# View specific container logs
docker logs sms-backend
docker logs sms-frontend
docker logs sms-mongodb
```

### Backend Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run linter
npm run lint

# Check TypeScript
npm run type-check
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run linter
npm run lint

# Type check
npm run type-check
```

### MongoDB Commands (if using manual setup)
```bash
# Connect to MongoDB
mongosh

# Or with authentication
mongosh mongodb://admin:admin123@localhost:27017

# Inside MongoDB shell
use school-management-system  # Switch database

show collections               # List all collections

db.students.find()           # View all students
db.students.find().pretty()  # Pretty format

db.students.insertOne({      # Insert a student
  rollNumber: "STU001",
  firstName: "John",
  lastName: "Doe"
})

db.students.updateOne(       # Update a student
  { _id: ObjectId("...") },
  { $set: { firstName: "Jane" } }
)

db.students.deleteOne(       # Delete a student
  { _id: ObjectId("...") }
)

db.students.countDocuments() # Count documents

session.exit()               # Exit MongoDB
```

### Version Checking
```bash
# Check Node version
node --version         # Should be 18+

# Check npm version
npm --version          # Should be 9+

# Check MongoDB version (if installed)
mongod --version

# Check Docker version
docker --version
docker-compose --version
```

---

## API Endpoints

### Students
```bash
GET    /api/students              # Get all students
GET    /api/students/:id          # Get one student
POST   /api/students              # Create student
PUT    /api/students/:id          # Update student
DELETE /api/students/:id          # Delete student
```

### Teachers
```bash
GET    /api/teachers              # Get all teachers
GET    /api/teachers/:id          # Get one teacher
POST   /api/teachers              # Create teacher
PUT    /api/teachers/:id          # Update teacher
DELETE /api/teachers/:id          # Delete teacher
```

### Attendance
```bash
GET    /api/attendance            # Get attendance records
POST   /api/attendance            # Mark attendance
GET    /api/attendance/student/:id # Get student attendance
```

### Grades
```bash
GET    /api/grades                # Get all grades
POST   /api/grades                # Create grade
PUT    /api/grades/:id            # Update grade
```

---

## API Request Examples

### Using cURL

```bash
# GET all students
curl -X GET http://localhost:5000/api/students

# GET health check
curl -X GET http://localhost:5000/api/health

# POST create student
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "rollNumber": "STU001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "dateOfBirth": "2008-05-15",
    "gender": "male",
    "class": "507f1f77bcf86cd799439012",
    "section": "A",
    "parentName": "Jane Doe",
    "parentPhone": "0987654321"
  }'

# PUT update student
curl -X PUT http://localhost:5000/api/students/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Johnny"}'

# DELETE student
curl -X DELETE http://localhost:5000/api/students/507f1f77bcf86cd799439011
```

### Using PowerShell
```powershell
# GET request
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET

# POST request
$body = @{
    rollNumber = "STU001"
    firstName = "John"
    lastName = "Doe"
    email = "john@example.com"
    phone = "1234567890"
    dateOfBirth = "2008-05-15"
    gender = "male"
    class = "507f1f77bcf86cd799439012"
    section = "A"
    parentName = "Jane Doe"
    parentPhone = "0987654321"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/students" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

## File Navigation

### Documentation Files
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start (5 min)
- **[SETUP.md](./SETUP.md)** - Detailed setup
- **[README.md](./README.md)** - Full documentation
- **[FILE_INDEX.md](./FILE_INDEX.md)** - File reference
- **[docs/API.md](./docs/API.md)** - API documentation
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System design
- **[docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)** - Developer guide

### Frontend Files
- **Pages**: `frontend/app/*/page.tsx`
- **Components**: `frontend/components/*/`
- **Styles**: `frontend/styles/globals.css`
- **API Client**: `frontend/lib/api.ts`
- **Config**: `frontend/tailwind.config.js`

### Backend Files
- **Entry Point**: `backend/src/index.ts`
- **Models**: `backend/src/models/*.ts`
- **Controllers**: `backend/src/controllers/*.ts`
- **Routes**: `backend/src/routes/*.ts`
- **Config**: `backend/.env`

---

## Troubleshooting Commands

### Check if Service is Running
```bash
# Check if frontend is running
curl -s http://localhost:3000 > /dev/null && echo "Frontend OK" || echo "Frontend DOWN"

# Check if backend is running
curl -s http://localhost:5000/api/health > /dev/null && echo "Backend OK" || echo "Backend DOWN"

# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"
```

### Free Ports
```bash
# Windows PowerShell - Kill process using port
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux - Kill process using port
lsof -i :3000
kill -9 <PID>
```

### View Running Containers
```bash
# List all containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container stats
docker stats
```

### Database Reset
```bash
# Backup database
mongodump --uri="mongodb://admin:admin123@localhost:27017"

# Restore database
mongorestore --uri="mongodb://admin:admin123@localhost:27017"

# Drop specific database
mongosh -eval "use school-management-system; db.dropDatabase()"
```

---

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://admin:admin123@localhost:27017/school-management-system
JWT_SECRET=your-super-secret-key
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=School Management System
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

---

## Log File Locations

### Docker Logs
```bash
docker-compose logs --tail=100 backend
docker-compose logs --tail=100 frontend
docker-compose logs --tail=100 mongodb
```

### Local Development Logs
- **Frontend**: Terminal running `npm run dev`
- **Backend**: Terminal running `npm run dev`
- **MongoDB**: System logs or terminal

---

## Performance Testing

### Frontend Performance
```bash
# Build performance
cd frontend
npm run build

# Check bundle size
npm install -g webpack-bundle-analyzer
# Add to build process or analyze manually
```

### Backend Performance
```bash
# Monitor backend
curl -s http://localhost:5000/api/health | jq .

# Load test with Apache Bench
ab -n 100 -c 10 http://localhost:5000/api/students

# Load test with curl-loader
curl-loader -config test.conf
```

### Database Performance
```bash
# Check query performance
db.students.find().explain("executionStats")

# Check indexes
db.students.getIndexes()

# Create index for faster queries
db.students.createIndex({ email: 1 })
```

---

## Git Commands (for Version Control)

```bash
# Initialize git repository
git init

# Add all changes
git add .

# Commit changes
git commit -m "feat: Initial project setup"

# Create a new branch
git checkout -b feature/my-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/my-feature

# View commit history
git log --oneline

# View changes
git diff
git diff --staged
```

---

## Useful VS Code Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Command palette |
| `Ctrl+~` | Toggle terminal |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+F` | Find in file |
| `Ctrl+H` | Find and replace |
| `Alt+Up/Down` | Move line |
| `Shift+Alt+Up/Down` | Duplicate line |
| `Ctrl+/` | Toggle comment |
| `F2` | Rename symbol |
| `Ctrl+D` | Multi-select |

---

## Tech Stack Versions

| Technology | Version | Link |
|-----------|---------|------|
| Next.js | 14.0+ | https://nextjs.org |
| React | 18.2+ | https://react.dev |
| Express | 4.18+ | https://expressjs.com |
| MongoDB | 7.0+ | https://www.mongodb.com |
| Node.js | 18.0+ | https://nodejs.org |
| TypeScript | 5.3+ | https://www.typescriptlang.org |
| Tailwind CSS | 3.3+ | https://tailwindcss.com |
| Framer Motion | 10.16+ | https://www.framer.com/motion |

---

## External Resources

### Documentation
- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com
- **MongoDB Docs**: https://docs.mongodb.com
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

### Tools
- **Postman** (API Testing): https://www.postman.com
- **MongoDB Compass**: https://www.mongodb.com/products/compass
- **VS Code**: https://code.visualstudio.com
- **Docker**: https://www.docker.com

### Learning
- **Next.js Tutorial**: https://nextjs.org/learn
- **Node.js Tutorial**: https://nodejs.org/en/docs
- **MongoDB University**: https://university.mongodb.com
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook

---

## Quick Decision Tree

**Need to...** → **Do this:**

| Task | Command |
|------|---------|
| Start application | `docker-compose up -d` |
| Stop application | `docker-compose down` |
| View logs | `docker-compose logs -f` |
| Add student via API | `curl -X POST http://localhost:5000/api/students ...` |
| Check API health | `curl http://localhost:5000/api/health` |
| Connect to database | `mongosh mongodb://admin:admin123@localhost:27017` |
| Start frontend only | `cd frontend && npm run dev` |
| Start backend only | `cd backend && npm run dev` |
| Build for production | `npm run build` (in frontend or backend) |
| Run linter | `npm run lint` |
| Check types | `npm run type-check` |

---

**Bookmark this page for quick reference!** 📌

---

*Last Updated: January 2024*
*School Management System - Professional Edition*
