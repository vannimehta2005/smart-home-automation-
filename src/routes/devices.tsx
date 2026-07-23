import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, StatusDot } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, Pencil, Trash2, Settings2 } from "lucide-react";
import { devices, rooms } from "@/lib/smart-home-data";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/devices")({
  head: () => ({ meta: [{ title: "Devices — Nestly" }, { name: "description", content: "All devices connected to your smart home." }] }),
  component: DevicesPage,
});

const categories = ["All", "Lighting", "Climate", "Security", "Appliance", "Entertainment", "Utility"];
const companies = ["All", ...Array.from(new Set(devices.map((d) => d.company)))];

function DevicesPage() {
  const [query, setQuery] = useState("");
  const [room, setRoom] = useState("All");
  const [cat, setCat] = useState("All");
  const [comp, setComp] = useState("All");
  const [sort, setSort] = useState("name");

  const filtered = useMemo(() => {
    let list = devices.filter((d) => {
      if (query && !d.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (room !== "All" && d.room !== room) return false;
      if (cat !== "All" && d.category !== cat) return false;
      if (comp !== "All" && d.company !== comp) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "power") return b.power - a.power;
      if (sort === "room") return a.room.localeCompare(b.room);
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [query, room, cat, comp, sort]);

  return (
    <AppLayout
      title="Devices"
      subtitle={`${devices.length} devices across ${rooms.length} rooms`}
      actions={<Button className="gap-2"><Plus className="h-4 w-4" /> Add Device</Button>}
    >
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search devices..." className="pl-9" />
          </div>
          <FilterSelect value={room} onChange={setRoom} label="Room" options={["All", ...rooms.map((r) => r.name)]} />
          <FilterSelect value={cat} onChange={setCat} label="Category" options={categories} />
          <FilterSelect value={comp} onChange={setComp} label="Company" options={companies} />
          <FilterSelect value={sort} onChange={setSort} label="Sort" options={["name", "power", "room"]} />
        </div>
      </Card>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((d) => (
          <DeviceCard key={d.id} device={d} />
        ))}
      </div>
      {filtered.length === 0 && (
        <Card className="mt-4 p-10 text-center text-sm text-muted-foreground">No devices match your filters.</Card>
      )}
    </AppLayout>
  );
}

function FilterSelect({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: string[] }) {
  return (
    <div className="min-w-[140px]">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>{label}: {o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function DeviceCard({ device }: { device: (typeof devices)[number] }) {
  const [on, setOn] = useState(device.status === "on");
  const Icon = device.icon;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${on ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-1">
          <Switch checked={on} onCheckedChange={setOn} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
              <DropdownMenuItem><Settings2 className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-4 text-base font-semibold">{device.name}</div>
      <div className="mt-1 text-xs text-muted-foreground">{device.company} · {device.model}</div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="rounded-full font-normal">{device.category}</Badge>
        <Badge variant="outline" className="rounded-full font-normal">{device.room}</Badge>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">{device.power} W</span>
        <StatusDot status={on ? "on" : "off"} />
      </div>
    </Card>
  );
}
