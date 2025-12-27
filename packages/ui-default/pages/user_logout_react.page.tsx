import { LogOut } from 'lucide-react';
import React, { useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui';
import { AutoloadPage } from '../misc/Page';
import { request } from '../utils';

// 保存 root 引用以避免重复创建
let logoutRoot: Root | null = null;

function LogoutPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    setSubmitting(true);
    setError('');

    try {
      const result = await request.post('', {});
      if (result.url) {
        window.location.href = result.url;
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || '登出失败，请重试');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-destructive/10 rounded-full">
              <LogOut className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">退出登录</CardTitle>
          <CardDescription>
            您确定要退出当前账户吗？
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? '正在退出...' : '确认退出'}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.history.back()}
              disabled={submitting}
            >
              取消
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const page = new AutoloadPage('user_logout', () => {
  const container = document.getElementById('user-logout-root');
  if (container) {
    logoutRoot ||= createRoot(container);
    logoutRoot.render(<LogoutPage />);
  }
});

export default page;
