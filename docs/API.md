# 📚 API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "status": 400
}
```

## Endpoints

### Health Check
```
GET /health
```
**Description**: Check if the server is running

**Response**:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Students

### Get All Students
```
GET /students
```

**Query Parameters**:
- `page` (optional): Pagination page number
- `limit` (optional): Records per page
- `search` (optional): Search by name or email
- `class` (optional): Filter by class ID

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "rollNumber": "STU001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "dateOfBirth": "2008-05-15",
      "gender": "male",
      "class": "507f1f77bcf86cd799439012",
      "section": "A",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "pinCode": "10001",
      "parentName": "Jane Doe",
      "parentPhone": "0987654321",
      "parentEmail": "jane@example.com",
      "admissionDate": "2023-06-01",
      "photo": "https://example.com/photo.jpg",
      "status": "active",
      "createdAt": "2023-06-01T12:00:00Z",
      "updatedAt": "2023-06-01T12:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}
```

### Get Student by ID
```
GET /students/:id
```

**URL Parameters**:
- `id`: Student MongoDB ID

**Response**: Returns single student object

### Create Student
```
POST /students
```

**Request Body**:
```json
{
  "rollNumber": "STU001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "dateOfBirth": "2008-05-15",
  "gender": "male",
  "class": "507f1f77bcf86cd799439012",
  "section": "A",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "pinCode": "10001",
  "parentName": "Jane Doe",
  "parentPhone": "0987654321",
  "parentEmail": "jane@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "data": { /* student object */ },
  "message": "Student created successfully"
}
```

### Update Student
```
PUT /students/:id
```

**URL Parameters**:
- `id`: Student MongoDB ID

**Request Body**: Same as create (partial update allowed)

**Response**: Updated student object

### Delete Student
```
DELETE /students/:id
```

**URL Parameters**:
- `id`: Student MongoDB ID

**Response**:
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

## Teachers

### Get All Teachers
```
GET /teachers
```

**Query Parameters**:
- `page` (optional): Pagination page number
- `limit` (optional): Records per page
- `search` (optional): Search by name or email
- `qualification` (optional): Filter by qualification
- `status` (optional): Filter by status (active/inactive/on-leave)

**Response**: Array of teacher objects

### Get Teacher by ID
```
GET /teachers/:id
```

### Create Teacher
```
POST /teachers
```

**Request Body**:
```json
{
  "employeeId": "EMP001",
  "firstName": "Robert",
  "lastName": "Wilson",
  "email": "robert@example.com",
  "phone": "1234567890",
  "dateOfBirth": "1990-03-20",
  "gender": "male",
  "qualification": "B.Tech Computer Science",
  "experience": 10,
  "specialization": ["Mathematics", "Science"],
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "pinCode": "10001",
  "salary": 50000
}
```

### Update Teacher
```
PUT /teachers/:id
```

### Delete Teacher
```
DELETE /teachers/:id
```

---

## Attendance

### Get Attendance Records
```
GET /attendance
```

**Query Parameters**:
- `studentId` (optional): Filter by student ID
- `classId` (optional): Filter by class ID
- `date` (optional): Filter by date (YYYY-MM-DD format)
- `status` (optional): Filter by status (present/absent/late/excused)

**Response**: Array of attendance records

### Mark Attendance
```
POST /attendance
```

**Request Body**:
```json
{
  "student": "507f1f77bcf86cd799439011",
  "class": "507f1f77bcf86cd799439012",
  "date": "2024-01-15",
  "status": "present",
  "remarks": "Present and attentive",
  "markedBy": "507f1f77bcf86cd799439013"
}
```

### Get Student Attendance
```
GET /attendance/student/:studentId
```

**Response**: Array of attendance records for the student

---

## Grades

### Get All Grades
```
GET /grades
```

**Query Parameters**:
- `studentId` (optional): Filter by student ID
- `classId` (optional): Filter by class ID
- `subject` (optional): Filter by subject
- `semester` (optional): Filter by semester

**Response**: Array of grade objects

### Create Grade
```
POST /grades
```

**Request Body**:
```json
{
  "student": "507f1f77bcf86cd799439011",
  "subject": "Mathematics",
  "class": "507f1f77bcf86cd799439012",
  "semester": "Sem-1",
  "term": "Mid Term",
  "marks": 85,
  "maxMarks": 100,
  "percentage": 85,
  "grade": "A",
  "remarks": "Good performance",
  "basedOn": "exam"
}
```

### Update Grade
```
PUT /grades/:id
```

**Request Body**: Same as create (partial update allowed)

---

## Example Requests

### Using cURL

#### Get All Students
```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer your_token_here"
```

#### Create Student
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \
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
```

### Using JavaScript/Fetch

```javascript
// Get all students
const response = await fetch('http://localhost:5000/api/students', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your_token_here'
  }
});

const data = await response.json();
console.log(data);

// Create student
const createResponse = await fetch('http://localhost:5000/api/students', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token_here'
  },
  body: JSON.stringify({
    rollNumber: 'STU001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    dateOfBirth: '2008-05-15',
    gender: 'male',
    class: '507f1f77bcf86cd799439012',
    section: 'A',
    parentName: 'Jane Doe',
    parentPhone: '0987654321'
  })
});

const createdStudent = await createResponse.json();
console.log(createdStudent);
```

### Using Axios (Frontend)

```javascript
import api from '@/lib/api';

// Get all students
const students = await api.get('/students');
console.log(students.data);

// Create student
const newStudent = await api.post('/students', {
  rollNumber: 'STU001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  // ... other fields
});

// Update student
const updated = await api.put('/students/507f1f77bcf86cd799439011', {
  firstName: 'Johnny',
  // ... updated fields
});

// Delete student
await api.delete('/students/507f1f77bcf86cd799439011');
```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error occurred |
| 503 | Service Unavailable | Service temporarily unavailable |

## Rate Limiting

- Rate limit: 100 requests per minute per IP
- Headers returned:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time (Unix timestamp)

## Pagination

Endpoints that support pagination use these parameters:

```
GET /endpoint?page=1&limit=10
```

**Response includes**:
```json
{
  "success": true,
  "data": [],
  "total": 100,
  "page": 1,
  "limit": 10,
  "pages": 10
}
```

## Best Practices

1. **Always include authentication token** for protected endpoints
2. **Use appropriate HTTP methods** (GET, POST, PUT, DELETE)
3. **Handle errors properly** with try-catch or promise.catch()
4. **Validate input data** before sending
5. **Use pagination** for large datasets
6. **Cache responses** where appropriate
7. **Implement retry logic** for network failures

---

**For more examples and testing, use tools like Postman or Insomnia**
