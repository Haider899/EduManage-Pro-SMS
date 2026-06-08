'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const TeacherLeaves = () => {
  const { user } = useAuth();
  const [leaves] = useState<any[]>([]);

  if (!user) return null;

  return (
    <div className="space-y-6 animate-slideInUp">
      <div>
        <h1 className="text-4xl font-bold mb-2">My Leave Requests</h1>
        <p className="text-slate-400">View status of your leave applications</p>
      </div>

      <div className="flex gap-3">
        <Link href="/leaves/apply" className="btn-accent btn-pill">Apply for Leave</Link>
      </div>

      <div>
        {leaves.length === 0 ? (
          <p className="text-slate-400">You have no leave requests yet.</p>
        ) : (
          <ul className="space-y-3">
            {leaves.map((l, i) => (
              <li key={i} className="glass-effect p-4 rounded">{l.type} — {l.from} to {l.to} — {l.status}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeacherLeaves;
