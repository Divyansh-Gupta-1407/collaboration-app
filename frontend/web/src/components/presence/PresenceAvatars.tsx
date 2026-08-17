import React from 'react';
import { Avatar } from '../ui/Avatar';

interface User {
  id: string;
  name: string;
  color?: string;
}

interface PresenceAvatarsProps {
  users: User[];
  maxCount?: number;
}

export const PresenceAvatars: React.FC<PresenceAvatarsProps> = ({ users, maxCount = 4 }) => {
  const visibleUsers = users.slice(0, maxCount);
  const overflowCount = Math.max(0, users.length - maxCount);

  return (
    <div className="flex items-center -space-x-2">
      {visibleUsers.map((user, i) => (
        <div key={user.id || i} className="relative group" style={{ zIndex: 10 - i }}>
          <div className="ring-2 ring-[#0a0e1a] rounded-full transition-transform hover:scale-110 hover:z-20">
            <Avatar name={user.name} size="sm" />
          </div>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {user.name}
          </div>
        </div>
      ))}
      {overflowCount > 0 && (
        <div className="relative z-0 flex items-center justify-center h-8 w-8 rounded-full bg-gray-700 text-xs text-white ring-2 ring-[#0a0e1a] font-medium border border-gray-600">
          +{overflowCount}
        </div>
      )}
    </div>
  );
};
