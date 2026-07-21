import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/minha-conta", "/agendar", "/login", "/cadastro", "/api"],
    },
    sitemap: "https://studiobeautyhm.com.br/sitemap.xml",
  };
}
