import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, SeverityBadge } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { alerts, type Alert } from "@/lib/smart-home-data";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/security")({
  head: () => ({ meta: [{ title: "Security — Nestly" }, { name: "description", content: "Live alerts and history for your smart home." }] }),
  component: SecurityPage,
});

function SecurityPage() {
  const [query, setQuery] = useState("");
  const [sev, setSev] = useState("all");
  const [selected, setSelected] = useState<Alert | null>(null);

  const live = alerts.filter((a) => a.severity === "critical");
  const history = useMemo(() => alerts.filter((a) => {
    if (query && !a.title.toLowerCase().includes(query.toLowerCase()) && !a.device.toLowerCase().includes(query.toLowerCase())) return false;
    if (sev !== "all" && a.severity !== sev) return false;
    return true;
  }), [query, sev]);

  return (
    <AppLayout title="Security" subtitle="Live alerts, sensors and event history">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-success/15 text-success"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Home status</div>
              <div className="text-lg font-semibold">Armed — Stay</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Critical alerts</div>
          <div className="mt-2 text-2xl font-semibold text-destructive">{live.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Alerts (30 days)</div>
          <div className="mt-2 text-2xl font-semibold">{alerts.length}</div>
        </Card>
      </div>

      <Card className="mt-4 p-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-destructive" />
          <h3 className="text-base font-semibold">Live alerts</h3>
        </div>
        <div className="mt-4 space-y-3">
          {live.length === 0 && (
            <div className="rounded-xl border border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">No critical alerts. All clear.</div>
          )}
          {live.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelected(a)}
              className="w-full rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-left transition-colors hover:bg-destructive/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={a.severity} />
                  <span className="text-sm font-semibold">{a.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>
              <div className="mt-2 text-xs text-muted-foreground">Device: {a.device}</div>
            </button>
          ))}
        </div>
      </Card>

      <Card className="mt-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold">Alert history</h3>
          <div className="flex flex-wrap gap-2">
            <div className="relative w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search alerts..." className="pl-9" />
            </div>
            <Select value={sev} onValueChange={setSev}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 divide-y divide-border">
          {history.map((a) => (
            <button key={a.id} onClick={() => setSelected(a)} className="flex w-full items-start justify-between gap-3 py-3 text-left hover:bg-muted/40">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={a.severity} />
                  <span className="truncate text-sm font-semibold">{a.title}</span>
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">{a.device} · {a.description}</div>
              </div>
              <span className="whitespace-nowrap text-xs text-muted-foreground">{a.time}</span>
            </button>
          ))}
        </div>
      </Card>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <SeverityBadge severity={selected.severity} />
                  {selected.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Device</div>
                  <div className="mt-1 font-medium">{selected.device}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">When</div>
                  <div className="mt-1 font-medium">{selected.time}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Description</div>
                  <div className="mt-1 text-muted-foreground">{selected.description}</div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1">Acknowledge</Button>
                  <Button variant="outline" className="flex-1">Dismiss</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
