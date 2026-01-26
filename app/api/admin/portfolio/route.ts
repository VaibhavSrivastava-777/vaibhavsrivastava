import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin/auth";
import {
  getPortfolioData,
  getPortfolioItem,
  savePortfolioItem,
  deletePortfolioItem,
} from "@/lib/admin/file-operations";
import { validatePortfolioItem, generateSlug } from "@/lib/admin/validation";

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const item = getPortfolioItem(slug);
      if (!item) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }
      return NextResponse.json(item);
    }

    const data = getPortfolioData();
    return NextResponse.json({ projects: data.projects });
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
    const slug = body.slug || generateSlug(body.name);

    const item = {
      slug,
      name: body.name,
      impact: body.impact,
      techStack: Array.isArray(body.techStack) ? body.techStack : body.techStack.split(",").map((t: string) => t.trim()).filter(Boolean),
      githubUrl: body.githubUrl || null,
      category: body.category,
      date: body.date,
      description: body.description,
      star: {
        situation: body.star.situation,
        task: body.star.task,
        action: body.star.action,
        result: body.star.result,
      },
    };

    const validation = validatePortfolioItem(item);
    if (!validation.valid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    savePortfolioItem(item);

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

    const item = {
      slug,
      name: body.name,
      impact: body.impact,
      techStack: Array.isArray(body.techStack) ? body.techStack : body.techStack.split(",").map((t: string) => t.trim()).filter(Boolean),
      githubUrl: body.githubUrl || null,
      category: body.category,
      date: body.date,
      description: body.description,
      star: {
        situation: body.star.situation,
        task: body.star.task,
        action: body.star.action,
        result: body.star.result,
      },
    };

    const validation = validatePortfolioItem(item);
    if (!validation.valid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    savePortfolioItem(item);

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

    deletePortfolioItem(slug);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
