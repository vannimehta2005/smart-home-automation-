import type { DeviceCategory } from "./smart-home-data";

export interface Company {
  company_id: string;
  company_name: string;
}

export interface MasterDevice {
  device_id: string;
  model_name: string;
  company_id: string;
  category: DeviceCategory;
  rated_power_watts: number;
  is_high_power_rated: boolean;
}

export const masterCompanies: Company[] = [
  { company_id: "c1", company_name: "Philips" },
  { company_id: "c2", company_name: "Havells" },
  { company_id: "c3", company_name: "Crompton" },
  { company_id: "c4", company_name: "LG" },
  { company_id: "c5", company_name: "Samsung" },
  { company_id: "c6", company_name: "Panasonic" },
  { company_id: "c7", company_name: "Orient" },
  { company_id: "c8", company_name: "Bajaj" },
];

export const masterDevices: MasterDevice[] = [
  { device_id: "m1", model_name: "Smart LED Bulb 12W", company_id: "c1", category: "Lighting", rated_power_watts: 12, is_high_power_rated: false },
  { device_id: "m2", model_name: "Hue White & Color A19", company_id: "c1", category: "Lighting", rated_power_watts: 9, is_high_power_rated: false },
  { device_id: "m3", model_name: "Smart Ceiling Fan", company_id: "c2", category: "Climate", rated_power_watts: 55, is_high_power_rated: false },
  { device_id: "m4", model_name: "Smart Water Heater 25L", company_id: "c2", category: "Appliance", rated_power_watts: 2000, is_high_power_rated: true },
  { device_id: "m5", model_name: "Mini Champ Water Pump", company_id: "c3", category: "Utility", rated_power_watts: 750, is_high_power_rated: true },
  { device_id: "m6", model_name: "Smart Pedestal Fan", company_id: "c3", category: "Climate", rated_power_watts: 60, is_high_power_rated: false },
  { device_id: "m7", model_name: "Dual Inverter AC", company_id: "c4", category: "Climate", rated_power_watts: 1450, is_high_power_rated: true },
  { device_id: "m8", model_name: "Smart Washing Machine", company_id: "c4", category: "Appliance", rated_power_watts: 500, is_high_power_rated: true },
  { device_id: "m9", model_name: "Smart Refrigerator", company_id: "c4", category: "Appliance", rated_power_watts: 250, is_high_power_rated: false },
  { device_id: "m10", model_name: 'QLED Smart TV 55"', company_id: "c5", category: "Entertainment", rated_power_watts: 120, is_high_power_rated: false },
  { device_id: "m11", model_name: "SmartThings Door Sensor", company_id: "c5", category: "Security", rated_power_watts: 3, is_high_power_rated: false },
  { device_id: "m12", model_name: "Smart Security Camera", company_id: "c6", category: "Security", rated_power_watts: 6, is_high_power_rated: false },
  { device_id: "m13", model_name: "Smart Microwave Oven", company_id: "c6", category: "Appliance", rated_power_watts: 1200, is_high_power_rated: true },
  { device_id: "m14", model_name: "Aeroquiet Smart Fan", company_id: "c7", category: "Climate", rated_power_watts: 45, is_high_power_rated: false },
  { device_id: "m15", model_name: "Smart Air Cooler", company_id: "c7", category: "Climate", rated_power_watts: 190, is_high_power_rated: false },
  { device_id: "m16", model_name: "Majesty Smart Geyser", company_id: "c8", category: "Appliance", rated_power_watts: 2200, is_high_power_rated: true },
  { device_id: "m17", model_name: "Smart Plug 16A", company_id: "c8", category: "Utility", rated_power_watts: 8, is_high_power_rated: false },
];
