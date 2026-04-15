'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiUploadCloud, FiFileText, FiCheckCircle, FiAlertCircle, FiArrowLeft, FiDownload } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import api from '@/lib/api';
import Link from 'next/link';

const StudentImportPage = () => {
  const [fileData, setFileData] = useState<any[]>([]);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setFileData(data);
        toast.success(`Successfully parsed ${data.length} records from ${file.name}`);
      } catch (err) {
        toast.error('Failed to parse Excel file. Ensure it is a valid .xlsx or .csv');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (fileData.length === 0) return;
    setIsLoading(true);

    try {
      const res: any = await api.post('/students/bulk', { students: fileData });
      toast.success(`Successfully imported ${res.count} students into the ecosystem!`);
      router.push('/students');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Bulk import protocol failed');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      { firstName: 'John', lastName: 'Doe', rollNumber: 'STU001', email: 'john@example.com', gender: 'male', dateOfBirth: '2005-01-01', class: 'Grade-10', section: 'A', parentName: 'Jane Doe', parentPhone: '1234567890', phone: '0987654321' }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "student_import_template.xlsx");
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/students"
            className="h-12 w-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90"
          >
            <FiArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-4xl font-black font-outfit text-white tracking-tight uppercase">Registry Ingestion</h1>
            <p className="text-slate-500 text-sm font-inter tracking-[0.1em]">Bulk Student Identity Onboarding Protocol</p>
          </div>
        </div>
        
        <button 
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 font-bold text-xs uppercase tracking-widest hover:bg-indigo-500/10 transition-all"
        >
          <FiDownload size={16} />
          Download Template
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upload Zone */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-[2.5rem] border-2 border-dashed border-white/10 p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-indigo-500/40 transition-all min-h-[400px]"
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <input 
            id="fileInput"
            type="file" 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
            onChange={handleFileUpload}
          />
          <div className="h-24 w-24 rounded-3xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-2xl shadow-indigo-500/20">
            <FiUploadCloud size={40} />
          </div>
          <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">Select Registry Source</h3>
          <p className="text-slate-500 text-sm max-w-xs font-inter">Drop your .xlsx or .csv student directory file here to begin the ingestion process.</p>
          
          {fileName && (
            <div className="mt-8 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <FiCheckCircle size={14} />
              {fileName}
            </div>
          )}
        </motion.div>

        {/* Intelligence Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-[2.5rem] border border-white/5 p-10 flex flex-col min-h-[400px]"
        >
          <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider flex items-center gap-3">
            <FiFileText className="text-amber-400" />
            Ingestion Queue
          </h3>

          <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3 pr-2 custom-scrollbar">
            {fileData.length > 0 ? (
              fileData.slice(0, 10).map((row, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-bold font-inter">{row.firstName} {row.lastName}</span>
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{row.rollNumber || 'NO-REF'}</span>
                  </div>
                  <div className="text-slate-600 font-mono text-[10px]">LID: {idx + 1}</div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <FiAlertCircle size={48} className="mb-4" />
                <p className="text-xs uppercase font-black tracking-widest">No Intelligence Uploaded</p>
              </div>
            )}
            {fileData.length > 10 && (
              <div className="text-center py-4 text-xs italic text-slate-500">...and {fileData.length - 10} others</div>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={handleImport}
              disabled={fileData.length === 0 || isLoading}
              className="w-full h-16 rounded-2xl bg-indigo-500 text-white font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-500/40 hover:bg-indigo-400 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <span className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <>
                  <FiCheckCircle size={20} />
                  Authorize Ingestion
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentImportPage;
