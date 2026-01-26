import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, setAuthCookie, checkAuth, clearAuthCookie } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  try {
    const { password, action } = await request.json();

    if (action === "login") {
      const isValid = await verifyPassword(password);
      if (isValid) {
        await setAuthCookie();
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
      }
    } else if (action === "logout") {
      await clearAuthCookie();
      return NextResponse.json({ success: true });
    } else if (action === "check") {
      const isAuthenticated = await checkAuth();
      return NextResponse.json({ authenticated: isAuthenticated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
