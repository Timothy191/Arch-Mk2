// ─── Layout Components ───
export { DepartmentLayout } from "./components/DepartmentLayout";

export { PageHeader } from "./components/PageHeader";

export { MacMenuBar } from "./components/MacMenuBar";

export { MacTitleBar } from "./components/MacTitleBar";

export { WorkflowBuilder } from "./components/WorkflowBuilder";
export type { WorkflowBuilderProps } from "./components/WorkflowBuilder";

// ─── Surface Components ───
export { GlassCard } from "./components/GlassCard";
export type { GlassCardProps } from "./components/GlassCard";

export { KPICard as KPI, KPIGrid } from "./components/KPI";

// ─── Form Components ───
export { Input } from "./components/Input";
export { SecondaryButton } from "./components/SecondaryButton";
export { ShiftToggle, getCurrentShift } from "./components/ShiftToggle";
export { FormInput, FormSelect, FormTextarea, SubmitButton } from "./components/FormFields";

// ─── shadcn/ui Primitives ───
export { Button, buttonVariants } from "./components/ui/button";
export type { ButtonProps } from "./components/ui/button";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";

export { Badge, badgeVariants } from "./components/ui/badge";
export type { BadgeProps } from "./components/ui/badge";

export { Input as ShadcnInput } from "./components/ui/input";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./components/ui/tabs";

export { Separator } from "./components/ui/separator";

export { ScrollArea, ScrollBar } from "./components/ui/scroll-area";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/ui/dropdown-menu";

export { Skeleton } from "./components/ui/skeleton";
export { GlassSkeleton } from "./components/ui/glass-skeleton";
export type { GlassSkeletonProps } from "./components/ui/glass-skeleton";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/ui/table";

export {
  Spinner,
  LoadingState,
  EmptyState,
  FieldError,
  FormError,
} from "./components/ui/states";
export type {
  SpinnerProps,
  LoadingStateProps,
  EmptyStateProps,
  FieldErrorProps,
  FormErrorProps,
} from "./components/ui/states";

export { ShineBorder } from "./components/ui/shine-border";

export {
  AnimatedNumber,
} from "./components/ui/animated-number";

export { NumberTicker } from "./components/ui/number-ticker";

export { Marquee } from "./components/ui/marquee";

// ─── Motion Components ───
export { AnimatedButton } from "./components/ui/animated-button";
export { AnimatedDialog } from "./components/ui/animated-dialog";
export {
  AnimatedList,
  AnimatedListItem,
  AnimatedFeed,
  AutoAnimateList,
} from "./components/ui/animated-list";
export type {
  AnimatedListProps,
  AnimatedFeedProps,
  AutoAnimateListProps,
} from "./components/ui/animated-list";

export { RevealLoader } from "./components/ui/reveal-loader";

export { AnimatedGridPattern } from "./components/ui/animated-grid-pattern";
export type { AnimatedGridPatternProps } from "./components/ui/animated-grid-pattern";

export { HeroVideoDialog } from "./components/ui/hero-video-dialog";

export { CyberButton } from "./components/ui/cyber-button";

export { DataGrid } from "./components/ui/data-grid";
export type { DataGridProps } from "./components/ui/data-grid";

export {
  Dock,
  DockIcon,
  dockVariants,
} from "./components/ui/dock";
export type { DockProps, DockIconProps } from "./components/ui/dock";

export { BentoGrid, BentoCard } from "./components/ui/bento-grid";

// ─── anime.js Motion Components ───
export { AnimeNumber } from "./components/motion/AnimeNumber";

export { AnimeStagger } from "./components/motion/AnimeStagger";

export { AnimeTimeline } from "./components/motion/AnimeTimeline";

// ─── Motion Primitives ───
export { BorderTrail } from "./components/motion-primitives/border-trail";
export type { BorderTrailProps } from "./components/motion-primitives/border-trail";

export { GlowEffect } from "./components/motion-primitives/glow-effect";
export type { GlowEffectProps } from "./components/motion-primitives/glow-effect";

export { Spotlight } from "./components/motion-primitives/spotlight";
export type { SpotlightProps } from "./components/motion-primitives/spotlight";

// ─── Flow Nodes & Edges ───
export { PluginNode } from "./components/nodes/PluginNode";
export type { PluginNodeData } from "./components/nodes/PluginNode";

export { TriggerNode } from "./components/nodes/TriggerNode";
export type { TriggerNodeData } from "./components/nodes/TriggerNode";

export { FlowEdge } from "./components/edges/FlowEdge";

// ─── Design System Provider ───
export { DesignSystemProvider } from "./components/DesignSystemProvider";
export type { DesignSystemProviderProps } from "./components/DesignSystemProvider";

// ─── Error Boundary ───
export { ErrorBoundary } from "./components/ErrorBoundary";

// ─── Utilities ───
export { cn } from "./lib/utils";
export { useFocusMode } from "./lib/useFocusMode";