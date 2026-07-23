import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Clock, Pencil, Trash2, Repeat } from "lucide-react";
import { routines, devices, getDevice, type Routine } from "@/lib/smart-home-data";
import { useState } from "react";

export const Route = createFileRoute("/routines")({
  head: () => ({ meta: [{ title: "Routines — Nestly" }, { name: "description", content: "Automate your home with schedules and routines." }] }),
  component: RoutinesPage,
});

const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function RoutinesPage() {
  const [list, setList] = useState(routines);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Routine | null>(null);

  const openCreate = () => { setEditing(null); setOpen(true); };
  const openEdit = (r: Routine) => { setEditing(r); setOpen(true); };
  const toggle = (id: string) =>
    setList((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  const remove = (id: string) => setList((prev) => prev.filter((r) => r.id !== id));

  return (
    <AppLayout
      title="Routines"
      subtitle="Automate your home with schedules"
      actions={<Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Create Routine</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => {
          const device = getDevice(r.deviceId);
          const Icon = device?.icon;
          return (
            <Card key={r.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`grid h-11 w-11 place-items-center rounded-xl ${r.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {Icon && <Icon className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="text-base font-semibold">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{device?.name}</div>
                  </div>
                </div>
                <Switch checked={r.enabled} onCheckedChange={() => toggle(r.id)} />
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" /> <span className="font-medium text-foreground">{r.time}</span> · turn {r.action}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Repeat className="h-4 w-4" /> {r.days.join(", ")}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <Badge variant="secondary" className={r.enabled ? "bg-success/10 text-success" : ""}>
                  {r.enabled ? "Active" : "Paused"}
                </Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(r)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(r.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <RoutineDialog open={open} onOpenChange={setOpen} routine={editing} onSave={(r) => {
        if (editing) {
          setList((prev) => prev.map((x) => (x.id === r.id ? r : x)));
        } else {
          setList((prev) => [...prev, { ...r, id: `r${Date.now()}` }]);
        }
        setOpen(false);
      }} />
    </AppLayout>
  );
}

function RoutineDialog({
  open, onOpenChange, routine, onSave,
}: {
  open: boolean; onOpenChange: (v: boolean) => void; routine: Routine | null; onSave: (r: Routine) => void;
}) {
  const [name, setName] = useState(routine?.name ?? "");
  const [deviceId, setDeviceId] = useState(routine?.deviceId ?? devices[0].id);
  const [action, setAction] = useState<"on" | "off">(routine?.action ?? "on");
  const [time, setTime] = useState(routine?.time ?? "07:00");
  const [days, setDays] = useState<string[]>(routine?.days ?? ["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [duration, setDuration] = useState(routine?.duration ?? "30 min");

  // reset when opening
  useState(() => 0);

  return (
    <Dialog open={open} onOpenChange={(v) => {
      onOpenChange(v);
      if (v) {
        setName(routine?.name ?? "");
        setDeviceId(routine?.deviceId ?? devices[0].id);
        setAction(routine?.action ?? "on");
        setTime(routine?.time ?? "07:00");
        setDays(routine?.days ?? ["Mon", "Tue", "Wed", "Thu", "Fri"]);
        setDuration(routine?.duration ?? "30 min");
      }
    }}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{routine ? "Edit routine" : "Create routine"}</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-1.5"><Label>Routine name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Morning wake up" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Device</Label>
              <Select value={deviceId} onValueChange={setDeviceId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {devices.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Action</Label>
              <Select value={action} onValueChange={(v) => setAction(v as "on" | "off")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="on">Turn ON</SelectItem>
                  <SelectItem value="off">Turn OFF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Trigger time</Label><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Duration</Label><Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30 min" /></div>
          </div>
          <div className="space-y-2">
            <Label>Repeat days</Label>
            <div className="flex flex-wrap gap-1.5">
              {dayOptions.map((d) => {
                const active = days.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(active ? days.filter((x) => x !== d) : [...days, d])}
                    className={`h-9 w-11 rounded-lg border text-xs font-semibold transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:bg-muted"}`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onSave({
            id: routine?.id ?? "",
            name: name || "Untitled routine",
            deviceId, action, time, days, duration,
            enabled: routine?.enabled ?? true,
          })}>Save routine</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
