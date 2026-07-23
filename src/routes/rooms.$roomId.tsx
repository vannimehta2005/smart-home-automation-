import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppLayout, StatusDot } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { rooms, devices } from "@/lib/smart-home-data";
import { useState } from "react";

export const Route = createFileRoute("/rooms/$roomId")({
  head: ({ params }) => {
    const room = rooms.find((r) => r.id === params.roomId);
    const title = room ? `${room.name} — Nestly` : "Room — Nestly";
    return { meta: [{ title }, { name: "description", content: `Devices in ${room?.name ?? "your home"}.` }] };
  },
  loader: ({ params }) => {
    const room = rooms.find((r) => r.id === params.roomId);
    if (!room) throw notFound();
    return { room };
  },
  component: RoomDetail,
});

function RoomDetail() {
  const { room } = Route.useLoaderData();
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roomDevices.map((d) => (
          <RoomDeviceCard key={d.id} device={d} />
        ))}
      </div>
    </AppLayout>
  );
}

function RoomDeviceCard({ device }: { device: (typeof devices)[number] }) {
  const [on, setOn] = useState(device.status === "on");
  const Icon = device.icon;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${on ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <Switch checked={on} onCheckedChange={setOn} />
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
