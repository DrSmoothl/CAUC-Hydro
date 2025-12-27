import {
  AlertCircle,
  CheckCircle,
  Circle,
  Clock,
  HelpCircle,
  Loader2,
  MemoryStick,
  XCircle,
} from 'lucide-react';
import React from 'react';
import { cn } from '../../utils/cn';

// 定义状态常量
export const STATUS = {
  STATUS_WAITING: 0,
  STATUS_ACCEPTED: 1,
  STATUS_WRONG_ANSWER: 2,
  STATUS_TIME_LIMIT_EXCEEDED: 3,
  STATUS_MEMORY_LIMIT_EXCEEDED: 4,
  STATUS_OUTPUT_LIMIT_EXCEEDED: 5,
  STATUS_RUNTIME_ERROR: 6,
  STATUS_COMPILE_ERROR: 7,
  STATUS_SYSTEM_ERROR: 8,
  STATUS_CANCELED: 9,
  STATUS_ETC: 10,
  STATUS_HACKED: 11,
  STATUS_JUDGING: 20,
  STATUS_COMPILING: 21,
  STATUS_FETCHED: 22,
  STATUS_IGNORED: 30,
  STATUS_FORMAT_ERROR: 31,
} as const;

export type StatusType = (typeof STATUS)[keyof typeof STATUS];

// 状态配置
const statusConfig: Record<StatusType, {
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  icon: React.ElementType;
}> = {
  [STATUS.STATUS_WAITING]: {
    label: 'Waiting',
    shortLabel: 'PD',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    icon: Clock,
  },
  [STATUS.STATUS_ACCEPTED]: {
    label: 'Accepted',
    shortLabel: 'AC',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    icon: CheckCircle,
  },
  [STATUS.STATUS_WRONG_ANSWER]: {
    label: 'Wrong Answer',
    shortLabel: 'WA',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: XCircle,
  },
  [STATUS.STATUS_TIME_LIMIT_EXCEEDED]: {
    label: 'Time Limit Exceeded',
    shortLabel: 'TLE',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: Clock,
  },
  [STATUS.STATUS_MEMORY_LIMIT_EXCEEDED]: {
    label: 'Memory Limit Exceeded',
    shortLabel: 'MLE',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    icon: MemoryStick,
  },
  [STATUS.STATUS_OUTPUT_LIMIT_EXCEEDED]: {
    label: 'Output Limit Exceeded',
    shortLabel: 'OLE',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    icon: AlertCircle,
  },
  [STATUS.STATUS_RUNTIME_ERROR]: {
    label: 'Runtime Error',
    shortLabel: 'RE',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    icon: AlertCircle,
  },
  [STATUS.STATUS_COMPILE_ERROR]: {
    label: 'Compile Error',
    shortLabel: 'CE',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    icon: AlertCircle,
  },
  [STATUS.STATUS_SYSTEM_ERROR]: {
    label: 'System Error',
    shortLabel: 'SE',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    icon: AlertCircle,
  },
  [STATUS.STATUS_CANCELED]: {
    label: 'Canceled',
    shortLabel: 'IGN',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    icon: Circle,
  },
  [STATUS.STATUS_ETC]: {
    label: 'Unknown',
    shortLabel: 'UKE',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    icon: HelpCircle,
  },
  [STATUS.STATUS_HACKED]: {
    label: 'Hacked',
    shortLabel: 'HK',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    icon: XCircle,
  },
  [STATUS.STATUS_JUDGING]: {
    label: 'Judging',
    shortLabel: 'JG',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: Loader2,
  },
  [STATUS.STATUS_COMPILING]: {
    label: 'Compiling',
    shortLabel: 'CP',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: Loader2,
  },
  [STATUS.STATUS_FETCHED]: {
    label: 'Fetched',
    shortLabel: 'FT',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: Clock,
  },
  [STATUS.STATUS_IGNORED]: {
    label: 'Ignored',
    shortLabel: 'IGN',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    icon: Circle,
  },
  [STATUS.STATUS_FORMAT_ERROR]: {
    label: 'Format Error',
    shortLabel: 'FE',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    icon: AlertCircle,
  },
};

export interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
  showLabel?: boolean;
  short?: boolean;
  score?: number;
  className?: string;
}

export function StatusBadge({
  status,
  showIcon = true,
  showLabel = true,
  short = true,
  score,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig[STATUS.STATUS_ETC];
  const Icon = config.icon;
  const isAnimating = status === STATUS.STATUS_JUDGING || status === STATUS.STATUS_COMPILING;
  const label = short ? config.shortLabel : config.label;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium',
        config.bgColor,
        config.color,
        className,
      )}
    >
      {showIcon && (
        <Icon className={cn('h-3.5 w-3.5', isAnimating && 'animate-spin')} />
      )}
      {showLabel && <span>{label}</span>}
      {typeof score === 'number' && score > 0 && status !== STATUS.STATUS_ACCEPTED && (
        <span className="ml-1 opacity-75">({score})</span>
      )}
    </span>
  );
}

// 用于显示分数的进度条
export interface ScoreBarProps {
  score: number;
  maxScore?: number;
  status?: StatusType;
  showText?: boolean;
  className?: string;
}

export function ScoreBar({
  score,
  maxScore = 100,
  status,
  showText = true,
  className,
}: ScoreBarProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  // 根据分数或状态确定颜色
  let barColor = 'bg-gray-400';
  if (status === STATUS.STATUS_ACCEPTED || percentage === 100) {
    barColor = 'bg-green-500';
  } else if (percentage >= 80) {
    barColor = 'bg-green-400';
  } else if (percentage >= 60) {
    barColor = 'bg-yellow-500';
  } else if (percentage >= 40) {
    barColor = 'bg-orange-500';
  } else if (percentage > 0) {
    barColor = 'bg-red-500';
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300', barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <span className="text-xs font-medium min-w-[3ch] text-right">
          {score}
        </span>
      )}
    </div>
  );
}
