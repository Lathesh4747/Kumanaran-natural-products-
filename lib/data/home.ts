import type { LocalizedText } from "@/types/site";

export interface HomeHeroCopy {
  eyebrow: string;
  title: string;
  descriptions: readonly {
    localeName: string;
    text: string;
  }[];
  ctaLabel: string;
  videoPlaceholder: string;
}

export interface HomeProduct {
  name: LocalizedText;
  description: LocalizedText;
}

export interface HomeLocation {
  eyebrow: string;
  title: string;
  description: string;
  officeLabel: string;
  address: string;
  mapTitle: string;
  mapSrc: string;
}

export const homeHero: HomeHeroCopy = {
  eyebrow: "Sri Lankan farm-fresh food brand",
  title: "Kumaran Natural Products",
  descriptions: [
    {
      localeName: "Sinhala",
      text: "කුමාරන් නැචුරල් ප්‍රොඩක්ට්ස් වෙතින් නැවුම් කුවේල් බිත්තර සහ කුවේල් මස්.",
    },
    {
      localeName: "Tamil",
      text: "குமரன் நேச்சுரல் புரொடக்ட்ஸ் வழங்கும் புதிய காடை முட்டைகள் மற்றும் காடை இறைச்சி.",
    },
    {
      localeName: "English",
      text: "Farm-fresh quail eggs and quail meat prepared for families across Sri Lanka.",
    },
  ],
  ctaLabel: "Products",
  videoPlaceholder: "Quail feed video placeholder",
};

export const homeProducts: readonly HomeProduct[] = [
  {
    name: {
      en: "Quail Eggs",
      si: "කුවේල් බිත්තර",
      ta: "காடை முட்டைகள்",
    },
    description: {
      en: "Freshly collected quail eggs for home meals, nutrition, and family cooking.",
      si: "ගෙදර ආහාර සහ පෝෂණය සඳහා නැවුම්ව එකතු කරන කුවේල් බිත්තර.",
      ta: "வீட்டு உணவு மற்றும் ஊட்டச்சத்துக்காக புதிதாக சேகரிக்கப்படும் காடை முட்டைகள்.",
    },
  },
  {
    name: {
      en: "Quail Meat",
      si: "කුවේල් මස්",
      ta: "காடை இறைச்சி",
    },
    description: {
      en: "Premium quail meat prepared for clean, flavourful Sri Lankan cooking.",
      si: "පිරිසිදු සහ රසවත් ශ්‍රී ලාංකික ආහාර සඳහා සකස් කරන උසස් කුවේල් මස්.",
      ta: "சுத்தமான, சுவையான இலங்கை சமையலுக்காக தயாரிக்கப்படும் தரமான காடை இறைச்சி.",
    },
  },
];

export const homeLocation: HomeLocation = {
  eyebrow: "Location",
  title: "Visit our office in Kalmunai",
  description:
    "Kumaran Natural Products is based in Kalmunai, serving customers across Sri Lanka with fresh quail eggs and quail meat.",
  officeLabel: "Office location",
  address: "Kalmunai, Sri Lanka",
  mapTitle: "Google Map showing Kalmunai, Sri Lanka",
  mapSrc:
    "https://www.google.com/maps?q=Kalmunai%2C%20Sri%20Lanka&output=embed",
};
