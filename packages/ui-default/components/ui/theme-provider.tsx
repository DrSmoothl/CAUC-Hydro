import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 独立的 hook，不需要 Provider（用于向后兼容）
export function useThemeState(): ThemeContextValue {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 从 document class 读取初始主题
    if (document.documentElement.classList.contains('theme--dark')) {
      return 'dark';
    }
    return 'light';
  });

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);

    // 更新 document class
    document.documentElement.classList.toggle('theme--dark', newTheme === 'dark');
    document.documentElement.classList.toggle('dark', newTheme === 'dark');

    // 调用后端 API 保存主题设置（通过 fetch 请求）
    // 使用 beacon API 确保即使页面跳转也能发送
    const url = `/set_theme/${newTheme}`;
    if (navigator.sendBeacon) {
      // sendBeacon 只能发送 POST，但这里我们的 API 是 GET
      // 所以用 fetch
      fetch(url, { credentials: 'same-origin' }).catch(() => {
        // 忽略错误，最坏情况下主题只在当前会话生效
      });
    } else {
      fetch(url, { credentials: 'same-origin' }).catch(() => {});
    }
  }, []);

  // 监听来自其他标签页或窗口的主题变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hydro-theme' && e.newValue) {
        const newTheme = e.newValue as Theme;
        setThemeState(newTheme);
        document.documentElement.classList.toggle('theme--dark', newTheme === 'dark');
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    };

    // 也用 localStorage 作为跨标签页同步机制
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 当主题变化时，同步到 localStorage（用于跨标签页同步）
  useEffect(() => {
    try {
      localStorage.setItem('hydro-theme', theme);
    } catch {
      // localStorage 可能不可用
    }
  }, [theme]);

  return { theme, setTheme };
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 优先从 document class 读取
    if (document.documentElement.classList.contains('theme--dark')) {
      return 'dark';
    }
    // 然后尝试 localStorage
    try {
      const stored = localStorage.getItem('hydro-theme');
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      // localStorage 不可用
    }
    return defaultTheme || 'light';
  });

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);

    // 更新 document class
    document.documentElement.classList.toggle('theme--dark', newTheme === 'dark');
    document.documentElement.classList.toggle('dark', newTheme === 'dark');

    // 保存到 localStorage
    try {
      localStorage.setItem('hydro-theme', newTheme);
    } catch {
      // 忽略
    }

    // 调用后端 API 保存主题设置
    fetch(`/set_theme/${newTheme}`, { credentials: 'same-origin' }).catch(() => {});
  }, []);

  // 监听来自其他标签页的主题变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hydro-theme' && e.newValue) {
        const newTheme = e.newValue as Theme;
        setThemeState(newTheme);
        document.documentElement.classList.toggle('theme--dark', newTheme === 'dark');
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
