'use client';

import { motion } from 'framer-motion';
import { FiAward, FiTrendingUp } from 'react-icons/fi';

const GradesPage = () => {
  const gradeDistribution = [
    { grade: 'A+', count: 156, percentage: 24 },
    { grade: 'A', count: 189, percentage: 29 },
    { grade: 'B', count: 211, percentage: 32 },
    { grade: 'C', count: 78, percentage: 12 },
    { grade: 'D', count: 15, percentage: 3 },
  ];

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Grade Management</h1>
        <p className="text-slate-400">View and manage student grades and performance</p>
      </div>

      {/* Grade Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect rounded-xl p-6 border border-slate-700"
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <FiAward size={24} />
          Grade Distribution
        </h2>

        <div className="space-y-4">
          {gradeDistribution.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{item.grade}</span>
                <span className="text-slate-400">{item.count} students</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage * 3}%` }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.6 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                ></motion.div>
              </div>
              <div className="text-xs text-slate-400">{item.percentage * 3}%</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-effect rounded-xl p-6 border border-slate-700"
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <FiTrendingUp size={24} />
          Performance Metrics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Average Score', value: '78.5%', trend: '+2.3%' },
            { label: 'Highest Score', value: '98%', trend: '+5.2%' },
            { label: 'Class Average', value: '76.8%', trend: '-1.2%' },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="bg-slate-800/30 p-6 rounded-lg hover:bg-slate-800/50 transition"
            >
              <p className="text-slate-400 text-sm mb-2">{metric.label}</p>
              <h3 className="text-2xl font-bold gradient-text mb-2">{metric.value}</h3>
              <p className="text-xs text-green-400">{metric.trend} from last month</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GradesPage;
