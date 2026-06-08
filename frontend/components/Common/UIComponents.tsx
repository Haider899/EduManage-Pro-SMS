'use client';

import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  children,
  className = '',
  hover = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-effect rounded-2xl p-7 border border-slate-200 dark:border-white/10 ${
        hover ? 'card-hover shadow-sm' : ''
      } ${className}`}
    >
      {icon && <div className="mb-5 text-cyan-600 dark:text-cyan-400">{icon}</div>}
      {title && <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{title}</h3>}
      {description && <p className="text-slate-500 dark:text-slate-400 text-sm mb-5 font-medium leading-relaxed">{description}</p>}
      {children}
    </motion.div>
  );
};

export const GradientButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = '' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl transition rounded-2xl font-bold py-3 px-6 ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const StatBox: React.FC<{
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}> = ({ label, value, icon, color = 'text-blue-400' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-effect rounded-2xl p-7 border border-slate-200 dark:border-white/10 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.24em] mb-3">{label}</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
        </div>
        {icon && <div className={`text-4xl opacity-80 ${color}`}>{icon}</div>}
      </div>
    </motion.div>
  );
};
