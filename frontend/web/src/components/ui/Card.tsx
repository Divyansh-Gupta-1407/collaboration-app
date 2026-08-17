import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverable = false }) => {
  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-xl p-6 transition-all duration-300 ${
        hoverable ? 'cursor-pointer hover:bg-white/10 hover:shadow-lg hover:-translate-y-1' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
