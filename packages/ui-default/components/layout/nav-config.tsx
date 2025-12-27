/**
 * 共享的导航配置
 * 所有使用 AppLayout 的页面都应该从这里导入导航和页脚配置
 */
import {
  BookOpen,
  Code2,
  FileText,
  GraduationCap,
  Home,
  ListTodo,
  MessageSquare,
  Trophy,
  Users,
} from 'lucide-react';
import type { NavItem } from '../ui/app-layout';

// 默认导航项
export const defaultNavItems: NavItem[] = [
  { name: 'home', label: '首页', href: '/', icon: Home },
  { name: 'problem_main', label: '题库', href: '/p', icon: FileText },
  { name: 'contest_main', label: '比赛', href: '/contest', icon: Trophy },
  { name: 'homework_main', label: '作业', href: '/homework', icon: GraduationCap },
  { name: 'training_main', label: '训练', href: '/training', icon: ListTodo },
  { name: 'record_main', label: '评测记录', href: '/record', icon: Code2 },
  { name: 'ranking', label: '排名', href: '/ranking', icon: Users },
  { name: 'discussion_main', label: '讨论', href: '/discuss', icon: MessageSquare },
  { name: 'wiki', label: '帮助', href: '/wiki/help', icon: BookOpen },
];

// 默认页脚分类
export const defaultFooterCategories = [
  {
    title: '状态',
    links: [
      { label: '评测队列', href: '/judge/queue' },
      { label: '系统状态', href: '/status' },
    ],
  },
  {
    title: '开发',
    links: [
      { label: 'GitHub', href: 'https://github.com/hydro-dev/Hydro', external: true },
      { label: '文档', href: 'https://hydro.js.org/', external: true },
    ],
  },
];

// 获取当前用户信息（从 UiContext）
export function getLayoutUser() {
  const ctx = (window as any).UiContext || {};
  return ctx.layoutUser || null;
}

// 获取当前域信息（从 UiContext）
export function getLayoutDomain() {
  const ctx = (window as any).UiContext || {};
  return ctx.layoutDomain || { _id: 'system', name: 'Hydro' };
}

// 获取版本信息（从 UiContext）
export function getLayoutVersion() {
  const ctx = (window as any).UiContext || {};
  return ctx.layoutVersion || 'Hydro';
}

// 常用的布局上下文 Hook
export function useLayoutContext() {
  const ctx = (window as any).UiContext || {};
  return {
    user: ctx.layoutUser || null,
    domain: ctx.layoutDomain || { _id: 'system', name: 'Hydro' },
    version: ctx.layoutVersion || 'Hydro',
  };
}
