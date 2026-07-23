import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, StatusDot, SeverityBadge } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  Zap,
  Clock,
  AlertTriangle,
  Wifi,
  WifiOff,
  ArrowRight,
} from "lucide-react";
import { devices, alerts, routines, energyToday } from "@/lib/smart-home-data";
import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Nestly" }, { name: "description", content: "Overview of your smart home: devices, energy, routines and alerts." }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  const favorites = devices.filter((d) => d.favorite);
  const online = devices.filter((d) => d.status === "on").length;
  const offline = devices.length - online;
  const activeRoutines = routines.filter((r) => r.enabled).length;
  const kwhToday = energyToday.reduce((s, e) => s + e.kwh, 0).toFixed(1);

  const stats = [
    { label: "Total Devices", value: devices.length, icon: Cpu, tone: "text-primary bg-primary/10" },
    { label: "Active Devices", value: online, icon: Wifi, tone: "text-success bg-success/10" },
    { label: "Active Routines", value: activeRoutines, icon: Clock, tone: "text-primary bg-primary/10" },
    { label: "Energy Today", value: `${kwhToday} kWh`, icon: Zap, tone: "text-warning-foreground bg-warning/15" },
    { label: "Total Alerts", value: alerts.length, icon: AlertTriangle, tone: "text-destructive bg-destructive/10" },
  ];

  return (
    <AppLayout>
      {/* Welcome + Home status */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="col-span-1 border-none bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/70">{dateStr}</div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Good evening, Aditya</h2>
              <p className="mt-1 text-sm text-primary-foreground/80">Everything looks calm at Sharma Residence.</p>
            </div>
            <div className="rounded-2xl bg-primary-foreground/10 px-4 py-3 text-right">
              <div className="text-xs text-primary-foreground/70">Local time</div>
              <div className="text-2xl font-semibold">{time}</div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <MiniStat label="Home mode" value="Evening" />
            <MiniStat label="Away mode" value="Off" />
            <MiniStat label="Devices online" value={`${online} / ${devices.length}`} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Home status</div>
              <div className="mt-1 text-lg font-semibold">All Systems Normal</div>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-success/15 text-success">
              <Wifi className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-5 space-y-3">
            <StatusRow label="Devices online" value={online} icon={Wifi} tone="text-success" />
            <StatusRow label="Devices offline" value={offline} icon={WifiOff} tone="text-muted-foreground" />
            <StatusRow label="Active routines" value={activeRoutines} icon={Clock} tone="text-primary" />
          </div>
        </Card>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className={`inline-grid h-9 w-9 place-items-center rounded-lg ${s.tone}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="mt-4 text-2xl font-semibold tracking-tight">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Quick controls + Energy */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Quick controls</h3>
              <p className="text-xs text-muted-foreground">Your favorite devices</p>
            </div>
            <Link to="/devices"><Button size="sm" variant="ghost" className="gap-1">View all <ArrowRight className="h-3.5 w-3.5" /></Button></Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {favorites.map((d) => (
              <QuickDeviceCard key={d.id} device={d} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Energy today</h3>
              <p className="text-xs text-muted-foreground">{kwhToday} kWh consumed</p>
            </div>
            <Link to="/energy"><Button size="sm" variant="ghost" className="gap-1">Details <ArrowRight className="h-3.5 w-3.5" /></Button></Link>
          </div>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyToday}>
                <defs>
                  <linearGradient id="e1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="h" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "var(--color-background)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="kwh" stroke="var(--color-primary)" strokeWidth={2} fill="url(#e1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Alerts + Routines */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Recent alerts</h3>
            <Link to="/security"><Button size="sm" variant="ghost" className="gap-1">All alerts <ArrowRight className="h-3.5 w-3.5" /></Button></Link>
          </div>
          <div className="mt-4 divide-y divide-border">
            {alerts.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={a.severity} />
                    <span className="text-xs text-muted-foreground">{a.time}</span>
                  </div>
                  <div className="mt-1 truncate text-sm font-medium">{a.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{a.device}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Active routines</h3>
            <Link to="/routines"><Button size="sm" variant="ghost" className="gap-1">Manage <ArrowRight className="h-3.5 w-3.5" /></Button></Link>
          </div>
          <div className="mt-4 divide-y divide-border">
            {routines.filter(r => r.enabled).slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{r.name}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {r.time}
                    <span>·</span>
                    <span>{r.days.join(", ")}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success">Active</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-primary-foreground/10 p-3">
      <div className="text-[11px] uppercase tracking-wider text-primary-foreground/70">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function StatusRow({ label, value, icon: Icon, tone }: any) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-muted-foreground"><Icon className={`h-4 w-4 ${tone}`} /> {label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function QuickDeviceCard({ device }: { device: typeof devices[number] }) {
  const [on, setOn] = useState(device.status === "on");
  const Icon = device.icon;
  return (
    <div className={`rounded-xl border p-4 transition-colors ${on ? "border-primary/30 bg-primary/5" : "border-border bg-background"}`}>
      <div className="flex items-start justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${on ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <Switch checked={on} onCheckedChange={setOn} />
      </div>
      <div className="mt-3 truncate text-sm font-semibold">{device.name}</div>
      <div className="mt-0.5 flex items-center justify-between">
        <span className="truncate text-xs text-muted-foreground">{device.room}</span>
        <StatusDot status={on ? "on" : "off"} />
      </div>
    </div>
  );
}
