import { KeyRound, Mail, ShieldCheck, User, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '../components/ui';
import { AutoloadPage } from '../misc/Page';
import { request } from '../utils';

// 保存 root 引用以避免重复创建
let registerRoot: Root | null = null;

// 注册页面 - 发送验证邮件
function RegisterPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('请输入邮箱地址');
      return;
    }

    // 简单的邮箱格式验证
    if (!email.includes('@') || !email.includes('.')) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const result = await request.post('', { mail: email });
      if (result.url) {
        window.location.href = result.url;
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || '发送验证邮件失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">注册账户</CardTitle>
          <CardDescription>
            输入您的邮箱地址，我们将发送验证链接
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* 验证码容器 - 如果模板中有 captcha 会插入到这里 */}
            <div id="captcha-container" />

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? '发送中...' : '发送验证邮件'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            已有账户？{' '}
            <a href="/login" className="text-primary hover:underline">
              立即登录
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// 注册页面 - 使用验证码完成注册
function RegisterWithCodePage() {
  const ctx = (window as any).UiContext || {};

  const mail = ctx.mail || '';
  const defaultUsername = ctx.username || '';

  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    if (!password) {
      setError('请输入密码');
      return;
    }
    if (password.length < 6) {
      setError('密码长度至少为 6 位');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const result = await request.post('', {
        uname: username,
        password,
        verifyPassword: confirmPassword,
      });

      if (result.url) {
        window.location.href = result.url;
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || '注册失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">完成注册</CardTitle>
          <CardDescription>
            设置您的用户名和密码
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 邮箱显示 */}
            <div className="space-y-2">
              <Label>邮箱地址</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={mail}
                  disabled
                  className="pl-9 bg-muted"
                />
              </div>
            </div>

            {/* 用户名 */}
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            {/* 密码 */}
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码（至少 6 位）"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* 确认密码 */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? '注册中...' : '完成注册'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            已有账户？{' '}
            <a href="/login" className="text-primary hover:underline">
              立即登录
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// 注册成功 - 邮件已发送
function RegisterMailSentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-500/10 rounded-full">
              <Mail className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">验证邮件已发送</CardTitle>
          <CardDescription>
            请检查您的收件箱并点击验证链接
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>我们已向您的邮箱发送了一封验证邮件。</p>
            <p className="mt-2">请在 24 小时内点击邮件中的链接完成注册。</p>
            <p className="mt-4">如果没有收到邮件，请检查垃圾邮件文件夹。</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button variant="outline" className="w-full" onClick={() => window.location.href = '/register'}>
            重新发送验证邮件
          </Button>
          <div className="text-sm text-muted-foreground text-center">
            <a href="/login" className="text-primary hover:underline">
              返回登录
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// 根据页面类型渲染不同的组件
function RegisterRouter() {
  const ctx = (window as any).UiContext || {};
  const pageType = ctx.registerPageType || 'register';

  switch (pageType) {
    case 'with_code':
      return <RegisterWithCodePage />;
    case 'mail_sent':
      return <RegisterMailSentPage />;
    default:
      return <RegisterPage />;
  }
}

const page = new AutoloadPage(['user_register', 'user_register_with_code', 'user_register_mail_sent'], () => {
  const container = document.getElementById('user-register-root');
  if (container) {
    // 避免重复创建 root
    registerRoot ||= createRoot(container);
    registerRoot.render(<RegisterRouter />);
  }
});

export default page;
