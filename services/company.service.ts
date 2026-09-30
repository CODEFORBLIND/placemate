import * as companyRepo from "@/repositories/company.repository";
import * as jobRepo from "@/repositories/job.repository";
import type { Database } from "@/types/database";
import { NotFoundError, validateWithSchema } from "./errors";
import {
  createCompanySchema,
  updateCompanySchema,
  type CreateCompanyInput,
  type UpdateCompanyInput,
} from "@/schemas/company.schema";

export type { CreateCompanyInput, UpdateCompanyInput };

type Company = Database["public"]["Tables"]["companies"]["Row"];
type Job = Database["public"]["Tables"]["jobs"]["Row"];

export async function getCompanyById(id: number): Promise<Company> {
  const company = await companyRepo.findById(id);
  if (!company) {
    throw new NotFoundError("Company", id);
  }
  return company;
}

export async function searchCompanies(
  filters: Parameters<typeof companyRepo.findMany>[0] = {},
  options: Parameters<typeof companyRepo.findMany>[1] = {},
): Promise<Company[]> {
  return await companyRepo.findMany(filters, options);
}

export async function searchCompaniesByName(name: string): Promise<Company[]> {
  if (!name || name.trim().length === 0) {
    return [];
  }
  return await companyRepo.findByName(name.trim());
}

export async function createCompany(
  input: CreateCompanyInput,
): Promise<Company> {
  const validated = validateWithSchema(createCompanySchema, input);

  return await companyRepo.create({
    name: validated.name.trim(),
    location: validated.location ?? null,
    contact_email: validated.contactEmail?.trim().toLowerCase() ?? null,
    contact_no: validated.contactNo ?? null,
    website: validated.website ?? null,
    is_hiring: validated.isHiring ?? true,
    industry: validated.industry ?? null,
    description: validated.description ?? null,
  });
}

export async function updateCompany(
  id: number,
  input: UpdateCompanyInput,
): Promise<Company> {
  await getCompanyById(id);
  const validated = validateWithSchema(updateCompanySchema, input);

  const updateData: Parameters<typeof companyRepo.update>[1] = {};

  if (validated.name !== undefined) updateData.name = validated.name.trim();
  if (validated.contactEmail !== undefined) {
    updateData.contact_email =
      validated.contactEmail !== null
        ? validated.contactEmail.trim().toLowerCase()
        : null;
  }
  if (validated.location !== undefined) updateData.location = validated.location;
  if (validated.contactNo !== undefined) updateData.contact_no = validated.contactNo;
  if (validated.website !== undefined) updateData.website = validated.website;
  if (validated.isHiring !== undefined) updateData.is_hiring = validated.isHiring;
  if (validated.industry !== undefined) updateData.industry = validated.industry;
  if (validated.description !== undefined) updateData.description = validated.description;

  return await companyRepo.update(id, updateData);
}

export async function setHiringStatus(
  id: number,
  isHiring: boolean,
): Promise<Company> {
  await getCompanyById(id);
  return await companyRepo.update(id, { is_hiring: isHiring });
}

export async function getCompanyJobs(
  companyId: number,
  options: Parameters<typeof jobRepo.findByCompanyId>[1] = {},
): Promise<Job[]> {
  await getCompanyById(companyId);
  return await jobRepo.findByCompanyId(companyId, options);
}
