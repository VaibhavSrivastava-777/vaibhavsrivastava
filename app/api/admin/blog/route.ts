import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin/auth";
import {
  getAllBlogFiles,
  getBlogPostContent,
  saveBlogPost,
  deleteBlogPost,
} from "@/lib/admin/file-operations";
import { validateBlogPost, generateSlug } from "@/lib/admin/validation";

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const post = getBlogPostContent(slug);
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      return NextResponse.json({
        slug,
        ...post.data,
        content: post.content,
      });
    }

    const files = getAllBlogFiles();
    const posts = files.map((file) => {
      const slug = file.replace(".md", "");
      const post = getBlogPostContent(slug);
      return {
        slug,
        title: post?.data.title || "Untitled",
        date: post?.data.date || "",
        category: post?.data.category || "",
        excerpt: post?.data.excerpt || "",
      };
    });

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const slug = body.slug || generateSlug(body.title);

    const validation = validateBlogPost({ ...body, slug });
    if (!validation.valid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    const frontmatter = {
      title: body.title,
      date: body.date,
      category: body.category,
      excerpt: body.excerpt,
    };

    saveBlogPost(slug, frontmatter, body.content);

    return NextResponse.json({ success: true, slug });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const validation = validateBlogPost(body);
    if (!validation.valid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    const frontmatter = {
      title: body.title,
      date: body.date,
      category: body.category,
      excerpt: body.excerpt,
    };

    saveBlogPost(slug, frontmatter, body.content);

    return NextResponse.json({ success: true, slug });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    deleteBlogPost(slug);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
