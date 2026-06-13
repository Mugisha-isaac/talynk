'use client';

import React from 'react';
import Link from 'next/link';
import { Avatar } from '../common/Avatar';
import { Card } from '../common/Card';

interface ActivityCardProps {
  actor: {
    id: string;
    name: string;
    avatar?: string;
  };
  action: string;
  target?: string;
  timestamp: Date;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  actor,
  action,
  target,
  timestamp,
  icon,
  onClick,
  href,
}) => {
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const content = (
    <div className="flex items-start gap-4 p-4 hover:bg-slate-700/30 transition-colors rounded-lg cursor-pointer">
      <Avatar src={actor.avatar} name={actor.name} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="text-sm">
            <Link href={`/profile/${actor.id}`} className="font-semibold text-white hover:text-blue-400 transition-colors">
              {actor.name}
            </Link>
            <span className="text-slate-400"> {action}</span>
            {target && (
              <span className="text-white font-semibold"> {target}</span>
            )}
          </div>
          {icon && (
            <div className="text-slate-400 flex-shrink-0">
              {icon}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500">{timeAgo(timestamp)}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Card variant="standard" className="p-0 overflow-hidden">
        <Link href={href} className="block">
          {content}
        </Link>
      </Card>
    );
  }

  return (
    <Card
      variant="standard"
      className="p-0 overflow-hidden"
      onClick={onClick}
    >
      {content}
    </Card>
  );
};

ActivityCard.displayName = 'ActivityCard';
