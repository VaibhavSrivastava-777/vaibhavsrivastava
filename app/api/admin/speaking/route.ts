import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin/auth";
import { saveSpeakingData } from "@/lib/admin/file-operations";
import fs from "fs";
import path from "path";

const SPEAKING_FILE = path.join(process.cwd(), "content", "speaking.json");

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fileContent = fs.readFileSync(SPEAKING_FILE, "utf-8");
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
    
    const speakingData = {
      engagements: [], // Keep empty array for backward compatibility
      mentoring: body.mentoring || {
        areas: [],
        testimonials: [],
      },
    };

    try {
      await saveSpeakingData(speakingData);
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error("Speaking update error:", error);
      if (error.message.includes("GitHub API not configured")) {
        return NextResponse.json({ 
          error: "GitHub API not configured. Please set GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN environment variables.",
          readOnly: true
        }, { status: 503 });
      }
      return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Speaking update error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
