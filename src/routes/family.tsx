import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, UserPlus, Shield, User, UserRound } from "lucide-react";
import { family } from "@/lib/smart-home-data";

export const Route = createFileRoute("/family")({
  head: () => ({ meta: [{ title: "Family — Nestly" }, { name: "description", content: "Manage members and their access to your home." }] }),
  component: FamilyPage,
});

const roleStyles: Record<string, string> = {
  Admin: "bg-primary/10 text-primary",
  Member: "bg-success/10 text-success",
  Guest: "bg-muted text-muted-foreground",
};

function FamilyPage() {
  return (
    <AppLayout
      title="Family"
      subtitle="Manage who has access to your smart home"
      actions={<Button className="gap-2"><UserPlus className="h-4 w-4" /> Invite Member</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {family.map((m) => {
          const Icon = m.role === "Admin" ? Shield : m.role === "Member" ? User : UserRound;
          return (
            <Card key={m.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">{m.initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold">{m.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{m.email}</div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Change role</DropdownMenuItem>
                    <DropdownMenuItem>Reset access</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <Badge variant="secondary" className={`${roleStyles[m.role]} gap-1.5`}>
                  <Icon className="h-3 w-3" /> {m.role}
                </Badge>
                <span className="text-xs text-muted-foreground">Active now</span>
              </div>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
