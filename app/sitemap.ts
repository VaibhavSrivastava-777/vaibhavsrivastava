import { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/markdown";
import fs from "fs";
import path from "path";

function getPortfolioSlugs() {
  try {
    const filePath = path.join(process.cwd(), "content", "portfolio.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
    return data.projects.map((project: any) => project.slug);
  } catch {
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vaibhavsrivastava.com";
  
  const blogPosts = getAllBlogPosts();
  const portfolioSlugs = getPortfolioSlugs();

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/speaking`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    },
  ];

  const portfolioRoutes = portfolioSlugs.map((slug: string) => ({
    url: `${baseUrl}/portfolio/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...routes, ...portfolioRoutes, ...blogRoutes];
}
