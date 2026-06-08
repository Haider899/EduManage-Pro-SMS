# 🤝 Contributing Guide

Thank you for your interest in contributing to the School Management System! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and professional in all interactions
- Provide constructive feedback
- Focus on code quality and user experience
- Report security vulnerabilities responsibly

## Getting Started

### 1. Fork and Clone the Repository
```bash
$ git clone https://github.com/yourusername/school-management-system.git
$ cd school-management-system
```

### 2. Create a Feature Branch
```bash
$ git checkout -b feature/your-feature-name
# or for bug fixes
$ git checkout -b bugfix/issue-description
```

### 3. Follow Naming Conventions
- **Branches**: 
  - Feature: `feature/feature-name`
  - Bug fix: `bugfix/bug-description`
  - Documentation: `docs/doc-update`
  - Hotfix: `hotfix/critical-issue`

## Development Setup

### Backend Development
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Code Style Guide

### TypeScript
- Use strict mode
- Define types explicitly
- Avoid `any` types where possible
- Use interfaces for complex objects

**Example**:
```typescript
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const getStudent = (id: string): Promise<Student> => {
  // Implementation
};
```

### React/Next.js Components
- Use functional components with hooks
- Export components as default
- Use descriptive component names
- Add proper TypeScript types

**Example**:
```typescript
'use client';

interface StudentCardProps {
  student: Student;
  onEdit?: (id: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onEdit }) => {
  return (
    <div className="card">
      {/* Component content */}
    </div>
  );
};

export default StudentCard;
```

### CSS/Styling
- Use Tailwind CSS utilities
- Keep custom CSS minimal
- Use consistent color scheme
- Test responsive design

**Example**:
```css
.card-hover {
  @apply transition-all duration-300 hover:shadow-lg;
}

.glass-effect {
  @apply bg-slate-900/20 backdrop-blur-sm border border-slate-700;
}
```

### Comments and Documentation
- Comment complex logic only
- Use clear, concise language
- Include JSDoc for functions

**Example**:
```typescript
/**
 * Calculate student attendance percentage
 * @param presentDays - Number of days present
 * @param totalDays - Total school days
 * @returns Attendance percentage (0-100)
 */
const calculateAttendancePercentage = (
  presentDays: number,
  totalDays: number
): number => {
  return (presentDays / totalDays) * 100;
};
```

## Git Workflow

### 1. Make Changes
```bash
# Edit files
git status  # See changes
git diff    # See detailed changes
```

### 2. Commit Messages
Use clear, descriptive commit messages:

```bash
# Good
git commit -m "feat: Add student attendance tracking feature"
git commit -m "fix: Resolve database connection timeout issue"
git commit -m "docs: Update API documentation"
git commit -m "style: Fix linting errors in StudentComponent"

# Bad
git commit -m "Update"
git commit -m "Fix bug"
git commit -m "Changes"
```

### 3. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
# Then create a Pull Request on GitHub
```

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions
- `chore`: Build/tool changes

**Scope** (optional):
- `students`: Student management
- `teachers`: Teacher management
- `attendance`: Attendance tracking
- `grades`: Grade management
- `fees`: Fee management
- `library`: Library management
- `ui`: User interface
- `api`: Backend API

## Testing

### Backend Tests
```bash
cd backend
npm test  # Run tests
npm run test:watch  # Watch mode
npm run test:coverage  # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test  # Run tests
npm run test:watch  # Watch mode
```

### Manual Testing Checklist
- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] No accessibility violations
- [ ] Performance is acceptable
- [ ] Related features still work

## Performance Guidelines

### Frontend
- Keep component bundle size small
- Lazy load images and components
- Optimize animations
- Minimize re-renders

### Backend
- Use database indexes
- Implement pagination
- Cache frequently accessed data
- Optimize queries

## Documentation Requirements

- Update relevant documentation files
- Add comments for complex logic
- Include examples for new features
- Update CHANGELOG.md

## Pull Request Process

### Before Creating PR
1. **Update your branch**:
   ```bash
   git pull origin main
   git rebase main
   ```

2. **Run tests and linting**:
   ```bash
   npm test
   npm run lint
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

### Creating PR

**PR Title** (clear and descriptive):
```
feat(students): Add bulk student import feature
fix(attendance): Resolve date selection bug
```

**PR Description** (include):
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe how you tested the changes

## Screenshots (if applicable)
Add before/after screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings generated
```

### Review Process
- At least one review required
- Address feedback and comments
- Keep PR focused and reasonably sized
- Re-request review after changes

## Reporting Issues

### Bug Reports
Include:
- Clear description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/videos
- Environment details

### Feature Requests
Include:
- Clear description
- Use cases
- Proposed solution
- Alternative solutions

## Security

### Reporting Security Issues
**DO NOT** create a public issue for security vulnerabilities

Email security concerns to: security@schoolmanagementsystem.com

Include:
- Description of vulnerability
- Affected components
- Potential impact
- Suggested fix (optional)

## Areas for Contribution

### Backend
- [ ] Add more API endpoints
- [ ] Improve error handling
- [ ] Add validation rules
- [ ] Optimize queries
- [ ] Add caching

### Frontend
- [ ] Improve UI/UX
- [ ] Add 3D visualizations
- [ ] Improve animations
- [ ] Add dark mode toggle
- [ ] Improve accessibility

### Documentation
- [ ] Add tutorials
- [ ] Improve API docs
- [ ] Add troubleshooting guide
- [ ] Translate to other languages

### Testing
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Add end-to-end tests
- [ ] Improve test coverage

## Development Tools

### Recommended IDE Extensions (VS Code)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Thunder Client (API testing)
- MongoDB for VS Code

### Useful Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linters
npm run type-check   # Check TypeScript

# Backend
npm run dev          # Start dev server with auto-reload
npm run build        # Compile TypeScript
npm run start        # Run compiled code
npm run lint         # Run linters
```

## Questions?

- Create an issue with the `question` label
- Join our community chat (Discord/Slack)
- Read the documentation
- Check existing issues and PRs

## License

By contributing, you agree that your contributions will be licensed under the project's license.

---

Thank you for contributing to making the School Management System better! 🚀

**Happy Coding!** ✨
