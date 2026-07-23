import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_auth/login")({
  head: () => ({ meta: [{ title: "Log in — Nestly" }, { name: "description", content: "Log in to your Nestly smart home account." }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Log in to control your home.</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@home.io" defaultValue="aditya@home.io" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" defaultValue="password" />
        </div>
        <Button type="submit" className="w-full" size="lg">Log in</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">Register</Link>
      </p>
    </div>
  );
}
