import {
  FileCheck,
  Plane,
  UserSquare,
  Hotel,
  Compass,
  Crown,
  Map,
  Building2,
  Briefcase,
  Sparkles,
  Globe,
  Phone,
  Car,
  Camera,
  Mountain,
  Ship,
  Star,
  Heart,
  Calendar,
  Coffee,
  Utensils,
  Plane as PlaneIcon,
  type LucideIcon,
} from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  FileCheck,
  Plane,
  UserSquare,
  Hotel,
  Compass,
  Crown,
  Map,
  Building2,
  Briefcase,
  Sparkles,
  Globe,
  Phone,
  Car,
  Camera,
  Mountain,
  Ship,
  Star,
  Heart,
  Calendar,
  Coffee,
  Utensils,
};

export const SERVICE_ICON_NAMES = Object.keys(SERVICE_ICONS);

export function getServiceIcon(name: string | null | undefined): LucideIcon {
  if (name && SERVICE_ICONS[name]) return SERVICE_ICONS[name];
  return Sparkles;
}
