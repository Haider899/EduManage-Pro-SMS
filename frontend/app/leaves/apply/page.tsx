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
        <h1 className="text-4xl font-bold mb-2">Apply for Leave</h1>
        <p className="text-slate-400">Submit a leave request</p>
      </div>

      <div className="glass-effect rounded-xl p-6 space-y-4">
        <label className="block">
          <span className="text-sm text-slate-300">Leave Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-transparent p-2 mt-1 rounded border border-slate-700">
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
            <option value="vacation">Vacation</option>
            <option value="emergency">Emergency</option>
          </select>
        </label>

        <label>
          <span className="text-sm text-slate-300">From</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full bg-transparent p-2 mt-1 rounded border border-slate-700" />
        </label>

        <label>
          <span className="text-sm text-slate-300">To</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full bg-transparent p-2 mt-1 rounded border border-slate-700" />
        </label>

        <label>
          <span className="text-sm text-slate-300">Reason</span>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full bg-transparent p-2 mt-1 rounded border border-slate-700" rows={4} />
        </label>

        <div className="flex justify-end">
          <button onClick={submit} className="btn-accent btn-pill">Submit Application</button>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplyPage;
