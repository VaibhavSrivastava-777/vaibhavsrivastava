import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const owner = process.env.GITHUB_OWNER || "";
    const repo = process.env.GITHUB_REPO || "";
    const token = process.env.GITHUB_TOKEN || "";

    if (!owner || !repo || !token) {
      return NextResponse.json({
        configured: false,
        error:
          "GitHub API not configured. Set GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN in Vercel environment variables. See GITHUB_API_SETUP.md for instructions.",
      });
    }

    // Test repository access
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "vaibhavsrivastava-admin-panel",
        },
      }
    );

    if (response.ok) {
      return NextResponse.json({
        configured: true,
        message: "GitHub API connected. Blog saves will work in production.",
      });
    }

    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message || `GitHub API returned ${response.status}`;

    let actionableError = errorMessage;
    if (response.status === 404) {
      actionableError =
        "Repository not found. Check GITHUB_OWNER and GITHUB_REPO are correct. Token may not have access.";
    } else if (response.status === 401 || response.status === 403) {
      actionableError =
        "Invalid or expired token. Generate a new token at github.com/settings/tokens with repo scope.";
    }

    return NextResponse.json({
      configured: false,
      error: actionableError,
    });
  } catch (error: any) {
    return NextResponse.json({
      configured: false,
      error: error.message || "Failed to verify GitHub API",
    });
  }
}
