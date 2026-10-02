import * as companyRepo from "@/repositories/company.repository";
import * as jobRepo from "@/repositories/job.repository";
import type {
  Company,
  CompanyFilters,
} from "@/repositories/company.repository";
import type { Job } from "@/repositories/job.repository";
import { NotFoundError, validate } from "./errors";
import {
  createCompanySchema,
  updateCompanySchema,
  type CreateCompanyInput,
  type UpdateCompanyInput,
} from "@/schemas/company.schema";

export type { CreateCompanyInput, UpdateCompanyInput };
export type { Company };

export async function getById(id: number): Promise<Company> {
  const company = await companyRepo.findById(id);
  if (!company) throw new NotFoundError("Company", id);
  return company;
}

export async function list(
  filters: CompanyFilters = {},
  page = 1,
  limit = 20,
): Promise<Company[]> {
  return companyRepo.findMany(filters, page, limit);
}

export async function create(input: CreateCompanyInput): Promise<Company> {
  const data = validate(createCompanySchema, input);
  return companyRepo.create({
    name: data.name,
    location: data.location ?? null,
    contact_email: data.contactEmail ?? null,
    contact_no: data.contactNo ?? null,
    website: data.website ?? null,
    is_hiring: data.isHiring ?? true,
    industry: data.industry ?? null,
    description: data.description ?? null,
  });
}

export async function update(
  id: number,
  input: UpdateCompanyInput,
): Promise<Company> {
  await getById(id);
  const data = validate(updateCompanySchema, input);
  return companyRepo.update(id, {
    name: data.name,
    location: data.location,
    contact_email: data.contactEmail,
    contact_no: data.contactNo,
    website: data.website,
    is_hiring: data.isHiring,
    industry: data.industry,
    description: data.description,
  });
}

export async function setHiring(
  id: number,
  isHiring: boolean,
): Promise<Company> {
  await getById(id);
  return companyRepo.update(id, { is_hiring: isHiring });
}

export async function getJobs(
  companyId: number,
  page = 1,
  limit = 20,
): Promise<Job[]> {
  await getById(companyId);
  return jobRepo.findByCompanyId(companyId, page, limit);
}

export async function remove(id: number): Promise<void> {
  await getById(id);
  await companyRepo.remove(id);
}
