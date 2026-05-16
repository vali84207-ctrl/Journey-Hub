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
  type LucideIcon,
} from "lucide-react";

export type ServiceSlug =
  | "visa-support"
  | "airport-transfers"
  | "private-chauffeur"
  | "hotel-booking"
  | "tour-guides"
  | "vip-transportation"
  | "custom-travel"
  | "city-tours"
  | "business-travel";

export interface ServiceMeta {
  slug: ServiceSlug;
  i18nKey:
    | "visa"
    | "airport"
    | "chauffeur"
    | "hotel"
    | "guides"
    | "vip"
    | "custom"
    | "city"
    | "business";
  icon: LucideIcon;
  image: string;
}

export const SERVICES: ServiceMeta[] = [
  {
    slug: "visa-support",
    i18nKey: "visa",
    icon: FileCheck,
    image:
      "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "airport-transfers",
    i18nKey: "airport",
    icon: Plane,
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "private-chauffeur",
    i18nKey: "chauffeur",
    icon: UserSquare,
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "hotel-booking",
    i18nKey: "hotel",
    icon: Hotel,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "tour-guides",
    i18nKey: "guides",
    icon: Compass,
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "vip-transportation",
    i18nKey: "vip",
    icon: Crown,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "custom-travel",
    i18nKey: "custom",
    icon: Map,
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "city-tours",
    i18nKey: "city",
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "business-travel",
    i18nKey: "business",
    icon: Briefcase,
    image:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=1400&q=80",
  },
];

export function getServiceBySlug(slug: string): ServiceMeta | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
