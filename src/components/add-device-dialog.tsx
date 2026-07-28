import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSmartHome } from "@/lib/smart-home-store";
import { toast } from "sonner";

export function AddDeviceDialog({ open, onOpenChange, defaultRoom }: { open: boolean; onOpenChange: (v: boolean) => void; defaultRoom?: string }) {
  const { rooms, addDevice, companies, masterDevices } = useSmartHome();
  const [companyId, setCompanyId] = useState("");
  const [modelId, setModelId] = useState("");
  const [companyQuery, setCompanyQuery] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState(defaultRoom ?? rooms[0]?.name ?? "");
  const [statusOn, setStatusOn] = useState(true);

  const visibleCompanies = useMemo(
    () => companies.filter((c) => c.company_name.toLowerCase().includes(companyQuery.trim().toLowerCase())),
    [companies, companyQuery],
  );
  const models = useMemo(
    () => masterDevices.filter((m) => m.company_id === companyId),
    [masterDevices, companyId],
  );
  const selected = masterDevices.find((m) => m.device_id === modelId) ?? null;

  const reset = () => {
    setCompanyId(""); setModelId(""); setCompanyQuery(""); setName(""); setStatusOn(true);
  };

  const submit = () => {
    if (!companyId || !selected || !name.trim() || !room) {
      toast.error("Please fill in all required fields");
      return;
    }
    addDevice({ name: name.trim(), masterDeviceId: selected.device_id, room, status: statusOn ? "on" : "off" });
    toast.success(`${name.trim()} added to ${room}`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a new device</DialogTitle>
          <DialogDescription>Choose a supported device from the catalog and add it to your home.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Company</Label>
            <Select
              value={companyId}
              onValueChange={(v) => { setCompanyId(v); setModelId(""); }}
            >
              <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    value={companyQuery}
                    onChange={(e) => setCompanyQuery(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    placeholder="Search companies..."
                    className="h-8"
                  />
                </div>
                {visibleCompanies.map((c) => (
                  <SelectItem key={c.company_id} value={c.company_id}>{c.company_name}</SelectItem>
                ))}
                {visibleCompanies.length === 0 && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">No companies found</div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label>Device model</Label>
            <Select value={modelId} onValueChange={setModelId} disabled={!companyId}>
              <SelectTrigger><SelectValue placeholder={companyId ? "Select device" : "Select a company first"} /></SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.device_id} value={m.device_id}>{m.model_name}</SelectItem>
                ))}
                {models.length === 0 && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">No devices for this company</div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Input value={selected?.category ?? ""} readOnly disabled placeholder="—" />
          </div>
          <div className="space-y-1.5">
            <Label>Rated power (W)</Label>
            <Input value={selected ? String(selected.rated_power_watts) : ""} readOnly disabled placeholder="—" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>High power rated</Label>
            <Input value={selected ? (selected.is_high_power_rated ? "Yes" : "No") : ""} readOnly disabled placeholder="—" />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label>Custom device name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Living Room AC" />
          </div>
          <div className="space-y-1.5">
            <Label>Assign room</Label>
            <Select value={room} onValueChange={setRoom}>
              <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
              <SelectContent>
                {rooms.map((r) => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <div className="text-sm font-medium">Initial status</div>
              <div className="text-xs text-muted-foreground">Turn ON after adding</div>
            </div>
            <Switch checked={statusOn} onCheckedChange={setStatusOn} />
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
