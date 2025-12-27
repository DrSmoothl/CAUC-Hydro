import React, { createContext, useCallback, useContext, useState } from 'react';
import { cn } from '../../utils/cn';
import { Footer, FooterCategory } from './footer';
import { BreadcrumbItem, Header } from './header';
import { NavItem, Sidebar, SidebarProvider, useSidebar } from './sidebar';
import { ThemeProvider, useTheme } from './theme-provider';

// 布局上下文
interface LayoutContextValue {
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export interface AppLayoutProps {
  children: React.ReactNode;
  // 侧边栏配置
  navItems?: NavItem[];
  currentPath?: string;
  domain?: { _id: string, name: string, avatar?: string };
  userDomains?: Array<{ _id: string, name: string, avatar?: string }>;
  // 顶栏配置
  breadcrumbs?: BreadcrumbItem[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  notifications?: number;
  onNotificationClick?: () => void;
  // 用户信息
  user?: {
    _id: number;
    uname: string;
    avatar?: string;
  };
  // 底栏配置
  footerCategories?: FooterCategory[];
  version?: string;
  copyright?: string;
  showFooter?: boolean;
  // 主题和语言（theme 现在可选，内部自动管理）
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  languages?: Array<{ code: string, name: string }>;
  currentLanguage?: string;
  onLanguageChange?: (code: string) => void;
  // 样式
  className?: string;
  contentClassName?: string;
}

function LayoutContent({
  children,
  navItems = [],
  currentPath = '',
  domain,
  userDomains = [],
  breadcrumbs = [],
  showSearch = true,
  searchPlaceholder,
  onSearch,
  notifications = 0,
  onNotificationClick,
  user,
  footerCategories = [],
  version,
  copyright,
  showFooter = true,
  languages = [],
  currentLanguage,
  onLanguageChange,
  className,
  contentClassName,
}: Omit<AppLayoutProps, 'theme' | 'onThemeChange'>) {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { collapsed } = useSidebar();
  const { theme, setTheme } = useTheme();

  const handleToggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen((prev) => !prev);
  }, []);

  return (
    <LayoutContext.Provider value={{ isMobileSidebarOpen, setMobileSidebarOpen }}>
      <div className={cn('flex min-h-screen bg-background', className)}>
        {/* 移动端遮罩 */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* 侧边栏 - 始终固定在左侧 */}
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50',
            'transform transition-transform duration-200 ease-in-out',
            isMobileSidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full md:translate-x-0',
          )}
        >
          <Sidebar
            navItems={navItems}
            currentPath={currentPath}
            user={user}
            domain={domain}
            userDomains={userDomains}
          />
        </div>

        {/* 主内容区域 - 左边距随侧边栏折叠状态变化 */}
        <div
          className={cn(
            'flex-1 flex flex-col min-w-0 transition-[margin] duration-300',
            collapsed ? 'md:ml-16' : 'md:ml-64',
          )}
        >
          {/* 顶栏 */}
          <Header
            breadcrumbs={breadcrumbs}
            user={user}
            showSearch={showSearch}
            searchPlaceholder={searchPlaceholder}
            onSearch={onSearch}
            onToggleSidebar={handleToggleMobileSidebar}
            showSidebarToggle
            theme={theme}
            onThemeChange={setTheme}
            languages={languages}
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
            notifications={notifications}
            onNotificationClick={onNotificationClick}
          />

          {/* 页面内容 */}
          <main className={cn('flex-1 overflow-auto', contentClassName)}>
            {children}
          </main>

          {/* 底栏 */}
          {showFooter && (
            <Footer
              categories={footerCategories}
              version={version}
              copyright={copyright}
              languages={languages}
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
              theme={theme}
              onThemeChange={setTheme}
            />
          )}
        </div>
      </div>
    </LayoutContext.Provider>
  );
}

// 主布局组件（包含 SidebarProvider 和 ThemeProvider）
export function AppLayout(props: AppLayoutProps) {
  // 忽略外部传入的 theme 和 onThemeChange，使用内部管理的状态
  const { theme: _theme, onThemeChange: _onThemeChange, ...rest } = props;
  return (
    <ThemeProvider>
      <SidebarProvider>
        <LayoutContent {...rest} />
      </SidebarProvider>
    </ThemeProvider>
  );
}

// SimpleLayout 的内部内容组件
function SimpleLayoutContent({
  children,
  breadcrumbs = [],
  user,
  showFooter = true,
  footerCategories,
  version,
  copyright,
  languages = [],
  currentLanguage,
  onLanguageChange,
  className,
  contentClassName,
}: Omit<
  AppLayoutProps,
  'navItems' | 'domain' | 'currentPath' | 'userDomains' | 'theme' | 'onThemeChange'
>) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn('flex flex-col min-h-screen bg-background', className)}>
      {/* 顶栏 */}
      <Header
        breadcrumbs={breadcrumbs}
        user={user}
        showSearch={false}
        theme={theme}
        onThemeChange={setTheme}
        languages={languages}
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />

      {/* 页面内容 */}
      <main className={cn('flex-1', contentClassName)}>{children}</main>

      {/* 底栏 */}
      {showFooter && (
        <Footer
          categories={footerCategories}
          version={version}
          copyright={copyright}
          languages={languages}
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
          theme={theme}
          onThemeChange={setTheme}
        />
      )}
    </div>
  );
}

// 简化版布局（无侧边栏，仅顶栏和底栏）
export function SimpleLayout(
  props: Omit<AppLayoutProps, 'navItems' | 'domain' | 'currentPath' | 'userDomains'>,
) {
  // 忽略外部传入的 theme 和 onThemeChange
  const { theme: _theme, onThemeChange: _onThemeChange, ...rest } = props;
  return (
    <ThemeProvider>
      <SimpleLayoutContent {...rest} />
    </ThemeProvider>
  );
}

// Hook
// eslint-disable-next-line react-refresh/only-export-components
export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    throw new Error('useLayout must be used within AppLayout');
  }
  return ctx;
}

// 导出 useTheme 以便其他组件使用
// eslint-disable-next-line react-refresh/only-export-components
export { useTheme } from './theme-provider';

// 导出类型
export type { BreadcrumbItem, FooterCategory, NavItem };
