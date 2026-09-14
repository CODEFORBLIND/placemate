import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const loginData = body;

  // TODO: Validate request body using Zod.
  // TODO: Pass validated data to auth service.

  return NextResponse.json({
    message: "login route",
    data: loginData,
  });
}
