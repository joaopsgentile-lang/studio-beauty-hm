import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://studiobeautyhm.com.br";
  const agora = new Date();

  return [
    { url: base, lastModified: agora, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/servicos`, lastModified: agora, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/contato`, lastModified: agora, changeFrequency: "monthly", priority: 0.5 },
  ];
}
