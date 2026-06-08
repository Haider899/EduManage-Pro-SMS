'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import Link from 'next/link';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'teacher' | 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const passwordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.password);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      await api.post('/auth/register', dataToSend);
      toast.success('✨ Account created successfully! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg);
      if (error.response?.data?.field) {
        setErrors(prev => ({ ...prev, [error.response.data.field]: errorMsg }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-500">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-400/15 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/15 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.08] bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[550px]"
      >
        {/* Card Container */}
        <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/40 border border-white/40 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Gradient Top Bar */}
          <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700" />
          
          {/* Content */}
          <div className="p-8 md:p-12 space-y-8">
            {/* Logo & Header */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/30"
              >
                <span className="text-4xl font-black text-white">S</span>
              </motion.div>
              <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">Join EduManage Pro School Management System</p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm ${
                    errors.name 
                      ? 'border-red-400 focus:border-red-500 dark:border-red-500' 
                      : 'border-slate-200 dark:border-slate-600 focus:border-blue-500'
                  } focus:outline-none`}
                />
                {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Username *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="username"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm ${
                    errors.username 
                      ? 'border-red-400 focus:border-red-500 dark:border-red-500' 
                      : 'border-slate-200 dark:border-slate-600 focus:border-blue-500'
                  } focus:outline-none`}
                />
                {errors.username && <p className="text-xs text-red-500 font-medium">{errors.username}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="name@institution.com"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm ${
                    errors.email 
                      ? 'border-red-400 focus:border-red-500 dark:border-red-500' 
                      : 'border-slate-200 dark:border-slate-600 focus:border-blue-500'
                  } focus:outline-none`}
                />
                {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200 bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm ${
                      errors.password 
                        ? 'border-red-400 focus:border-red-500 dark:border-red-500' 
                        : 'border-slate-200 dark:border-slate-600 focus:border-blue-500'
                    } focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {formData.password && (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i <= strength ? ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strength - 1] : 'bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
                {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200 bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm ${
                      errors.confirmPassword 
                        ? 'border-red-400 focus:border-red-500 dark:border-red-500' 
                        : 'border-slate-200 dark:border-slate-600 focus:border-blue-500'
                    } focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword}</p>}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-6 mt-6 rounded-xl font-bold text-white text-base tracking-wide uppercase bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:shadow-2xl hover:shadow-blue-500/30 shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Creating account...
                  </>
                ) : 'Create Account'}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
            </div>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Already have an account?{' '}
                <Link 
                  href="/login"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-700/50 text-center">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              EduManage Pro • v1.1.0
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2"
        >
          <p>🔒 Secure registration • Your data is encrypted</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
