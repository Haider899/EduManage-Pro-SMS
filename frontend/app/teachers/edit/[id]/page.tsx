'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  FiSave, FiMail, FiUser, FiArrowLeft,
  FiHash, FiPhone, FiCalendar, FiMapPin, FiBriefcase, FiAward, FiLoader, FiDollarSign
} from 'react-icons/fi';
import api from '@/lib/api';
import Link from 'next/link';

const EditTeacherPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    phone: '',
    dateOfBirth: '',
    gender: 'other',
    qualification: '',
    experience: 0,
    salary: 0,
    address: '',
    city: '',
    state: '',
    pinCode: '',
    joiningDate: '',
    status: 'active',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res: any = await api.get(`/teachers/${id}`);
        if (res && res.success && res.data) {
          const t = res.data;
          setFormData({
            firstName: t.firstName || '',
            lastName: t.lastName || '',
            email: t.email || '',
            employeeId: t.employeeId || '',
            phone: t.phone || '',
            dateOfBirth: t.dateOfBirth ? new Date(t.dateOfBirth).toISOString().split('T')[0] : '',
            gender: t.gender || 'other',
            qualification: t.qualification || '',
            experience: t.experience || 0,
            salary: t.salary || 0,
            address: t.address || '',
            city: t.city || '',
            state: t.state || '',
            pinCode: t.pinCode || '',
            joiningDate: t.joiningDate ? new Date(t.joiningDate).toISOString().split('T')[0] : '',
            status: t.status || 'active',
          });
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to load teacher data');
        router.push('/teachers');
      } finally {
        setIsFetching(false);
      }
    };
    if (id) fetchTeacher();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/teachers/${id}`, formData);
      toast.success('Teacher record updated successfully!');
      router.push('/teachers');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/40 transition-all font-inter text-sm";
  const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 mb-2 block";

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <FiLoader size={40} className="text-teal-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/teachers"
            className="h-12 w-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90"
          >
            <FiArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-4xl font-black font-outfit text-cyan-400 tracking-tight">Edit Teacher</h1>
            <p className="text-slate-500 text-sm font-inter">Modify record: {formData.firstName} {formData.lastName}</p>
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
        <div className="glass-effect rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <FiUser size={120} />
          </div>
          <h2 className="text-lg font-black font-outfit text-cyan-400 mb-8 border-l-4 border-cyan-500 pl-4 uppercase tracking-wider">
            Personal Details
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className={labelClasses}>First Name</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-teal-400 transition-colors" size={18} />
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
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-teal-400 transition-colors" size={18} />
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
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-teal-400 transition-colors" size={18} />
                <input
                  type="date"
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
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/40 transition-all font-inter text-sm appearance-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Contact Number</label>
              <div className="relative group">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-teal-400 transition-colors" size={18} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Professional Info */}
        <div className="glass-effect rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
          <h2 className="text-lg font-black font-outfit text-cyan-400 mb-8 border-l-4 border-cyan-500 pl-4 uppercase tracking-wider">
            Professional Record
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className={labelClasses}>Employee ID</label>
              <div className="relative group">
                <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-400 transition-colors" size={18} />
                <input
                  type="text" required
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Email</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-400 transition-colors" size={18} />
                <input
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Qualification</label>
              <div className="relative group">
                <FiAward className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-400 transition-colors" size={18} />
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g. M.Ed, Ph.D"
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Experience (Years)</label>
              <div className="relative group">
                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-400 transition-colors" size={18} />
                <input
                  type="number" min="0"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Salary</label>
              <div className="relative group">
                <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-400 transition-colors" size={18} />
                <input
                  type="number" min="0"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Joining Date</label>
              <div className="relative group">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-400 transition-colors" size={18} />
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Address & Status */}
        <div className="glass-effect rounded-[2.5rem] border border-white/5 p-10 shadow-2xl">
          <h2 className="text-lg font-black font-outfit text-cyan-400 mb-8 border-l-4 border-cyan-500 pl-4 uppercase tracking-wider">
            Address & Status
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1 md:col-span-2">
              <label className={labelClasses}>Full Address</label>
              <div className="relative group">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-rose-400 transition-colors" size={18} />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>City</label>
              <div className="relative group">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-rose-400 transition-colors" size={18} />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>State</label>
              <div className="relative group">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-rose-400 transition-colors" size={18} />
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Pin Code</label>
              <div className="relative group">
                <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-rose-400 transition-colors" size={18} />
                <input
                  type="text"
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/40 transition-all font-inter text-sm appearance-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
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
            className="w-full h-20 rounded-[2.5rem] bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-700 text-white font-black uppercase tracking-[0.4em] shadow-2xl shadow-teal-500/40 hover:shadow-teal-500/60 disabled:opacity-50 transition-all flex items-center justify-center gap-4 text-sm"
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

export default EditTeacherPage;
