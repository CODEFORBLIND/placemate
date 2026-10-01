import { NextRequest, NextResponse } from "next/server";
import {
  handleError,
  parsePagination,
  buildPaginatedResponse,
  parseSortParams,
} from "@/lib/api-helpers";
import * as studentService from "@/services/student.service";
import { ValidationError } from "@/services/errors";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const { page, limit } = parsePagination(request);

    const filters: Record<string, unknown> = {};
    const courseName = url.searchParams.get("courseName");
    if (courseName) {
      if (!["MCA", "MSC"].includes(courseName))
        throw new ValidationError("Invalid courseName. Allowed: MCA, MSC");
      filters.courseName = courseName;
    }
    const profileStatus = url.searchParams.get("profileStatus");
    if (profileStatus) {
      if (!["DRAFT", "PENDING_APPROVAL", "APPROVED"].includes(profileStatus))
        throw new ValidationError("Invalid profileStatus");
      filters.profileStatus = profileStatus;
    }
    const graduationYear = url.searchParams.get("graduationYear");
    if (graduationYear) {
      if (!/^\d+$/.test(graduationYear.trim()))
        throw new ValidationError("Invalid graduationYear");
      const gy = Number(graduationYear);
      if (gy < 2000 || gy > 2100)
        throw new ValidationError("graduationYear out of range");
      filters.graduationYear = gy;
    }
    const pcRole = url.searchParams.get("pcRole");
    if (pcRole) {
      if (!["MEMBER", "COORDINATOR"].includes(pcRole))
        throw new ValidationError("Invalid pcRole");
      filters.pcRole = pcRole;
    }
    const search = url.searchParams.get("search");
    if (search && search.trim()) filters.search = search.trim();

    const { sortBy, ascending } = parseSortParams(
      request,
      ["created_at", "full_name", "cgpa", "graduation_year"],
      "created_at",
    );

    const data = await studentService.listStudents(
      filters as Parameters<typeof studentService.listStudents>[0],
      {
        page,
        limit,
        sortBy: sortBy as
          "created_at" | "full_name" | "cgpa" | "graduation_year",
        ascending,
      },
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
