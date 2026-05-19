'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  FiUserPlus, FiMail, FiLock, FiUser, FiArrowLeft, 
  FiHash, FiPhone, FiCalendar, FiMapPin, FiLayers, FiTag
} from 'react-icons/fi';
import api from '@/lib/api';
import Link from 'next/link';

const AddStudentPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    rollNumber: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    class: '',
    section: '',
    address: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Note: We're sending 'name' for the User account and firstName/lastName for the Student profile
      const payload = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
        id: undefined, // ensure no ID is passed
      };

      await api.post('/students', payload);
      toast.success('Student added successfully!');
      router.push('/students');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add student');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "form-field pl-12 pr-6";
  const labelClasses = "form-label";

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/students"
            className="h-12 w-12 rounded-2xl border border-slate-200 bg-white/60 dark:border-white/10 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white transition-all active:scale-90"
          >
            <FiArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-4xl font-black font-outfit text-slate-900 dark:text-white tracking-tight">Add Student</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-inter">Create a clear student profile and portal login</p>
          </div>
        </div>
      </div>

      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Section: Personal Details */}
        <div className="form-card relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <FiUser size={120} />
          </div>
          
          <h2 className="form-title">
            Personal Details
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className={labelClasses}>First Name</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="text" required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Alexander"
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Last Name</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="text" required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Pierce"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mt-6">
            <div className="space-y-1">
              <label className={labelClasses}>Date of Birth</label>
              <div className="relative group">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="date" required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="form-field appearance-none cursor-pointer"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Contact Number</label>
              <div className="relative group">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="tel" required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Academic Allocation */}
        <div className="form-card relative overflow-hidden">
          <h2 className="form-title">
            Academic Details
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <label className={labelClasses}>Roll Number</label>
              <div className="relative group">
                <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="text" required
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  placeholder="e.g. STU-2024-001"
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Class</label>
              <div className="relative group">
                <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="text" required
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  placeholder="Grade / Class Name"
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Section</label>
              <div className="relative group">
                <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="text" required
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="e.g. Section-A"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Portal Access */}
        <div className="form-card">
          <h2 className="form-title">
            Portal Access
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <label className={labelClasses}>Username</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="text" required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="alex_p"
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Email</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@school.edu"
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Temporary Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="password" required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Guardian & Logic */}
        <div className="form-card">
          <h2 className="form-title">
            Guardian & Residence
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className={labelClasses}>Guardian Full Name</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="text" required
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="Primary Guardian Name"
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Guardian Phone</label>
              <div className="relative group">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="tel" required
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  placeholder="Guardian Contact"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-1">
            <label className={labelClasses}>Full Residential Address</label>
            <div className="relative group">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input
                type="text" required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, City, State, Zip"
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* FAB: Submit */}
        <div className="sticky bottom-10 z-30 pt-10">
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full h-16 rounded-[2rem] btn-accent text-white font-black uppercase tracking-[0.22em] shadow-xl shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-4 text-sm"
          >
            {isLoading ? (
              <span className="h-6 w-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                <FiUserPlus size={24} />
                Save Student
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default AddStudentPage;
