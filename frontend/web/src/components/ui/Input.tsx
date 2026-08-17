import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
        <input
          ref={ref}
          className={`block w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white placeholder-gray-500 transition-all focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
