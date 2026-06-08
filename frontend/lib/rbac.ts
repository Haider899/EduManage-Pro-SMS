import {
  FiActivity,
  FiBook,
  FiBookOpen,
  FiCalendar,
  FiClipboard,
  FiDollarSign,
  FiFileText,
  FiHome,
  FiLayers,
  FiMessageSquare,
  FiShield,
  FiUser,
  FiUsers,
} from 'react-icons/fi';

export type Role = 'superadmin' | 'admin' | 'hr' | 'teacher' | 'student';

export interface MenuItem {
  icon: any;
  label: string;
  href: string;
  description: string;
  roles: Role[];
}

export interface RoleProfile {
  title: string;
  strapline: string;
  badge: string;
  accent: string;
  summary: string;
}

export const AUTH_PAGES = ['/login', '/register', '/forgot-password'];

export const roleProfiles: Record<Role, RoleProfile> = {
  superadmin: {
    title: 'Command Center',
    strapline: 'Global control over academics, staffing, finance, and security.',
    badge: 'Super Admin',
    accent: 'from-cyan-400 via-sky-500 to-blue-600',
    summary: 'Full institutional visibility with unrestricted operations.',
  },
  admin: {
    title: 'Operations Hub',
    strapline: 'Manage admissions, faculty performance, notices, and finance.',
    badge: 'Administrator',
    accent: 'from-orange-400 via-amber-500 to-rose-500',
    summary: 'Oversight across academic operations and institutional reporting.',
  },
  hr: {
    title: 'People Desk',
    strapline: 'Handle staff onboarding, student intake, attendance, and leave flow.',
    badge: 'HR Control',
    accent: 'from-emerald-400 via-teal-500 to-cyan-600',
    summary: 'Focused workflows for staffing, admissions, and people operations.',
  },
  teacher: {
    title: 'Faculty Workspace',
    strapline: 'Run classes, publish materials, track attendance, and grade outcomes.',
    badge: 'Teaching',
    accent: 'from-fuchsia-400 via-violet-500 to-indigo-600',
    summary: 'Daily class management and academic delivery.',
  },
  student: {
    title: 'Student Portal',
    strapline: 'Monitor learning progress, schedule, attendance, and personal profile.',
    badge: 'Learner',
    accent: 'from-pink-400 via-rose-500 to-orange-500',
    summary: 'Personal academic progress, schedule, and campus visibility.',
  },
};

export const menuItems: MenuItem[] = [
  { icon: FiHome, label: 'Dashboard', href: '/', description: 'Personalized overview', roles: ['superadmin', 'admin', 'hr', 'teacher', 'student'] },
  { icon: FiShield, label: 'Staff Access', href: '/staff/add', description: 'Create privileged identities', roles: ['superadmin', 'admin', 'hr'] },
  { icon: FiUsers, label: 'Students', href: '/students', description: 'Directory and records', roles: ['superadmin', 'admin', 'hr', 'teacher'] },
  { icon: FiUsers, label: 'New Student', href: '/students/add', description: 'Admission workflow', roles: ['superadmin', 'admin', 'hr'] },
  { icon: FiLayers, label: 'Bulk Import', href: '/students/import', description: 'Mass enrollment intake', roles: ['superadmin', 'admin', 'hr'] },
  { icon: FiBook, label: 'Teachers', href: '/teachers', description: 'Faculty directory', roles: ['superadmin', 'admin', 'hr'] },
  { icon: FiActivity, label: 'Attendance', href: '/attendance', description: 'Attendance analytics', roles: ['superadmin', 'admin', 'hr', 'teacher', 'student'] },
  { icon: FiClipboard, label: 'Mark Attendance', href: '/attendance/mark', description: 'Classroom attendance input', roles: ['superadmin', 'admin', 'teacher'] },
  { icon: FiBookOpen, label: 'Grades', href: '/grades', description: 'Assessment performance', roles: ['superadmin', 'admin', 'teacher', 'student'] },
  { icon: FiCalendar, label: 'Timetable', href: '/timetable', description: 'Schedule and slots', roles: ['superadmin', 'admin', 'hr', 'teacher', 'student'] },
  { icon: FiDollarSign, label: 'Fees', href: '/fees', description: 'Finance and ledger', roles: ['superadmin', 'admin', 'hr'] },
  { icon: FiMessageSquare, label: 'Notices', href: '/notices/manage', description: 'Announcements and governance', roles: ['superadmin', 'admin', 'hr'] },
  { icon: FiFileText, label: 'Reports', href: '/reports/full', description: 'Institution insights', roles: ['superadmin', 'admin'] },
  { icon: FiCalendar, label: 'Leave Desk', href: '/leaves/manage', description: 'Approvals and workforce planning', roles: ['superadmin', 'admin', 'hr'] },
  { icon: FiCalendar, label: 'Apply Leave', href: '/leaves/apply', description: 'Submit a leave request', roles: ['superadmin', 'teacher'] },
  { icon: FiBookOpen, label: 'Assignments', href: '/assignments', description: 'Task planning and distribution', roles: ['superadmin', 'teacher', 'student'] },
  { icon: FiBookOpen, label: 'Materials', href: '/teachers/materials', description: 'Teaching resources', roles: ['superadmin', 'teacher'] },
  { icon: FiUser, label: 'Profile', href: '/profile', description: 'Personal account details', roles: ['superadmin', 'admin', 'hr', 'teacher', 'student'] },
];

export const getRoleMenu = (role?: Role | null) => {
  if (!role) return [];
  return menuItems.filter((item) => item.roles.includes(role));
};

export const canAccessPath = (role: Role | null | undefined, pathname: string) => {
  if (!role) return false;
  if (AUTH_PAGES.some((page) => pathname === page) || pathname.startsWith('/reset-password/')) return true;
  if (role === 'superadmin') return true;

  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  return menuItems.some((item) => {
    if (!item.roles.includes(role)) return false;
    return normalized === item.href || normalized.startsWith(`${item.href}/`);
  });
};
