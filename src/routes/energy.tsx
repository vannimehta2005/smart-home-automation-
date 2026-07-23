import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, Zap } from "lucide-react";
import { energyToday, energyWeek, energyByCategory, devices } from "@/lib/smart-home-data";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useState } from "react";

export const Route = createFileRoute("/energy")({
  head: () => ({ meta: [{ title: "Energy — Nestly" }, { name: "description", content: "Track consumption, savings and top power-consuming devices." }] }),
  component: EnergyPage,
});

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function EnergyPage() {
  const [range, setRange] = useState("week");
  const kwhToday = energyToday.reduce((s, e) => s + e.kwh, 0).toFixed(1);
  const kwhWeek = energyWeek.reduce((s, e) => s + e.kwh, 0);
  const peak = Math.max(...energyToday.map((e) => e.kwh));
  const avg = (kwhWeek / 7).toFixed(1);

  const topDevices = [...devices]
    .filter((d) => d.power > 20)
    .sort((a, b) => b.power - a.power)
    .slice(0, 6);

  const stats = [
    { label: "Today", value: `${kwhToday} kWh`, delta: "+4.2%", tone: "text-primary" },
    { label: "This week", value: `${kwhWeek} kWh`, delta: "-2.1%", tone: "text-success" },
    { label: "Peak usage", value: `${peak} kWh`, delta: "20:00", tone: "text-warning-foreground" },
    { label: "Daily avg", value: `${avg} kWh`, delta: "Last 7 days", tone: "text-muted-foreground" },
  ];

  return (
    <AppLayout
      title="Energy"
      subtitle="Understand and optimize your home's power consumption"
      actions={
        <Tabs value={range} onValueChange={setRange}>
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      }
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</div>
            <div className={`mt-1 text-xs ${s.tone}`}>{s.delta}</div>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Consumption trend</h3>
              <p className="text-xs text-muted-foreground">kWh over the past week</p>
            </div>
            <span className="flex items-center gap-1 text-xs text-success"><TrendingUp className="h-3.5 w-3.5" /> 2.1% lower</span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyWeek}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <Tooltip contentStyle={{ background: "var(--color-background)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="kwh" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--color-primary)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-semibold">By category</h3>
          <p className="text-xs text-muted-foreground">Share of this week's consumption</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={energyByCategory} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {energyByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--color-background)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-base font-semibold">Hourly usage today</h3>
          <p className="text-xs text-muted-foreground">kWh per hour</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyToday}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="h" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                <Tooltip contentStyle={{ background: "var(--color-background)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="kwh" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">AI suggestions</h3>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {[
              "Living Room AC consumed 20% more energy this week — consider raising target temp by 1°C.",
              "Geyser runs at peak-tariff hours. Shift to 5 AM to save ~₹340/month.",
              "Kitchen smart plug is drawing standby power — schedule off overnight.",
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-border bg-muted/40 p-3 text-muted-foreground">{s}</div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Top consumers</h3>
            <p className="text-xs text-muted-foreground">Devices ranked by consumption this week</p>
          </div>
        </div>
        <div className="mt-4 divide-y divide-border">
          {topDevices.map((d, i) => {
            const Icon = d.icon;
            const used = (d.power * (24 + i * 3)) / 1000;
            return (
              <div key={d.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-muted-foreground"><Icon className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{d.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{d.room}</div>
                </div>
                <div className="hidden text-sm text-muted-foreground sm:block">{d.power} W</div>
                <div className="text-sm font-semibold">{used.toFixed(1)} kWh</div>
                {d.power > 1000 && (
                  <Badge variant="outline" className="border-destructive/20 bg-destructive/5 text-destructive">
                    <Zap className="mr-1 h-3 w-3" /> High Power
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </AppLayout>
  );
}
