'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiUserPlus, FiShield, FiUser, FiMail, FiLock, FiArrowLeft, FiBriefcase, FiZap, FiPhone, FiMapPin, FiCalendar, FiHash, FiEye, FiEyeOff, FiAward, FiDollarSign } from 'react-icons/fi';
import api from '@/lib/api';
import Link from 'next/link';

const StaffOnboardingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'teacher',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    joiningDate: '',
    employeeId: '',
    dateOfBirth: '',
    gender: 'male',
    qualification: '',
    experience: 0,
    salary: 0,
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== confirmPassword) {
      toast.error('Passwords do not match. Please check both fields.');
      return;
    }
    
    setIsLoading(true);

    try {
      await api.post('/auth/onboard-staff', formData); 
      toast.success(`${formData.name} added as ${formData.role.toUpperCase()}`);
      if (formData.role === 'teacher') {
        router.push('/teachers');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add staff member');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "form-field pl-14 pr-6";
  const labelClasses = "form-label";

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-12 flex items-center gap-6">
        <Link 
          href="/"
          className="h-12 w-12 rounded-2xl border border-slate-200 bg-white/60 dark:border-white/10 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white transition-all active:scale-90 shadow-sm"
        >
          <FiArrowLeft size={22} />
        </Link>
        <div>
          <h1 className="text-4xl font-black font-outfit text-slate-900 dark:text-white tracking-tight">Add Staff Member</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-inter">Create a staff profile and portal access</p>
        </div>
      </div>

      <div className="grid gap-10">
        {/* Access Summary Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
            <FiShield size={120} />
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FiShield size={20} />
            </div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Role Access</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6 max-w-2xl font-inter">
            Add the staff details carefully. The selected role controls which dashboard modules this user can access.
          </p>
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <FiZap className="text-amber-400 mt-1" />
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                <span className="text-slate-900 dark:text-white font-bold block mb-1">HR Access</span>
                Admissions, notices, leave management, and institutional reports.
              </p>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <FiZap className="text-emerald-400 mt-1" />
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                <span className="text-slate-900 dark:text-white font-bold block mb-1">Teacher Access</span>
                Attendance, grades, assignments, and course materials.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Onboarding Form */}
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-10"
        >
          {/* Section 1: Primary Identity */}
          <div className="form-card relative">
            <h3 className="form-title flex items-center gap-4">
              <span className="h-[2px] w-8 bg-indigo-500/40" />
              Primary Details
            </h3>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClasses}>Full Name</label>
                <div className="relative group">
                  <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="text" required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Robert Ford"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Username</label>
                <div className="relative group">
                  <FiZap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="text" required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="staff_handle"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Email (Optional)</label>
                <div className="relative group">
                  <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="staff@school.edu"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Assigned Role</label>
                <div className="relative group">
                  <FiBriefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`${inputClasses} appearance-none cursor-pointer`}
                  >
                    <option value="teacher">Faculty Teacher</option>
                    <option value="hr">HR Officer</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Details */}
          <div className="form-card relative">
            <h3 className="form-title flex items-center gap-4">
              <span className="h-[2px] w-8 bg-teal-500/40" />
              Personal Details
            </h3>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-1">
                <label className={labelClasses}>Date of Birth</label>
                <div className="relative group">
                  <FiCalendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
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
                <div className="relative group">
                  <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className={`${inputClasses} appearance-none cursor-pointer`}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Contact Number</label>
                <div className="relative group">
                  <FiPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={18} />
                  <input
                    type="tel" required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone Number"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Professional Record */}
          <div className="form-card relative">
            <h3 className="form-title flex items-center gap-4">
              <span className="h-[2px] w-8 bg-amber-500/40" />
              Professional Details
            </h3>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClasses}>Employee ID</label>
                <div className="relative group">
                  <FiHash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" size={18} />
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    placeholder="EMP-T-001"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Qualification</label>
                <div className="relative group">
                  <FiAward className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" size={18} />
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. M.Ed, Ph.D, BS-IT"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Experience (Years)</label>
                <div className="relative group">
                  <FiBriefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" size={18} />
                  <input
                    type="number" min="0"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                    placeholder="Years of Experience"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Salary</label>
                <div className="relative group">
                  <FiDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" size={18} />
                  <input
                    type="number" min="0"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                    placeholder="Monthly Salary"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Joining Date</label>
                <div className="relative group">
                  <FiCalendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" size={18} />
                  <input
                    type="date" required
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Address */}
          <div className="form-card relative">
            <h3 className="form-title flex items-center gap-4">
              <span className="h-[2px] w-8 bg-rose-500/40" />
              Address & Location
            </h3>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-1 lg:col-span-2">
                <label className={labelClasses}>Residential Address</label>
                <div className="relative group">
                  <FiMapPin className="absolute left-5 top-4 text-slate-500 group-focus-within:text-rose-400 transition-colors" size={18} />
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street Address"
                    className={`${inputClasses} pl-14`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>City</label>
                <div className="relative group">
                  <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-400 transition-colors" size={18} />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Islamabad"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>State / Province</label>
                <div className="relative group">
                  <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-400 transition-colors" size={18} />
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Federal / Punjab"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Pin / Zip Code</label>
                <div className="relative group">
                  <FiHash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-400 transition-colors" size={18} />
                  <input
                    type="text"
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    placeholder="e.g. 44000"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Security Credentials */}
          <div className="form-card relative">
            <h3 className="form-title flex items-center gap-4">
              <span className="h-[2px] w-8 bg-purple-500/40" />
              Login Credentials
            </h3>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClasses}>Password</label>
                <div className="relative group">
                  <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"} required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className={inputClasses}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 focus:outline-none transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Confirm Password</label>
                <div className="relative group">
                  <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"} required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClasses}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 focus:outline-none transition-colors"
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-12">
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
                  Save Staff Member
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default StaffOnboardingPage;
