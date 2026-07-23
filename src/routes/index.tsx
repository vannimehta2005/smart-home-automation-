import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Home,
  Zap,
  ShieldCheck,
  Clock,
  Users,
  ArrowRight,
  Cpu,
  Sparkles,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nestly — The Smart Home, Perfected" },
      { name: "description", content: "Nestly is a modern smart home platform to control devices, automate routines, monitor energy and stay secure." },
      { property: "og:title", content: "Nestly — The Smart Home, Perfected" },
      { property: "og:description", content: "Control every device, every room, and every routine — all in one beautiful app." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Home className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Nestly</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
            <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground">Benefits</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/register">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              New — AI energy insights
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
              The smart home,<br />
              <span className="text-primary">perfectly orchestrated.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Control every light, appliance and sensor in your home. Automate routines,
              track energy, and stay secure — all from one calm, elegant app.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Create account <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Log in
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> Free 30-day trial</div>
              <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> No credit card</div>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative">
            <div className="relative rounded-3xl border border-border bg-gradient-to-br from-muted/60 to-background p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "💡", label: "Living Room", val: "3 lights on", color: "bg-warning/15" },
                  { icon: "❄️", label: "AC", val: "22°C · cool", color: "bg-primary/10" },
                  { icon: "🔒", label: "Security", val: "Armed", color: "bg-success/15" },
                  { icon: "⚡", label: "Today", val: "12.4 kWh", color: "bg-accent" },
                ].map((c) => (
                  <div key={c.label} className={`rounded-2xl ${c.color} p-4`}>
                    <div className="text-2xl">{c.icon}</div>
                    <div className="mt-4 text-sm font-semibold">{c.label}</div>
                    <div className="text-xs text-muted-foreground">{c.val}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-background p-4">
                <div>
                  <div className="text-xs text-muted-foreground">Home mode</div>
                  <div className="text-sm font-semibold">Evening — Relax</div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything your home needs.</h2>
            <p className="mt-3 text-muted-foreground">A single control plane for lights, climate, security, energy and routines.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Cpu, title: "Device Control", desc: "Pair, group and control every device from any room, any device." },
              { icon: Clock, title: "Smart Routines", desc: "Automate mornings, movie nights and away modes with one tap." },
              { icon: Zap, title: "Energy Insights", desc: "Realtime consumption tracking with AI-driven savings tips." },
              { icon: ShieldCheck, title: "Security & Alerts", desc: "Instant alerts for smoke, gas, leaks and unusual activity." },
              { icon: Users, title: "Family Access", desc: "Invite family with granular admin, member and guest roles." },
              { icon: Home, title: "Multi-Home", desc: "Manage multiple properties from a single account." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-background p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Save energy. Sleep better.</h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                Nestly learns your patterns and quietly does the right thing. Fewer taps, lower bills, calmer evenings.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { k: "Up to 27%", v: "reduction in monthly energy costs" },
                { k: "3.2 hrs", v: "average time saved per week on chores" },
                { k: "99.98%", v: "device uptime with local fallback" },
              ].map((b) => (
                <div key={b.k} className="flex items-center justify-between rounded-2xl border border-border bg-background p-5">
                  <div className="text-2xl font-semibold text-primary">{b.k}</div>
                  <div className="text-sm text-muted-foreground">{b.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-border bg-muted/40 p-10 text-center">
            <h3 className="text-2xl font-semibold tracking-tight">Ready to make your home smarter?</h3>
            <p className="max-w-md text-sm text-muted-foreground">Set up in under 5 minutes. Works with 200+ device brands.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/register"><Button size="lg">Create free account</Button></Link>
              <Link to="/login"><Button size="lg" variant="outline">Log in</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-8">
          <div className="text-sm text-muted-foreground">© 2026 Nestly. All rights reserved.</div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
