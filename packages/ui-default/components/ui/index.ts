export { Alert, AlertDescription, AlertTitle } from './alert';
export { Avatar, AvatarFallback, AvatarImage } from './avatar';
export { Badge, badgeVariants } from './badge';
// shadcn/ui components
export { Button, buttonVariants } from './button';
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
export { Checkbox } from './checkbox';
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './dialog';
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';
export { Input } from './input';
export { Label } from './label';
export { Select, SelectOption } from './select';
export { Separator } from './separator';
export { ScoreBar, STATUS, StatusBadge } from './status-badge';
export type { StatusType } from './status-badge';
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
export { Textarea } from './textarea';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
export { UserCard, UserInline } from './user-card';
export type { UserCardProps, UserInlineProps } from './user-card';

// Layout components
export { AppLayout, SimpleLayout, useLayout } from './app-layout';

// Navigation config (共享导航配置)
export {
  defaultFooterCategories,
  defaultNavItems,
  getLayoutDomain,
  getLayoutUser,
  getLayoutVersion,
  useLayoutContext,
} from '../layout/nav-config';

// Problem components (题目相关组件)
export { CategorySelector, CategorySidebar } from '../problem/category-selector';
export type { CategoryConfig, CategorySelectorProps, CategorySidebarProps } from '../problem/category-selector';
export type {
  AppLayoutProps,
  BreadcrumbItem,
  FooterCategory,
  NavItem,
} from './app-layout';
export { Footer } from './footer';
export type { FooterLink, FooterProps } from './footer';
export { Header } from './header';
export type { HeaderProps } from './header';
export { Sidebar, SidebarProvider, useSidebar } from './sidebar';
export type { SidebarProps } from './sidebar';
