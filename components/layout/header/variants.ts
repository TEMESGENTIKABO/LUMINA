import {
  BarChart3,
  BookOpen,
  Briefcase,
  Clapperboard,
  Cpu,
  Globe,
  Landmark,
  LineChart,
  Mail,
  MessageSquareQuote,
  Music,
  Newspaper,
  PlayCircle,
  Rocket,
  Search,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/config/headerNav";

export type StripKind =
  "pill" | "text" | "live" | "latest" | "links" | "black" | "none";

export interface Variant {
  strip: StripKind;
  emblem: boolean;
  tagline: boolean;
  bell: boolean;
  subscribe: boolean;
  subIcon: "mail" | "crown" | null;
  burgerRight: boolean;
  center: boolean;
  weatherInBar: boolean;
}

const base: Variant = {
  strip: "none",
  emblem: false,
  tagline: false,
  bell: false,
  subscribe: false,
  subIcon: null,
  burgerRight: false,
  center: false,
  weatherInBar: false,
};

// Same ten styles as before — only moved out of HeaderRoot.
export const VARIANTS: Record<number, Variant> = {
  1: {
    ...base,
    strip: "pill",
    emblem: true,
    tagline: true,
    bell: true,
    subscribe: true,
    subIcon: "mail",
  },
  2: { ...base, strip: "text", emblem: true, subscribe: true, subIcon: "mail" },
  3: { ...base, strip: "live", emblem: true, burgerRight: true },
  4: { ...base, strip: "links" },
  5: {
    ...base,
    strip: "latest",
    emblem: true,
    bell: true,
    subscribe: true,
    subIcon: "mail",
  },
  6: { ...base, strip: "black", emblem: true, tagline: true, subscribe: true },
  7: {
    ...base,
    strip: "none",
    emblem: true,
    tagline: true,
    bell: true,
    subscribe: true,
    subIcon: "crown",
    weatherInBar: true,
  },
  8: { ...base, strip: "links", emblem: true, center: true, subscribe: true },
  9: { ...base, strip: "pill", emblem: true, subscribe: true, subIcon: "mail" },
  10: {
    ...base,
    strip: "text",
    emblem: true,
    subscribe: true,
    subIcon: "mail",
  },
};

export const ICONS: Record<IconKey, LucideIcon> = {
  star: Star,
  politics: Landmark,
  business: BarChart3,
  tech: Cpu,
  globe: Globe,
  analysis: LineChart,
  film: Clapperboard,
  music: Music,
  style: Sparkles,
  heritage: Landmark,
  startup: Rocket,
  work: Briefcase,
  book: BookOpen,
  opinion: MessageSquareQuote,
  video: PlayCircle,
  paper: Newspaper,
  mail: Mail,
  search: Search,
};
