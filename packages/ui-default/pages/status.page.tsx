import {
  Activity,
  Cpu,
  HardDrive,
  Monitor,
  Server,
  Terminal,
} from 'lucide-react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui';
import { AutoloadPage } from '../misc/Page';

interface ServerStat {
  _id: string;
  isOnline: boolean;
  status: string;
  updateAt: string;
  osinfo: {
    distro: string;
    release: string;
    codename: string;
    arch: string;
    kernel: string;
  };
  cpu: {
    manufacturer: string;
    brand: string;
    speed: number;
    flags: string;
  };
  memory: {
    used: number;
    total: number;
  };
  stack?: number;
  reqCount: number;
}

interface CompilerInfo {
  key: string[];
  message: string;
}

interface StatusData {
  stats: ServerStat[];
  compilers: CompilerInfo[];
  languages: Record<string, string>;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

function MemoryBar({ used, total }: { used: number, total: number }) {
  const percentage = Math.round((used / total) * 100);
  let barColor = 'bg-green-500';
  if (percentage > 80) barColor = 'bg-red-500';
  else if (percentage > 60) barColor = 'bg-yellow-500';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden min-w-[60px]">
        <div
          className={`h-full ${barColor} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {formatBytes(used)}/{formatBytes(total)}
      </span>
    </div>
  );
}

function ServersTab({ stats }: { stats: ServerStat[] }) {
  if (!stats.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>暂无服务器信息</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">ID</TableHead>
          <TableHead className="w-24">状态</TableHead>
          <TableHead>操作系统</TableHead>
          <TableHead>CPU</TableHead>
          <TableHead className="w-48">内存</TableHead>
          <TableHead className="w-24 text-right">请求数</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stats.map((server) => (
          <TableRow key={server._id}>
            <TableCell className="font-mono text-xs">
              {server._id.slice(0, 8)}
            </TableCell>
            <TableCell>
              {server.isOnline ? (
                <Badge variant="success" className="gap-1">
                  <Activity className="h-3 w-3" />
                  {server.status}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  离线
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help flex items-center gap-1">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    {server.osinfo.distro} {server.osinfo.release}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{server.osinfo.kernel}</p>
                  <p>{server.osinfo.arch}</p>
                </TooltipContent>
              </Tooltip>
            </TableCell>
            <TableCell>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help flex items-center gap-1">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    {server.cpu.brand}@{server.cpu.speed}GHz
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{server.cpu.manufacturer}</p>
                </TooltipContent>
              </Tooltip>
            </TableCell>
            <TableCell>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <MemoryBar used={server.memory.used} total={server.memory.total} />
                  </div>
                </TooltipTrigger>
                {server.stack && (
                  <TooltipContent>
                    Stack size: {server.stack}MB
                  </TooltipContent>
                )}
              </Tooltip>
            </TableCell>
            <TableCell className="text-right font-mono">
              {server.reqCount.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function CompilersTab({ compilers }: { compilers: CompilerInfo[] }) {
  if (!compilers.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>暂无编译器信息</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {compilers.map((compiler, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{compiler.key.join(', ')}</span>
          </div>
          <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
            <code>{compiler.message}</code>
          </pre>
        </div>
      ))}
    </div>
  );
}

function LanguagesTab({ languages }: { languages: Record<string, string> }) {
  const entries = Object.entries(languages);

  if (!entries.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <HardDrive className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>暂无语言配置</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {entries.map(([lang, command]) => (
        <div key={lang} className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{lang}</Badge>
          </div>
          <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
            <code>{command}</code>
          </pre>
        </div>
      ))}
    </div>
  );
}

function StatusPage() {
  const ctx = (window as any).UiContext || {};
  const data: StatusData = {
    stats: ctx.stats || [],
    compilers: ctx.compilers || [],
    languages: ctx.languages || {},
  };

  const hasCompilers = data.compilers.length > 0;
  const hasLanguages = Object.keys(data.languages).length > 0;

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            系统状态
          </CardTitle>
          <CardDescription>
            查看服务器、编译器和语言配置信息
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="servers">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="servers"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <Server className="h-4 w-4 mr-2" />
                服务器
              </TabsTrigger>
              {hasCompilers && (
                <TabsTrigger
                  value="compilers"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  编译器版本
                </TabsTrigger>
              )}
              {hasLanguages && (
                <TabsTrigger
                  value="languages"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <HardDrive className="h-4 w-4 mr-2" />
                  编译命令
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="servers" className="m-0">
              <ServersTab stats={data.stats} />
            </TabsContent>

            {hasCompilers && (
              <TabsContent value="compilers" className="m-0">
                <CompilersTab compilers={data.compilers} />
              </TabsContent>
            )}

            {hasLanguages && (
              <TabsContent value="languages" className="m-0">
                <LanguagesTab languages={data.languages} />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

const page = new AutoloadPage('statusPage', () => {
  const container = document.getElementById('status-root');
  if (container) {
    createRoot(container).render(<StatusPage />);
  }
});

export default page;
