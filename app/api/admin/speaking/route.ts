import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin/auth";
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

    // Check if we're in a read-only environment (Vercel production)
    if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
      // In production, we can't write to the file system
      return NextResponse.json({ 
        error: "File system is read-only in production. Please update files via git and redeploy, or use the development server for testing.",
        readOnly: true
      }, { status: 503 });
    }

    const body = await request.json();
    
    const speakingData = {
      engagements: body.engagements || [],
      mentoring: body.mentoring || {
        areas: [],
        testimonials: [],
      },
    };

    try {
      fs.writeFileSync(SPEAKING_FILE, JSON.stringify(speakingData, null, 2), "utf-8");
      return NextResponse.json({ success: true });
    } catch (writeError: any) {
      if (writeError.code === "EROFS" || writeError.message.includes("read-only")) {
        return NextResponse.json({ 
          error: "File system is read-only. This feature works in development mode. For production, please update files via git and redeploy.",
          readOnly: true
        }, { status: 503 });
      }
      throw writeError;
    }
  } catch (error: any) {
    console.error("Speaking update error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
