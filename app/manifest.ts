import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

// Web app manifest — lets the site be installed/added to home screen and gives
// search engines + the browser a canonical name, theme, and icon set.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Kumaran",
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f3f7f3",
    theme_color: "#2e7d46",
    lang: "en-LK",
    categories: ["food", "shopping", "business"],
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
