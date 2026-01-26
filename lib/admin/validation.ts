export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export function validateSlug(slug: string): boolean {
  // Only allow alphanumeric, hyphens, and underscores
  return /^[a-z0-9-]+$/.test(slug);
}

export function sanitizePath(path: string): string {
  // Remove any path traversal attempts
  return path.replace(/\.\./g, "").replace(/[^a-zA-Z0-9._-]/g, "");
}

export interface BlogPostData {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  slug?: string;
}

export function validateBlogPost(data: BlogPostData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push("Title is required");
  }

  if (!data.date || !isValidDate(data.date)) {
    errors.push("Valid date is required");
  }

  const validCategories = ["Product Strategy", "AI Adoption", "Growth Leadership"];
  if (!data.category || !validCategories.includes(data.category)) {
    errors.push(`Category must be one of: ${validCategories.join(", ")}`);
  }

  if (!data.excerpt || data.excerpt.trim().length === 0) {
    errors.push("Excerpt is required");
  }

  if (!data.content || data.content.trim().length === 0) {
    errors.push("Content is required");
  }

  if (data.slug && !validateSlug(data.slug)) {
    errors.push("Invalid slug format");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export interface PortfolioItemData {
  name: string;
  impact: string;
  category: string;
  date: string;
  description: string;
  techStack: string[];
  githubUrl?: string | null;
  star: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  slug?: string;
}

export function validatePortfolioItem(data: PortfolioItemData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push("Project name is required");
  }

  if (!data.impact || data.impact.trim().length === 0) {
    errors.push("Impact description is required");
  }

  if (!data.date || !isValidDate(data.date)) {
    errors.push("Valid date is required");
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push("Description is required");
  }

  if (!data.techStack || data.techStack.length === 0) {
    errors.push("At least one tech stack item is required");
  }

  if (!data.star.situation || data.star.situation.trim().length === 0) {
    errors.push("STAR Situation is required");
  }

  if (!data.star.task || data.star.task.trim().length === 0) {
    errors.push("STAR Task is required");
  }

  if (!data.star.action || data.star.action.trim().length === 0) {
    errors.push("STAR Action is required");
  }

  if (!data.star.result || data.star.result.trim().length === 0) {
    errors.push("STAR Result is required");
  }

  if (data.slug && !validateSlug(data.slug)) {
    errors.push("Invalid slug format");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
