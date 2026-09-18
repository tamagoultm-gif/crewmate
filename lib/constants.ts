import {
  Film,
  Camera,
  Clapperboard,
  Instagram,
  Megaphone,
  Sparkles,
  Video,
  Images,
  type LucideIcon,
} from "lucide-react";

/** Canonical service catalog. Mirrored in the DB via seed. */
export const SERVICES: {
  name: string;
  slug: string;
  description: string;
  icon: string;
}[] = [
  { name: "Reels", slug: "reels", description: "Short-form vertical video built to stop the scroll.", icon: "Clapperboard" },
  { name: "Stories", slug: "stories", description: "Native, ephemeral content that feels at home on the feed.", icon: "Sparkles" },
  { name: "Video", slug: "video", description: "From concept to edit — brand films, ads and long-form.", icon: "Video" },
  { name: "Photography", slug: "photography", description: "Product, lifestyle and editorial photography.", icon: "Camera" },
  { name: "UGC", slug: "ugc", description: "Authentic user-generated content that converts.", icon: "Film" },
  { name: "Social Media Content", slug: "social-media-content", description: "Always-on content packages for every channel.", icon: "Instagram" },
  { name: "Brand Content", slug: "brand-content", description: "Campaign-grade creative for launches and activations.", icon: "Megaphone" },
];

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  Clapperboard,
  Sparkles,
  Video,
  Camera,
  Film,
  Instagram,
  Megaphone,
  Images,
};

/** Content types offered in the request form. */
export const CONTENT_TYPES = [
  "Reels",
  "Stories",
  "Video",
  "Photography",
  "UGC",
  "Social Media Content",
  "Brand Content",
  "Advertising",
  "Other",
] as const;

export const BUDGET_RANGES = [
  "< 500 €",
  "500 – 1 500 €",
  "1 500 – 3 000 €",
  "3 000 – 6 000 €",
  "6 000 €+",
  "À discuter",
] as const;

export const LANGUAGES = ["Arabic", "French", "English", "Spanish", "Italian"] as const;

export const REQUEST_STATUSES = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

export const CONTACT_STATUSES = ["NEW", "READ", "REPLIED", "ARCHIVED"] as const;

export const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  READ: "Read",
  REPLIED: "Replied",
  ARCHIVED: "Archived",
};

/** Tailwind classes for status pills. */
export const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-brand-100 text-brand-700 ring-brand-200",
  CONTACTED: "bg-amber-100 text-amber-700 ring-amber-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 ring-blue-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-rose-100 text-rose-700 ring-rose-200",
  READ: "bg-zinc-100 text-zinc-600 ring-zinc-200",
  REPLIED: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  ARCHIVED: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/community", label: "Community" },
  { href: "/contact", label: "Contact" },
];
