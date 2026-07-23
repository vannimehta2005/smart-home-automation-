import {
  Lightbulb,
  Fan,
  AirVent,
  Lock,
  Droplet,
  Flame,
  Tv,
  Plug,
  Blinds,
  Thermometer,
  Camera,
  DoorOpen,
  type LucideIcon,
} from "lucide-react";

export type DeviceCategory =
  | "Lighting"
  | "Climate"
  | "Security"
  | "Appliance"
  | "Entertainment"
  | "Utility";

export interface Device {
  id: string;
  name: string;
  category: DeviceCategory;
  company: string;
  model: string;
  room: string;
  power: number; // watts
  status: "on" | "off";
  icon: LucideIcon;
  favorite?: boolean;
}

export const rooms = [
  { id: "living-room", name: "Living Room", icon: "🛋️" },
  { id: "kitchen", name: "Kitchen", icon: "🍳" },
  { id: "bedroom", name: "Master Bedroom", icon: "🛏️" },
  { id: "bathroom", name: "Bathroom", icon: "🛁" },
  { id: "garage", name: "Garage", icon: "🚗" },
  { id: "office", name: "Home Office", icon: "💻" },
];

export const devices: Device[] = [
  { id: "d1", name: "Living Room Light", category: "Lighting", company: "Philips Hue", model: "White & Color A19", room: "Living Room", power: 9, status: "on", icon: Lightbulb, favorite: true },
  { id: "d2", name: "Living Room AC", category: "Climate", company: "Daikin", model: "FTKM50", room: "Living Room", power: 1400, status: "on", icon: AirVent, favorite: true },
  { id: "d3", name: "Ceiling Fan", category: "Climate", company: "Havells", model: "Stealth Air", room: "Living Room", power: 55, status: "on", icon: Fan, favorite: true },
  { id: "d4", name: "Smart TV", category: "Entertainment", company: "Samsung", model: 'QLED 55"', room: "Living Room", power: 120, status: "off", icon: Tv },
  { id: "d5", name: "Kitchen Light", category: "Lighting", company: "Philips Hue", model: "BR30", room: "Kitchen", power: 12, status: "on", icon: Lightbulb },
  { id: "d6", name: "Kitchen Smart Plug", category: "Utility", company: "TP-Link", model: "Kasa HS110", room: "Kitchen", power: 8, status: "off", icon: Plug },
  { id: "d7", name: "Bedroom Fan", category: "Climate", company: "Orient", model: "Aeroquiet", room: "Master Bedroom", power: 45, status: "off", icon: Fan },
  { id: "d8", name: "Bedroom Light", category: "Lighting", company: "Wipro", model: "Smart LED", room: "Master Bedroom", power: 9, status: "off", icon: Lightbulb },
  { id: "d9", name: "Smart Curtains", category: "Utility", company: "Aqara", model: "B1", room: "Master Bedroom", power: 5, status: "off", icon: Blinds },
  { id: "d10", name: "Geyser", category: "Appliance", company: "Bajaj", model: "Majesty 25L", room: "Bathroom", power: 2000, status: "off", icon: Flame, favorite: true },
  { id: "d11", name: "Bathroom Heater", category: "Climate", company: "Usha", model: "3213-P", room: "Bathroom", power: 2200, status: "off", icon: Thermometer },
  { id: "d12", name: "Main Door Lock", category: "Security", company: "Yale", model: "YDM7116", room: "Garage", power: 3, status: "on", icon: Lock },
  { id: "d13", name: "Water Motor", category: "Utility", company: "Crompton", model: "Mini Champ", room: "Garage", power: 750, status: "off", icon: Droplet },
  { id: "d14", name: "Front Door Camera", category: "Security", company: "Ring", model: "Doorbell Pro 2", room: "Garage", power: 6, status: "on", icon: Camera },
  { id: "d15", name: "Office Desk Light", category: "Lighting", company: "IKEA", model: "Tradfri", room: "Home Office", power: 8, status: "on", icon: Lightbulb },
  { id: "d16", name: "Office Smart Plug", category: "Utility", company: "Wemo", model: "Mini", room: "Home Office", power: 2, status: "on", icon: Plug },
  { id: "d17", name: "Garage Door", category: "Security", company: "Chamberlain", model: "MyQ", room: "Garage", power: 250, status: "off", icon: DoorOpen },
];

