import { NextRequest, NextResponse } from "next/server";
import {
  handleError,
  parsePagination,
  buildPaginatedResponse,
} from "@/lib/api-helpers";
import * as studentService from "@/services/student.service";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const { page, limit } = parsePagination(request);

    const filters: Record<string, unknown> = {};
    const courseName = url.searchParams.get("courseName");
    if (courseName) filters.courseName = courseName;
    const profileStatus = url.searchParams.get("profileStatus");
    if (profileStatus) filters.profileStatus = profileStatus;
    const graduationYear = url.searchParams.get("graduationYear");
    if (graduationYear) filters.graduationYear = parseInt(graduationYear, 10);
    const pcRole = url.searchParams.get("pcRole");
    if (pcRole) filters.pcRole = pcRole;
    const search = url.searchParams.get("search");
    if (search) filters.search = search;

    const sortBy =
      (url.searchParams.get("sortBy") as
        "created_at" | "full_name" | "cgpa" | "graduation_year") ||
      "created_at";
    const order = url.searchParams.get("order") || "desc";
    const ascending = order === "asc";

    const data = await studentService.listStudents(
      filters as Parameters<typeof studentService.listStudents>[0],
      { page, limit, sortBy, ascending },
    );

    const paginated = buildPaginatedResponse(request, data, { page, limit });
    return NextResponse.json(paginated, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const student = await studentService.registerProfile(body);
    return NextResponse.json(
      { message: "Student profile created", data: student },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
