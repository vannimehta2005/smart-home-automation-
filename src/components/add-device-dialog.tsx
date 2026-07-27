import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSmartHome } from "@/lib/smart-home-store";
import { toast } from "sonner";
import type { DeviceCategory } from "@/lib/smart-home-data";

const CATEGORIES: DeviceCategory[] = ["Lighting", "Climate", "Security", "Appliance", "Entertainment", "Utility"];

export function AddDeviceDialog({ open, onOpenChange, defaultRoom }: { open: boolean; onOpenChange: (v: boolean) => void; defaultRoom?: string }) {
  const { rooms, addDevice } = useSmartHome();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<DeviceCategory>("Lighting");
  const [company, setCompany] = useState("");
  const [model, setModel] = useState("");
  const [room, setRoom] = useState(defaultRoom ?? rooms[0]?.name ?? "");
  const [power, setPower] = useState("10");
  const [highPower, setHighPower] = useState(false);
  const [statusOn, setStatusOn] = useState(true);

  const submit = () => {
    if (!name.trim() || !company.trim() || !model.trim() || !room) {
      toast.error("Please fill in all required fields");
      return;
    }
    const watts = Number(power) || 0;
    addDevice({
      name: name.trim(),
      category,
      company: company.trim(),
      model: model.trim(),
      room,
      power: watts,
      highPower,
      status: statusOn ? "on" : "off",
    });
    toast.success(`${name} added to ${room}`);
    setName(""); setCompany(""); setModel(""); setPower("10"); setHighPower(false); setStatusOn(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a new device</DialogTitle>
          <DialogDescription>Connect a smart device to your home.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Device name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Balcony Light" />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as DeviceCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
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
          <div className="space-y-1.5">
            <Label>Company</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Philips Hue" />
          </div>
          <div className="space-y-1.5">
            <Label>Model</Label>
            <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. A19" />
          </div>
          <div className="space-y-1.5">
            <Label>Rated power (W)</Label>
            <Input type="number" value={power} onChange={(e) => setPower(e.target.value)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <div className="text-sm font-medium">Initial status</div>
              <div className="text-xs text-muted-foreground">Turn ON after adding</div>
            </div>
            <Switch checked={statusOn} onCheckedChange={setStatusOn} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3 sm:col-span-2">
            <div>
              <div className="text-sm font-medium">High power device</div>
              <div className="text-xs text-muted-foreground">Alert on unusual usage</div>
            </div>
            <Switch checked={highPower} onCheckedChange={setHighPower} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Add Device</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
