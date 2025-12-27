import {
  Bell,
  ChevronRight,
  Globe,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Shield,
  Sun,
  User,
} from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Input } from './input';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  user?: {
    _id: number;
    uname: string;
    avatar?: string;
  };
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  languages?: Array<{ code: string; name: string }>;
  currentLanguage?: string;
  onLanguageChange?: (code: string) => void;
  notifications?: number;
  onNotificationClick?: () => void;
  className?: string;
}

export function Header({
  breadcrumbs = [],
  user,
  showSearch = true,
  searchPlaceholder = '搜索题目、比赛...',
  onSearch,
  onToggleSidebar,
  showSidebarToggle = false,
  theme = 'light',
  onThemeChange,
  languages = [],
  currentLanguage,
  onLanguageChange,
  notifications = 0,
  onNotificationClick,
  className,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleNavigate = (href: string) => {
    window.location.href = href;
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex items-center h-14 px-4 gap-4',
        'border-b border-border bg-background/95 backdrop-blur',
        className,
      )}
    >
      {/* 侧边栏切换按钮（移动端） */}
      {showSidebarToggle && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* 面包屑导航 */}
      {breadcrumbs.length > 0 && (
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              {item.href ? (
                <a
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="font-medium">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* 搜索框 */}
      {showSearch && (
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-md hidden md:block"
        >
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </form>
      )}

      <div className="flex-1" />

      {/* 右侧工具栏 */}
      <div className="flex items-center gap-1">
        {/* 搜索按钮（移动端） */}
        {showSearch && (
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
        )}

        {/* 通知 */}
        {user && (
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onNotificationClick}
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span
                className={cn(
                  'absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full',
                  'bg-destructive text-destructive-foreground text-xs',
                  'flex items-center justify-center',
                )}
              >
                {notifications > 9 ? '9+' : notifications}
              </span>
            )}
          </Button>
        )}

        {/* 语言切换 */}
        {languages.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => onLanguageChange?.(lang.code)}
                  className={cn(currentLanguage === lang.code && 'bg-accent')}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* 主题切换 */}
        {onThemeChange && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        )}

        {/* 用户菜单 */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.uname.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.uname}</p>
                <p className="text-xs text-muted-foreground">UID: {user._id}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleNavigate(`/user/${user._id}`)}
              >
                <User className="h-4 w-4 mr-2" />
                个人主页
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate('/home/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                设置
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate('/home/security')}>
                <Shield className="h-4 w-4 mr-2" />
                安全
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleNavigate('/logout')}
                className="text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigate('/login')}
            >
              登录
            </Button>
            <Button size="sm" onClick={() => handleNavigate('/register')}>
              注册
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
