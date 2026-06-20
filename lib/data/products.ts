import type { LocalizedText } from "@/types/site";

export type ProductType = "Egg" | "Meat";

export interface Product {
  id: string;
  type: ProductType;
  packLabel: string;
  name: LocalizedText;
  description: LocalizedText;
  /** Pre-discount price. Omitted for DB-sourced products that have no sale price. */
  mrpOriginal?: number;
  mrp: number;
  isActive: boolean;
}

export const products: readonly Product[] = [
  {
    id: "quail-eggs-10pack",
    type: "Egg",
    packLabel: "10 Eggs",
    name: {
      en: "Quail Eggs (10 Pack)",
      si: "කුවේල් බිත්තර (10 ඇසුරුම)",
      ta: "காடை முட்டைகள் (10 பேக்)",
    },
    description: {
      en: "Farm-fresh quail eggs in a 10-egg packet. Rich in protein and nutrients, ideal for daily family meals and cooking.",
      si: "ගොවිපළෙන් නැවුම්ව ඇසුරුම් කළ කුවේල් බිත්තර 10ක් ඇසුරුමකි. ප්‍රෝටීන් සහ පෝෂ්‍ය පදාර්ථ බහුල, දෛනික ආහාර සඳහා ඉතා සුදුසුයි.",
      ta: "பண்ணையிலிருந்து புதிதாக 10 முட்டைகள் பேக் செய்யப்பட்டது. புரதம் மற்றும் ஊட்டச்சத்துக்கள் நிறைந்தது, தினசரி சமையலுக்கு ஏற்றது.",
    },
    mrpOriginal: 350,
    mrp: 319,
    isActive: true,
  },
  {
    id: "quail-eggs-16pack",
    type: "Egg",
    packLabel: "16 Eggs",
    name: {
      en: "Quail Eggs (16 Pack)",
      si: "කුවේල් බිත්තර (16 ඇසුරුම)",
      ta: "காடை முட்டைகள் (16 பேக்)",
    },
    description: {
      en: "Our value 16-egg pack of fresh quail eggs. Great for households, restaurants, and regular buyers who want more for less.",
      si: "නැවුම් කුවේල් බිත්තර 16ක් ඇසුරුම. ගෘහ, අවන්හල්, සහ නිතිපතා ගනුදෙනුකරුවන් සඳහා ලාභදායී ත්‍යාගයකි.",
      ta: "புதிய காடை முட்டைகள் 16 பேக். வீட்டு, உணவகம் மற்றும் வழக்கமான வாங்குவோருக்கு சிறந்த மதிப்பு.",
    },
    mrp: 499,
    isActive: true,
  },
  {
    id: "quail-meat-500g",
    type: "Meat",
    packLabel: "500g",
    name: {
      en: "Quail Meat 500g",
      si: "කුවේල් මස් 500ග්‍රෑ",
      ta: "காடை இறைச்சி 500கி",
    },
    description: {
      en: "Freshly processed quail meat in a 500g packet. Lean, tender, and flavourful — perfect for traditional Sri Lankan curries and grilled dishes.",
      si: "500ග්‍රෑ ඇසුරුම්කරණයෙන් නැවුම් සකස් කළ කුවේල් මස්. ශ්‍රී ලාංකික ව්‍යංජන සහ රෝස්ට් ආහාර සඳහා ඉතා සුදුසු.",
      ta: "500கி பேக்கில் புதிதாக பதப்படுத்தப்பட்ட காடை இறைச்சி. இலங்கை கறி மற்றும் வறுவல் உணவுகளுக்கு மிகவும் ஏற்றது.",
    },
    mrpOriginal: 1990,
    mrp: 1699,
    isActive: true,
  },
  {
    id: "quail-meat-1000g",
    type: "Meat",
    packLabel: "1000g",
    name: {
      en: "Quail Meat 1000g",
      si: "කුවේල් මස් 1000ග්‍රෑ",
      ta: "காடை இறைச்சி 1000கி",
    },
    description: {
      en: "Premium quail meat in a generous 1000g pack. Ideal for larger families, events, or restaurants that want consistently fresh, high-quality meat.",
      si: "විශාල 1000ග්‍රෑ ඇසුරුමේ ප්‍රිමියම් කුවේල් මස්. විශාල පවුල්, උත්සව, හෝ ගුණාත්මක මස් සොයන අවන්හල් සඳහා ඉතා සුදුසු.",
      ta: "1000கி பேக்கில் பிரீமியம் காடை இறைச்சி. பெரிய குடும்பங்கள், நிகழ்வுகள் அல்லது தரமான இறைச்சியை விரும்பும் உணவகங்களுக்கு சிறந்தது.",
    },
    mrp: 3290,
    isActive: true,
  },
];
