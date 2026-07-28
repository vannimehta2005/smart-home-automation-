import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  devices as seedDevices,
  rooms as seedRooms,
  family as seedFamily,
  type Device,
  type DeviceCategory,
} from "./smart-home-data";
import {
  masterCompanies,
  masterDevices as seedMasterDevices,
  type Company,
  type MasterDevice,
} from "./master-catalog";
import {
  Lightbulb,
  AirVent,
  Lock,
  Plug,
  Tv,
  Plug2,
  type LucideIcon,
} from "lucide-react";

function iconForCategory(category: DeviceCategory): LucideIcon {
  switch (category) {
    case "Lighting":
      return Lightbulb;
    case "Climate":
      return AirVent;
    case "Security":
      return Lock;
    case "Entertainment":
      return Tv;
    case "Appliance":
      return Plug2;
    default:
      return Plug;
  }
}


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
  updateRoom: (id: string, patch: Partial<Omit<Room, "id">>) => void;
  deleteRoom: (id: string) => void;
  companies: Company[];
  masterDevices: MasterDevice[];
  addCompany: (name: string) => void;
  updateCompany: (id: string, name: string) => void;
  deleteCompany: (id: string) => void;
  addMasterDevice: (d: Omit<MasterDevice, "device_id">) => void;
  updateMasterDevice: (id: string, patch: Partial<Omit<MasterDevice, "device_id">>) => void;
  deleteMasterDevice: (id: string) => void;
  addDevice: (d: {
    name: string;
    masterDeviceId: string;
    room: string;
    status: "on" | "off";
  }) => void;
  updateDevice: (id: string, patch: { name?: string; room?: string; status?: "on" | "off" }) => void;
  deleteDevice: (id: string) => void;
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
      updateRoom: (id, patch) =>
        setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r))),
      deleteRoom: (id) => {
        setRooms((prev) => {
          const target = prev.find((r) => r.id === id);
          if (target) setDevices((ds) => ds.filter((d) => d.room !== target.name));
          return prev.filter((r) => r.id !== id);
        });
      },
      companies,
      masterDevices: catalog,
      addCompany: (name) =>
        setCompanies((prev) => [...prev, { company_id: `c${Date.now()}`, company_name: name }]),
      updateCompany: (id, name) =>
        setCompanies((prev) => prev.map((c) => (c.company_id === id ? { ...c, company_name: name } : c))),
      deleteCompany: (id) => {
        setCompanies((prev) => prev.filter((c) => c.company_id !== id));
        setCatalog((prev) => prev.filter((m) => m.company_id !== id));
      },
      addMasterDevice: (d) =>
        setCatalog((prev) => [...prev, { device_id: `m${Date.now()}`, ...d }]),
      updateMasterDevice: (id, patch) =>
        setCatalog((prev) => prev.map((m) => (m.device_id === id ? { ...m, ...patch } : m))),
      deleteMasterDevice: (id) => setCatalog((prev) => prev.filter((m) => m.device_id !== id)),
      addDevice: (d) => {
        const master = catalog.find((m) => m.device_id === d.masterDeviceId);
        if (!master) return;
        const company = companies.find((c) => c.company_id === master.company_id);
        setDevices((prev) => [
          ...prev,
          {
            id: `d${Date.now()}`,
            name: d.name,
            masterDeviceId: master.device_id,
            category: master.category,
            company: company?.company_name ?? "",
            model: master.model_name,
            room: d.room,
            power: master.rated_power_watts,
            status: d.status,
            highPower: master.is_high_power_rated,
            icon: iconForCategory(master.category),
          },
        ]);
      },
      updateDevice: (id, patch) =>
        setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d))),
      deleteDevice: (id) => setDevices((prev) => prev.filter((d) => d.id !== id)),
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
