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

export interface ServiceDef {
  slug: string;
  i18nKey: string;
  icon: LucideIcon;
  image: string;
}

export const SERVICES: ServiceDef[] = [
  {
    slug: "visa-support",
    i18nKey: "visa",
    icon: FileCheck,
    image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80",
  },
  {
    slug: "airport-transfers",
    i18nKey: "airport",
    icon: Plane,
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  },
  {
    slug: "private-chauffeur",
    i18nKey: "chauffeur",
    icon: Car,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
  },
  {
    slug: "hotel-booking",
    i18nKey: "hotel",
    icon: Hotel,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
  },
  {
    slug: "tour-guides",
    i18nKey: "guides",
    icon: Compass,
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  },
  {
    slug: "vip-transport",
    i18nKey: "vip",
    icon: Crown,
    image: "https://images.unsplash.com/photo-1555353540-64580b51c258?w=800&q=80",
  },
  {
    slug: "custom-travel",
    i18nKey: "custom",
    icon: Map,
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
  },
  {
    slug: "city-tours",
    i18nKey: "city",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800&q=80",
  },
  {
    slug: "business-travel",
    i18nKey: "business",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
];

export function getServiceBySlug(slug: string): ServiceDef | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
