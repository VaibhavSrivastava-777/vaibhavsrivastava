import { cookies } from "next/headers";

const COOKIE_NAME = "admin-auth";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export async function verifyPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is not set. Please create a .env.local file with ADMIN_PASSWORD=your-password");
  }
  return password === adminPassword;
}

export async function setAuthCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  } catch (error) {
    console.error("Error setting cookie:", error);
    throw error;
  }
}

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(COOKIE_NAME);
  return authCookie?.value === "authenticated";
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
