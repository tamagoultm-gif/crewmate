"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { creatorSchema, requestStatusSchema, contactStatusSchema, fieldErrors } from "@/lib/validations";
import { recomputeCreatorRating } from "@/lib/data";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

export type FormState = { ok: boolean; message?: string; errors?: Record<string, string> };

// ---------------- Requests ----------------

export async function updateRequestStatus(id: string, status: string) {
  await requireAdmin();
  const parsed = requestStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false };
  await prisma.projectRequest.update({ where: { id }, data: { status: parsed.data } });
  revalidatePath("/admin/requests");
  revalidatePath(`/admin/requests/${id}`);
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateRequestNotes(id: string, notes: string) {
  await requireAdmin();
  await prisma.projectRequest.update({ where: { id }, data: { adminNotes: notes } });
  revalidatePath(`/admin/requests/${id}`);
  return { ok: true };
}

export async function deleteRequest(id: string) {
  await requireAdmin();
  await prisma.projectRequest.delete({ where: { id } });
  revalidatePath("/admin/requests");
  redirect("/admin/requests");
}

// ---------------- Contacts ----------------

export async function updateContactStatus(id: string, status: string) {
  await requireAdmin();
  const parsed = contactStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false };
  await prisma.contactMessage.update({ where: { id }, data: { status: parsed.data } });
  revalidatePath("/admin/contacts");
  return { ok: true };
}

export async function deleteContact(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/contacts");
  return { ok: true };
}

// ---------------- Creators ----------------

function parseCreatorForm(formData: FormData) {
  const list = (key: string) =>
    String(formData.get(key) || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  return creatorSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    displayName: formData.get("displayName"),
    slug: formData.get("slug"),
    profession: formData.get("profession"),
    headline: formData.get("headline"),
    bio: formData.get("bio"),
    location: formData.get("location"),
    city: formData.get("city"),
    country: formData.get("country"),
    avatarUrl: formData.get("avatarUrl"),
    coverUrl: formData.get("coverUrl"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    instagram: formData.get("instagram"),
    tiktok: formData.get("tiktok"),
    youtube: formData.get("youtube"),
    website: formData.get("website"),
    languages: list("languages"),
    skills: list("skills"),
    specialties: list("specialties"),
    ratingAvg: formData.get("ratingAvg") || 0,
    reviewsCount: formData.get("reviewsCount") || 0,
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
    active: formData.get("active") !== "false" && formData.get("active") !== null,
    sortOrder: formData.get("sortOrder") || 0,
    serviceIds: formData.getAll("serviceIds").map(String),
  });
}

export async function saveCreator(
  id: string | null,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const parsed = parseCreatorForm(formData);
  if (!parsed.success) {
    return { ok: false, message: "Please check the form.", errors: fieldErrors(parsed.error) };
  }
  const d = parsed.data;
  const slug = (d.slug && slugify(d.slug)) || slugify(d.displayName);

  const data = {
    firstName: d.firstName,
    lastName: d.lastName,
    displayName: d.displayName,
    slug,
    profession: d.profession,
    headline: d.headline || null,
    bio: d.bio || "",
    location: d.location,
    city: d.city || null,
    country: d.country || null,
    avatarUrl: d.avatarUrl || null,
    coverUrl: d.coverUrl || null,
    email: d.email || null,
    phone: d.phone || null,
    instagram: d.instagram || null,
    tiktok: d.tiktok || null,
    youtube: d.youtube || null,
    website: d.website || null,
    languages: d.languages,
    skills: d.skills,
    specialties: d.specialties,
    ratingAvg: d.ratingAvg,
    reviewsCount: d.reviewsCount,
    featured: d.featured,
    active: d.active,
    sortOrder: d.sortOrder,
  };

  let creatorId = id;
  try {
    if (id) {
      await prisma.creator.update({ where: { id }, data });
      await prisma.creatorService.deleteMany({ where: { creatorId: id } });
    } else {
      const created = await prisma.creator.create({ data });
      creatorId = created.id;
    }
    if (creatorId && d.serviceIds.length) {
      await prisma.creatorService.createMany({
        data: d.serviceIds.map((serviceId) => ({ creatorId: creatorId!, serviceId })),
        skipDuplicates: true,
      });
    }
  } catch (e) {
    return { ok: false, message: "A creator with this slug may already exist." };
  }

  revalidatePath("/admin/creators");
  revalidatePath("/community");
  // For a NEW creator, go straight to its edit page so the admin can add
  // portfolio images/videos (which need an existing creator id).
  if (!id && creatorId) redirect(`/admin/creators/${creatorId}/edit?created=1`);
  redirect("/admin/creators");
}

