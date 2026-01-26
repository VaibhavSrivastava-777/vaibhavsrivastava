import fs from "fs";
import path from "path";

// Server-only utility functions

export function getLatestBlogPost() {
  try {
    const blogDir = path.join(process.cwd(), "content", "blog");
    if (!fs.existsSync(blogDir)) {
      return null;
    }
    
    const files = fs.readdirSync(blogDir).filter((file) => file.endsWith(".md"));
    if (files.length === 0) {
      return null;
    }
    
    // Sort by filename (assuming date prefix) and get latest
    const sortedFiles = files.sort().reverse();
    const latestFile = sortedFiles[0];
    const filePath = path.join(blogDir, latestFile);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    
    // Simple frontmatter parsing (basic implementation)
    const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const titleMatch = frontmatter.match(/title:\s*(.+)/);
      const excerptMatch = frontmatter.match(/excerpt:\s*(.+)/);
      
      return {
        slug: latestFile.replace(".md", ""),
        title: titleMatch ? titleMatch[1].replace(/['"]/g, "") : "Untitled",
        excerpt: excerptMatch ? excerptMatch[1].replace(/['"]/g, "") : "",
      };
    }
    
    return {
      slug: latestFile.replace(".md", ""),
      title: "Latest Post",
      excerpt: "",
    };
  } catch (error) {
    return null;
  }
}

export function getLatestSpeakingEngagement() {
  try {
    const speakingPath = path.join(process.cwd(), "content", "speaking.json");
    if (!fs.existsSync(speakingPath)) {
      return null;
    }
    
    const data = JSON.parse(fs.readFileSync(speakingPath, "utf-8"));
    if (data.engagements && data.engagements.length > 0) {
      // Sort by date and get latest
      const sorted = [...data.engagements].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return sorted[0];
    }
    return null;
  } catch (error) {
    return null;
  }
}

