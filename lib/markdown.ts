import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  content: string;
  readingTime?: number;
}

export function getAllBlogPosts(): BlogPost[] {
  try {
    const blogDir = path.join(process.cwd(), "content", "blog");
    if (!fs.existsSync(blogDir)) {
      return [];
    }
    
    const files = fs.readdirSync(blogDir).filter((file) => file.endsWith(".md"));
    
    const posts = files.map((file) => {
      const filePath = path.join(blogDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      
      return {
        slug: file.replace(".md", ""),
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || "",
        category: data.category || "General",
        content: content,
        readingTime: calculateReadingTime(content),
      };
    });
    
    // Sort by date, newest first
    return posts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(process.cwd(), "content", "blog", `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();
    
    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || "",
      category: data.category || "General",
      content: contentHtml,
      readingTime: calculateReadingTime(content),
    };
  } catch (error) {
    return null;
  }
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
