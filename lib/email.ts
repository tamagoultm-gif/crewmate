import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.EMAIL_FROM || "Crewmate <onboarding@resend.dev>";
const ADMIN_TO = process.env.EMAIL_ADMIN_TO || "admin@crewmate.studio";

type Mail = { to: string; subject: string; html: string };

async function send({ to, subject, html }: Mail) {
  if (!resend) {
    // No API key configured — log so the flow still works locally.
    console.log("\n[email:dev] ---------------------------------");
    console.log(`to: ${to}`);
    console.log(`subject: ${subject}`);
    console.log("(set RESEND_API_KEY to actually deliver)\n");
    return { ok: true, dev: true };
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
    return { ok: true };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { ok: false };
  }
}

const wrap = (title: string, body: string) => `
  <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;color:#0A0A0B">
    <div style="padding:24px 0;border-bottom:1px solid #eee">
      <span style="font-weight:800;letter-spacing:-0.02em;font-size:20px">CREWMATE</span>
    </div>
    <h1 style="font-size:20px;margin:24px 0 8px">${title}</h1>
    ${body}
    <p style="margin-top:32px;color:#71717A;font-size:12px">Crewmate — creator community & talent platform.</p>
  </div>`;

export async function notifyNewRequest(data: {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  contentType?: string | null;
  description: string;
  budget?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  location?: string | null;
  creators: string[];
}) {
  const rows = [
    ["Client", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Company", data.company],
    ["Content type", data.contentType],
    ["Budget", data.budget],
    ["Preferred date", data.preferredDate],
    ["Preferred time", data.preferredTime],
    ["Location", data.location],
    ["Selected creators", data.creators.join(", ") || "—"],
  ]
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#71717A">${k}</td><td style="padding:6px 0;font-weight:600">${v}</td></tr>`
    )
    .join("");

  const html = wrap(
    "New project request received",
    `<table style="width:100%;font-size:14px;border-collapse:collapse">${rows}</table>
     <p style="margin-top:16px;font-size:14px"><strong>Message</strong><br/>${data.description}</p>`
  );

  return send({ to: ADMIN_TO, subject: `New request — ${data.name}`, html });
}

export async function confirmRequestToClient(data: {
  to: string;
  name: string;
  creators: string[];
}) {
  const html = wrap(
    `Thanks, ${data.name} — we've got your request`,
    `<p style="font-size:14px;line-height:1.6">Your project request has been received. Our team will review it and get back to you shortly to plan the next steps${
      data.creators.length ? ` with ${data.creators.join(", ")}` : ""
    }.</p>
     <p style="font-size:14px">— The Crewmate team</p>`
  );
  return send({ to: data.to, subject: "We received your project request", html });
}

export async function notifyNewContact(data: {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}) {
  const html = wrap(
    "New contact message",
    `<p style="font-size:14px"><strong>${data.name}</strong> &lt;${data.email}&gt;</p>
     <p style="font-size:14px"><strong>Subject:</strong> ${data.subject || "—"}</p>
     <p style="font-size:14px;line-height:1.6">${data.message}</p>`
  );
  return send({ to: ADMIN_TO, subject: `Contact — ${data.subject || data.name}`, html });
}
