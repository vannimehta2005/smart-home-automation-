import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_auth/register")({
  head: () => ({ meta: [{ title: "Create account — Nestly" }, { name: "description", content: "Create your Nestly smart home account." }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Start automating your home in minutes.</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => { e.preventDefault(); navigate({ to: "/onboarding" }); }}
      >
        <div className="space-y-1.5"><Label>Full name</Label><Input placeholder="Aditya Sharma" /></div>
        <div className="space-y-1.5"><Label>Email</Label><Input type="email" placeholder="you@home.io" /></div>
        <div className="space-y-1.5"><Label>Password</Label><Input type="password" placeholder="At least 8 characters" /></div>
        <div className="space-y-1.5"><Label>Confirm password</Label><Input type="password" placeholder="Confirm password" /></div>
        <Button type="submit" size="lg" className="w-full">Create account</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link>
      </p>
    </div>
  );
}
