import { NextRequest, NextResponse } from "next/server";
import { AppError, ValidationError } from "@/services/errors";

export function handleError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    const body: Record<string, unknown> = { error: error.message };
    if (error instanceof ValidationError && error.details)
      body.details = error.details;
    return NextResponse.json(body, { status: error.statusCode });
  }
  if (error instanceof SyntaxError)
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  console.error(error);
  return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
}

export function ok(data: unknown, message?: string): NextResponse {
  if (message) return NextResponse.json({ message, data }, { status: 200 });
  return NextResponse.json({ data }, { status: 200 });
}

export function created(data: unknown, message: string): NextResponse {
  return NextResponse.json({ message, data }, { status: 201 });
}

export function getPage(request: NextRequest): { page: number; limit: number } {
  const page = Number(request.nextUrl.searchParams.get("page") || 1);
  const limit = Number(request.nextUrl.searchParams.get("limit") || 20);
  if (!Number.isInteger(page) || page < 1)
    throw new ValidationError("page must be a positive number");
  if (!Number.isInteger(limit) || limit < 1 || limit > 100)
    throw new ValidationError("limit must be between 1 and 100");
  return { page, limit };
}

export function getNumber(
  request: NextRequest,
  name: string,
): number | undefined {
  const raw = request.nextUrl.searchParams.get(name);
  if (raw === null || raw === "") return undefined;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0)
    throw new ValidationError(`${name} must be a positive number`);
  return value;
}

export function getText(
  request: NextRequest,
  name: string,
): string | undefined {
  const raw = request.nextUrl.searchParams.get(name);
  if (raw === null || raw.trim() === "") return undefined;
  return raw.trim();
}

export function getFlag(
  request: NextRequest,
  name: string,
): boolean | undefined {
  const raw = request.nextUrl.searchParams.get(name);
  if (raw === null || raw === "") return undefined;
  if (raw !== "true" && raw !== "false")
    throw new ValidationError(`${name} must be true or false`);
  return raw === "true";
}

export function getEnum<T extends string>(
  request: NextRequest,
  name: string,
  allowed: T[],
): T | undefined {
  const raw = request.nextUrl.searchParams.get(name);
  if (raw === null || raw === "") return undefined;
  if (!allowed.includes(raw as T))
    throw new ValidationError(`${name} must be one of ${allowed.join(", ")}`);
  return raw as T;
}

export async function routeId(
  params: Promise<{ id: string }>,
): Promise<number> {
  const { id } = await params;
  const value = Number(id);
  if (!Number.isInteger(value) || value <= 0)
    throw new ValidationError("Invalid id in URL");
  return value;
}
