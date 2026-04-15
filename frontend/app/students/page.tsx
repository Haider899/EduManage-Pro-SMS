'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const StudentList = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res: any = await api.get('/students');
      if (res && res.success) {
        setStudents(res.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete student ${name}?`)) {
      try {
        await api.delete(`/students/${id}`);
        toast.success('Student deleted successfully');
        fetchStudents(); // Refresh the list
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  const filteredStudents = students.filter(student => 
    student.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Students</h1>
          <p className="text-slate-400">Manage student records and information</p>
        </div>
        <Link href="/students/add">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:shadow-lg transition text-white font-bold"
          >
            <FiPlus size={20} />
            Add Student
          </motion.button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 px-4 py-3 glass-effect rounded-lg border border-slate-700">
        <FiSearch size={20} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search students..."
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
                <th className="px-6 py-4 text-left font-semibold">Roll No</th>
                <th className="px-6 py-4 text-left font-semibold">Class</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => (
                  <motion.tr
                    key={student._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-700 hover:bg-slate-800/20 transition"
                  >
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 text-slate-300">{student.rollNumber || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-300">{student.class || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-300">{student.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === 'active' || !student.status
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {student.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Link href={`/students/edit/${student._id}`}>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition" title="Edit Student">
                          <FiEdit2 size={18} className="text-blue-400" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(student._id, `${student.firstName} ${student.lastName}`)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition" title="Delete Student"
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

export default StudentList;
