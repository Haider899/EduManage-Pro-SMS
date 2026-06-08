'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiImage, FiLock, FiSave, FiArrowLeft, FiShield } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const ProfileEditPage = () => {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  
  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    passwordCurrent: '',
    password: '',
    passwordConfirm: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      await api.patch('/auth/updateMe', profileData);
      await refreshUser();
      toast.success('✨ Profile details updated successfully');
      router.push('/profile');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.passwordConfirm) {
      toast.error('New passwords do not match');
      return;
    }
    setPasswordLoading(true);

    try {
      await api.patch('/auth/updatePassword', passwordData);
      toast.success('🔒 Password updated successfully');
      setPasswordData({
        passwordCurrent: '',
        password: '',
        passwordConfirm: '',
      });
      router.push('/profile');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Password update failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-cyan-600 transition-colors text-xs font-black uppercase tracking-widest"
        >
          <FiArrowLeft size={16} />
          Back
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-sm relative overflow-hidden"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-900 font-outfit tracking-tight mb-2">Account Settings</h1>
          <p className="text-slate-500 font-inter">Manage your profile details and security settings</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-3 mb-10 border-b border-slate-150 pb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-cyan-500/10 text-cyan-600 border border-cyan-500/25 shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            Profile Details
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === 'password'
                ? 'bg-cyan-500/10 text-cyan-600 border border-cyan-500/25 shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            Change Password
          </button>
        </div>

        {activeTab === 'profile' ? (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Live Avatar Preview & Input */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-0.5 shadow-md flex-shrink-0">
                <div className="h-full w-full rounded-[0.9rem] bg-slate-950 flex items-center justify-center overflow-hidden">
                  {profileData.avatar ? (
                    <img 
                      src={profileData.avatar} 
                      alt="Avatar Preview" 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${profileData.name || 'User'}`;
                      }}
                    />
                  ) : (
                    <span className="text-3xl font-black text-white font-outfit uppercase">
                      {profileData.name?.[0] || 'U'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 w-full space-y-2">
                <label className="form-label">Profile Image URL</label>
                <div className="relative group">
                  <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-500" size={18} />
                  <input
                    type="url"
                    value={profileData.avatar}
                    onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                    className="form-field pl-12 pr-5"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="form-label">Full Name</label>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-500" size={18} />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="form-field pl-12 pr-5"
                    placeholder="Your Full Name"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="form-label">Phone Number</label>
                <div className="relative group">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-500" size={18} />
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="form-field pl-12 pr-5"
                    placeholder="e.g. +92 300 1234567"
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="form-label">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-500" size={18} />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="form-field pl-12 pr-5"
                  placeholder="name@institution.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full btn-accent py-4 mt-6 rounded-2xl text-sm font-black tracking-widest uppercase shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {profileLoading ? (
                <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <>
                  <FiSave size={18} />
                  Save Settings
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="form-label">Current Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-500" size={18} />
                <input
                  type="password"
                  value={passwordData.passwordCurrent}
                  onChange={(e) => setPasswordData({ ...passwordData, passwordCurrent: e.target.value })}
                  className="form-field pl-12 pr-5"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* New Password */}
              <div className="space-y-2">
                <label className="form-label">New Password</label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-500" size={18} />
                  <input
                    type="password"
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                    className="form-field pl-12 pr-5"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <label className="form-label">Confirm New Password</label>
                <div className="relative group">
                  <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-500" size={18} />
                  <input
                    type="password"
                    value={passwordData.passwordConfirm}
                    onChange={(e) => setPasswordData({ ...passwordData, passwordConfirm: e.target.value })}
                    className="form-field pl-12 pr-5"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full btn-accent py-4 mt-6 rounded-2xl text-sm font-black tracking-widest uppercase shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {passwordLoading ? (
                <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <>
                  <FiLock size={18} />
                  Update Password
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileEditPage;
