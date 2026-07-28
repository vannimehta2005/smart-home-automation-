import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { useSmartHome } from "@/lib/smart-home-store";
import type { Company, MasterDevice } from "@/lib/master-catalog";
import type { DeviceCategory } from "@/lib/smart-home-data";
import { toast } from "sonner";

export const Route = createFileRoute("/master-catalog")({
  head: () => ({
    meta: [
      { title: "Master Catalog — Nestly" },
      { name: "description", content: "Administrator catalog of supported companies and device models." },
      { property: "og:title", content: "Master Catalog — Nestly" },
      { property: "og:description", content: "Administrator catalog of supported companies and device models." },
    ],
  }),
  component: MasterCatalogPage,
});

const CATEGORIES: DeviceCategory[] = ["Lighting", "Climate", "Security", "Appliance", "Entertainment", "Utility"];

function MasterCatalogPage() {
  const {
    companies, masterDevices,
    addCompany, updateCompany, deleteCompany,
    addMasterDevice, updateMasterDevice, deleteMasterDevice,
  } = useSmartHome();

  const [companyOpen, setCompanyOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [companyName, setCompanyName] = useState("");

  const [deviceOpen, setDeviceOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<MasterDevice | null>(null);
  const [model, setModel] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [category, setCategory] = useState<DeviceCategory>("Lighting");
  const [power, setPower] = useState("10");
  const [highPower, setHighPower] = useState(false);

  const openCompany = (c: Company | null) => {
    setEditingCompany(c);
    setCompanyName(c?.company_name ?? "");
    setCompanyOpen(true);
  };

  const saveCompany = () => {
    if (!companyName.trim()) return toast.error("Company name is required");
    if (editingCompany) updateCompany(editingCompany.company_id, companyName.trim());
    else addCompany(companyName.trim());
    toast.success("Company saved");
    setCompanyOpen(false);
  };

  const openDevice = (d: MasterDevice | null) => {
    setEditingDevice(d);
    setModel(d?.model_name ?? "");
    setCompanyId(d?.company_id ?? companies[0]?.company_id ?? "");
    setCategory(d?.category ?? "Lighting");
    setPower(String(d?.rated_power_watts ?? 10));
    setHighPower(d?.is_high_power_rated ?? false);
    setDeviceOpen(true);
  };

  const saveDevice = () => {
    if (!model.trim() || !companyId) return toast.error("Model and company are required");
    const payload = {
      model_name: model.trim(),
      company_id: companyId,
      category,
      rated_power_watts: Number(power) || 0,
      is_high_power_rated: highPower,
    };
    if (editingDevice) updateMasterDevice(editingDevice.device_id, payload);
    else addMasterDevice(payload);
    toast.success("Device model saved");
    setDeviceOpen(false);
  };

  const companyName_ = (id: string) => companies.find((c) => c.company_id === id)?.company_name ?? "—";

  return (
    <AppLayout title="Master Catalog" subtitle="Administrator-managed companies and supported device models">
      <div className="mb-4 text-sm text-muted-foreground">
        <Link to="/settings" className="hover:text-foreground">Settings</Link> / Master Catalog
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold">Companies</h3>
              <p className="mt-1 text-sm text-muted-foreground">{companies.length} manufacturers</p>
            </div>
            <Button size="sm" className="gap-2" onClick={() => openCompany(null)}><Plus className="h-4 w-4" /> Add Company</Button>
          </div>
          <div className="mt-5 space-y-3">
            {companies.map((c) => (
              <div key={c.company_id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{c.company_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {masterDevices.filter((m) => m.company_id === c.company_id).length} models
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openCompany(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { deleteCompany(c.company_id); toast.success(`${c.company_name} removed`); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Separator className="mt-3" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold">Device models</h3>
              <p className="mt-1 text-sm text-muted-foreground">{masterDevices.length} supported models</p>
            </div>
            <Button size="sm" className="gap-2" onClick={() => openDevice(null)}><Plus className="h-4 w-4" /> Add Device Model</Button>
          </div>
          <div className="mt-5 space-y-3">
            {masterDevices.map((m) => (
              <div key={m.device_id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{m.model_name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {companyName_(m.company_id)} · {m.category} · {m.rated_power_watts} W
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {m.is_high_power_rated && <Badge variant="secondary">High power</Badge>}
                    <Button size="icon" variant="ghost" onClick={() => openDevice(m)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { deleteMasterDevice(m.device_id); toast.success(`${m.model_name} removed`); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Separator className="mt-3" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Dialog open={companyOpen} onOpenChange={setCompanyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCompany ? "Edit company" : "Add company"}</DialogTitle>
            <DialogDescription>Companies available to all homes.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>Company name</Label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Philips" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompanyOpen(false)}>Cancel</Button>
            <Button onClick={saveCompany}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deviceOpen} onOpenChange={setDeviceOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDevice ? "Edit device model" : "Add device model"}</DialogTitle>
            <DialogDescription>Specifications shared by every home using this model.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Model name</Label>
              <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Dual Inverter AC" />
            </div>
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Select value={companyId} onValueChange={setCompanyId}>
                <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                <SelectContent>
                  {companies.map((c) => <SelectItem key={c.company_id} value={c.company_id}>{c.company_name}</SelectItem>)}
                </SelectContent>
              </Select>
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
              <Label>Rated power (W)</Label>
              <Input type="number" value={power} onChange={(e) => setPower(e.target.value)} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <div className="text-sm font-medium">High power rated</div>
                <div className="text-xs text-muted-foreground">Alert on unusual usage</div>
              </div>
              <Switch checked={highPower} onCheckedChange={setHighPower} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeviceOpen(false)}>Cancel</Button>
            <Button onClick={saveDevice}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
