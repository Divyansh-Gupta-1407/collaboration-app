import React from 'react';
import Image from 'next/image';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', isOnline }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const colors = [
    'bg-purple-500', 'bg-blue-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500', 'bg-rose-500'
  ];
  
  // Simple hash to consistently pick a color based on name
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div className="relative inline-block">
      {src ? (
        <Image
          src={src}
          alt={name}
          width={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
          height={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
          className={`${sizes[size]} rounded-full object-cover border border-white/20`}
        />
      ) : (
        <div className={`${sizes[size]} ${bgColor} flex items-center justify-center rounded-full text-white font-medium shadow-sm border border-white/20`}>
          {initials}
        </div>
      )}
      {isOnline !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-[#0a0e1a] ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          } ${size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-2.5 w-2.5' : 'h-3 w-3'}`}
        />
      )}
    </div>
  );
};
