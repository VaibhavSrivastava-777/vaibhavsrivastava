import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, checkAuth, clearAuthCookie } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, action } = body;

    console.log("Auth API called with action:", action);
    console.log("ADMIN_PASSWORD set:", !!process.env.ADMIN_PASSWORD);

    if (action === "login") {
      try {
        const isValid = await verifyPassword(password);
        console.log("Password valid:", isValid);
        if (isValid) {
          // Create response and set cookie on it
          const response = NextResponse.json({ success: true });
          response.cookies.set("admin-auth", "authenticated", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
          });
          console.log("Auth cookie set");
          return response;
        } else {
          console.log("Invalid password");
          return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
        }
      } catch (error: any) {
        console.error("Auth error:", error);
        return NextResponse.json({ 
          success: false, 
          error: error.message || "Authentication configuration error. Please check ADMIN_PASSWORD environment variable." 
        }, { status: 500 });
      }
    } else if (action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.delete("admin-auth");
      return response;
    } else if (action === "check") {
      const isAuthenticated = await checkAuth();
      return NextResponse.json({ authenticated: isAuthenticated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ 
      error: error.message || "Server error. Please check server logs." 
    }, { status: 500 });
  }
}
