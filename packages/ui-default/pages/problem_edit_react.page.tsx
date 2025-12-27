import {
  AlertTriangle,
  ChevronLeft,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { CategoryConfig } from '../components/ui';
import {
  Alert,
  AlertDescription,
  AppLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CategorySelector,
  Checkbox,
  defaultFooterCategories,
  defaultNavItems,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useLayoutContext,
} from '../components/ui';
import { AutoloadPage } from '../misc/Page';

// 类型定义
interface ProblemDoc {
  docId?: number;
  pid?: string;
  title?: string;
  content?: string;
  tag?: string[];
  difficulty?: number;
  hidden?: boolean;
}

interface StatementLang {
  code: string;
  name: string;
}

interface FileItem {
  name: string;
  size: number;
  lastModified?: string;
}

// 文件列表组件
interface FileListProps {
  files: FileItem[];
  onUpload: () => void;
  onDelete: (name: string) => void;
  title: string;
}

function FileList({ files, onUpload, onDelete, title }: FileListProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{title}</CardTitle>
          <Button size="sm" onClick={onUpload}>
            <Upload className="h-3 w-3 mr-1" />
            上传
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无文件</p>
        ) : (
          <div className="space-y-1">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between text-sm p-1 rounded hover:bg-muted"
              >
                <span className="truncate flex-1">{file.name}</span>
                <span className="text-muted-foreground text-xs mx-2">
                  {formatSize(file.size)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onDelete(file.name)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Markdown 提示组件
function MarkdownHint() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('polyhedron-hint') === 'dismiss',
  );

  if (dismissed) return null;

  const handleDismiss = () => setDismissed(true);
  const handleDismissForever = () => {
    localStorage.setItem('polyhedron-hint', 'dismiss');
    setDismissed(true);
  };

  return (
    <Alert className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <p className="mb-2">
          为了更好地管理题目版本和验证，我们建议使用 Polyhedron 来准备题目。
        </p>
        <p className="mb-2 text-sm text-muted-foreground">
          Polyhedron 支持管理题目版本历史、测试解决方案、检查时间限制、撰写比赛声明、协作等更多功能。
        </p>
        <div className="flex gap-2 mt-2">
          <a
            href="https://polyhedron.hydro.ac/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm"
          >
            打开 Polyhedron
          </a>
          <span className="text-muted-foreground">|</span>
          <button
            onClick={handleDismiss}
            className="text-primary hover:underline text-sm"
          >
            关闭
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            onClick={handleDismissForever}
            className="text-primary hover:underline text-sm"
          >
            不再显示
          </button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// 主页面组件
function ProblemEditPage() {
  const ctx = (window as any).UiContext || {};
  const { user, domain, version } = useLayoutContext();

  // 从上下文获取数据
  const pdoc: ProblemDoc = ctx.pdoc || {};
  const categories: CategoryConfig = ctx.categories || {};
  const isCreate = ctx.isCreate || false;
  const statementLangs: StatementLang[] = ctx.statementLangs || [{ code: 'zh', name: '中文' }];
  const additionalFiles: FileItem[] = ctx.additionalFiles || [];
  const canDelete = ctx.canDelete || false;

  // 表单状态
  const [pid, setPid] = useState(pdoc.pid || '');
  const [title, setTitle] = useState(pdoc.title || '');
  const [hidden, setHidden] = useState(pdoc.hidden || false);
  const [difficulty, setDifficulty] = useState(String(pdoc.difficulty || ''));
  const [selectedTags, setSelectedTags] = useState<string[]>(pdoc.tag || []);
  const [customTags, setCustomTags] = useState('');

  // 多语言内容
  const [contents, setContents] = useState<Record<string, string>>(() => {
    if (!pdoc.content) return { zh: '' };
    try {
      const parsed = JSON.parse(pdoc.content);
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed;
      }
      return { zh: pdoc.content };
    } catch {
      return { zh: pdoc.content || '' };
    }
  });
  const [activeTab, setActiveTab] = useState(statementLangs[0]?.code || 'zh');

  // 对话框状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 合并所有标签
  const allTags = [
    ...selectedTags,
    ...customTags.split(',').map((t) => t.trim()).filter(Boolean),
  ];

  // 更新内容
  const handleContentChange = useCallback((value: string) => {
    setContents((prev) => ({
      ...prev,
      [activeTab]: value,
    }));
  }, [activeTab]);

  // 提交表单
  const handleSubmit = async () => {
    if (!title.trim()) {
      // eslint-disable-next-line no-alert
      window.alert('标题不能为空');
      return;
    }

    setSubmitting(true);
    try {
      const contentJson = JSON.stringify(contents);
      const formData = new FormData();
      if (pid) formData.append('pid', pid);
      formData.append('title', title);
      formData.append('content', contentJson);
      formData.append('tag', allTags.join(', '));
      if (difficulty) formData.append('difficulty', difficulty);
      if (hidden) formData.append('hidden', 'on');

      const response = await fetch(window.location.href, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.url) {
          window.location.href = result.url;
        } else {
          window.location.reload();
        }
      } else {
        throw new Error('提交失败');
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      window.alert('操作失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 删除题目
  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(window.location.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'delete' }),
      });

      if (response.ok) {
        const result = await response.json();
        window.location.href = result.url || '/p';
      } else {
        throw new Error('删除失败');
      }
    } catch {
      // eslint-disable-next-line no-alert
      window.alert('删除失败，请重试');
    } finally {
      setSubmitting(false);
      setDeleteDialogOpen(false);
    }
  };

  // 文件操作
  const handleUploadFile = () => {
    // 触发原有的文件上传逻辑
    const uploadBtn = document.querySelector('[name="upload_file"]') as HTMLButtonElement;
    uploadBtn?.click();
  };

  const handleDeleteFile = (name: string) => {
    // eslint-disable-next-line no-alert
    if (window.confirm(`确定要删除文件 ${name} 吗？`)) {
      // 调用删除 API
    }
  };

  const breadcrumbs = isCreate
    ? [
      { label: '首页', href: '/' },
      { label: '题库', href: '/p' },
      { label: '创建题目' },
    ]
    : [
      { label: '首页', href: '/' },
      { label: '题库', href: '/p' },
      { label: pdoc.pid || `P${pdoc.docId}`, href: `/p/${pdoc.pid || pdoc.docId}` },
      { label: '编辑' },
    ];

  return (
    <AppLayout
      user={user}
      domain={domain}
      navItems={defaultNavItems}
      currentPath="/p"
      breadcrumbs={breadcrumbs}
      footerCategories={defaultFooterCategories}
      version={version}
      showSearch={false}
      contentClassName="p-4 md:p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">
              {isCreate ? '创建题目' : '编辑题目'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {!isCreate && canDelete && (
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={submitting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                删除
              </Button>
            )}
            <Button onClick={handleSubmit} disabled={submitting}>
              <Save className="h-4 w-4 mr-2" />
              {isCreate ? '创建' : '保存'}
            </Button>
          </div>
        </div>

        {/* Polyhedron 提示 */}
        {isCreate && <MarkdownHint />}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* 主编辑区 */}
          <div className="lg:col-span-3 space-y-4">
            {/* 基本信息 */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3">
                    <Label htmlFor="pid">题目 ID</Label>
                    <Input
                      id="pid"
                      value={pid}
                      onChange={(e) => setPid(e.target.value)}
                      placeholder="P1000"
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-7">
                    <Label htmlFor="title">标题</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="题目标题"
                      className="mt-1"
                      autoFocus={isCreate}
                    />
                  </div>
                  <div className="col-span-2 flex items-end">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hidden"
                        checked={hidden}
                        onCheckedChange={(checked) => setHidden(!!checked)}
                      />
                      <Label htmlFor="hidden" className="cursor-pointer">
                        隐藏
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {hidden ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            {hidden ? '题目已隐藏，仅管理员可见' : '题目公开可见'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 mt-4">
                  <div className="col-span-9">
                    <Label htmlFor="tags">标签</Label>
                    <Input
                      id="tags"
                      value={allTags.join(', ')}
                      onChange={(e) => {
                        const inputTags = e.target.value.split(',').map((t) => t.trim());
                        const catTags = inputTags.filter((t) => (
                          Object.keys(categories).includes(t)
                          || Object.values(categories).flat().includes(t)
                        ));
                        const custom = inputTags.filter((t) => !catTags.includes(t));
                        setSelectedTags(catTags);
                        setCustomTags(custom.join(', '));
                      }}
                      placeholder="用逗号分隔多个标签"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      用逗号分隔多个标签，也可以点击右侧分类添加
                    </p>
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor="difficulty">难度</Label>
                    <Input
                      id="difficulty"
                      type="number"
                      min="1"
                      max="10"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      placeholder="1-10"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 题目内容编辑器 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">题目内容</CardTitle>
              </CardHeader>
              <CardContent>
                {/* 语言标签 */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    {statementLangs.map((lang) => (
                      <TabsTrigger key={lang.code} value={lang.code}>
                        {lang.name}
                      </TabsTrigger>
                    ))}
                    <Button variant="ghost" size="sm" className="ml-2">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </TabsList>
                  {statementLangs.map((lang) => (
                    <TabsContent key={lang.code} value={lang.code}>
                      <Textarea
                        value={contents[lang.code] || ''}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder="使用 Markdown 格式编写题目内容..."
                        className="min-h-[500px] font-mono text-sm"
                        autoFocus={!isCreate}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
                <p className="text-xs text-muted-foreground mt-2">
                  支持 Markdown 格式，可使用 LaTeX 数学公式
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 右侧边栏 */}
          <div className="space-y-4">
            {/* 分类选择 */}
            <CategorySelector
              categories={categories}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />

            {/* 附加文件 - 仅编辑模式 */}
            {!isCreate && (
              <FileList
                files={additionalFiles}
                onUpload={handleUploadFile}
                onDelete={handleDeleteFile}
                title="附加文件"
              />
            )}
          </div>
        </div>
      </div>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            确定要删除这道题目吗？题目的文件、提交记录、讨论和题解都将被删除，此操作不可恢复。
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

// 注册页面，匹配 problem_create 和 problem_edit 两个页面名称
const page = new AutoloadPage(['problem_create', 'problem_edit'], () => {
  const container = document.getElementById('problem-edit-root');
  if (container) {
    createRoot(container).render(<ProblemEditPage />);
  }
});

export default page;
