import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { sanitizePath, validateSlug } from "./validation";
import { githubAPI } from "./github-api";

const CONTENT_DIR = path.join(process.cwd(), "content");
const BLOG_DIR = path.join(CONTENT_DIR, "blog");
const PORTFOLIO_FILE = path.join(CONTENT_DIR, "portfolio.json");
const RESUME_FILE = path.join(CONTENT_DIR, "resume.json");
const SPEAKING_FILE = path.join(CONTENT_DIR, "speaking.json");

// Helper to determine if we should use GitHub API
function shouldUseGitHub(): boolean {
  return (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") && githubAPI.isConfigured();
}

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

export async function saveBlogPost(slug: string, frontmatter: any, content: string): Promise<void> {
  const safeSlug = sanitizePath(slug);
  if (!validateSlug(safeSlug)) {
    throw new Error("Invalid slug");
  }

  const frontmatterString = Object.entries(frontmatter)
    .map(([key, value]) => {
      const escapedValue = typeof value === "string" ? `"${value.replace(/"/g, '\\"')}"` : value;
      return `${key}: ${escapedValue}`;
    })
    .join("\n");

  const fileContent = `---\n${frontmatterString}\n---\n\n${content}`;
  const filePath = `content/blog/${safeSlug}.md`;
  const commitMessage = `Update blog post: ${frontmatter.title || safeSlug}`;

  // Use GitHub API in production, file system in development
  if (shouldUseGitHub()) {
    await githubAPI.commitFile(filePath, fileContent, commitMessage);
  } else {
    if (!fs.existsSync(BLOG_DIR)) {
      fs.mkdirSync(BLOG_DIR, { recursive: true });
    }

    const fullPath = path.join(BLOG_DIR, `${safeSlug}.md`);
    try {
      fs.writeFileSync(fullPath, fileContent, "utf-8");
    } catch (error: any) {
      if (error.code === "EROFS" || error.message.includes("read-only")) {
        throw new Error("EROFS: File system is read-only. Please configure GitHub API for production.");
      }
      throw error;
    }
  }
}

export async function deleteBlogPost(slug: string): Promise<void> {
  const safeSlug = sanitizePath(slug);
  if (!validateSlug(safeSlug)) {
    throw new Error("Invalid slug");
  }

  const filePath = `content/blog/${safeSlug}.md`;
  const commitMessage = `Delete blog post: ${safeSlug}`;

  // Use GitHub API in production, file system in development
  if (shouldUseGitHub()) {
    await githubAPI.deleteFile(filePath, commitMessage);
  } else {
    const fullPath = path.join(BLOG_DIR, `${safeSlug}.md`);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (error: any) {
        if (error.code === "EROFS" || error.message.includes("read-only")) {
          throw new Error("EROFS: File system is read-only. Please configure GitHub API for production.");
        }
        throw error;
      }
    }
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

export async function savePortfolioData(data: { projects: any[] }): Promise<void> {
  const fileContent = JSON.stringify(data, null, 2);
  const filePath = "content/portfolio.json";
  const commitMessage = "Update portfolio data";

  // Use GitHub API in production, file system in development
  if (shouldUseGitHub()) {
    await githubAPI.commitFile(filePath, fileContent, commitMessage);
  } else {
    try {
      fs.writeFileSync(PORTFOLIO_FILE, fileContent, "utf-8");
    } catch (error: any) {
      if (error.code === "EROFS" || error.message.includes("read-only")) {
        throw new Error("EROFS: File system is read-only. Please configure GitHub API for production.");
      }
      throw error;
    }
  }
}

export function getPortfolioItem(slug: string): any | null {
  const data = getPortfolioData();
  return data.projects.find((p: any) => p.slug === slug) || null;
}

export async function savePortfolioItem(item: any): Promise<void> {
  const data = getPortfolioData();
  const index = data.projects.findIndex((p: any) => p.slug === item.slug);
  
  if (index >= 0) {
    data.projects[index] = item;
  } else {
    data.projects.push(item);
  }
  
  await savePortfolioData(data);
}

export async function deletePortfolioItem(slug: string): Promise<void> {
  const data = getPortfolioData();
  data.projects = data.projects.filter((p: any) => p.slug !== slug);
  await savePortfolioData(data);
}

// Resume operations
export async function saveResumeData(data: any): Promise<void> {
  const fileContent = JSON.stringify(data, null, 2);
  const filePath = "content/resume.json";
  const commitMessage = "Update resume data";

  // Use GitHub API in production, file system in development
  if (shouldUseGitHub()) {
    await githubAPI.commitFile(filePath, fileContent, commitMessage);
  } else {
    try {
      fs.writeFileSync(RESUME_FILE, fileContent, "utf-8");
    } catch (error: any) {
      if (error.code === "EROFS" || error.message.includes("read-only")) {
        throw new Error("EROFS: File system is read-only. Please configure GitHub API for production.");
      }
      throw error;
    }
  }
}

// Speaking operations
export async function saveSpeakingData(data: any): Promise<void> {
  const fileContent = JSON.stringify(data, null, 2);
  const filePath = "content/speaking.json";
  const commitMessage = "Update speaking and mentoring data";

  // Use GitHub API in production, file system in development
  if (shouldUseGitHub()) {
    await githubAPI.commitFile(filePath, fileContent, commitMessage);
  } else {
    try {
      fs.writeFileSync(SPEAKING_FILE, fileContent, "utf-8");
    } catch (error: any) {
      if (error.code === "EROFS" || error.message.includes("read-only")) {
        throw new Error("EROFS: File system is read-only. Please configure GitHub API for production.");
      }
      throw error;
    }
  }
}
