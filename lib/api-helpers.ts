import { NextRequest, NextResponse } from "next/server";
import {
  AppError,
  ValidationError,
  UnauthorizedError,
} from "@/services/errors";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export function handleError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    const body: Record<string, unknown> = {
      error: error.message,
    };
    if (error instanceof ValidationError && error.details) {
      body.details = error.details;
    }
    return NextResponse.json(body, { status: error.statusCode });
  }

  if (error instanceof Error && error.message === "Unauthorized") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.error("Unhandled error:", error);
  const message =
    error instanceof Error ? error.message : "Internal server error";
  return NextResponse.json({ error: message }, { status: 500 });
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export function parsePagination(request: NextRequest): PaginationParams {
  const url = request.nextUrl;
  const pageParam = url.searchParams.get("page");
  const limitParam = url.searchParams.get("limit");

  let page = pageParam ? parseInt(pageParam, 10) : 1;
  let limit = limitParam ? parseInt(limitParam, 10) : 20;

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 20;
  if (limit > 100) limit = 100;

  return { page, limit };
}

export function buildPaginatedResponse<T>(
  request: NextRequest,
  data: T[],
  pagination: PaginationParams,
) {
  const { page, limit } = pagination;
  const url = request.nextUrl;
  const basePath = url.pathname;

  const hasNext = data.length === limit;
  const hasPrev = page > 1;

  const buildUrl = (p: number) => {
    const params = new URLSearchParams(url.searchParams.toString());
    params.set("page", String(p));
    params.set("limit", String(limit));
    return `${basePath}?${params.toString()}`;
  };

  return {
    data,
    pagination: {
      page,
      limit,
      count: data.length,
      hasNext,
      hasPrev,
      nextUrl: hasNext ? buildUrl(page + 1) : null,
      prevUrl: hasPrev ? buildUrl(page - 1) : null,
    },
  };
}

export function parseId(id: string | undefined): number {
  if (!id) throw new ValidationError("ID is required");
  const num = parseInt(id, 10);
  if (isNaN(num) || num <= 0) throw new ValidationError("Invalid ID");
  return num;
}

export function requireAuth(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) throw new UnauthorizedError("Authentication required");
  try {
    return verifyToken(token);
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

export function parseSortParams(
  request: NextRequest,
  allowed: string[],
  defaultSort: string,
): { sortBy: string; ascending: boolean } {
  const sortBy = request.nextUrl.searchParams.get("sortBy") || defaultSort;
  const order = request.nextUrl.searchParams.get("order") || "desc";
  const ascending = order === "asc";
  if (!allowed.includes(sortBy)) {
    throw new ValidationError(`Invalid sortBy. Allowed: ${allowed.join(", ")}`);
  }
  return { sortBy, ascending };
}
