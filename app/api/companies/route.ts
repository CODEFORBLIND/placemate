import { NextRequest } from "next/server";
import { companyService } from "@/services";
import {
  handleError,
  ok,
  created,
  getPage,
  getText,
  getFlag,
} from "@/lib/api-helpers";
import { getSession, requirePc, requireApproved } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    requireApproved(session);
    const { page, limit } = getPage(request);
    const companies = await companyService.list(
      {
        name: getText(request, "name"),
        location: getText(request, "location"),
        industry: getText(request, "industry"),
        isHiring: getFlag(request, "isHiring"),
      },
      page,
      limit,
    );
    return ok(companies);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    requirePc(session);
    const body = await request.json();
    const company = await companyService.create(body);
    return created(company, "Company created");
  } catch (error) {
    return handleError(error);
  }
}
