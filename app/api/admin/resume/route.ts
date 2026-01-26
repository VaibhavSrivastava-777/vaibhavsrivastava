import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin/auth";
import { saveResumeData } from "@/lib/admin/file-operations";
import fs from "fs";
import path from "path";

const RESUME_FILE = path.join(process.cwd(), "content", "resume.json");

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fileContent = fs.readFileSync(RESUME_FILE, "utf-8");
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.executiveSummary || body.executiveSummary.trim().length === 0) {
      return NextResponse.json({ error: "Executive summary is required" }, { status: 400 });
    }

    if (!body.experience || !Array.isArray(body.experience) || body.experience.length === 0) {
      return NextResponse.json({ error: "At least one experience entry is required" }, { status: 400 });
    }

    if (!body.skills) {
      return NextResponse.json({ error: "Skills are required" }, { status: 400 });
    }

    const resumeData = {
      executiveSummary: body.executiveSummary,
      experience: body.experience,
      skills: body.skills,
      education: body.education || [],
    };

    try {
      await saveResumeData(resumeData);
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error("Resume update error:", error);
      if (error.message.includes("GitHub API not configured")) {
        return NextResponse.json({ 
          error: "GitHub API not configured. Please set GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN environment variables.",
          readOnly: true
        }, { status: 503 });
      }
      return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Resume update error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
