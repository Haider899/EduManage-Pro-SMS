'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUpload } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const MaterialsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!loading) {
      // Only teachers, hr, and superadmin can upload materials
      if (!user || !['teacher', 'hr', 'superadmin'].includes(user.role)) {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  const onFileChange = (e: any) => {
    setFiles(Array.from(e.target.files || []));
  };

  const upload = async () => {
    try {
      const payload = { files: files.map((f) => ({ filename: f.name })) };
      await api.post('/materials', payload);
      toast.success('Materials uploaded');
      setFiles([]);
    } catch (err: any) {
      toast.error(err.response?.message || 'Failed to upload materials');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-slideInUp">
      <div>
        <h1 className="text-4xl font-bold mb-2">Upload Materials</h1>
        <p className="text-slate-400">Share class materials with your students</p>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <div className="space-y-4">
          <input type="file" multiple onChange={onFileChange} className="bg-transparent" />
          <div className="flex items-center gap-3">
            <button onClick={upload} className="btn-accent btn-pill"><FiUpload /> Upload</button>
            <div className="text-slate-400">{files.length} file(s) selected</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Uploaded (local)</h2>
        <ul className="list-disc pl-6 text-slate-300">
          {files.map((f, i) => (
            <li key={i}>{f.name} — {Math.round(f.size/1024)} KB</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MaterialsPage;
