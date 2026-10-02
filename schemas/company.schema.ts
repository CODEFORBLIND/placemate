import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().trim().min(1, "Company name is required"),
  location: z.string().trim().nullable().optional(),
  contactEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .nullable()
    .optional(),
  contactNo: z.string().trim().nullable().optional(),
  website: z.string().trim().nullable().optional(),
  isHiring: z.boolean().optional(),
  industry: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().trim().min(1).optional(),
  location: z.string().trim().nullable().optional(),
  contactEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .nullable()
    .optional(),
  contactNo: z.string().trim().nullable().optional(),
  website: z.string().trim().nullable().optional(),
  isHiring: z.boolean().optional(),
  industry: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
