import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSmartHome } from "@/lib/smart-home-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ICONS = ["🛋️", "🍳", "🛏️", "🛁", "🚗", "💻", "🌳", "🎮", "📚", "🧺", "🧸", "🍽️"];

export function AddRoomDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { addRoom } = useSmartHome();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🛋️");
  const [desc, setDesc] = useState("");

  const submit = () => {
    if (!name.trim()) {
      toast.error("Please enter a room name");
      return;
    }
    addRoom({ name: name.trim(), icon, description: desc.trim() || undefined });
    toast.success(`Room "${name}" added`);
    setName(""); setIcon("🛋️"); setDesc("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new room</DialogTitle>
          <DialogDescription>Group your devices by room for easier control.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Room name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Guest Room" />
          </div>
          <div className="space-y-1.5">
            <Label>Icon</Label>
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={cn(
                    "grid h-11 place-items-center rounded-lg border text-xl transition-colors",
                    icon === i ? "border-primary bg-primary/10" : "border-border hover:bg-muted",
                  )}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description <span className="text-muted-foreground">(optional)</span></Label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short description..." rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Create Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
