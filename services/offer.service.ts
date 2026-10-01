import * as offerRepo from "@/repositories/offer.repository";
import * as applicationRepo from "@/repositories/application.repository";
import type { Database } from "@/types/database";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
  ForbiddenError,
  validateWithSchema,
} from "./errors";
import {
  createOfferSchema,
  respondOfferSchema,
  updateOfferSchema,
  type CreateOfferInput,
  type RespondOfferInput,
  type UpdateOfferInput,
} from "@/schemas/offer.schema";

export type { CreateOfferInput, RespondOfferInput, UpdateOfferInput };

type Offer = Database["public"]["Tables"]["offers"]["Row"];

export async function getOfferById(id: number): Promise<Offer> {
  const offer = await offerRepo.findById(id);
  if (!offer) {
    throw new NotFoundError("Offer", id);
  }
  return offer;
}

export async function getOfferByApplicationId(
  applicationId: number,
): Promise<Offer> {
  const offer = await offerRepo.findByApplicationId(applicationId);
  if (!offer) {
    throw new NotFoundError("Offer for application", applicationId);
  }
  return offer;
}

export async function getOffersByStudent(
  studentId: number,
  options: Parameters<typeof offerRepo.findByStudentId>[1] = {},
): Promise<Offer[]> {
  return await offerRepo.findByStudentId(studentId, options);
}

export async function createOffer(input: CreateOfferInput): Promise<Offer> {
  const validated = validateWithSchema(createOfferSchema, input);

  const application = await applicationRepo.findById(validated.applicationId);
  if (!application) {
    throw new NotFoundError("Application", validated.applicationId);
  }

  if (application.status === "REJECTED") {
    throw new ValidationError(
      "Cannot issue an offer for a rejected application",
    );
  }

  const existingOffer = await offerRepo.findByApplicationId(
    validated.applicationId,
  );
  if (existingOffer) {
    throw new ConflictError(
      `An offer has already been issued for application ${validated.applicationId}`,
    );
  }

  const offer = await offerRepo.create({
    application_id: validated.applicationId,
    role_offered: validated.roleOffered.trim(),
    stipend: validated.stipend ?? null,
    is_ppo: validated.isPpo ?? false,
    internship_duration: validated.internshipDuration ?? null,
    joining_date: validated.joiningDate ?? null,
    offered_on: validated.offeredOn ?? new Date().toISOString().split("T")[0],
    status: "PENDING",
  });

  await applicationRepo.update(validated.applicationId, {
    status: "OFFERED",
  });

  return offer;
}

export async function respondToOffer(
  offerId: number,
  studentId: number,
  decision: "ACCEPTED" | "REJECTED",
): Promise<Offer> {
  const validated = validateWithSchema(respondOfferSchema, { decision });
  const offer = await getOfferById(offerId);

  if (offer.status !== "PENDING") {
    throw new ValidationError(
      `Cannot respond to offer with status '${offer.status}'. Only PENDING offers can be responded to.`,
    );
  }

  const application = await applicationRepo.findById(offer.application_id);
  if (!application) {
    throw new NotFoundError("Application", offer.application_id);
  }

  if (application.student_id !== studentId) {
    throw new ForbiddenError("You are not authorized to respond to this offer");
  }

  const updatedOffer = await offerRepo.update(offerId, {
    status: validated.decision,
  });

  await applicationRepo.update(offer.application_id, {
    remark: `Offer ${validated.decision.toLowerCase()} by candidate`,
  });

  return updatedOffer;
}

export async function updateOfferDetails(
  id: number,
  input: UpdateOfferInput,
): Promise<Offer> {
  const current = await getOfferById(id);
  const validated = validateWithSchema(updateOfferSchema, input);

  if (validated.status !== undefined && validated.status !== current.status) {
    throw new ValidationError(
      `Cannot change offer status via this endpoint. Use /respond for ACCEPTED/REJECTED transitions.`,
    );
  }

  const updateData: Parameters<typeof offerRepo.update>[1] = {};

  if (validated.roleOffered !== undefined) {
    updateData.role_offered = validated.roleOffered.trim();
  }
  if (validated.stipend !== undefined) updateData.stipend = validated.stipend;
  if (validated.isPpo !== undefined) updateData.is_ppo = validated.isPpo;
  if (validated.internshipDuration !== undefined) {
    updateData.internship_duration = validated.internshipDuration;
  }
  if (validated.joiningDate !== undefined) {
    updateData.joining_date = validated.joiningDate;
  }

  if (Object.keys(updateData).length === 0) {
    return current;
  }

  return await offerRepo.update(id, updateData);
}
