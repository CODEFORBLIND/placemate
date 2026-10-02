import * as offerRepo from "@/repositories/offer.repository";
import * as applicationRepo from "@/repositories/application.repository";
import type { Offer } from "@/repositories/offer.repository";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
  ForbiddenError,
  validate,
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
export type { Offer };

export async function getById(id: number): Promise<Offer> {
  const offer = await offerRepo.findById(id);
  if (!offer) throw new NotFoundError("Offer", id);
  return offer;
}

export async function getByApplication(applicationId: number): Promise<Offer> {
  const offer = await offerRepo.findByApplicationId(applicationId);
  if (!offer) throw new NotFoundError("Offer for application", applicationId);
  return offer;
}

export async function listByStudent(
  studentId: number,
  page = 1,
  limit = 20,
): Promise<Offer[]> {
  return offerRepo.findByStudentId(studentId, page, limit);
}

export async function list(page = 1, limit = 20): Promise<Offer[]> {
  return offerRepo.findMany(page, limit);
}

export async function create(input: CreateOfferInput): Promise<Offer> {
  const data = validate(createOfferSchema, input);
  const application = await applicationRepo.findById(data.applicationId);
  if (!application) throw new NotFoundError("Application", data.applicationId);
  if (application.status === "REJECTED")
    throw new ValidationError("Cannot offer a rejected application");
  const existing = await offerRepo.findByApplicationId(data.applicationId);
  if (existing)
    throw new ConflictError("Offer already exists for this application");
  const offer = await offerRepo.create({
    application_id: data.applicationId,
    role_offered: data.roleOffered,
    stipend: data.stipend ?? null,
    is_ppo: data.isPpo ?? false,
    internship_duration: data.internshipDuration ?? null,
    joining_date: data.joiningDate ?? null,
    offered_on: data.offeredOn ?? new Date().toISOString().split("T")[0],
    status: "PENDING",
  });
  await applicationRepo.update(data.applicationId, { status: "OFFERED" });
  return offer;
}

export async function respond(
  id: number,
  studentId: number,
  decision: "ACCEPTED" | "REJECTED",
): Promise<Offer> {
  const data = validate(respondOfferSchema, { decision });
  const offer = await getById(id);
  if (offer.status !== "PENDING")
    throw new ValidationError("This offer is already answered");
  const application = await applicationRepo.findById(offer.application_id);
  if (!application)
    throw new NotFoundError("Application", offer.application_id);
  if (application.student_id !== studentId)
    throw new ForbiddenError("This offer is not yours");
  const updated = await offerRepo.update(id, { status: data.decision });
  await applicationRepo.update(offer.application_id, {
    remark: `Offer ${data.decision.toLowerCase()} by student`,
  });
  return updated;
}

export async function updateDetails(
  id: number,
  input: UpdateOfferInput,
): Promise<Offer> {
  const current = await getById(id);
  const data = validate(updateOfferSchema, input);
  if (current.status !== "PENDING")
    throw new ValidationError("Only pending offers can be edited");
  return offerRepo.update(id, {
    role_offered: data.roleOffered,
    stipend: data.stipend,
    is_ppo: data.isPpo,
    internship_duration: data.internshipDuration,
    joining_date: data.joiningDate,
  });
}

export async function remove(id: number): Promise<void> {
  await getById(id);
  await offerRepo.remove(id);
}
