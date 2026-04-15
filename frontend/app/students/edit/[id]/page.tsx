'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  FiSave, FiMail, FiUser, FiArrowLeft,
  FiHash, FiPhone, FiCalendar, FiMapPin, FiLayers, FiTag, FiLoader
} from 'react-icons/fi';
import api from '@/lib/api';
import Link from 'next/link';

const EditStudentPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
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
    status: 'active',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res: any = await api.get(`/students/${id}`);
        if (res && res.success && res.data) {
          const s = res.data;
          setFormData({
            firstName: s.firstName || '',
            lastName: s.lastName || '',
            email: s.email || '',
            rollNumber: s.rollNumber || '',
            phone: s.phone || '',
            dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : '',
            gender: s.gender || 'male',
            class: s.class || '',
            section: s.section || '',
            address: s.address || '',
            parentName: s.parentName || '',
            parentPhone: s.parentPhone || '',
            parentEmail: s.parentEmail || '',
            status: s.status || 'active',
          });
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to load student data');
        router.push('/students');
      } finally {
        setIsFetching(false);
      }
    };
    if (id) fetchStudent();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/students/${id}`, formData);
      toast.success('Student record updated successfully!');
      router.push('/students');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-inter text-sm";
  const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 mb-2 block";

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <FiLoader size={40} className="text-indigo-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/students"
            className="h-12 w-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90"
          >
            <FiArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-4xl font-black font-outfit text-white tracking-tight">Edit Student</h1>
            <p className="text-slate-500 text-sm font-inter">Modify student record: {formData.firstName} {formData.lastName}</p>
          </div>
        </div>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Section: Personal Intelligence */}
        <div className="glass-effect rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <FiUser size={120} />
          </div>
          <h2 className="text-lg font-black font-outfit text-white mb-8 border-l-4 border-indigo-500 pl-4 uppercase tracking-wider">
            Personal Intelligence
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
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-inter text-sm appearance-none"
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
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Academic Allocation */}
        <div className="glass-effect rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
          <h2 className="text-lg font-black font-outfit text-white mb-8 border-l-4 border-emerald-500 pl-4 uppercase tracking-wider">
            Academic Allocation
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <label className={labelClasses}>Registry Number (Roll)</label>
              <div className="relative group">
                <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="text" required
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Class Level</label>
              <div className="relative group">
                <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="text" required
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Section Unit</label>
              <div className="relative group">
                <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="text" required
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Contact & Portal */}
        <div className="glass-effect rounded-[2.5rem] border border-white/5 p-10 shadow-2xl">
          <h2 className="text-lg font-black font-outfit text-white mb-8 border-l-4 border-amber-500 pl-4 uppercase tracking-wider">
            Contact & Status
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className={labelClasses}>System Email</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-inter text-sm appearance-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Guardian & Residence */}
        <div className="glass-effect rounded-[2.5rem] border border-white/5 p-10 shadow-2xl">
          <h2 className="text-lg font-black font-outfit text-white mb-8 border-l-4 border-rose-500 pl-4 uppercase tracking-wider">
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
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="sticky bottom-10 z-30 pt-10">
          <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full h-20 rounded-[2.5rem] bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white font-black uppercase tracking-[0.4em] shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 disabled:opacity-50 transition-all flex items-center justify-center gap-4 text-sm"
          >
            {isLoading ? (
              <span className="h-6 w-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                <FiSave size={24} />
                Save Changes
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default EditStudentPage;
