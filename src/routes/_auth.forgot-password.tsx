import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_auth/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — Nestly" }, { name: "description", content: "Reset your Nestly account password." }] }),
  component: ForgotPage,
});

function ForgotPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
      <p className="mt-1 text-sm text-muted-foreground">We'll email you a reset link.</p>
      <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5"><Label>Email</Label><Input type="email" placeholder="you@home.io" /></div>
        <Button size="lg" className="w-full">Send reset link</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-primary hover:underline">Back to login</Link>
      </p>
    </div>
  );
}
