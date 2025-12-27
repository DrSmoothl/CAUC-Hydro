import {
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarDays,
  Clock,
  Code2,
  FileText,
  GraduationCap,
  Home,
  ListTodo,
  MessageSquare,
  Sparkles,
  Star,
  Trophy,
  Users,
} from 'lucide-react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  AppLayout,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  type NavItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui';
import { AutoloadPage } from '../misc/Page';

// 默认导航
const defaultNavItems: NavItem[] = [
  { name: 'home', label: '首页', href: '/', icon: Home },
  { name: 'problem_main', label: '题库', href: '/p', icon: FileText },
  { name: 'contest_main', label: '比赛', href: '/contest', icon: Trophy },
  { name: 'homework_main', label: '作业', href: '/homework', icon: GraduationCap },
  { name: 'training_main', label: '训练', href: '/training', icon: ListTodo },
  { name: 'record_main', label: '评测记录', href: '/record', icon: Code2 },
  { name: 'ranking', label: '排名', href: '/ranking', icon: Users },
  { name: 'discussion_main', label: '讨论', href: '/discuss', icon: MessageSquare },
  { name: 'wiki', label: '帮助', href: '/wiki/help', icon: BookOpen },
];

const defaultFooterCategories = [
  {
    title: '状态',
    links: [
      { label: '评测队列', href: '/judge/queue' },
      { label: '系统状态', href: '/status' },
    ],
  },
  {
    title: '开发',
    links: [
      { label: 'GitHub', href: 'https://github.com/hydro-dev/Hydro', external: true },
      { label: '文档', href: 'https://hydro.js.org/', external: true },
    ],
  },
];

// 类型定义
interface ContestDoc {
  docId: number;
  title: string;
  rule: string;
  beginAt: string;
  endAt: string;
  attend?: number;
  rated?: boolean;
}

interface ProblemDoc {
  docId: number;
  pid: string;
  title: string;
  difficulty?: number;
}

interface DiscussionDoc {
  docId: string;
  title: string;
  owner: number;
  nReply: number;
}

interface TrainingDoc {
  docId: number;
  title: string;
  nSubscribe?: number;
  pin?: number;
}

interface UserDoc {
  _id: number;
  uname: string;
  avatar?: string;
  avatarUrl?: string;
  rp?: number;
}

interface HomeworkDoc {
  docId: number;
  title: string;
  endAt: string;
}

