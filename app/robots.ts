import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Operations app and auth-adjacent routes are private — keep them out of search.
      disallow: ["/dashboard", "/admin", "/api/", "/sign-in", "/sign-up", "/pending-approval"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
