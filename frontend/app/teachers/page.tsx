"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const TeacherList = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Only admin, hr and superadmin can access the Teacher Directory
      if (user && !['admin', 'hr', 'superadmin'].includes(user.role)) {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  const fetchTeachers = async () => {
      try {
      setIsLoading(true);
      const res: any = await api.get('/teachers');
      if (res && res.success) {
        setTeachers(res.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch teachers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete teacher ${name}?`)) {
      try {
        await api.delete(`/teachers/${id}`);
        toast.success('Teacher deleted successfully');
        fetchTeachers(); // Refresh the list
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete teacher');
      }
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const fullName = `${teacher.firstName || ''} ${teacher.lastName || ''} ${teacher.name || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) ||
           teacher.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           teacher.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           teacher.email?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Teachers</h1>
          <p className="text-slate-400">Manage teacher information and assignments</p>
        </div>
        <Link href="/staff/add">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg hover:shadow-lg transition"
          >
            <FiPlus size={20} />
            Add Teacher
          </motion.button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 px-4 py-3 glass-effect rounded-lg border border-slate-700">
        <FiSearch size={20} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search teachers..."
          className="bg-transparent outline-none w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect rounded-xl overflow-hidden border border-slate-700"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/30">
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Employee ID</th>
                <th className="px-6 py-4 text-left font-semibold">Subject</th>
                <th className="px-6 py-4 text-left font-semibold">Experience</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Loading teachers...
                  </td>
                </tr>
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No teachers found.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher, idx) => (
                  <motion.tr
                    key={teacher._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-700 hover:bg-slate-800/20 transition"
                  >
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {teacher.name || `${teacher.firstName} ${teacher.lastName}`}
                    </td>
                    <td className="px-6 py-4 text-slate-300">{teacher.employeeId || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-300">{teacher.subject || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-300">{teacher.experience ? `${teacher.experience} years` : 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-300">{teacher.email}</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Link href={`/teachers/edit/${teacher._id}`}>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition" title="Edit Teacher">
                          <FiEdit2 size={18} className="text-blue-400" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(teacher._id, teacher.name || `${teacher.firstName} ${teacher.lastName}`)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition" title="Delete Teacher"
                      >
                        <FiTrash2 size={18} className="text-red-400" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherList;
