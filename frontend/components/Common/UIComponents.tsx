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
      className={`glass-effect rounded-xl p-6 border border-slate-700 ${
        hover ? 'card-hover' : ''
      } ${className}`}
    >
      {icon && <div className="mb-4">{icon}</div>}
      {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
      {description && <p className="text-slate-400 text-sm mb-4">{description}</p>}
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg transition rounded-lg font-medium ${className}`}
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-effect rounded-lg p-6 border border-slate-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-2">{label}</p>
          <h3 className="text-3xl font-bold gradient-text">{value}</h3>
        </div>
        {icon && <div className={`text-4xl ${color}`}>{icon}</div>}
      </div>
    </motion.div>
  );
};
