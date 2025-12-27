import { Trophy } from 'lucide-react';
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui';
import { AutoloadPage } from '../misc/Page';

// 保存 root 引用以避免重复创建
let rankingRoot: Root | null = null;

interface RpColumn {
  key: string;
  hidden?: boolean;
}

interface UserDoc {
  _id: number;
  uname: string;
  avatarUrl?: string;
  rp?: number;
  rpInfo?: Record<string, number>;
  nAccept?: number;
  bio?: string;
  rank?: number;
  hasPriv?: (priv: number) => boolean;
  hasPerm?: (perm: number) => boolean;
}

interface RankingData {
  udocs: UserDoc[];
  page: number;
  upcount: number;
  currentUser?: UserDoc;
  rpColumns: RpColumn[];
  pageSize: number;
}

function UserAvatar({ user }: { user: UserDoc }) {
  const initials = user.uname?.slice(0, 2).toUpperCase() || '??';
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatarUrl} alt={user.uname} />
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <a
        href={`/user/${user._id}`}
        className="font-medium hover:underline text-foreground"
      >
        {user.uname}
      </a>
    </div>
  );
}

function RankBadge({ rank }: { rank: number | string }) {
  if (typeof rank !== 'number') return <span className="text-muted-foreground">-</span>;

  if (rank === 1) {
    return (
      <Badge className="bg-yellow-500 hover:bg-yellow-500">
        <Trophy className="h-3 w-3 mr-1" />
        1
      </Badge>
    );
  }
  if (rank === 2) {
    return <Badge className="bg-gray-400 hover:bg-gray-400">{rank}</Badge>;
  }
  if (rank === 3) {
    return <Badge className="bg-amber-600 hover:bg-amber-600">{rank}</Badge>;
  }
  return <span className="text-muted-foreground">{rank}</span>;
}

function RankingTable({ data }: { data: RankingData }) {
  const { udocs, page, currentUser, rpColumns, pageSize } = data;
  const visibleRpColumns = rpColumns.filter((col) => !col.hidden);

  if (!udocs.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>暂无排名数据</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">排名</TableHead>
            <TableHead className="w-64">用户</TableHead>
            <TableHead className="w-20 text-right">RP</TableHead>
            {visibleRpColumns.map((col) => (
              <TableHead key={col.key} className="w-16 text-center hidden md:table-cell">
                {col.key}
              </TableHead>
            ))}
            <TableHead className="w-16 text-center">AC</TableHead>
            <TableHead className="hidden lg:table-cell">简介</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* 当前用户行（高亮） */}
          {currentUser && (
            <TableRow className="bg-primary/5 border-primary/20">
              <TableCell className="text-center">
                <RankBadge rank={currentUser.rank || '-'} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <UserAvatar user={currentUser} />
                  <Badge variant="outline" className="text-xs">你</Badge>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {Math.round(currentUser.rp || 0)}
              </TableCell>
              {visibleRpColumns.map((col) => (
                <TableCell key={col.key} className="text-center hidden md:table-cell">
                  {currentUser.rpInfo?.[col.key]
                    ? Math.round(currentUser.rpInfo[col.key])
                    : '-'}
                </TableCell>
              ))}
              <TableCell className="text-center">
                <span className="text-green-600 font-medium">
                  {currentUser.nAccept || 0}
                </span>
              </TableCell>
              <TableCell className="hidden lg:table-cell max-w-xs truncate text-muted-foreground">
                {currentUser.bio || ''}
              </TableCell>
            </TableRow>
          )}

          {/* 排名列表 */}
          {udocs.map((user, index) => {
            const rank = (page - 1) * pageSize + index + 1;
            return (
              <TableRow key={user._id}>
                <TableCell className="text-center">
                  <RankBadge rank={rank} />
                </TableCell>
                <TableCell>
                  <UserAvatar user={user} />
                </TableCell>
                <TableCell className="text-right font-medium">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">
                        {Math.round(user.rp || 0)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Rating Points
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                {visibleRpColumns.map((col) => (
                  <TableCell key={col.key} className="text-center hidden md:table-cell">
                    {user.rpInfo?.[col.key]
                      ? Math.round(user.rpInfo[col.key])
                      : '-'}
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  <span className="text-green-600 font-medium">
                    {user.nAccept || 0}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell max-w-xs truncate text-muted-foreground">
                  {user.bio || ''}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}

// 分页组件
function Pagination({
  page,
  totalPages,
  baseUrl = '/ranking',
}: {
  page: number;
  totalPages: number;
  baseUrl?: string;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1
      || i === totalPages
      || (i >= page - delta && i <= page + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      {page > 1 && (
        <a
          href={`${baseUrl}?page=${page - 1}`}
          className="px-3 py-2 text-sm border rounded-md hover:bg-muted"
        >
          上一页
        </a>
      )}
      {pages.map((p, idx) => (
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <a
            key={p}
            href={`${baseUrl}?page=${p}`}
            className={`px-3 py-2 text-sm border rounded-md ${
              p === page
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            {p}
          </a>
        )
      ))}
      {page < totalPages && (
        <a
          href={`${baseUrl}?page=${page + 1}`}
          className="px-3 py-2 text-sm border rounded-md hover:bg-muted"
        >
          下一页
        </a>
      )}
    </div>
  );
}

function RankingPage() {
  // 从 UiContext 获取数据
  const ctx = (window as any).UiContext || {};
  const data: RankingData = {
    udocs: ctx.udocs || [],
    page: ctx.page || 1,
    upcount: ctx.upcount || 0,
    currentUser: ctx.currentUser,
    rpColumns: ctx.rpColumns || [],
    pageSize: ctx.pageSize || 50,
  };

  const totalPages = Math.ceil(data.upcount / data.pageSize);

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            用户排名
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {data.page === 1 && data.udocs.length > 0 && (
            <div className="px-4 py-3 bg-muted/50 border-b text-sm text-muted-foreground">
              💡 排名页面不是实时更新的
            </div>
          )}
          <RankingTable data={data} />
          <Pagination page={data.page} totalPages={totalPages} />
        </CardContent>
      </Card>
    </div>
  );
}

const page = new AutoloadPage('ranking_legacy', () => {
  const container = document.getElementById('ranking-root');
  if (container) {
    rankingRoot ||= createRoot(container);
    rankingRoot.render(<RankingPage />);
  }
});

export default page;
