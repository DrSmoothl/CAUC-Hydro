import { AlertCircle } from 'lucide-react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '../components/ui';
import { AutoloadPage } from '../misc/Page';

interface ErrorParam {
  message?: string;
  params?: string[];
  toString(): string;
}

interface ErrorData {
  error: {
    name: string;
    message: string;
    params: (string | ErrorParam)[];
  };
}

function formatMessage(message: string, params: (string | ErrorParam)[]): string {
  let result = message;
  params.forEach((param, index) => {
    const value = typeof param === 'object' ? param.toString() : param;
    result = result.replace(`{${index}}`, value);
  });
  return result;
}

function ErrorPage() {
  const { error } = window.UiContext as ErrorData;

  const formatParam = (param: string | ErrorParam): string => {
    if (typeof param === 'object' && param.message) {
      return formatMessage(param.message, param.params || []);
    }
    return String(param);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">
            哎呀！
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {formatMessage(error.message, error.params)}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator />

          <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>技术信息</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p className="flex gap-2">
                <span className="font-medium">类型:</span>
                <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                  {error.name}
                </code>
              </p>

              {error.params.length > 0 && (
                <div>
                  <span className="font-medium">参数:</span>
                  <ol className="list-decimal list-inside mt-1 space-y-1 text-sm">
                    {error.params.map((param, index) => (
                      <li key={index} className="text-muted-foreground">
                        {formatParam(param)}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </AlertDescription>
          </Alert>

          <div className="flex justify-center pt-2">
            <a
              href="javascript:history.back()"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← 返回上一页
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default new AutoloadPage('errorPage', async () => {
  const container = document.getElementById('error-root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <ErrorPage />
      </React.StrictMode>,
    );
  }
});
