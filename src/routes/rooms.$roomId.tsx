import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppLayout, StatusDot } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useSmartHome } from "@/lib/smart-home-store";
import type { Device } from "@/lib/smart-home-data";

export const Route = createFileRoute("/rooms/$roomId")({
  head: ({ params }) => {
    return { meta: [{ title: `Room — Nestly` }, { name: "description", content: `Devices in room ${params.roomId}.` }] };
  },
  component: RoomDetail,
});

function RoomDetail() {
  const { roomId } = Route.useParams();
  const { rooms, devices, toggleDevice } = useSmartHome();
  const room = rooms.find((r) => r.id === roomId);
  if (!room) throw notFound();
  const roomDevices = devices.filter((d) => d.room === room.name);

  return (
    <AppLayout
      title={room.name}
      subtitle={`${roomDevices.length} devices in this room`}
      actions={
        <Link to="/rooms">
          <Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> All rooms</Button>
        </Link>
      }
    >
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/rooms" className="hover:text-foreground">Rooms</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{room.name}</span>
      </nav>

      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-2xl">{room.icon}</div>
        <div>
          <div className="text-base font-semibold">{room.name}</div>
          <div className="text-xs text-muted-foreground">{roomDevices.filter(d => d.status === "on").length} active · {roomDevices.length} total</div>
        </div>
      </div>

      {roomDevices.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">No devices in this room yet.</Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roomDevices.map((d) => (
            <RoomDeviceCard key={d.id} device={d} on={d.status === "on"} onToggle={(v) => toggleDevice(d.id, v)} />
          ))}
        </div>
      )}
    </AppLayout>
  );
}

function RoomDeviceCard({ device, on, onToggle }: { device: Device; on: boolean; onToggle: (v: boolean) => void }) {
  const Icon = device.icon;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${on ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <Switch checked={on} onCheckedChange={onToggle} />
      </div>
      <div className="mt-4 text-base font-semibold">{device.name}</div>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary" className="rounded-full font-normal">{device.category}</Badge>
        <span>· {device.company}</span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">{device.power} W</span>
        <StatusDot status={on ? "on" : "off"} />
      </div>
    </Card>
  );
}
