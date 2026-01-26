import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { sanitizePath, validateSlug } from "./validation";

const CONTENT_DIR = path.join(process.cwd(), "content");
const BLOG_DIR = path.join(CONTENT_DIR, "blog");
const PORTFOLIO_FILE = path.join(CONTENT_DIR, "portfolio.json");

// Blog operations
export function getAllBlogFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
    return [];
  }
  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".md"));
}

export function getBlogPostContent(slug: string): { data: any; content: string } | null {
  const safeSlug = sanitizePath(slug);
  if (!validateSlug(safeSlug)) {
    throw new Error("Invalid slug");
  }

  const filePath = path.join(BLOG_DIR, `${safeSlug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  return { data, content };
}

export function saveBlogPost(slug: string, frontmatter: any, content: string): void {
  const safeSlug = sanitizePath(slug);
  if (!validateSlug(safeSlug)) {
    throw new Error("Invalid slug");
  }

  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  const filePath = path.join(BLOG_DIR, `${safeSlug}.md`);
  const frontmatterString = Object.entries(frontmatter)
    .map(([key, value]) => {
      const escapedValue = typeof value === "string" ? `"${value.replace(/"/g, '\\"')}"` : value;
      return `${key}: ${escapedValue}`;
    })
    .join("\n");

  const fileContent = `---\n${frontmatterString}\n---\n\n${content}`;
  fs.writeFileSync(filePath, fileContent, "utf-8");
}

export function deleteBlogPost(slug: string): void {
  const safeSlug = sanitizePath(slug);
  if (!validateSlug(safeSlug)) {
    throw new Error("Invalid slug");
  }

  const filePath = path.join(BLOG_DIR, `${safeSlug}.md`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

// Portfolio operations
export function getPortfolioData(): { projects: any[] } {
  if (!fs.existsSync(PORTFOLIO_FILE)) {
    return { projects: [] };
  }
  const fileContent = fs.readFileSync(PORTFOLIO_FILE, "utf-8");
  return JSON.parse(fileContent);
}

export function savePortfolioData(data: { projects: any[] }): void {
  fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function getPortfolioItem(slug: string): any | null {
  const data = getPortfolioData();
  return data.projects.find((p: any) => p.slug === slug) || null;
}

export function savePortfolioItem(item: any): void {
  const data = getPortfolioData();
  const index = data.projects.findIndex((p: any) => p.slug === item.slug);
  
  if (index >= 0) {
    data.projects[index] = item;
  } else {
    data.projects.push(item);
  }
  
  savePortfolioData(data);
}

export function deletePortfolioItem(slug: string): void {
  const data = getPortfolioData();
  data.projects = data.projects.filter((p: any) => p.slug !== slug);
  savePortfolioData(data);
}
