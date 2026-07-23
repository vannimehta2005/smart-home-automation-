import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_auth/waiting-approval")({
  head: () => ({ meta: [{ title: "Waiting for approval — Nestly" }, { name: "description", content: "Your request to join a home is pending admin approval." }] }),
  component: WaitingPage,
});

function WaitingPage() {
  return (
    <div className="text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-warning/15 text-warning-foreground">
        <Clock className="h-7 w-7" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Waiting for admin approval</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your request to join <span className="font-medium text-foreground">Sharma Residence</span> has been sent.
        You'll get an email as soon as an admin approves it.
      </p>
      <div className="mt-8 flex justify-center gap-2">
        <Link to="/login"><Button variant="outline">Back to login</Button></Link>
        <Button>Resend request</Button>
      </div>
    </div>
  );
}
