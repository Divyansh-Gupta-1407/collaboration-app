import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    success: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-300 border-red-500/30',
    neutral: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};