export async function toggleCreatorActive(id: string, active: boolean) {
  await requireAdmin();
  await prisma.creator.update({ where: { id }, data: { active } });
  revalidatePath("/admin/creators");
  revalidatePath("/community");
  return { ok: true };
}

export async function deleteCreator(id: string) {
  await requireAdmin();
  await prisma.creator.delete({ where: { id } });
  revalidatePath("/admin/creators");
  revalidatePath("/community");
  redirect("/admin/creators");
}

// ---------------- Portfolio ----------------

export async function addPortfolioItem(creatorId: string, formData: FormData) {
  await requireAdmin();
  const count = await prisma.portfolioItem.count({ where: { creatorId } });
  await prisma.portfolioItem.create({
    data: {
      creatorId,
      type: (String(formData.get("type") || "IMAGE") as any),
      title: String(formData.get("title") || "Untitled"),
      description: String(formData.get("description") || "") || null,
      mediaUrl: String(formData.get("mediaUrl") || ""),
      thumbnailUrl: String(formData.get("thumbnailUrl") || formData.get("mediaUrl") || "") || null,
      category: String(formData.get("category") || "") || null,
      externalUrl: String(formData.get("externalUrl") || "") || null,
      sortOrder: count,
    },
  });
  revalidatePath(`/admin/creators/${creatorId}/edit`);
  return { ok: true };
}

export async function deletePortfolioItem(id: string, creatorId: string) {
  await requireAdmin();
  await prisma.portfolioItem.delete({ where: { id } });
  revalidatePath(`/admin/creators/${creatorId}/edit`);
  return { ok: true };
}

// ---------------- Reviews ----------------

export async function addReview(creatorId: string, formData: FormData) {
  await requireAdmin();
  await prisma.review.create({
    data: {
      creatorId,
      authorName: String(formData.get("authorName") || "Anonymous"),
      authorRole: String(formData.get("authorRole") || "") || null,
      rating: Math.max(1, Math.min(5, Number(formData.get("rating") || 5))),
      comment: String(formData.get("comment") || "") || null,
      published: true,
    },
  });
  await recomputeCreatorRating(creatorId);
  revalidatePath("/admin/reviews");
  revalidatePath("/community");
  return { ok: true };
}

export async function toggleReviewPublished(id: string, published: boolean) {
  await requireAdmin();
  const review = await prisma.review.update({ where: { id }, data: { published } });
  await recomputeCreatorRating(review.creatorId);
  revalidatePath("/admin/reviews");
  revalidatePath("/community");
  return { ok: true };
}

export async function deleteReview(id: string) {
  await requireAdmin();
  const review = await prisma.review.delete({ where: { id } });
  await recomputeCreatorRating(review.creatorId);
  revalidatePath("/admin/reviews");
  revalidatePath("/community");
  return { ok: true };
}

// ---------------- Services ----------------

export async function saveService(id: string | null, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  if (!name) return { ok: false };
  const data = {
    name,
    slug: slugify(name),
    description: String(formData.get("description") || "") || null,
    icon: String(formData.get("icon") || "Sparkles"),
    active: formData.get("active") !== "false",
  };
  if (id) await prisma.service.update({ where: { id }, data });
  else await prisma.service.create({ data: { ...data, sortOrder: 99 } });
  revalidatePath("/admin/services");
  return { ok: true };
}

export async function deleteService(id: string) {
  await requireAdmin();
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
  return { ok: true };
}

// ---------------- Settings ----------------

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const entries = Array.from(formData.entries()).filter(([k]) => k.startsWith("setting_"));
  for (const [k, v] of entries) {
    const key = k.replace("setting_", "");
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(v) },
      create: { key, value: String(v) },
    });
  }
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}
