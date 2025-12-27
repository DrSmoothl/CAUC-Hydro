import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Search,
  Shuffle,
  Star,
  Trash2,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AppLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  type CategoryConfig,
  CategorySidebar,
  Checkbox,
  defaultFooterCategories,
  defaultNavItems,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  StatusBadge,
  type StatusType,
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
  useLayoutContext,
} from '../components/ui';
import { AutoloadPage } from '../misc/Page';

// 类型定义
interface ProblemDoc {
  docId: number;
  pid?: string;
  title: string;
  nAccept: number;
  nSubmit: number;
  difficulty?: number;
  tag?: string[];
  hidden?: boolean;
  domainId?: string;
}

interface ProblemStatus {
  docId: number;
  rid?: string;
  status?: number;
  score?: number;
  star?: boolean;
}

interface UrlParams {
  page?: number;
  q?: string;
  sort?: string;
}

// 根据状态获取对应的类型
function getStatusType(status?: number): StatusType | undefined {
  if (status === undefined || status === null) return undefined;
  // 直接返回状态码，StatusBadge 会处理
  return status as StatusType;
}

// 难度徽章组件
function DifficultyBadge({ difficulty }: { difficulty?: number }) {
  if (!difficulty) {
    return <span className="text-muted-foreground text-sm">(无)</span>;
  }

  let color = 'bg-gray-500';
  let label = '未评级';

  if (difficulty <= 3) {
    color = 'bg-green-500';
    label = '简单';
  } else if (difficulty <= 6) {
    color = 'bg-yellow-500';
    label = '中等';
  } else if (difficulty <= 9) {
    color = 'bg-orange-500';
    label = '困难';
  } else {
    color = 'bg-red-500';
    label = '极难';
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`${color} text-white text-xs px-2`}>{difficulty}</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>难度: {label} ({difficulty})</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// 分页组件
interface PaginatorProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Paginator({ page, totalPages, onPageChange }: PaginatorProps) {
  if (totalPages <= 1) return null;

  const pages = useMemo(() => {
    const result: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) result.push(i);
    } else {
      // 显示首页
      result.push(1);

      if (page > 3) result.push('...');

      // 显示当前页附近的页码
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!result.includes(i)) result.push(i);
      }

      if (page < totalPages - 2) result.push('...');

      // 显示末页
      if (!result.includes(totalPages)) result.push(totalPages);
    }

    return result;
  }, [page, totalPages]);

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((p, i) => (
        typeof p === 'number' ? (
          <Button
            key={p}
            variant={p === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(p)}
            className="min-w-[2rem]"
          >
            {p}
          </Button>
        ) : (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
            ...
          </span>
        )
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// 排序选项
const sortOptions = [
  { value: 'default', label: '默认排序' },
  { value: 'recent', label: '最近更新' },
  { value: 'difficulty', label: '难度排序' },
  { value: 'nAccept', label: '通过数' },
];

// 搜索和筛选组件
interface SearchFilterProps {
  query: string;
  onQueryChange: (query: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  onSearch: () => void;
  showTags: boolean;
  onToggleTags: () => void;
}

function SearchFilter({
  query,
  onQueryChange,
  sort,
  onSortChange,
  onSearch,
  showTags,
  onToggleTags,
}: SearchFilterProps) {
  const currentSortLabel = sortOptions.find((o) => o.value === sort)?.label || '默认排序';

  return (
    <div className="flex items-center gap-2">
      {/* 搜索框 */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          placeholder="搜索题目..."
          className="pl-9 pr-2"
        />
      </div>

      {/* 排序下拉框 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[120px] justify-between">
            {currentSortLabel}
            <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className="flex items-center justify-between"
            >
              {option.label}
              {sort === option.value && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 显示/隐藏标签按钮 */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleTags}
        title={showTags ? '隐藏标签' : '显示标签'}
      >
        {showTags ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>

      {/* 搜索按钮 */}
      <Button onClick={onSearch} size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}

// 随机题目组件
function LuckyProblem({ domainId }: { domainId: string }) {
  const handleLucky = () => {
    window.location.href = domainId === 'system'
      ? '/p/random'
      : `/d/${domainId}/p/random`;
  };

  return (
    <Card>
      <CardContent className="py-4">
        <Button variant="outline" className="w-full" onClick={handleLucky}>
          <Shuffle className="h-4 w-4 mr-2" />
          随机跳题
        </Button>
      </CardContent>
    </Card>
  );
}

// 编辑模式工具栏
interface EditToolbarProps {
  selectedCount: number;
  onHide: () => void;
  onUnhide: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onCopy: () => void;
  hasEditPerm: boolean;
}

function EditToolbar({
  selectedCount,
  onHide,
  onUnhide,
  onDownload,
  onDelete,
  onCopy,
  hasEditPerm,
}: EditToolbarProps) {
  return (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
      <span className="text-sm font-medium">
        已选择 {selectedCount} 道题目
      </span>
      <div className="flex-1" />
      {hasEditPerm && (
        <>
          <Button variant="outline" size="sm" onClick={onHide}>
            <EyeOff className="h-4 w-4 mr-1" />
            隐藏
          </Button>
          <Button variant="outline" size="sm" onClick={onUnhide}>
            <Eye className="h-4 w-4 mr-1" />
            显示
          </Button>
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4 mr-1" />
            下载
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            删除
          </Button>
        </>
      )}
      <Button variant="outline" size="sm" onClick={onCopy}>
        <Copy className="h-4 w-4 mr-1" />
        复制
      </Button>
    </div>
  );
}

// 题目列表组件
interface ProblemTableProps {
  problems: ProblemDoc[];
  statusDict: Record<number, ProblemStatus>;
  showTags: boolean;
  editMode: boolean;
  selectedPids: Set<number>;
  onSelectPid: (pid: number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onStarProblem?: (pid: number, star: boolean) => void;
  domainId: string;
}

function ProblemTable({
  problems,
  statusDict,
  showTags,
  editMode,
  selectedPids,
  onSelectPid,
  onSelectAll,
  onStarProblem,
  domainId,
}: ProblemTableProps) {
  const allSelected = problems.length > 0 && problems.every((p) => selectedPids.has(p.docId));
  const someSelected = problems.some((p) => selectedPids.has(p.docId));

  const getProblemUrl = (problem: ProblemDoc) => {
    const pid = problem.pid || problem.docId;
    if (problem.domainId && problem.domainId !== domainId) {
      return `/d/${problem.domainId}/p/${pid}`;
    }
    return domainId === 'system' ? `/p/${pid}` : `/d/${domainId}/p/${pid}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {editMode && (
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected || (someSelected && !allSelected)}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
              />
            </TableHead>
          )}
          {editMode && <TableHead className="w-20">ID</TableHead>}
          {!editMode && <TableHead className="w-16">状态</TableHead>}
          <TableHead>题目</TableHead>
          <TableHead className="w-24 text-center">AC / 尝试</TableHead>
          <TableHead className="w-20 text-center">难度</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {problems.map((problem) => {
          const status = statusDict[problem.docId];
          const statusType = getStatusType(status?.status);
          const isSelected = selectedPids.has(problem.docId);

          return (
            <TableRow
              key={problem.docId}
              className={isSelected ? 'bg-primary/5' : undefined}
            >
              {editMode && (
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectPid(problem.docId, !!checked)}
                  />
                </TableCell>
              )}
              {editMode && (
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {problem.docId}
                </TableCell>
              )}
              {!editMode && (
                <TableCell>
                  {statusType !== undefined && <StatusBadge status={statusType} short />}
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-2">
                  {onStarProblem && (
                    <button
                      onClick={() => onStarProblem(problem.docId, !status?.star)}
                      className="text-muted-foreground hover:text-yellow-500 transition-colors"
                    >
                      <Star
                        className={`h-4 w-4 ${status?.star ? 'fill-yellow-500 text-yellow-500' : ''}`}
                      />
                    </button>
                  )}
                  <a
                    href={getProblemUrl(problem)}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {problem.pid || `P${problem.docId}`}
                  </a>
                  <a
                    href={getProblemUrl(problem)}
                    className="hover:text-primary transition-colors truncate"
                  >
                    {problem.title}
                  </a>
                  {problem.hidden && (
                    <Badge variant="secondary" className="text-xs">
                      隐藏
                    </Badge>
                  )}
                </div>
                {showTags && problem.tag && problem.tag.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {problem.tag.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-center text-sm">
                <span className="text-green-600">{problem.nAccept}</span>
                {' / '}
                <span className="text-muted-foreground">{problem.nSubmit}</span>
              </TableCell>
              <TableCell className="text-center">
                <DifficultyBadge difficulty={problem.difficulty} />
              </TableCell>
            </TableRow>
          );
        })}
        {problems.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={editMode ? 5 : 4}
              className="text-center py-8 text-muted-foreground"
            >
              暂无题目
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

// 创建题目快捷入口
interface ProblemAddLink {
  name: string;
  href: string;
  icon?: string;
  text: string;
}

interface CreateProblemLinksProps {
  links: ProblemAddLink[];
}

function CreateProblemLinks({ links }: CreateProblemLinksProps) {
  if (!links.length) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">创建题目</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span className="text-sm">{link.text}</span>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}

// 主页面组件
function ProblemMainPage() {
  const ctx = (window as any).UiContext || {};
  const { user, domain, version } = useLayoutContext();

  // 从上下文获取数据
  const initialProblems: ProblemDoc[] = ctx.pdocs || [];
  const initialStatusDict: Record<number, ProblemStatus> = ctx.psdict || {};
  const categories: CategoryConfig = ctx.categories || {};
  const initialPage = ctx.page || 1;
  const totalPages = ctx.ppcount || 1;
  const initialQuery = ctx.qs || '';
  const initialSort = ctx.sort || 'default';
  const hasEditPerm = ctx.canEditProblem || false;
  const hasCreatePerm = ctx.canCreateProblem || false;
  const problemAddLinks = ctx.problemAddLinks || [];
  const totalCount = ctx.pcount || 0;

  // 状态
  const [problems] = useState(initialProblems);
  const [statusDict, setStatusDict] = useState(initialStatusDict);
  const [page] = useState(initialPage);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState(initialSort);
  const [showTags, setShowTags] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPids, setSelectedPids] = useState<Set<number>>(new Set());
  const [, setLoading] = useState(false);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);

  // 构建 URL
  const buildUrl = useCallback((params: UrlParams) => {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.sort && params.sort !== 'default') searchParams.set('sort', params.sort);
    if (params.page && params.page > 1) searchParams.set('page', String(params.page));
    const queryString = searchParams.toString();
    const basePath = domain._id === 'system' ? '/p' : `/d/${domain._id}/p`;
    return queryString ? `${basePath}?${queryString}` : basePath;
  }, [domain._id]);

  // 搜索处理
  const handleSearch = useCallback(() => {
    const url = buildUrl({ q: query, sort, page: 1 });
    window.location.href = url;
  }, [buildUrl, query, sort]);

  // 分页处理
  const handlePageChange = useCallback((newPage: number) => {
    const url = buildUrl({ q: query, sort, page: newPage });
    window.location.href = url;
  }, [buildUrl, query, sort]);

  // 分类点击
  const handleCategoryClick = useCallback((category: string) => {
    const newQuery = `category:${category}`;
    const url = buildUrl({ q: newQuery, sort });
    window.location.href = url;
  }, [buildUrl, sort]);

  // 选择处理
  const handleSelectPid = useCallback((pid: number, selected: boolean) => {
    setSelectedPids((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(pid);
      } else {
        next.delete(pid);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedPids(new Set(problems.map((p) => p.docId)));
    } else {
      setSelectedPids(new Set());
    }
  }, [problems]);

  // 批量操作
  const handleBulkOperation = useCallback(async (operation: string) => {
    if (selectedPids.size === 0) {
      // eslint-disable-next-line no-alert
      window.alert('请先选择题目');
      return;
    }

    const pids = Array.from(selectedPids);

    if (operation === 'delete') {
      // eslint-disable-next-line no-alert
      if (!window.confirm(`确定要删除选中的 ${pids.length} 道题目吗？此操作不可恢复。`)) {
        return;
      }
    }

    try {
      setLoading(true);
      const basePath = domain._id === 'system' ? '/p' : `/d/${domain._id}/p`;
      const response = await fetch(basePath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, pids }),
      });

      if (!response.ok) throw new Error('操作失败');

      // eslint-disable-next-line no-alert
      window.alert('操作成功');
      setSelectedPids(new Set());
      window.location.reload();
    } catch {
      // eslint-disable-next-line no-alert
      window.alert('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [selectedPids, domain._id]);

  // 收藏题目
  const handleStarProblem = useCallback(async (pid: number, star: boolean) => {
    try {
      const basePath = domain._id === 'system' ? `/p/${pid}` : `/d/${domain._id}/p/${pid}`;
      await fetch(basePath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: star ? 'star' : 'unstar' }),
      });
      setStatusDict((prev) => ({
        ...prev,
        [pid]: { ...prev[pid], star },
      }));
    } catch {
      // 忽略错误
    }
  }, [domain._id]);

  return (
    <AppLayout
      user={user}
      domain={domain}
      navItems={defaultNavItems}
      currentPath="/p"
      breadcrumbs={[
        { label: '首页', href: '/' },
        { label: '题库' },
      ]}
      footerCategories={defaultFooterCategories}
      version={version}
      showSearch
      onSearch={(q) => {
        if (q.trim()) {
          const url = buildUrl({ q, sort });
          window.location.href = url;
        }
      }}
      contentClassName="p-4 md:p-6"
    >
      <div className="grid lg:grid-cols-4 gap-6">
        {/* 主内容区 */}
        <div className="lg:col-span-3 space-y-4">
          {/* 标题栏 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">题库</h1>
              <p className="text-muted-foreground text-sm mt-1">
                共 {totalCount} 道题目
              </p>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <Button
                  variant={editMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEditMode(!editMode)}
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  {editMode ? '退出编辑' : '编辑模式'}
                </Button>
              )}
            </div>
          </div>

          {/* 搜索和筛选 */}
          <Card>
            <CardContent className="py-4">
              <SearchFilter
                query={query}
                onQueryChange={setQuery}
                sort={sort}
                onSortChange={setSort}
                onSearch={handleSearch}
                showTags={showTags}
                onToggleTags={() => setShowTags(!showTags)}
              />
            </CardContent>
          </Card>

          {/* 编辑模式工具栏 */}
          {editMode && selectedPids.size > 0 && (
            <EditToolbar
              selectedCount={selectedPids.size}
              onHide={() => handleBulkOperation('hide')}
              onUnhide={() => handleBulkOperation('unhide')}
              onDownload={() => handleBulkOperation('download')}
              onDelete={() => handleBulkOperation('delete')}
              onCopy={() => setCopyDialogOpen(true)}
              hasEditPerm={hasEditPerm}
            />
          )}

          {/* 题目列表 */}
          <Card>
            <CardContent className="p-0">
              <ProblemTable
                problems={problems}
                statusDict={statusDict}
                showTags={showTags}
                editMode={editMode}
                selectedPids={selectedPids}
                onSelectPid={handleSelectPid}
                onSelectAll={handleSelectAll}
                onStarProblem={user ? handleStarProblem : undefined}
                domainId={domain._id}
              />
            </CardContent>
            <Paginator
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Card>
        </div>

        {/* 右侧边栏 */}
        <div className="space-y-4">
          {/* 创建题目入口 */}
          {hasCreatePerm && (
            <CreateProblemLinks links={problemAddLinks} />
          )}

          {/* 分类筛选 */}
          <CategorySidebar
            categories={categories}
            onCategoryClick={handleCategoryClick}
          />

          {/* 随机跳题 */}
          <LuckyProblem domainId={domain._id} />
        </div>
      </div>

      {/* 复制对话框 */}
      <Dialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>复制题目</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              已选择 {selectedPids.size} 道题目，请选择目标域：
            </p>
            {/* TODO: 域选择器 */}
            <Input placeholder="输入目标域 ID" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCopyDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => handleBulkOperation('copy')}>
              确认复制
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

const page = new AutoloadPage('problemMainReactPage', () => {
  const container = document.getElementById('problem-main-root');
  if (container) {
    createRoot(container).render(<ProblemMainPage />);
  }
});

export default page;
