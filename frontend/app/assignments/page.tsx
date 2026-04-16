'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const classes = ['10-A', '10-B', '11-A'];

const AssignmentsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (!loading) {
      // Only teachers, hr, and superadmin can create assignments
      if (!user || !['teacher', 'hr', 'superadmin'].includes(user.role)) {
        router.push('/');
      } else {
        fetchAssignments();
      }
    }
  }, [user, loading, router]);

  const onFileChange = (e: any) => setFiles(Array.from(e.target.files || []));

  const fetchAssignments = async () => {
    try {
      const res: any = await api.get('/assignments');
      setAssignments(res.data || []);
    } catch (err: any) {
      // ignore
    }
  };

  const create = async () => {
    if (!title || !dueDate) return toast.error('Please provide title and due date');
    try {
      const payload = {
        title,
        class: selectedClass,
        due: dueDate,
        description,
        attachments: files.map((f) => ({ filename: f.name })),
      };
      await api.post('/assignments', payload);
      toast.success('Assignment created');
      setTitle('');
      setDescription('');
      setFiles([]);
      fetchAssignments();
    } catch (err: any) {
      toast.error(err.response?.message || 'Failed to create assignment');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-slideInUp">
      <div>
        <h1 className="text-4xl font-bold mb-2">Assignments</h1>
        <p className="text-slate-400">Create and assign work to classes</p>
      </div>

      <div className="glass-effect rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="bg-transparent p-2 border border-slate-700 rounded">
            {classes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title" className="bg-transparent p-2 border border-slate-700 rounded" />
          <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-transparent p-2 border border-slate-700 rounded" />
        </div>

        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full bg-transparent p-3 border border-slate-700 rounded" rows={4} />

        <div className="flex items-center gap-3">
          <input type="file" multiple onChange={onFileChange} />
          <button onClick={create} className="btn-accent btn-pill">Create Assignment</button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Assignments</h2>
        <div className="space-y-4">
          {assignments.length === 0 && <p className="text-slate-400">No assignments created yet.</p>}
          {assignments.map((a: any) => (
            <div key={a._id} className="glass-effect rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{a.title}</h3>
                  <p className="text-sm text-slate-300">Due: {a.due ? new Date(a.due).toLocaleString() : '—'}</p>
                </div>
              </div>
              <p className="mt-2 text-slate-300">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentsPage;
