import { NextRequest } from "next/server";
import { studentService } from "@/services";
import {
  handleError,
  ok,
  created,
  getPage,
  getText,
  getNumber,
  getEnum,
} from "@/lib/api-helpers";
import { getSession, requirePc } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    requirePc(session);
    const { page, limit } = getPage(request);
    const students = await studentService.list(
      {
        courseName: getEnum(request, "courseName", ["MCA", "MSC"]),
        profileStatus: getEnum(request, "profileStatus", [
          "DRAFT",
          "PENDING_APPROVAL",
          "APPROVED",
        ]),
        graduationYear: getNumber(request, "graduationYear"),
        pcRole: getEnum(request, "pcRole", ["MEMBER", "COORDINATOR"]),
        search: getText(request, "search"),
      },
      page,
      limit,
    );
    return ok(students);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    const body = await request.json();
    const student = await studentService.createProfile(session.user.id, body);
    return created(
      student,
      "Profile created, complete it and submit for approval",
    );
  } catch (error) {
    return handleError(error);
  }
}
