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
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  AppLayout,
  type BreadcrumbItem,
  type FooterCategory,
  type NavItem,
} from '../components/ui';

// 图标映射
const iconComponents = {
  home: Home,
  homepage: Home,
  problem_main: FileText,
  contest_main: Trophy,
  homework_main: GraduationCap,
  training_main: ListTodo,
  discussion_main: MessageSquare,
  record_main: Code2,
  ranking: Users,
  wiki: BookOpen,
  default: FileText,
};

interface LayoutConfig {
  layoutUser?: {
    _id: number;
    uname: string;
    avatar?: string;
  };
  layoutDomain?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  layoutUserDomains?: Array<{
    _id: string;
    name: string;
    avatar?: string;
  }>;
  layoutNavItems?: Array<{
    name: string;
    label: string;
    href: string;
    iconName?: string;
  }>;
  layoutBreadcrumbs?: BreadcrumbItem[];
  layoutFooterCategories?: FooterCategory[];
  layoutCurrentPath?: string;
  layoutVersion?: string;
  layoutTheme?: 'light' | 'dark';
  layoutLanguage?: string;
  layoutLanguages?: Array<{ code: string, name: string }>;
  layoutNotification?: {
    type: string;
    message: string;
  };
}

function AppLayoutPage() {
  // 从 UiContext 获取配置
  const config: LayoutConfig = (window as any).UiContext || {};

  // 转换导航项，添加图标
  const navItems: NavItem[] = (config.layoutNavItems || []).map((item) => ({
    name: item.name,
    label: item.label,
    href: item.href,
    icon: iconComponents[item.iconName as keyof typeof iconComponents]
      || iconComponents.default,
  }));

  const handleLanguageChange = (code: string) => {
    window.location.href = `/language/${code}?redirect=${encodeURIComponent(window.location.pathname)}`;
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/p?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <AppLayout
      user={config.layoutUser}
      domain={config.layoutDomain}
      userDomains={config.layoutUserDomains}
      navItems={navItems}
      currentPath={config.layoutCurrentPath || window.location.pathname}
      breadcrumbs={config.layoutBreadcrumbs}
      footerCategories={config.layoutFooterCategories}
      version={config.layoutVersion}
      languages={config.layoutLanguages}
      currentLanguage={config.layoutLanguage}
      onLanguageChange={handleLanguageChange}
      onSearch={handleSearch}
      contentClassName="p-4 md:p-6"
    >
      {/* 通知 */}
      {config.layoutNotification && (
        <div
          className={`mb-4 p-4 rounded-lg border ${
            config.layoutNotification.type === 'error'
              ? 'bg-destructive/10 border-destructive text-destructive'
              : 'bg-primary/10 border-primary text-primary'
          }`}
        >
          {config.layoutNotification.message}
        </div>
      )}

      {/* 页面内容将在这里渲染 */}
      <div id="page-content-slot" />
    </AppLayout>
  );
}

// 挂载
const rootEl = document.getElementById('app-layout-root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<AppLayoutPage />);
}

export default AppLayoutPage;
