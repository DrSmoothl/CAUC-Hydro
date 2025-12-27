import { Fingerprint, KeyRound, ShieldCheck, Smartphone } from 'lucide-react';
import React, { useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '../components/ui';
import { AutoloadPage } from '../misc/Page';
import { request } from '../utils';

// 保存 root 引用以避免重复创建
let sudoRoot: Root | null = null;

type AuthMethod = 'password' | 'authn' | 'tfa';

function SudoPage() {
  const ctx = (window as any).UserContext || {};
  const hasAuthn = ctx.authn === true;
  const hasTfa = ctx.tfa === true;

  // 确定默认的认证方式
  const getDefaultMethod = (): AuthMethod => {
    if (hasAuthn) return 'authn';
    return 'password';
  };

  const [method, setMethod] = useState<AuthMethod>(getDefaultMethod());
  const [password, setPassword] = useState('');
  const [tfaCode, setTfaCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (method === 'password' && !password) {
      setError('请输入密码');
      return;
    }
    if (method === 'tfa' && !tfaCode) {
      setError('请输入两步验证码');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data: Record<string, string> = {};

      if (method === 'password') {
        data.password = password;
      } else if (method === 'tfa') {
        data.tfa = tfaCode;
      } else if (method === 'authn') {
        // WebAuthn 需要特殊处理
        data.authnChallenge = '';
      }

      const result = await request.post('', data);

      if (result.url) {
        window.location.href = result.url;
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || '验证失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWebAuthn = async () => {
    setSubmitting(true);
    setError('');

    try {
      // 触发 WebAuthn 验证 - 使用原有的隐藏表单机制
      const form = document.createElement('form');
      form.method = 'POST';
      form.style.display = 'none';

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'authnChallenge';
      input.value = '';

      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      setError(err.message || '认证器验证失败');
      setSubmitting(false);
    }
  };

  const availableMethods: { key: AuthMethod, label: string, icon: React.ReactNode }[] = [];

  if (hasAuthn) {
    availableMethods.push({
      key: 'authn',
      label: '使用认证器',
      icon: <Fingerprint className="h-4 w-4" />,
    });
  }
  if (hasTfa) {
    availableMethods.push({
      key: 'tfa',
      label: '使用两步验证',
      icon: <Smartphone className="h-4 w-4" />,
    });
  }
  availableMethods.push({
    key: 'password',
    label: '使用密码',
    icon: <KeyRound className="h-4 w-4" />,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-500/10 rounded-full">
              <ShieldCheck className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">身份验证</CardTitle>
          <CardDescription>
            您正在进入 sudo 模式，请验证您的身份
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          {/* WebAuthn 认证器 */}
          {method === 'authn' && (
            <div className="space-y-4">
              <Button
                type="button"
                className="w-full"
                onClick={handleWebAuthn}
                disabled={submitting}
              >
                <Fingerprint className="mr-2 h-4 w-4" />
                {submitting ? '验证中...' : '使用认证器验证'}
              </Button>
            </div>
          )}

          {/* 两步验证 */}
          {method === 'tfa' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tfa">两步验证码</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="tfa"
                    type="number"
                    placeholder="请输入 6 位验证码"
                    value={tfaCode}
                    onChange={(e) => setTfaCode(e.target.value)}
                    className="pl-9"
                    autoFocus
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? '验证中...' : '确认'}
              </Button>
            </form>
          )}

          {/* 密码验证 */}
          {method === 'password' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    autoComplete="current-password"
                    autoFocus
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? '验证中...' : '确认'}
              </Button>
            </form>
          )}

          {/* 提示信息 */}
          <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            <p className="font-medium mb-1">提示</p>
            <p>您正在进入 sudo 模式。在执行了受 sudo 保护的操作后，几小时内不活动才需要重新验证。</p>
          </div>

          {/* 其他验证方式 */}
          {availableMethods.length > 1 && (
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">或使用其他方式：</p>
              <div className="flex flex-wrap gap-2">
                {availableMethods
                  .filter((m) => m.key !== method)
                  .map((m) => (
                    <Button
                      key={m.key}
                      variant="outline"
                      size="sm"
                      onClick={() => setMethod(m.key)}
                      disabled={submitting}
                    >
                      {m.icon}
                      <span className="ml-1">{m.label}</span>
                    </Button>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const page = new AutoloadPage('user_sudo', () => {
  const container = document.getElementById('user-sudo-root');
  if (container) {
    sudoRoot ||= createRoot(container);
    sudoRoot.render(<SudoPage />);
  }
});

export default page;
