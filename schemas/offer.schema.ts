import { z } from "zod";

export const offerStatusEnum = z.enum(["PENDING", "ACCEPTED", "REJECTED"], {
  message: "Offer status must be PENDING, ACCEPTED, or REJECTED",
});

export const createOfferSchema = z.object({
  applicationId: z
    .number()
    .int()
    .positive({ message: "Valid application ID is required" }),
  roleOffered: z
    .string()
    .trim()
    .min(1, { message: "Role offered is required" }),
  stipend: z
    .number()
    .int()
    .min(0, { message: "Stipend cannot be negative" })
    .nullable()
    .optional(),
  isPpo: z.boolean().default(false).optional(),
  internshipDuration: z
    .number()
    .int()
    .min(1, { message: "Internship duration must be greater than zero" })
    .nullable()
    .optional(),
  joiningDate: z
    .string()
    .trim()
    .nullable()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid joiningDate",
    }),
  offeredOn: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid offeredOn date",
    }),
});

export const respondOfferSchema = z.object({
  decision: z.enum(["ACCEPTED", "REJECTED"], {
    message: "Decision must be either ACCEPTED or REJECTED",
  }),
});

export const updateOfferSchema = z.object({
  roleOffered: z
    .string()
    .trim()
    .min(1, { message: "Role offered cannot be empty" })
    .optional(),
  stipend: z
    .number()
    .int()
    .min(0, { message: "Stipend cannot be negative" })
    .nullable()
    .optional(),
  isPpo: z.boolean().optional(),
  internshipDuration: z
    .number()
    .int()
    .min(1, { message: "Internship duration must be greater than zero" })
    .nullable()
    .optional(),
  joiningDate: z
    .string()
    .trim()
    .nullable()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid joiningDate",
    }),
  status: offerStatusEnum.optional(),
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type RespondOfferInput = z.infer<typeof respondOfferSchema>;
export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;
