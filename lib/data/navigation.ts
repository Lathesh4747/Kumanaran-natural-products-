import type { LocalizedText } from "@/types/site";

export interface NavigationItem {
  href: string;
  label: LocalizedText;
}

export const navigationItems: readonly NavigationItem[] = [
  {
    href: "/",
    label: { en: "Home", si: "මුල් පිටුව", ta: "முகப்பு" },
  },
  {
    href: "/products",
    label: { en: "Products", si: "නිෂ්පාදන", ta: "தயாரிப்புகள்" },
  },
  {
    href: "/about",
    label: { en: "About", si: "අප ගැන", ta: "எங்களை பற்றி" },
  },
  {
    href: "/blog",
    label: { en: "Blog", si: "බ්ලොග්", ta: "வலைப்பதிவு" },
  },
  {
    href: "/contact",
    label: { en: "Contact", si: "සම්බන්ධ වන්න", ta: "தொடர்பு" },
  },
];
