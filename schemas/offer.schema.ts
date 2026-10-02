import { z } from "zod";

export const offerStatusEnum = z.enum(["PENDING", "ACCEPTED", "REJECTED"]);

const dateString = z
  .string()
  .trim()
  .nullable()
  .optional()
  .refine((value) => !value || !isNaN(Date.parse(value)), {
    message: "Invalid date",
  });

export const createOfferSchema = z.object({
  applicationId: z.number().int().positive("Valid application ID is required"),
  roleOffered: z.string().trim().min(1, "Role offered is required"),
  stipend: z.number().int().min(0).nullable().optional(),
  isPpo: z.boolean().optional(),
  internshipDuration: z.number().int().min(1).nullable().optional(),
  joiningDate: dateString,
  offeredOn: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || !isNaN(Date.parse(value)), {
      message: "Invalid date",
    }),
});

export const respondOfferSchema = z.object({
  decision: z.enum(["ACCEPTED", "REJECTED"]),
});

export const updateOfferSchema = z.object({
  roleOffered: z.string().trim().min(1).optional(),
  stipend: z.number().int().min(0).nullable().optional(),
  isPpo: z.boolean().optional(),
  internshipDuration: z.number().int().min(1).nullable().optional(),
  joiningDate: dateString,
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type RespondOfferInput = z.infer<typeof respondOfferSchema>;
export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;
