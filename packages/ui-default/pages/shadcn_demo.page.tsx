import { MantineProvider } from '@mantine/core';
import { AlertCircle, Bell, Check, Info, Mail, Settings, User } from 'lucide-react';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  ScoreBar,
  Select,
  SelectOption,
  Separator,
  STATUS,
  StatusBadge,
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
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  UserCard,
  UserInline,
} from '../components/ui';
import { AutoloadPage } from '../misc/Page';

function ShadcnUIDemo() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="container mx-auto p-8 space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shadcn/UI 组件库</h1>
          <p className="text-muted-foreground text-lg">
            HydroOJ 现代化 UI 组件演示
          </p>
        </div>

        {/* Tabs 组件 */}
        <Tabs defaultValue="buttons" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="buttons">按钮</TabsTrigger>
            <TabsTrigger value="forms">表单</TabsTrigger>
            <TabsTrigger value="feedback">反馈</TabsTrigger>
            <TabsTrigger value="data">数据</TabsTrigger>
            <TabsTrigger value="overlay">弹出层</TabsTrigger>
            <TabsTrigger value="oj">OJ组件</TabsTrigger>
          </TabsList>

          {/* 按钮选项卡 */}
          <TabsContent value="buttons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>按钮组件</CardTitle>
                <CardDescription>不同样式和尺寸的按钮</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button>默认按钮</Button>
                  <Button variant="secondary">次要按钮</Button>
                  <Button variant="destructive">危险按钮</Button>
                  <Button variant="outline">轮廓按钮</Button>
                  <Button variant="ghost">幽灵按钮</Button>
                  <Button variant="link">链接按钮</Button>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2 items-center">
                  <Button size="sm">小型</Button>
                  <Button size="default">默认</Button>
                  <Button size="lg">大型</Button>
                  <Button size="icon"><Settings className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>徽章组件</CardTitle>
                <CardDescription>用于状态和标签展示</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge>默认</Badge>
                <Badge variant="secondary">次要</Badge>
                <Badge variant="destructive">危险</Badge>
                <Badge variant="outline">轮廓</Badge>
                <Badge variant="success">成功</Badge>
                <Badge variant="warning">警告</Badge>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 表单选项卡 */}
          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>输入组件</CardTitle>
                <CardDescription>表单输入控件</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">用户名</Label>
                    <Input id="username" placeholder="请输入用户名" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input id="email" type="email" placeholder="请输入邮箱" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">个人简介</Label>
                  <Textarea id="bio" placeholder="介绍一下你自己..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">编程语言</Label>
                  <Select id="language">
                    <SelectOption value="">选择语言</SelectOption>
                    <SelectOption value="cpp">C++</SelectOption>
                    <SelectOption value="python">Python</SelectOption>
                    <SelectOption value="java">Java</SelectOption>
                    <SelectOption value="javascript">JavaScript</SelectOption>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember">记住我的选择</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 反馈选项卡 */}
          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>提示组件</CardTitle>
                <CardDescription>不同类型的提示信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>提示</AlertTitle>
                  <AlertDescription>
                    这是一条默认提示信息。
                  </AlertDescription>
                </Alert>
                <Alert variant="success">
                  <Check className="h-4 w-4" />
                  <AlertTitle>成功</AlertTitle>
                  <AlertDescription>
                    操作已成功完成！
                  </AlertDescription>
                </Alert>
                <Alert variant="warning">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>警告</AlertTitle>
                  <AlertDescription>
                    请注意这个重要信息。
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>错误</AlertTitle>
                  <AlertDescription>
                    发生了一些问题，请重试。
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>工具提示</CardTitle>
                <CardDescription>悬停显示更多信息</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">悬停查看提示</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>这是一个工具提示</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 数据选项卡 */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>表格组件</CardTitle>
                <CardDescription>展示数据列表</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>题目</TableHead>
                      <TableHead>难度</TableHead>
                      <TableHead>通过率</TableHead>
                      <TableHead className="text-right">状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">A+B Problem</TableCell>
                      <TableCell><Badge variant="success">简单</Badge></TableCell>
                      <TableCell>95%</TableCell>
                      <TableCell className="text-right"><Badge>已通过</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">最大子数组和</TableCell>
                      <TableCell><Badge variant="warning">中等</Badge></TableCell>
                      <TableCell>67%</TableCell>
                      <TableCell className="text-right"><Badge variant="secondary">未尝试</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">旅行商问题</TableCell>
                      <TableCell><Badge variant="destructive">困难</Badge></TableCell>
                      <TableCell>23%</TableCell>
                      <TableCell className="text-right"><Badge variant="destructive">失败</Badge></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>头像组件</CardTitle>
                <CardDescription>用户头像展示</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 弹出层选项卡 */}
          <TabsContent value="overlay" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>对话框组件</CardTitle>
                <CardDescription>模态对话框</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>打开对话框</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>确认提交</DialogTitle>
                      <DialogDescription>
                        你确定要提交这份代码吗？提交后将不能修改。
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        取消
                      </Button>
                      <Button onClick={() => setDialogOpen(false)}>确认</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>下拉菜单</CardTitle>
                <CardDescription>操作菜单</CardDescription>
              </CardHeader>
              <CardContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      设置
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>个人资料</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      <span>消息</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className="mr-2 h-4 w-4" />
                      <span>通知</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      退出登录
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OJ专用组件选项卡 */}
          <TabsContent value="oj" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>状态徽章</CardTitle>
                <CardDescription>用于显示评测结果状态</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={STATUS.STATUS_ACCEPTED} />
                  <StatusBadge status={STATUS.STATUS_WRONG_ANSWER} />
                  <StatusBadge status={STATUS.STATUS_TIME_LIMIT_EXCEEDED} />
                  <StatusBadge status={STATUS.STATUS_MEMORY_LIMIT_EXCEEDED} />
                  <StatusBadge status={STATUS.STATUS_RUNTIME_ERROR} />
                  <StatusBadge status={STATUS.STATUS_COMPILE_ERROR} />
                  <StatusBadge status={STATUS.STATUS_JUDGING} />
                  <StatusBadge status={STATUS.STATUS_WAITING} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={STATUS.STATUS_WRONG_ANSWER} score={60} />
                  <StatusBadge status={STATUS.STATUS_ACCEPTED} short={false} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>分数进度条</CardTitle>
                <CardDescription>用于显示得分情况</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <ScoreBar score={100} />
                  <ScoreBar score={85} />
                  <ScoreBar score={60} />
                  <ScoreBar score={40} />
                  <ScoreBar score={20} />
                  <ScoreBar score={0} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>用户卡片</CardTitle>
                <CardDescription>用户信息展示组件</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <UserCard
                    uid={1}
                    username="admin"
                    displayName="系统管理员"
                    rp={9999}
                    rank={1}
                    acceptCount={1024}
                    bio="HydroOJ 系统管理员"
                    isSuperUser
                    isOnline
                    onViewProfile={() => {}}
                    onSendMessage={() => {}}
                  />
                  <UserCard
                    uid={2}
                    username="test_user"
                    rp={1500}
                    rank={42}
                    acceptCount={128}
                    bio="我是一个普通用户"
                    isModerator
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>用户内联显示</CardTitle>
                <CardDescription>用于表格等场景的紧凑用户显示</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <UserInline uid={1} username="admin" isSuperUser />
                  <UserInline uid={2} username="moderator" isModerator />
                  <UserInline uid={3} username="normal_user" href="#" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>模拟提交记录</CardTitle>
                <CardDescription>结合表格和状态组件</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>状态</TableHead>
                      <TableHead>题目</TableHead>
                      <TableHead>用户</TableHead>
                      <TableHead>分数</TableHead>
                      <TableHead>时间</TableHead>
                      <TableHead>内存</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell><StatusBadge status={STATUS.STATUS_ACCEPTED} /></TableCell>
                      <TableCell className="font-medium">P1001 A+B Problem</TableCell>
                      <TableCell><UserInline uid={1} username="admin" isSuperUser /></TableCell>
                      <TableCell><ScoreBar score={100} className="w-20" /></TableCell>
                      <TableCell>15ms</TableCell>
                      <TableCell>1.2MB</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><StatusBadge status={STATUS.STATUS_WRONG_ANSWER} score={60} /></TableCell>
                      <TableCell className="font-medium">P1002 数列求和</TableCell>
                      <TableCell><UserInline uid={2} username="test_user" /></TableCell>
                      <TableCell><ScoreBar score={60} className="w-20" /></TableCell>
                      <TableCell>120ms</TableCell>
                      <TableCell>8.5MB</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><StatusBadge status={STATUS.STATUS_JUDGING} /></TableCell>
                      <TableCell className="font-medium">P1003 动态规划</TableCell>
                      <TableCell><UserInline uid={3} username="coder" /></TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}

const page = new AutoloadPage('shadcnUIDemo', () => {
  const container = document.getElementById('shadcn-ui-demo');
  if (container) {
    createRoot(container).render(
      <MantineProvider>
        <ShadcnUIDemo />
      </MantineProvider>,
    );
  }
});

export default page;
