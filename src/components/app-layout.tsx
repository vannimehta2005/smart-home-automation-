import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  DoorOpen,
  Cpu,
  Clock,
  Zap,
  ShieldCheck,
  Users,
  Settings as SettingsIcon,
  Search,
  Bell,
  ChevronDown,
  Home as HomeIcon,
  Menu,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/rooms", label: "Rooms", icon: DoorOpen },
  { to: "/devices", label: "Devices", icon: Cpu },
  { to: "/routines", label: "Routines", icon: Clock },
  { to: "/energy", label: "Energy", icon: Zap },
  { to: "/security", label: "Security", icon: ShieldCheck },
  { to: "/family", label: "Family", icon: Users },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

function SidebarInner({ onNav }: { onNav?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <HomeIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-sidebar-foreground">Nestly</div>
          <div className="truncate text-[11px] text-muted-foreground">Smart Home</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNav}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-primary")} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-xl bg-accent/60 p-3">
          <div className="text-xs font-semibold text-sidebar-foreground">Home Mode</div>
          <div className="mt-1 text-[11px] text-muted-foreground">All systems normal</div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-[11px] font-medium text-success">17 devices online</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppLayout({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
        <div className="fixed inset-y-0 left-0 w-64 border-r border-border">
          <SidebarInner />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur lg:px-8">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SidebarInner onNav={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Home selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden h-10 gap-2 rounded-lg px-3 md:flex">
                <HomeIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Sharma Residence</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Your homes</DropdownMenuLabel>
              <DropdownMenuItem>Sharma Residence</DropdownMenuItem>
              <DropdownMenuItem>Beach House</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>+ Add new home</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative ml-auto hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search devices, routines, rooms..."
              className="h-10 rounded-lg border-border bg-muted/60 pl-9 focus-visible:bg-background"
            />
          </div>

          <div className="ml-auto flex items-center gap-1 md:ml-2">
            <Button variant="ghost" size="icon" className="relative rounded-lg">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="rounded-lg">
                <SettingsIcon className="h-5 w-5" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 flex items-center gap-2 rounded-lg p-1 hover:bg-muted">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                      AS
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="text-sm font-semibold">Aditya Sharma</div>
                  <div className="text-xs font-normal text-muted-foreground">aditya@home.io</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/login">Sign out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page header */}
        {(title || actions) && (
          <div className="flex flex-col gap-3 border-b border-border bg-background px-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <div className="min-w-0">
              {title && (
                <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
        )}

        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function StatusDot({ status }: { status: "on" | "off" | "online" | "offline" }) {
  const on = status === "on" || status === "online";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className={cn("h-1.5 w-1.5 rounded-full", on ? "bg-success" : "bg-muted-foreground/50")} />
      <span className={cn(on ? "text-success" : "text-muted-foreground")}>
        {on ? "Active" : "Off"}
      </span>
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: "critical" | "warning" | "info" }) {
  const styles = {
    critical: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-warning/15 text-warning-foreground border-warning/30",
    info: "bg-primary/10 text-primary border-primary/20",
  };
  return (
    <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide", styles[severity])}>
      {severity}
    </Badge>
  );
}
