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
  AppLayout,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  defaultFooterCategories,
  defaultNavItems,
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
  useLayoutContext,
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
    arch: string;
  };
  cpu: {
    manufacturer: string;
    brand: string;
    speed: number;
  };
  memory: {
    used: number;
    total: number;
  };
  reqCount: number;
}

interface CompilerInfo {
  key: string[];
  message: string;
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
            <TableCell className="font-mono text-sm">{server._id}</TableCell>
            <TableCell>
              <Badge variant={server.isOnline ? 'default' : 'destructive'}>
                <span
                  className={`w-2 h-2 rounded-full mr-1.5 ${
                    server.isOnline ? 'bg-green-400' : 'bg-red-400'
                  }`}
                />
                {server.isOnline ? '在线' : '离线'}
              </Badge>
            </TableCell>
            <TableCell>
              <Tooltip>
                <TooltipTrigger className="cursor-help">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {server.osinfo?.distro || 'Unknown'}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {server.osinfo?.distro} {server.osinfo?.release}{' '}
                  {server.osinfo?.arch}
                </TooltipContent>
              </Tooltip>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate max-w-[200px]">
                  {server.cpu?.brand || 'Unknown'}
                </span>
              </div>
            </TableCell>
            <TableCell>
              {server.memory && (
                <MemoryBar
                  used={server.memory.used}
                  total={server.memory.total}
                />
              )}
            </TableCell>
            <TableCell className="text-right font-mono">
              {server.reqCount?.toLocaleString() || 0}
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-48">编译器</TableHead>
          <TableHead>版本信息</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {compilers.map((compiler, idx) => (
          <TableRow key={idx}>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {compiler.key.map((k) => (
                  <Badge key={k} variant="outline" className="font-mono text-xs">
                    {k}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-w-xl">
                {compiler.message}
              </pre>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function LanguagesTab({ languages }: { languages: Record<string, string> }) {
  const entries = Object.entries(languages);
  if (!entries.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <HardDrive className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>暂无语言配置信息</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-32">语言</TableHead>
          <TableHead>编译命令</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map(([lang, cmd]) => (
          <TableRow key={lang}>
            <TableCell>
              <Badge variant="secondary" className="font-mono">
                {lang}
              </Badge>
            </TableCell>
            <TableCell>
              <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                {cmd}
              </code>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function StatusLayoutPage() {
  const ctx = (window as any).UiContext || {};
  const { user, domain, version } = useLayoutContext();

  const stats: ServerStat[] = ctx.stats || [];
  const compilers: CompilerInfo[] = ctx.compilers || [];
  const languages: Record<string, string> = ctx.langs || {};

  const hasCompilers = compilers.length > 0;
  const hasLanguages = Object.keys(languages).length > 0;

  return (
    <AppLayout
      user={user}
      domain={domain}
      navItems={defaultNavItems}
      currentPath="/status"
      breadcrumbs={[{ label: '首页', href: '/' }, { label: '系统状态' }]}
      footerCategories={defaultFooterCategories}
      version={version}
      showSearch={false}
      contentClassName="p-4 md:p-6"
    >
      <TooltipProvider>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>系统状态</CardTitle>
                <CardDescription>
                  查看服务器运行状态、编译器版本和语言配置
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="servers" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="servers"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Server className="h-4 w-4 mr-2" />
                  服务器状态
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
                <ServersTab stats={stats} />
              </TabsContent>

              {hasCompilers && (
                <TabsContent value="compilers" className="m-0">
                  <CompilersTab compilers={compilers} />
                </TabsContent>
              )}

              {hasLanguages && (
                <TabsContent value="languages" className="m-0">
                  <LanguagesTab languages={languages} />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </TooltipProvider>
    </AppLayout>
  );
}

const page = new AutoloadPage('statusLayoutPage', () => {
  const container = document.getElementById('status-layout-root');
  if (container) {
    createRoot(container).render(<StatusLayoutPage />);
  }
});

export default page;
