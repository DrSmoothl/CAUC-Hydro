import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  Code2,
  FileText,
  Folder,
  GraduationCap,
  Home,
  LayoutDashboard,
  ListTodo,
  LogOut,
  type LucideIcon,
  MessageSquare,
  Settings,
  Shield,
  Trophy,
  User,
  Users,
} from 'lucide-react';
import React, { createContext, useContext, useState } from 'react';
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
import { Separator } from './separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

// Sidebar Context
interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
});

// Hook - 放在前面以便在 Sidebar 组件中使用
// eslint-disable-next-line react-refresh/only-export-components
export function useSidebar() {
  return useContext(SidebarContext);
}

// 导航项配置
export interface NavItem {
  name: string;
  label: string;
  icon?: LucideIcon;
  iconName?: string;
  href: string;
  active?: boolean;
  children?: NavItem[];
  badge?: string | number;
}

// 预定义的图标映射
const iconMap: Record<string, LucideIcon> = {
  home: Home,
  homepage: Home,
  problem: FileText,
  problem_main: FileText,
  contest: Trophy,
  contest_main: Trophy,
  homework: GraduationCap,
  homework_main: GraduationCap,
  training: ListTodo,
  training_main: ListTodo,
  discuss: MessageSquare,
  discussion_main: MessageSquare,
  record: Code2,
  record_main: Code2,
  ranking: Users,
  wiki: BookOpen,
  domain_dashboard: LayoutDashboard,
  domain_user: Users,
  manage_dashboard: Settings,
  user_detail: User,
  wiki_help: BookOpen,
  home_files: Folder,
  home_security: Shield,
  default: FileText,
};

function getIconForNav(iconName?: string): LucideIcon {
  if (!iconName) return iconMap.default;
  return iconMap[iconName] || iconMap.default;
}

// 导航项组件
interface NavItemComponentProps {
  item: NavItem;
  collapsed: boolean;
  currentPath: string;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: (href: string) => void;
  depth?: number;
}

function NavItemComponent({
  item,
  collapsed,
  currentPath,
  expanded,
  onToggle,
  onNavigate,
  depth = 0,
}: NavItemComponentProps) {
  const Icon = item.icon || getIconForNav(item.iconName);
  const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
  const hasChildren = item.children && item.children.length > 0;

  const content = (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      className={cn(
        'w-full gap-2 h-9',
        collapsed ? 'justify-center px-0' : 'justify-start',
        depth > 0 && !collapsed && 'ml-4',
      )}
      onClick={() => {
        if (hasChildren) {
          onToggle();
        } else {
          onNavigate(item.href);
        }
      }}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 text-left truncate">{item.label}</span>
          {item.badge && (
            <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                expanded && 'rotate-180',
              )}
            />
          )}
        </>
      )}
    </Button>
  );

  return (
    <li>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      ) : (
        content
      )}

      {/* 子菜单 */}
      {hasChildren && expanded && !collapsed && (
        <ul className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavItemComponent
              key={child.name}
              item={child}
              collapsed={collapsed}
              currentPath={currentPath}
              expanded={false}
              onToggle={() => {}}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// Sidebar 主组件
export interface SidebarProps {
  navItems: NavItem[];
  user?: {
    _id: number;
    uname: string;
    avatar?: string;
    mail?: string;
  };
  domain?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  userDomains?: Array<{ _id: string, name: string, avatar?: string }>;
  logoUrl?: string;
  currentPath?: string;
  onNavigate?: (href: string) => void;
  onLogout?: () => void;
  className?: string;
}

export function Sidebar({
  navItems,
  user,
  domain,
  userDomains = [],
  logoUrl = '/components/profile/logo.png',
  currentPath = '',
  onNavigate,
  onLogout,
  className,
}: SidebarProps) {
  // 使用 Context 中的 collapsed 状态
  const { collapsed, setCollapsed } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (name: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedItems(newExpanded);
  };

  const handleNavigate = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    } else {
      window.location.href = href;
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex flex-col h-screen bg-card border-r border-border transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          className,
        )}
      >
          {/* Logo 区域 */}
          <div className="flex items-center h-14 px-3 border-b border-border">
            {!collapsed && (
              <a href="/" className="flex items-center gap-2 flex-1 min-w-0">
                <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
              </a>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft
                className={cn(
                  'h-4 w-4 transition-transform',
                  collapsed && 'rotate-180',
                )}
              />
            </Button>
          </div>

          {/* 域选择器 */}
          {domain && !collapsed && (
            <div className="px-3 py-2 border-b border-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 h-auto py-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={domain.avatar} />
                      <AvatarFallback className="text-xs">
                        {domain.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-left truncate text-sm">
                      {domain.name}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {userDomains.map((d) => (
                    <DropdownMenuItem
                      key={d._id}
                      onClick={() => handleNavigate(`/d/${d._id}/`)}
                    >
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarImage src={d.avatar} />
                        <AvatarFallback className="text-xs">
                          {d.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{d.name}</span>
                    </DropdownMenuItem>
                  ))}
                  {userDomains.length > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuItem onClick={() => handleNavigate('/home/domain')}>
                    <Settings className="h-4 w-4 mr-2" />
                    管理域
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* 导航菜单 */}
          <nav className="flex-1 overflow-y-auto py-2">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <NavItemComponent
                  key={item.name}
                  item={item}
                  collapsed={collapsed}
                  currentPath={currentPath}
                  expanded={expandedItems.has(item.name)}
                  onToggle={() => toggleExpanded(item.name)}
                  onNavigate={handleNavigate}
                />
              ))}
            </ul>
          </nav>

          <Separator />

          {/* 用户区域 */}
          {user ? (
            <div className="p-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full gap-2 h-auto py-2',
                      collapsed ? 'justify-center px-0' : 'justify-start',
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.uname.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium truncate">{user.uname}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          UID: {user._id}
                        </p>
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleNavigate(`/user/${user._id}`)}>
                    <User className="h-4 w-4 mr-2" />
                    个人主页
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate('/home/messages')}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    消息
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
                    onClick={onLogout || (() => handleNavigate('/logout'))}
                    className="text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              <Button
                variant="default"
                className="w-full"
                onClick={() => handleNavigate('/login')}
              >
                {collapsed ? <User className="h-4 w-4" /> : '登录'}
              </Button>
              {!collapsed && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleNavigate('/register')}
                >
                  注册
                </Button>
              )}
            </div>
          )}
        </aside>
      </TooltipProvider>
  );
}

// Provider 和 Hook
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}
