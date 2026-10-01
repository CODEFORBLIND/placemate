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

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  console.error("Unhandled error:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export function parsePagination(request: NextRequest): PaginationParams {
  const url = request.nextUrl;
  const pageParam = url.searchParams.get("page");
  const limitParam = url.searchParams.get("limit");

  let page = 1;
  let limit = 20;

  if (pageParam !== null) {
    if (!/^\d+$/.test(pageParam.trim()))
      throw new ValidationError("Invalid page parameter");
    page = Number(pageParam);
  }
  if (limitParam !== null) {
    if (!/^\d+$/.test(limitParam.trim()))
      throw new ValidationError("Invalid limit parameter");
    limit = Number(limitParam);
  }

  if (page < 1) throw new ValidationError("page must be >= 1");
  if (limit < 1 || limit > 100)
    throw new ValidationError("limit must be between 1 and 100");

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
  const trimmed = id.trim();
  if (!/^\d+$/.test(trimmed)) throw new ValidationError("Invalid ID");
  const num = Number(trimmed);
  if (!Number.isInteger(num) || num <= 0)
    throw new ValidationError("Invalid ID");
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
  const orderParam = request.nextUrl.searchParams.get("order") || "desc";
  const order = orderParam.toLowerCase();
  if (!["asc", "desc"].includes(order)) {
    throw new ValidationError(`Invalid order. Allowed: asc, desc`);
  }
  const ascending = order === "asc";
  if (!allowed.includes(sortBy)) {
    throw new ValidationError(`Invalid sortBy. Allowed: ${allowed.join(", ")}`);
  }
  return { sortBy, ascending };
}
