import type { MetadataRoute } from "next";
import { festivals } from "./data";
import { siteUrl } from "./site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 },
    ...festivals.map((festival) => ({
      url: `${siteUrl}/${festival.kind === "concert" ? "concerts" : "festivals"}/${festival.year}/${festival.slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
