import { z } from "zod";
import { REQUEST_STATUSES, CONTACT_STATUSES } from "./constants";

// FormData.get() returns string | null; treat null (absent field) as undefined
// so optional fields don't fail validation.
const nullToUndef = (v: unknown) => (v === null || v === undefined ? undefined : v);

const optionalText = (max: number) =>
  z.preprocess(nullToUndef, z.string().max(max).optional());
const optionalUrl = () =>
  z.preprocess(nullToUndef, z.string().url().optional().or(z.literal("")));
const optionalEmail = () =>
  z.preprocess(nullToUndef, z.string().email().optional().or(z.literal("")));

// --- Client project request ---
export const projectRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(80),
  lastName: z.string().min(1, "Last name is required").max(80),
  company: optionalText(120),
  email: z.string().email("A valid email is required"),
  phone: optionalText(40),
  contentType: optionalText(80),
  description: z.string().min(10, "Please tell us a bit more (min 10 characters)").max(4000),
  budget: optionalText(80),
  preferredDate: optionalText(40),
  preferredTime: optionalText(40),
  location: optionalText(160),
  creatorsCount: z.preprocess(
    (v) => (v === null || v === undefined || v === "" ? undefined : v),
    z.coerce.number().int().min(0).max(50).optional()
  ),
  message: optionalText(4000),
  creatorIds: z.array(z.string()).default([]),
});

export type ProjectRequestInput = z.infer<typeof projectRequestSchema>;

// --- Contact message ---
export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("A valid email is required"),
  company: optionalText(120),
  phone: optionalText(40),
  subject: optionalText(160),
  message: z.string().min(5, "Please write a short message").max(4000),
});

export type ContactInput = z.infer<typeof contactSchema>;

// --- Admin: creator upsert ---
export const creatorSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  displayName: z.string().min(1).max(120),
  slug: optionalText(140),
  profession: z.string().min(1).max(120),
  headline: optionalText(200),
  bio: optionalText(6000),
  location: z.string().min(1).max(160),
  city: optionalText(120),
  country: optionalText(120),
  // Accept both full URLs and local upload paths like "/uploads/x.jpg"
  avatarUrl: optionalText(500),
  coverUrl: optionalText(500),
  email: optionalEmail(),
  phone: optionalText(40),
  instagram: optionalText(200),
  tiktok: optionalText(200),
  youtube: optionalText(200),
  website: optionalText(200),
  languages: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  specialties: z.array(z.string()).default([]),
  ratingAvg: z.coerce.number().min(0).max(5).default(0),
  reviewsCount: z.coerce.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  serviceIds: z.array(z.string()).default([]),
});

export type CreatorInput = z.infer<typeof creatorSchema>;

export const requestStatusSchema = z.enum(REQUEST_STATUSES);
export const contactStatusSchema = z.enum(CONTACT_STATUSES);

/** Convert a Zod error into a { field: message } map for forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
