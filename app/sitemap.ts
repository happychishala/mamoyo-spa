import type { MetadataRoute } from "next";
import { SITE_URL, SITE_ROUTES } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return SITE_ROUTES.map((route) => ({
    url: `${SITE_URL}${route === "/" ? "" : route}`,
    lastModified,
    changeFrequency: route === "/" || route === "/journal" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/spa") || route === "/book" ? 0.9 : 0.7,
  }));
}
