import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const COOKIE = "placemate_token";
const SEVEN_DAYS = 60 * 60 * 24 * 7;

export type TokenData = {
  userId: number;
  email: string;
};

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(data: TokenData): string {
  return jwt.sign(data, SECRET, { expiresIn: "7d" });
}

export function readToken(token: string): TokenData | null {
  try {
    const data = jwt.verify(token, SECRET) as TokenData;
    if (typeof data.userId !== "number" || typeof data.email !== "string")
      return null;
    return { userId: data.userId, email: data.email };
  } catch {
    return null;
  }
}

export function tokenFromRequest(request: NextRequest): string | null {
  const fromCookie = request.cookies.get(COOKIE)?.value;
  if (fromCookie) return fromCookie;
  const header = request.headers.get("authorization");
  if (!header) return null;
  const parts = header.split(" ");
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer")
    return parts[1];
  return null;
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export const AUTH_COOKIE = COOKIE;
