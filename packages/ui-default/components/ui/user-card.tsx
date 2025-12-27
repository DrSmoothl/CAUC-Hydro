import { MessageCircle, Trophy } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export interface UserCardProps {
  uid: number;
  username: string;
  displayName?: string;
  avatar?: string;
  rp?: number;
  rank?: number | string;
  acceptCount?: number;
  bio?: string;
  isSuperUser?: boolean;
  isModerator?: boolean;
  isOnline?: boolean;
  email?: string;
  onSendMessage?: () => void;
  onViewProfile?: () => void;
  className?: string;
  compact?: boolean;
}

export function UserCard({
  uid,
  username,
  displayName,
  avatar,
  rp = 0,
  rank,
  acceptCount = 0,
  bio,
  isSuperUser,
  isModerator,
  isOnline,
  onSendMessage,
  onViewProfile,
  className,
  compact = false,
}: UserCardProps) {
  const initials = username.slice(0, 2).toUpperCase();

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className || ''}`}>
        <div className="relative">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{username}</span>
          {displayName && displayName !== username && (
            <span className="text-xs text-muted-foreground">{displayName}</span>
          )}
        </div>
        {isSuperUser && <Badge variant="destructive" className="text-xs">SU</Badge>}
        {isModerator && !isSuperUser && <Badge variant="secondary" className="text-xs">MOD</Badge>}
      </div>
    );
  }

  return (
    <Card className={`overflow-hidden ${className || ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatar} alt={username} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-background" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg truncate">{username}</h3>
              {displayName && displayName !== username && (
                <span className="text-sm text-muted-foreground">({displayName})</span>
              )}
              {isSuperUser && <Badge variant="destructive">SU</Badge>}
              {isModerator && !isSuperUser && <Badge variant="secondary">MOD</Badge>}
            </div>

            <p className="text-sm text-muted-foreground">UID: {uid}</p>

            <div className="flex items-center gap-4 mt-2 text-sm">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{Math.round(rp)}</span>
                    {rank && <span className="text-muted-foreground">(#{rank})</span>}
                  </div>
                </TooltipTrigger>
                <TooltipContent>Rating Points</TooltipContent>
              </Tooltip>

              <div className="flex items-center gap-1 text-green-600">
                <span className="font-medium">{acceptCount}</span>
                <span className="text-muted-foreground">AC</span>
              </div>
            </div>

            {bio && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{bio}</p>
            )}
          </div>
        </div>

        {(onSendMessage || onViewProfile) && (
          <div className="flex gap-2 mt-4 pt-4 border-t">
            {onViewProfile && (
              <Button variant="outline" size="sm" className="flex-1" onClick={onViewProfile}>
                View Profile
              </Button>
            )}
            {onSendMessage && (
              <Button variant="outline" size="sm" onClick={onSendMessage}>
                <MessageCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 简化版用户内联显示（用于表格等场景）
export interface UserInlineProps {
  uid: number;
  username: string;
  avatar?: string;
  isSuperUser?: boolean;
  isModerator?: boolean;
  href?: string;
  className?: string;
}

export function UserInline({
  uid: _uid,
  username,
  avatar,
  isSuperUser,
  isModerator,
  href,
  className,
}: UserInlineProps) {
  const content = (
    <span className={`inline-flex items-center gap-1.5 ${className || ''}`}>
      <Avatar className="h-5 w-5">
        <AvatarImage src={avatar} alt={username} />
        <AvatarFallback className="text-xs">{username.slice(0, 1).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="font-medium hover:underline">{username}</span>
      {isSuperUser && <Badge variant="destructive" className="text-[10px] px-1 py-0">SU</Badge>}
      {isModerator && !isSuperUser && <Badge variant="secondary" className="text-[10px] px-1 py-0">MOD</Badge>}
    </span>
  );

  if (href) {
    return <a href={href} className="no-underline">{content}</a>;
  }

  return content;
}
