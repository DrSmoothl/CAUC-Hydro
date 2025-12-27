import { KeyRound, Mail, MailCheck, ShieldAlert, User } from 'lucide-react';
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
let lostpassRoot: Root | null = null;

// 忘记密码页面 - 发送重置邮件
function LostpassPage() {
  const ctx = (window as any).UiContext || {};
  const smtpEnabled = ctx.smtpEnabled !== false;

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('请输入邮箱地址');
      return;
    }

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
      setError(err.message || '发送重置邮件失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-500/10 rounded-full">
              <ShieldAlert className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">找回密码</CardTitle>
          <CardDescription>
            {smtpEnabled
              ? '输入您的注册邮箱，我们将发送密码重置链接'
              : '请放松并尝试回忆您的密码'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          {smtpEnabled ? (
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

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? '发送中...' : '发送重置邮件'}
              </Button>
            </form>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              邮件服务未配置，请联系管理员重置密码
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            想起密码了？{' '}
            <a href="/login" className="text-primary hover:underline">
              返回登录
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// 忘记密码页面 - 重置密码（使用验证码）
function LostpassWithCodePage() {
  const ctx = (window as any).UiContext || {};
  const username = ctx.uname || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError('请输入新密码');
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
        password,
        verifyPassword: confirmPassword,
      });

      if (result.url) {
        window.location.href = result.url;
      } else {
        window.location.href = '/login';
      }
    } catch (err: any) {
      setError(err.message || '重置密码失败，请重试');
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
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">重置密码</CardTitle>
          <CardDescription>
            设置您的新密码
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名显示 */}
            <div className="space-y-2">
              <Label>用户名</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={username}
                  disabled
                  className="pl-9 bg-muted"
                />
              </div>
            </div>

            {/* 新密码 */}
            <div className="space-y-2">
              <Label htmlFor="password">新密码</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入新密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  autoComplete="new-password"
                  autoFocus
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
                  placeholder="请再次输入新密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? '重置中...' : '重置密码'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// 忘记密码页面 - 邮件已发送
function LostpassMailSentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-500/10 rounded-full">
              <MailCheck className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">邮件已发送</CardTitle>
          <CardDescription>
            密码重置邮件已发送到您的邮箱
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">
              请检查您的邮箱（包括垃圾邮件文件夹），点击邮件中的链接完成密码重置。
            </p>
            <p className="text-sm">
              如果您没有收到邮件，请稍等几分钟后重试。
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = '/lostpass')}
          >
            重新发送
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

// 页面路由
function LostpassRouter() {
  const pageName = document.documentElement.getAttribute('data-page') || '';

  switch (pageName) {
    case 'user_lostpass_with_code':
      return <LostpassWithCodePage />;
    case 'user_lostpass_mail_sent':
      return <LostpassMailSentPage />;
    default:
      return <LostpassPage />;
  }
}

const page = new AutoloadPage(['user_lostpass', 'user_lostpass_with_code', 'user_lostpass_mail_sent'], () => {
  const container = document.getElementById('user-lostpass-root');
  if (container) {
    lostpassRoot ||= createRoot(container);
    lostpassRoot.render(<LostpassRouter />);
  }
});

export default page;
