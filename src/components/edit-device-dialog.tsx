import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSmartHome } from "@/lib/smart-home-store";
import { toast } from "sonner";
import type { Device } from "@/lib/smart-home-data";

export function EditDeviceDialog({
  device,
  open,
  onOpenChange,
}: {
  device: Device | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { rooms, updateDevice } = useSmartHome();
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [statusOn, setStatusOn] = useState(false);

  useEffect(() => {
    if (!device || !open) return;
    setName(device.name);
    setRoom(device.room);
    setStatusOn(device.status === "on");
  }, [device, open]);

  const submit = () => {
    if (!device) return;
    if (!name.trim() || !room) {
      toast.error("Please fill in all required fields");
      return;
    }
    updateDevice(device.id, { name: name.trim(), room, status: statusOn ? "on" : "off" });
    toast.success(`${name.trim()} updated`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit device</DialogTitle>
          <DialogDescription>Catalog specifications are read-only. Update your home-specific details.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Company</Label>
            <Input value={device?.company ?? ""} readOnly disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Device model</Label>
            <Input value={device?.model ?? ""} readOnly disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Input value={device?.category ?? ""} readOnly disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Rated power (W)</Label>
            <Input value={device ? String(device.power) : ""} readOnly disabled />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>High power rated</Label>
            <Input value={device?.highPower ? "Yes" : "No"} readOnly disabled />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label>Custom device name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Assign room</Label>
            <Select value={room} onValueChange={setRoom}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {rooms.map((r) => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <div className="text-sm font-medium">Device status</div>
              <div className="text-xs text-muted-foreground">Turn device ON or OFF</div>
            </div>
            <Switch checked={statusOn} onCheckedChange={setStatusOn} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
