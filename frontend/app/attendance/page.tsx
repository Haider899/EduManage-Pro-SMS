'use client';

import { motion } from 'framer-motion';
import { FiCalendar, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';

const AttendancePage = () => {
  const attendanceStats = [
    { label: 'Present', count: 1156, color: 'bg-green-500/20 text-green-400', icon: FiCheckCircle },
    { label: 'Absent', count: 45, color: 'bg-red-500/20 text-red-400', icon: FiXCircle },
    { label: 'Late', count: 33, color: 'bg-yellow-500/20 text-yellow-400', icon: FiAlertCircle },
  ];

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Attendance Management</h1>
        <p className="text-slate-400">Track student attendance for today and previous days</p>
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
                <p className="text-slate-300 text-sm mb-2">{stat.label}</p>
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
              className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition"
            >
              <span className="font-medium">{item.grade}</span>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-green-400">Present: {item.present}</span>
                <span className="text-red-400">Absent: {item.absent}</span>
                <span className="text-yellow-400">Late: {item.late}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AttendancePage;
