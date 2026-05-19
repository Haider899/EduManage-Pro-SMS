'use client';

import { motion } from 'framer-motion';
import { FiCalendar, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';

const AttendancePage = () => {
  const attendanceStats = [
    { label: 'Present', count: 1156, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700', icon: FiCheckCircle },
    { label: 'Absent', count: 45, color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-700', icon: FiXCircle },
    { label: 'Late', count: 33, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700', icon: FiAlertCircle },
  ];

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Attendance Management</h1>
        <p className="text-slate-600 dark:text-slate-300">Track student attendance for today and previous days</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {attendanceStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-effect rounded-xl p-6 border border-slate-700 card-hover ${stat.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-2 font-semibold">{stat.label}</p>
                <h3 className="text-3xl font-bold">{stat.count}</h3>
              </div>
              <stat.icon size={32} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Attendance Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-effect rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center gap-2 mb-6">
          <FiCalendar size={24} />
          <h2 className="text-xl font-semibold">{"Today's Attendance"}</h2>
        </div>
        <div className="space-y-3">
          {[
            { grade: '10-A', present: 45, absent: 2, late: 1 },
            { grade: '10-B', present: 42, absent: 3, late: 2 },
            { grade: '11-A', present: 48, absent: 1, late: 0 },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50 transition"
            >
              <span className="font-bold text-slate-900 dark:text-white">{item.grade}</span>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Present: {item.present}</span>
                <span className="text-rose-600 dark:text-rose-400 font-semibold">Absent: {item.absent}</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">Late: {item.late}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AttendancePage;
