import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { rooms, devices } from "@/lib/smart-home-data";

export const Route = createFileRoute("/rooms")({
  head: () => ({ meta: [{ title: "Rooms — Nestly" }, { name: "description", content: "Browse and control devices grouped by room." }] }),
  component: RoomsPage,
});

function RoomsPage() {
  return (
    <AppLayout
      title="Rooms"
      subtitle="Organize and control devices grouped by room"
      actions={<Button className="gap-2"><Plus className="h-4 w-4" /> Add Room</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => {
          const roomDevices = devices.filter((d) => d.room === room.name);
          const activeCount = roomDevices.filter((d) => d.status === "on").length;
          return (
            <Link key={room.id} to="/rooms/$roomId" params={{ roomId: room.id }}>
              <Card className="group cursor-pointer p-6 transition-all hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-start justify-between">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-2xl">
                    {room.icon}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mt-5 text-lg font-semibold">{room.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">{roomDevices.length} devices</div>
                <div className="mt-4 flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 font-medium text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" /> {activeCount} active
                  </span>
                  <span className="text-muted-foreground">{roomDevices.length - activeCount} off</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </AppLayout>
  );
}