export interface Routine {
  id: string;
  name: string;
  deviceId: string;
  action: "on" | "off";
  time: string;
  days: string[];
  duration: string;
  enabled: boolean;
}

export const routines: Routine[] = [
  { id: "r1", name: "Morning Wake Up", deviceId: "d8", action: "on", time: "06:30", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], duration: "30 min", enabled: true },
  { id: "r2", name: "Evening Ambience", deviceId: "d1", action: "on", time: "18:45", days: ["Everyday"], duration: "5 hr", enabled: true },
  { id: "r3", name: "Night AC", deviceId: "d2", action: "on", time: "22:00", days: ["Everyday"], duration: "7 hr", enabled: true },
  { id: "r4", name: "Geyser Preheat", deviceId: "d10", action: "on", time: "06:00", days: ["Everyday"], duration: "20 min", enabled: true },
  { id: "r5", name: "Away — Lights Off", deviceId: "d5", action: "off", time: "09:00", days: ["Mon", "Wed", "Fri"], duration: "—", enabled: false },
  { id: "r6", name: "Weekend Movie Time", deviceId: "d4", action: "on", time: "20:00", days: ["Sat", "Sun"], duration: "3 hr", enabled: true },
];

export type AlertSeverity = "critical" | "warning" | "info";

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  device: string;
  time: string;
}

export const alerts: Alert[] = [
  { id: "a1", severity: "critical", title: "Gas Leak Detected", description: "Kitchen gas sensor detected unusual methane levels.", device: "Kitchen Sensor", time: "2 min ago" },
  { id: "a2", severity: "critical", title: "Front Door Unlocked Unexpectedly", description: "Main Door unlocked at 02:14 AM.", device: "Main Door Lock", time: "1 hr ago" },
  { id: "a3", severity: "warning", title: "Geyser Left ON", description: "Geyser has been on for 45 minutes.", device: "Geyser", time: "3 hr ago" },
  { id: "a4", severity: "warning", title: "Unusual Power Draw", description: "Living Room AC drawing 20% more than average.", device: "Living Room AC", time: "Today, 14:20" },
  { id: "a5", severity: "info", title: "Firmware Update Available", description: "Ring Doorbell Pro has a new firmware.", device: "Front Door Camera", time: "Yesterday" },
  { id: "a6", severity: "info", title: "Motion Detected", description: "Motion at front porch.", device: "Front Door Camera", time: "Yesterday" },
];

export const family = [
  { id: "u1", name: "Aditya Sharma", role: "Admin" as const, email: "aditya@home.io", initials: "AS" },
  { id: "u2", name: "Meera Sharma", role: "Admin" as const, email: "meera@home.io", initials: "MS" },
  { id: "u3", name: "Rohan Sharma", role: "Member" as const, email: "rohan@home.io", initials: "RS" },
  { id: "u4", name: "Nanny Priya", role: "Guest" as const, email: "priya@home.io", initials: "NP" },
];

export const energyToday = [
  { h: "00", kwh: 0.8 }, { h: "02", kwh: 0.6 }, { h: "04", kwh: 0.5 },
  { h: "06", kwh: 1.4 }, { h: "08", kwh: 2.1 }, { h: "10", kwh: 1.6 },
  { h: "12", kwh: 1.9 }, { h: "14", kwh: 2.4 }, { h: "16", kwh: 2.0 },
  { h: "18", kwh: 2.8 }, { h: "20", kwh: 3.2 }, { h: "22", kwh: 2.1 },
];

export const energyWeek = [
  { d: "Mon", kwh: 22 }, { d: "Tue", kwh: 26 }, { d: "Wed", kwh: 19 },
  { d: "Thu", kwh: 28 }, { d: "Fri", kwh: 31 }, { d: "Sat", kwh: 34 }, { d: "Sun", kwh: 29 },
];

export const energyByCategory = [
  { name: "Climate", value: 48 },
  { name: "Appliance", value: 22 },
  { name: "Lighting", value: 12 },
  { name: "Entertainment", value: 10 },
  { name: "Utility", value: 8 },
];

export function getDevice(id: string) {
  return devices.find((d) => d.id === id);
}
