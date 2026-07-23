import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Users, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_auth/onboarding")({
  head: () => ({ meta: [{ title: "Set up your home — Nestly" }, { name: "description", content: "Create or join a Nestly smart home." }] }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const [mode, setMode] = useState<"create" | "join">("create");
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Set up your home</h1>
      <p className="mt-1 text-sm text-muted-foreground">Create a new home or join an existing one.</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {[
          { id: "create" as const, icon: Home, title: "Create Home", desc: "Start fresh as admin" },
          { id: "join" as const, icon: Users, title: "Join Home", desc: "Request access with a code" },
        ].map((o) => (
          <button
            key={o.id}
            onClick={() => setMode(o.id)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              mode === o.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-background hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <o.icon className={`h-5 w-5 ${mode === o.id ? "text-primary" : "text-muted-foreground"}`} />
              {mode === o.id && <Check className="h-4 w-4 text-primary" />}
            </div>
            <div className="mt-3 text-sm font-semibold">{o.title}</div>
            <div className="text-xs text-muted-foreground">{o.desc}</div>
          </button>
        ))}
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (mode === "create") navigate({ to: "/dashboard" });
          else navigate({ to: "/waiting-approval" });
        }}
      >
        {mode === "create" ? (
          <>
            <div className="space-y-1.5"><Label>Home name</Label><Input placeholder="Sharma Residence" /></div>
            <div className="space-y-1.5"><Label>Address (optional)</Label><Input placeholder="221B Baker Street" /></div>
          </>
        ) : (
          <div className="space-y-1.5"><Label>Home invite code</Label><Input placeholder="e.g. NEST-8823-XY" /></div>
        )}
        <Button size="lg" className="w-full">{mode === "create" ? "Create Home" : "Request to join"}</Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-primary hover:underline">Back to login</Link>
      </p>
    </div>
  );
}
