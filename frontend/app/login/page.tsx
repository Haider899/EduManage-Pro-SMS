'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ identifier: '', password: '' });
  const router = useRouter();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = { identifier: '', password: '' };
    if (!identifier.trim()) newErrors.identifier = 'Username or email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return !newErrors.identifier && !newErrors.password;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response: any = await api.post('/auth/login', { identifier, password });
      if (rememberMe) localStorage.setItem('rememberIdentifier', identifier);
      await login(response.token);
      toast.success('✨ Welcome back!');
      router.push('/');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Authentication failed. Please check your credentials.';
      toast.error(errorMsg);
      setErrors(prev => ({ ...prev, password: errorMsg }));
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberIdentifier');
    if (remembered) setIdentifier(remembered);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-500">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-400/15 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/15 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.08] bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[500px]"
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
              <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Sign In</h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">EduManage Pro School Management System</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username/Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Username or Email</label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errors.identifier) setErrors(prev => ({ ...prev, identifier: '' }));
                    }}
                    placeholder="Enter your username or email"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white/50 dark:bg-slate-700/30 backdrop-blur-sm ${
                      errors.identifier 
                        ? 'border-red-400 focus:border-red-500 dark:border-red-500' 
                        : 'border-slate-200 dark:border-slate-600 focus:border-blue-500'
                    } focus:outline-none`}
                  />
                </div>
                {errors.identifier && <p className="text-xs text-red-500 font-medium">{errors.identifier}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Password</label>
                  <button 
                    type="button"
                    onClick={() => router.push('/forgot-password')} 
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
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
                {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 accent-blue-600 cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                  Remember me
                </label>
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
                    Signing in...
                  </>
                ) : 'Sign In'}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
            </div>

            {/* Register Link */}
            <div className="text-center pt-2">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Don&apos;t have an account?{' '}
                <button 
                  type="button"
                  onClick={() => router.push('/register')}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition"
                >
                  Register here
                </button>
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
          <p>🔒 Secure connection with encryption</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
