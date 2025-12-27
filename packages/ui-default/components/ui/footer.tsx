import {
  Book,
  Code2,
  ExternalLink,
  Github,
  Globe,
  Heart,
  HelpCircle,
  History,
  MessageCircle,
  Moon,
  Scale,
  Sun,
} from 'lucide-react';
import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Separator } from './separator';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterCategory {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  categories?: FooterCategory[];
  version?: string;
  copyright?: string;
  languages?: Array<{ code: string, name: string }>;
  currentLanguage?: string;
  onLanguageChange?: (code: string) => void;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  className?: string;
}

// 图标映射
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub: Github,
  开发文档: Book,
  'API 文档': Code2,
  帮助中心: HelpCircle,
  问题反馈: MessageCircle,
  评测队列: History,
  使用条款: Scale,
};

export function Footer({
  categories = [],
  version = 'Hydro',
  copyright = `© ${new Date().getFullYear()} Hydro. Built with ❤️`,
  languages = [],
  currentLanguage,
  onLanguageChange,
  theme = 'light',
  onThemeChange,
  className,
}: FooterProps) {
  const handleNavigate = (href: string, external?: boolean) => {
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  };

  return (
    <footer className={cn('border-t border-border bg-muted/30', className)}>
      {/* 主要内容区域 */}
      {categories.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div key={category.title}>
                <h3 className="font-semibold text-sm mb-3">{category.title}</h3>
                <ul className="space-y-2">
                  {category.links.map((link) => {
                    const Icon = iconMap[link.label];
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                          className={cn(
                            'text-sm text-muted-foreground hover:text-foreground',
                            'transition-colors inline-flex items-center gap-1.5',
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigate(link.href, link.external);
                          }}
                        >
                          {Icon && <Icon className="h-3.5 w-3.5" />}
                          {link.label}
                          {link.external && <ExternalLink className="h-3 w-3" />}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {categories.length > 0 && <Separator />}

      {/* 底部工具栏 */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 版权信息 */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{copyright}</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
          </div>

          {/* 工具栏 */}
          <div className="flex items-center gap-2">
            {/* 版本信息 */}
            <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted">
              {version}
            </span>

            {/* 语言切换 */}
            {languages.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8">
                    <Globe className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">
                      {languages.find((l) => l.code === currentLanguage)?.name
                        || '语言'}
                    </span>
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
                size="sm"
                className="h-8"
                onClick={() =>
                  onThemeChange(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">深色</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">浅色</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
