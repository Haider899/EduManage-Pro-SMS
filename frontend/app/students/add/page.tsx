'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  FiUserPlus, FiMail, FiLock, FiUser, FiArrowLeft, 
  FiHash, FiPhone, FiCalendar, FiMapPin, FiBriefcase, FiLayers, FiTag
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

  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch classes for dropdown (if they exist)
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res: any = await api.get('/classes');
        setClasses(res.data || []);
      } catch (err) {
        console.warn('Could not fetch classes, might be empty');
      }
    };
    // For now, if no classes endpoint exists yet, we'll use empty or mock
    // fetchClasses(); 
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
      toast.success('Student identity and access authorized successfully!');
      router.push('/students');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Onboarding failed');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-inter text-sm";
  const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 mb-2 block";

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
            <h1 className="text-4xl font-black font-outfit text-white tracking-tight">New Admission</h1>
            <p className="text-slate-500 text-sm font-inter">Authorized student onboarding protocol</p>
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
                  placeholder="+1 (555) 000-0000"
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
                  placeholder="e.g. STU-2024-001"
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
                  placeholder="Grade / Class Name"
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
                  placeholder="e.g. Section-A"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Portal Access */}
        <div className="glass-effect rounded-[2.5rem] border border-white/5 p-10 shadow-2xl">
          <h2 className="text-lg font-black font-outfit text-white mb-8 border-l-4 border-amber-500 pl-4 uppercase tracking-wider">
            Portal Authorization
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <label className={labelClasses}>Auth ID (Username)</label>
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
              <label className={labelClasses}>System Email</label>
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
              <label className={labelClasses}>Temporary Pass-key</label>
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
            className="w-full h-20 rounded-[2.5rem] bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 text-white font-black uppercase tracking-[0.4em] shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 disabled:opacity-50 transition-all flex items-center justify-center gap-4 text-sm"
          >
            {isLoading ? (
              <span className="h-6 w-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                <FiUserPlus size={24} />
                Finalize Authorization
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default AddStudentPage;