// 比赛卡片组件
function ContestSection({
  contests,
  tsdict,
}: {
  contests: ContestDoc[];
  tsdict: Record<number, { attend?: number }>;
}) {
  if (!contests?.length) return null;

  const getContestStatus = (contest: ContestDoc) => {
    const now = Date.now();
    const begin = new Date(contest.beginAt).getTime();
    const end = new Date(contest.endAt).getTime();
    if (now < begin) return { label: '即将开始', color: 'bg-blue-500' };
    if (now < end) return { label: '进行中', color: 'bg-green-500' };
    return { label: '已结束', color: 'bg-gray-500' };
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            比赛
          </CardTitle>
          <a
            href="/contest"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            更多 <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {contests.slice(0, 5).map((contest) => {
          const status = getContestStatus(contest);
          const attended = tsdict?.[contest.docId]?.attend === 1;
          return (
            <a
              key={contest.docId}
              href={`/contest/${contest.docId}`}
              className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge
                      variant="secondary"
                      className={`${status.color} text-white text-xs`}
                    >
                      {status.label}
                    </Badge>
                    {contest.rated && (
                      <Badge variant="outline" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Rated
                      </Badge>
                    )}
                    {attended && (
                      <Badge
                        variant="outline"
                        className="text-xs text-green-600 border-green-600"
                      >
                        已报名
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium truncate">{contest.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(contest.beginAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {contest.attend || 0} 人
                    </span>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </CardContent>
    </Card>
  );
}

// 最新题目组件
function RecentProblemsSection({ problems }: { problems: ProblemDoc[] }) {
  if (!problems?.length) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            最新题目
          </CardTitle>
          <a
            href="/p"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            更多 <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {problems.slice(0, 8).map((problem) => (
            <a
              key={problem.docId}
              href={`/p/${problem.pid || problem.docId}`}
              className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">
                  {problem.pid || `P${problem.docId}`}
                </span>
                <span className="text-sm truncate max-w-[200px]">
                  {problem.title}
                </span>
              </span>
              {problem.difficulty !== undefined && (
                <Badge variant="outline" className="text-xs">
                  难度 {problem.difficulty}
                </Badge>
              )}
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 排名组件
function RankingSection({
  uids,
  udict,
}: {
  uids: number[];
  udict: Record<number, UserDoc>;
}) {
  if (!uids?.length) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            排名
          </CardTitle>
          <a
            href="/ranking"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            更多 <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>用户</TableHead>
              <TableHead className="text-right w-20">RP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uids.slice(0, 10).map((uid, index) => {
              const u = udict[uid];
              if (!u) return null;
              return (
                <TableRow key={uid}>
                  <TableCell className="font-medium">
                    {index === 0 && <span className="text-yellow-500">🥇</span>}
                    {index === 1 && <span className="text-gray-400">🥈</span>}
                    {index === 2 && <span className="text-amber-600">🥉</span>}
                    {index > 2 && (
                      <span className="text-muted-foreground">{index + 1}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`/user/${uid}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={u.avatarUrl || u.avatar} />
                        <AvatarFallback className="text-xs">
                          {u.uname?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.uname}</span>
                    </a>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {Math.round(u.rp || 0)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// 讨论组件
function DiscussionSection({
  discussions,
  udict,
}: {
  discussions: DiscussionDoc[];
  udict: Record<number, UserDoc>;
}) {
  if (!discussions?.length) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            讨论
          </CardTitle>
          <a
            href="/discuss"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            更多 <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {discussions.slice(0, 5).map((disc) => {
          const owner = udict[disc.owner];
          return (
            <a
              key={disc.docId}
              href={`/discuss/${disc.docId}`}
              className="block p-2 rounded hover:bg-muted transition-colors"
            >
              <h4 className="font-medium text-sm truncate">{disc.title}</h4>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                {owner && (
                  <span className="flex items-center gap-1">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={owner.avatarUrl || owner.avatar} />
                      <AvatarFallback className="text-xs">
                        {owner.uname?.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    {owner.uname}
                  </span>
                )}
                <span>{disc.nReply} 回复</span>
              </div>
            </a>
          );
        })}
      </CardContent>
    </Card>
  );
}

// 训练组件
function TrainingSection({ trainings }: { trainings: TrainingDoc[] }) {
  if (!trainings?.length) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-green-500" />
            训练计划
          </CardTitle>
          <a
            href="/training"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            更多 <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {trainings.slice(0, 5).map((training) => (
          <a
            key={training.docId}
            href={`/training/${training.docId}`}
            className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-2">
              {training.pin ? (
                <Badge variant="default" className="text-xs">
                  置顶
                </Badge>
              ) : null}
              <span className="font-medium text-sm">{training.title}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {training.nSubscribe || 0} 人订阅
            </span>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}

// 作业组件
function HomeworkSection({
  homeworks,
}: {
  homeworks: HomeworkDoc[];
}) {
  if (!homeworks?.length) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-500" />
            作业
          </CardTitle>
          <a
            href="/homework"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            更多 <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {homeworks.slice(0, 5).map((hw) => {
          const now = Date.now();
          const end = new Date(hw.endAt).getTime();
          const isOverdue = now > end;
          return (
            <a
              key={hw.docId}
              href={`/homework/${hw.docId}`}
              className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-medium text-sm truncate">{hw.title}</span>
                {isOverdue && (
                  <Badge variant="secondary" className="text-xs">
                    已截止
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(hw.endAt).toLocaleDateString()}
              </span>
            </a>
          );
        })}
      </CardContent>
    </Card>
  );
}

// 公告组件
function BulletinSection({ content }: { content: string }) {
  if (!content) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-orange-500" />
          公告
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
    </Card>
  );
}

// 主页面组件
function HomePage() {
  const ctx = (window as any).UiContext || {};

  const layoutUser = ctx.layoutUser || null;
  const domain = ctx.layoutDomain || { _id: 'system', name: 'Hydro' };
  const udict: Record<number, UserDoc> = ctx.udict || {};

  // 解析首页内容
  const contents = ctx.contents || [];
  const sections: Record<string, any> = {};

  // 提取各部分数据
  for (const column of contents) {
    for (const [name, data] of column.sections || []) {
      sections[name] = data;
    }
  }

  // 提取各板块数据
  const contestData = sections.contest || [[], {}];
  const homeworkData = sections.homework || [[], {}];
  const trainingData = sections.training || [[], {}];
  const discussionData = sections.discussion || [[], {}];
  const rankingUids = sections.ranking || [];
  const recentProblemsData = sections.recent_problems || [[], {}];
  const starredProblemsData = sections.starred_problems || [[]];
  const bulletinContent = sections.bulletin || '';

  return (
    <AppLayout
      user={layoutUser}
      domain={domain}
      navItems={defaultNavItems}
      currentPath="/"
      breadcrumbs={[{ label: '首页' }]}
      footerCategories={defaultFooterCategories}
      version={ctx.layoutVersion || 'Hydro'}
      showSearch
      onSearch={(q) => {
        if (q.trim()) window.location.href = `/p?q=${encodeURIComponent(q)}`;
      }}
      contentClassName="p-4 md:p-6"
    >
      {/* 欢迎区域 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {layoutUser ? `欢迎回来，${layoutUser.uname}！` : `欢迎来到 ${domain.name}`}
        </h1>
        <p className="text-muted-foreground mt-1">
          {domain.name} - 在线评测系统
        </p>
      </div>

      {/* 公告 */}
      {bulletinContent && (
        <div className="mb-6">
          <BulletinSection content={bulletinContent} />
        </div>
      )}

      {/* 主内容区域 - 两栏布局 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* 左侧主要内容 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 比赛 */}
          <ContestSection contests={contestData[0]} tsdict={contestData[1]} />

          {/* 作业 */}
          <HomeworkSection homeworks={homeworkData[0]} />

          {/* 讨论 */}
          <DiscussionSection discussions={discussionData[0]} udict={udict} />
        </div>

        {/* 右侧边栏 */}
        <div className="space-y-6">
          {/* 排名 */}
          <RankingSection uids={rankingUids} udict={udict} />

          {/* 最新题目 */}
          <RecentProblemsSection problems={recentProblemsData[0]} />

          {/* 训练 */}
          <TrainingSection trainings={trainingData[0]} />

          {/* 收藏的题目 */}
          {starredProblemsData[0]?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  收藏的题目
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {starredProblemsData[0].slice(0, 5).map((problem: ProblemDoc) => (
                    <a
                      key={problem.docId}
                      href={`/p/${problem.pid || problem.docId}`}
                      className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors"
                    >
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">
                        {problem.pid || `P${problem.docId}`}
                      </span>
                      <span className="text-sm truncate">{problem.title}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

const page = new AutoloadPage('homepagePage', () => {
  const container = document.getElementById('homepage-root');
  if (container) {
    createRoot(container).render(<HomePage />);
  }
});

export default page;
