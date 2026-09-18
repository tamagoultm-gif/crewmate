"use server";

import { prisma } from "@/lib/prisma";
import { projectRequestSchema, contactSchema, fieldErrors } from "@/lib/validations";
import { notifyNewRequest, confirmRequestToClient, notifyNewContact } from "@/lib/email";

export type ActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
};

/** Submit a client project request with selected creators. */
export async function submitProjectRequest(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const creatorIds = formData.getAll("creatorIds").map(String).filter(Boolean);

  const parsed = projectRequestSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    company: formData.get("company"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    contentType: formData.get("contentType"),
    description: formData.get("description"),
    budget: formData.get("budget"),
    preferredDate: formData.get("preferredDate"),
    preferredTime: formData.get("preferredTime"),
    location: formData.get("location"),
    creatorsCount: formData.get("creatorsCount") || undefined,
    message: formData.get("message"),
    creatorIds,
  });

  if (!parsed.success) {
    return { ok: false, message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error) };
  }

  const data = parsed.data;

  // Only keep creator ids that actually exist and are active.
  const validCreators = data.creatorIds.length
    ? await prisma.creator.findMany({
        where: { id: { in: data.creatorIds }, active: true },
        select: { id: true, displayName: true },
      })
    : [];

  const request = await prisma.projectRequest.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company || null,
      email: data.email,
      phone: data.phone || null,
      contentType: data.contentType || null,
      description: data.description,
      budget: data.budget || null,
      preferredDate: data.preferredDate || null,
      preferredTime: data.preferredTime || null,
      location: data.location || null,
      creatorsCount: data.creatorsCount ?? (validCreators.length || null),
      message: data.message || null,
      status: "NEW",
      selectedCreators: {
        create: validCreators.map((c) => ({ creatorId: c.id })),
      },
    },
  });

  // Fire-and-await emails (dev logs if no key).
  const names = validCreators.map((c) => c.displayName);
  await Promise.allSettled([
    notifyNewRequest({
      id: request.id,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      company: data.company,
      contentType: data.contentType,
      description: data.description,
      budget: data.budget,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      location: data.location,
      creators: names,
    }),
    confirmRequestToClient({ to: data.email, name: data.firstName, creators: names }),
  ]);

  return { ok: true, message: "Your project request has been sent. We'll be in touch shortly." };
}

/** Submit a general contact message. */
export async function submitContact(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error) };
  }

  const data = parsed.data;
  await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      company: data.company || null,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
      status: "NEW",
    },
  });

  await notifyNewContact({
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
  });

  return { ok: true, message: "Thanks — your message has been sent. We'll reply soon." };
}
