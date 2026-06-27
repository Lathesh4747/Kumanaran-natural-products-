import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

// Private operations app + auth routes are kept out of every crawler; the public
// marketing site is fully open — including to answer/generative-engine bots
// (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) so the brand can be cited
// in AI answers (AEO / GEO).
const privateRoutes = [
  "/dashboard",
  "/admin",
  "/api/",
  "/sign-in",
  "/sign-up",
  "/pending-approval",
  "/price",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privateRoutes },
      { userAgent: "GPTBot", allow: "/", disallow: privateRoutes },
      { userAgent: "ClaudeBot", allow: "/", disallow: privateRoutes },
      { userAgent: "PerplexityBot", allow: "/", disallow: privateRoutes },
      { userAgent: "Google-Extended", allow: "/", disallow: privateRoutes },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
