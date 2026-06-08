'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const LeaveApplyPage = () => {
  const { user } = useAuth();
  const [type, setType] = useState('sick');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reason, setReason] = useState('');

  const submit = async () => {
    try {
      await api.post('/leaves', { type, startDate: from, endDate: to, reason });
      toast.success('Leave application submitted');
      setType('sick');
      setFrom('');
      setTo('');
      setReason('');
    } catch (err: any) {
      toast.error(err.response?.message || 'Failed to submit leave');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-slideInUp">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Apply for Leave</h1>
        <p className="text-slate-500 dark:text-slate-400">Submit a leave request for approval</p>
      </div>

      <div className="form-card space-y-5">
        <label className="block">
          <span className="form-label">Leave Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className="form-field appearance-none">
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
            <option value="vacation">Vacation</option>
            <option value="emergency">Emergency</option>
          </select>
        </label>

        <label>
          <span className="form-label">From</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="form-field" />
        </label>

        <label>
          <span className="form-label">To</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="form-field" />
        </label>

        <label>
          <span className="form-label">Reason</span>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="form-field" rows={4} />
        </label>

        <div className="flex justify-end">
          <button onClick={submit} className="btn-accent btn-pill">Submit Application</button>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplyPage;
