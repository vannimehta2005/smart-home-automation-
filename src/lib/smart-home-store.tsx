import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  devices as seedDevices,
  rooms as seedRooms,
  family as seedFamily,
  type Device,
} from "./smart-home-data";
import { Lightbulb, type LucideIcon } from "lucide-react";

export type Room = { id: string; name: string; icon: string; description?: string };
export type FamilyMember = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Member" | "Guest";
  initials: string;
  pending?: boolean;
};

export type Theme = "light" | "dark" | "system";

type Ctx = {
  rooms: Room[];
  devices: Device[];
  family: FamilyMember[];
  addRoom: (r: Omit<Room, "id">) => void;
  addDevice: (d: {
    name: string;
    category: Device["category"];
    company: string;
    model: string;
    room: string;
    power: number;
    status: "on" | "off";
    icon?: LucideIcon;
  }) => void;
  toggleDevice: (id: string, on: boolean) => void;
  inviteMember: (m: { name: string; email: string; role: FamilyMember["role"] }) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const SmartHomeCtx = createContext<Ctx | null>(null);

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", isDark);
}

export function SmartHomeProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(seedRooms);
  const [devices, setDevices] = useState<Device[]>(seedDevices);
  const [family, setFamily] = useState<FamilyMember[]>(seedFamily as FamilyMember[]);
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const saved = (typeof window !== "undefined" &&
      (localStorage.getItem("nestly-theme") as Theme | null)) || "light";
    setThemeState(saved);
    applyTheme(saved);
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onChange = () => {
      if ((localStorage.getItem("nestly-theme") as Theme) === "system") applyTheme("system");
    };
    mq?.addEventListener?.("change", onChange);
    return () => mq?.removeEventListener?.("change", onChange);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem("nestly-theme", t);
    } catch {}
    applyTheme(t);
  };

  const value = useMemo<Ctx>(
    () => ({
      rooms,
      devices,
      family,
      addRoom: (r) =>
        setRooms((prev) => [
          ...prev,
          { id: `room-${Date.now()}`, ...r },
        ]),
      addDevice: (d) =>
        setDevices((prev) => [
          ...prev,
          {
            id: `d${Date.now()}`,
            name: d.name,
            category: d.category,
            company: d.company,
            model: d.model,
            room: d.room,
            power: d.power,
            status: d.status,
            icon: d.icon ?? Lightbulb,
          },
        ]),
      toggleDevice: (id, on) =>
        setDevices((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status: on ? "on" : "off" } : d)),
        ),
      inviteMember: (m) => {
        const initials = m.name
          .split(" ")
          .map((s) => s[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        setFamily((prev) => [
          ...prev,
          { id: `u${Date.now()}`, name: m.name, email: m.email, role: m.role, initials, pending: true },
        ]);
      },
      theme,
      setTheme,
    }),
    [rooms, devices, family, theme],
  );

  return <SmartHomeCtx.Provider value={value}>{children}</SmartHomeCtx.Provider>;
}

export function useSmartHome() {
  const ctx = useContext(SmartHomeCtx);
  if (!ctx) throw new Error("useSmartHome must be inside SmartHomeProvider");
  return ctx;
}
