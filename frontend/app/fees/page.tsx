'use client';

import { motion } from 'framer-motion';
import { FiDollarSign, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const FeesPage = () => {
  const feesSummary = [
    { label: 'Total Collected', amount: '$125,450', icon: FiCheckCircle, color: 'text-green-400' },
    { label: 'Pending Amount', amount: '$48,750', icon: FiAlertCircle, color: 'text-yellow-400' },
    { label: 'Overdue Amount', amount: '$12,300', icon: FiAlertCircle, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Fee Management</h1>
        <p className="text-slate-400">Track and manage student fee payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {feesSummary.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-effect rounded-xl p-6 border border-slate-700 card-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">{item.label}</p>
                <h3 className="text-2xl font-bold gradient-text">{item.amount}</h3>
              </div>
              <item.icon size={32} className={item.color} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-effect rounded-xl p-6 border border-slate-700"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiDollarSign size={24} />
          Recent Transactions
        </h2>

        <div className="space-y-3">
          {[
            { name: 'John Doe', amount: '$5,000', date: 'Today', status: 'completed' },
            { name: 'Jane Smith', amount: '$5,500', date: 'Yesterday', status: 'completed' },
            { name: 'Mike Johnson', amount: '$4,500', date: '2 days ago', status: 'pending' },
            { name: 'Sarah Williams', amount: '$5,000', date: '3 days ago', status: 'completed' },
          ].map((transaction, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition"
            >
              <div>
                <p className="font-medium">{transaction.name}</p>
                <p className="text-sm text-slate-400">{transaction.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold">{transaction.amount}</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    transaction.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FeesPage;
