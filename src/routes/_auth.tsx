import { createFileRoute, Link } from "@tanstack/react-router";
import { ReactNode } from "react";
import { Home } from "lucide-react";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  );
}

import { Outlet } from "@tanstack/react-router";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen bg-muted/40 lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-foreground/10">
            <Home className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">Nestly</span>
        </Link>
        <div>
          <p className="text-3xl font-semibold leading-tight tracking-tight">
            "It just feels like my home finally listens."
          </p>
          <p className="mt-4 text-sm text-primary-foreground/70">— Meera S., Nestly customer since 2024</p>
        </div>
        <div className="text-xs text-primary-foreground/60">© 2026 Nestly</div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
