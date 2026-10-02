import { z } from "zod";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: number) {
    super(
      id === undefined
        ? `${resource} not found`
        : `${resource} ${id} not found`,
      404,
    );
  }
}

export class ValidationError extends AppError {
  details?: Record<string, string[]>;

  constructor(message: string, details?: Record<string, string[]>) {
    super(message, 400);
    this.details = details;
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You are not allowed to do this") {
    super(message, 403);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Please log in first") {
    super(message, 401);
  }
}

export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const details: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".") || "body";
      if (!details[key]) details[key] = [];
      details[key].push(issue.message);
    }
    const first = result.error.issues[0]?.message || "Invalid input";
    throw new ValidationError(first, details);
  }
  return result.data;
}
