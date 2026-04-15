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
      toast.error('Pass-keys do not match. Please verify your credentials.');
      return;
    }
    
    setIsLoading(true);

    try {
      await api.post('/auth/onboard-staff', formData); 
      toast.success(`Identity established: ${formData.name} authorized as ${formData.role.toUpperCase()}`);
      if (formData.role === 'teacher') {
        router.push('/teachers');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Onboarding protocol failed');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all font-inter shadow-inner";
  const labelClasses = "text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1 mb-2 block";

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-12 flex items-center gap-6">
        <Link 
          href="/"
          className="h-12 w-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90 shadow-xl"
        >
          <FiArrowLeft size={22} />
        </Link>
        <div>
          <h1 className="text-4xl font-black font-outfit text-white tracking-tight uppercase">Staff Intelligence Portal</h1>
          <p className="text-slate-500 text-sm font-inter tracking-widest uppercase">Administrative Control Unit: Full Profile Onboarding</p>
        </div>
      </div>

      <div className="grid gap-10">
        {/* Security Intelligence Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-[2.5rem] border border-white/5 p-8 relative overflow-hidden bg-gradient-to-br from-indigo-500/5 to-transparent shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
            <FiShield size={120} />
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FiShield size={20} />
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Security Protocols</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6 max-w-2xl font-inter">
            Establishing a new staff identity generates a permanent professional record linked to their portal credentials. Ensure all legal data is audited before finalization.
          </p>
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <FiZap className="text-amber-400 mt-1" />
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                <span className="text-white font-bold block mb-1">HR Clearance</span>
                Authorized for Admissions, Notice Management, and Institutional Reporting.
              </p>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <FiZap className="text-emerald-400 mt-1" />
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                <span className="text-white font-bold block mb-1">Faculty Clearance</span>
                Authorized for Attendance Monitoring, Grading, and Course Management.
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
          <div className="glass-effect rounded-[3rem] border border-white/5 p-12 shadow-3xl bg-slate-900/40 relative">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.5em] mb-8 flex items-center gap-4">
              <span className="h-[2px] w-8 bg-indigo-500/40" />
              Sector 1: Primary Identity
            </h3>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClasses}>Legal Name</label>
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
                <label className={labelClasses}>Identity Handle (Username)</label>
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
          <div className="glass-effect rounded-[3rem] border border-white/5 p-12 shadow-3xl bg-slate-900/40 relative">
            <h3 className="text-xs font-black text-teal-400 uppercase tracking-[0.5em] mb-8 flex items-center gap-4">
              <span className="h-[2px] w-8 bg-teal-500/40" />
              Sector 2: Personal Details
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
          <div className="glass-effect rounded-[3rem] border border-white/5 p-12 shadow-3xl bg-slate-900/40 relative">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-[0.5em] mb-8 flex items-center gap-4">
              <span className="h-[2px] w-8 bg-amber-500/40" />
              Sector 3: Professional Record
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
          <div className="glass-effect rounded-[3rem] border border-white/5 p-12 shadow-3xl bg-slate-900/40 relative">
            <h3 className="text-xs font-black text-rose-400 uppercase tracking-[0.5em] mb-8 flex items-center gap-4">
              <span className="h-[2px] w-8 bg-rose-500/40" />
              Sector 4: Address & Location
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
          <div className="glass-effect rounded-[3rem] border border-white/5 p-12 shadow-3xl bg-slate-900/40 relative">
            <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.5em] mb-8 flex items-center gap-4">
              <span className="h-[2px] w-8 bg-purple-500/40" />
              Sector 5: Security Credentials
            </h3>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClasses}>Initial Pass-key</label>
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
                <label className={labelClasses}>Confirm Pass-key</label>
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
              className="w-full h-20 rounded-[2.5rem] bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 text-white font-black uppercase tracking-[0.4em] shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 disabled:opacity-50 transition-all flex items-center justify-center gap-4 text-sm"
            >
              {isLoading ? (
                <span className="h-6 w-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <>
                  <FiUserPlus size={24} />
                  Initialize Staff Identity
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
