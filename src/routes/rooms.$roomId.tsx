import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AppLayout, StatusDot } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft, ChevronRight, Plus, Pencil, Trash2, Info, Zap, Power, PowerOff,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSmartHome } from "@/lib/smart-home-store";
import { AddDeviceDialog } from "@/components/add-device-dialog";
import type { Device } from "@/lib/smart-home-data";

export const Route = createFileRoute("/rooms/$roomId")({
  head: ({ params }) => ({
    meta: [
      { title: `Room — Nestly` },
      { name: "description", content: `Devices and controls for room ${params.roomId}.` },
    ],
  }),
  component: RoomDetail,
});

const ICON_OPTIONS = ["🛋️", "🍳", "🛏️", "🛁", "🚗", "💻", "🌿", "🎮", "🧺", "🪴", "🎨", "📚"];

function RoomDetail() {
  const { roomId } = Route.useParams();
  const navigate = useNavigate();
  const { rooms, devices, toggleDevice, updateRoom, deleteRoom } = useSmartHome();
  const room = rooms.find((r) => r.id === roomId);
  if (!room) throw notFound();

  const roomDevices = devices.filter((d) => d.room === room.name);
  const activeCount = roomDevices.filter((d) => d.status === "on").length;
  const offlineCount = roomDevices.length - activeCount;
  const totalPower = roomDevices.reduce((sum, d) => sum + d.power, 0);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailDevice, setDetailDevice] = useState<Device | null>(null);
  const [editName, setEditName] = useState(room.name);
  const [editIcon, setEditIcon] = useState(room.icon);
  const [editDesc, setEditDesc] = useState(room.description ?? "");

  const openEdit = () => {
    setEditName(room.name);
    setEditIcon(room.icon);
    setEditDesc(room.description ?? "");
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!editName.trim()) {
      toast.error("Room name is required");
      return;
    }
    updateRoom(room.id, { name: editName.trim(), icon: editIcon, description: editDesc.trim() });
    toast.success("Room updated");
    setEditOpen(false);
  };

  const confirmDelete = () => {
    deleteRoom(room.id);
    toast.success(`${room.name} deleted`);
    setDeleteOpen(false);
    navigate({ to: "/rooms" });
  };

  return (
    <AppLayout
      title={room.name}
      subtitle={`${roomDevices.length} devices · ${activeCount} active`}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/rooms">
            <Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> All rooms</Button>
          </Link>
          <Button variant="outline" className="gap-2" onClick={openEdit}>
            <Pencil className="h-4 w-4" /> Edit Room
          </Button>
          <Button variant="outline" className="gap-2 text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
          <Button className="gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add Device
          </Button>
        </div>
      }
    >
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/rooms" className="hover:text-foreground">Rooms</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{room.name}</span>
      </nav>

      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-2xl">{room.icon}</div>
        <div>
          <div className="text-base font-semibold">{room.name}</div>
          <div className="text-xs text-muted-foreground">
            {roomDevices.length} devices · {activeCount} active · {offlineCount} offline
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total Devices" value={String(roomDevices.length)} />
        <SummaryCard label="Active Devices" value={String(activeCount)} accent="success" />
        <SummaryCard label="Offline Devices" value={String(offlineCount)} accent="muted" />
        <SummaryCard label="Total Power Rating" value={`${totalPower.toLocaleString()} W`} accent="primary" icon={<Zap className="h-4 w-4" />} />
      </div>

      {roomDevices.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          No devices in this room yet.
          <div className="mt-4">
            <Button className="gap-2" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" /> Add your first device
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roomDevices.map((d) => (
            <RoomDeviceCard
              key={d.id}
              device={d}
              on={d.status === "on"}
              onToggle={(v) => toggleDevice(d.id, v)}
              onDetails={() => setDetailDevice(d)}
              onEdit={() => toast("Device editing coming soon")}
            />
          ))}
        </div>
      )}

      <AddDeviceDialog open={addOpen} onOpenChange={setAddOpen} defaultRoom={room.name} />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit room</DialogTitle>
            <DialogDescription>Update the name, icon or description.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Room name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setEditIcon(ic)}
                    className={`grid h-10 w-10 place-items-center rounded-xl border text-xl transition ${editIcon === ic ? "border-primary bg-primary/10" : "border-border bg-muted hover:bg-accent"}`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Optional" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {room.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the room and all {roomDevices.length} device{roomDevices.length === 1 ? "" : "s"} in it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!detailDevice} onOpenChange={(v) => !v && setDetailDevice(null)}>
        <DialogContent className="sm:max-w-md">
          {detailDevice && (
            <>
              <DialogHeader>
                <DialogTitle>{detailDevice.name}</DialogTitle>
                <DialogDescription>{detailDevice.company} · {detailDevice.model}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <DetailRow label="Category" value={detailDevice.category} />
                <DetailRow label="Room" value={detailDevice.room} />
                <DetailRow label="Company" value={detailDevice.company} />
                <DetailRow label="Model" value={detailDevice.model} />
                <DetailRow label="Rated Power" value={`${detailDevice.power} W`} />
                <DetailRow label="Status" value={detailDevice.status === "on" ? "ON" : "OFF"} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailDevice(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function SummaryCard({ label, value, accent, icon }: { label: string; value: string; accent?: "success" | "muted" | "primary"; icon?: React.ReactNode }) {
  const tone =
    accent === "success" ? "text-success" :
    accent === "primary" ? "text-primary" :
    accent === "muted" ? "text-muted-foreground" : "text-foreground";
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        {icon}
      </div>
      <div className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</div>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function RoomDeviceCard({
  device, on, onToggle, onDetails, onEdit,
}: {
  device: Device;
  on: boolean;
  onToggle: (v: boolean) => void;
  onDetails: () => void;
  onEdit: () => void;
}) {
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
      <div className="mt-1 text-xs text-muted-foreground">{device.model}</div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Zap className="h-3.5 w-3.5" /> {device.power} W
        </span>
        <div className="flex items-center gap-1.5">
          {on ? <Power className="h-3.5 w-3.5 text-success" /> : <PowerOff className="h-3.5 w-3.5 text-muted-foreground" />}
          <StatusDot status={on ? "on" : "off"} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" /> Edit
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={onDetails}>
          <Info className="h-3.5 w-3.5" /> Details
        </Button>
      </div>
    </Card>
  );
}
