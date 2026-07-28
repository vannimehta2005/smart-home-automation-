import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { LogOut, Trash2, Sun, Moon, Monitor, Database } from "lucide-react";
import { useState } from "react";
import { useSmartHome, type Theme } from "@/lib/smart-home-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Nestly" }, { name: "description", content: "Manage your profile, home and preferences." }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [awayMode, setAwayMode] = useState(false);
  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifCritical, setNotifCritical] = useState(true);

  return (
    <AppLayout title="Settings" subtitle="Manage your profile, home and preferences">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Section title="Profile" description="Update your personal information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" defaultValue="Aditya Sharma" />
              <Field label="Email" defaultValue="aditya@home.io" />
              <Field label="Phone" defaultValue="+91 98765 43210" />
              <Field label="Timezone" defaultValue="Asia/Kolkata" />
            </div>
            <div className="mt-4 flex justify-end"><Button>Save changes</Button></div>
          </Section>

          <Section title="Home information" description="Details about this residence">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Home name" defaultValue="Sharma Residence" />
              <Field label="Address" defaultValue="221B Baker Street" />
              <Field label="Home code" defaultValue="NEST-8823-XY" />
              <Field label="Members" defaultValue="4 people" />
            </div>
          </Section>

          <Section title="Notifications" description="Choose what to be notified about">
            <ToggleRow label="Push notifications" description="Alerts on your phone" value={notifPush} onChange={setNotifPush} />
            <Separator />
            <ToggleRow label="Email notifications" description="Weekly summaries and important events" value={notifEmail} onChange={setNotifEmail} />
            <Separator />
            <ToggleRow label="Critical alerts only" description="Only fire, gas, security" value={notifCritical} onChange={setNotifCritical} />
          </Section>

          <Section title="Change password" description="Use at least 8 characters">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Current password" type="password" defaultValue="" />
              <Field label="New password" type="password" defaultValue="" />
            </div>
            <div className="mt-4 flex justify-end"><Button>Update password</Button></div>
          </Section>
        </div>

        <div className="space-y-4">
          <Section title="Appearance" description="Choose how Nestly looks to you">
            <ThemePicker />
          </Section>

          <Section title="Master Catalog" description="Administrator-only companies and supported device models">
            <Link to="/master-catalog" className="block">
              <Button variant="outline" className="w-full gap-2"><Database className="h-4 w-4" /> Open Master Catalog</Button>
            </Link>
          </Section>


          <Section title="Away mode" description="Simulate presence, tighten security">
            <ToggleRow label="Enable away mode" description="Turns off non-essential devices" value={awayMode} onChange={setAwayMode} />
          </Section>

          <Card className="p-6">
            <h3 className="text-base font-semibold">Account</h3>
            <p className="mt-1 text-sm text-muted-foreground">Sign out or leave this home.</p>
            <div className="mt-4 space-y-2">
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full gap-2"><LogOut className="h-4 w-4" /> Sign out</Button>
              </Link>
            </div>
          </Card>

          <Card className="border-destructive/30 bg-destructive/5 p-6">
            <h3 className="text-base font-semibold text-destructive">Danger zone</h3>
            <p className="mt-1 text-sm text-muted-foreground">Deleting this home is permanent and cannot be undone.</p>
            <Button variant="destructive" className="mt-4 w-full gap-2"><Trash2 className="h-4 w-4" /> Delete home</Button>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </Card>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue?: string; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} defaultValue={defaultValue} />
    </div>
  );
}

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

function ThemePicker() {
  const { theme, setTheme } = useSmartHome();
  const options: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((o) => {
        const Icon = o.icon;
        const active = theme === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => setTheme(o.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors",
              active ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted",
            )}
          >
            <Icon className="h-5 w-5" />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
