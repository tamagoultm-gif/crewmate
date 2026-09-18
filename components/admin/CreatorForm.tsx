"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { saveCreator, type FormState } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";
import { FileUpload } from "@/components/admin/FileUpload";

type Service = { id: string; name: string };
type CreatorData = {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  slug: string;
  profession: string;
  headline: string | null;
  bio: string;
  location: string;
  city: string | null;
  country: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  website: string | null;
  languages: string[];
  skills: string[];
  specialties: string[];
  ratingAvg: number;
  reviewsCount: number;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  serviceIds: string[];
};

const initial: FormState = { ok: false };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Save creator
    </button>
  );
}

function Text({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  error,
  required,
  full,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="label" htmlFor={name}>
        {label} {required && <span className="text-brand-600">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        step={type === "number" ? "any" : undefined}
        className="input"
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

export function CreatorForm({ creator, services }: { creator?: CreatorData; services: Service[] }) {
  const action = saveCreator.bind(null, creator?.id ?? null);
  const [state, formAction] = useActionState(action, initial);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.ok) toast(state.message, "error");
  }, [state, toast]);

  const err = state.errors ?? {};
  const activeServiceIds = new Set(creator?.serviceIds ?? []);

  return (
    <form action={formAction} className="space-y-6">
      <section className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Identity</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Text label="First name" name="firstName" defaultValue={creator?.firstName} error={err.firstName} required />
          <Text label="Last name" name="lastName" defaultValue={creator?.lastName} error={err.lastName} required />
          <Text label="Display name" name="displayName" defaultValue={creator?.displayName} error={err.displayName} required />
          <Text label="Slug (optional)" name="slug" defaultValue={creator?.slug} placeholder="auto from display name" />
          <Text label="Profession" name="profession" defaultValue={creator?.profession} error={err.profession} required />
          <Text label="Location" name="location" defaultValue={creator?.location} placeholder="Tunis, Tunisia" required />
          <Text label="City" name="city" defaultValue={creator?.city} />
          <Text label="Country" name="country" defaultValue={creator?.country} />
          <Text label="Headline" name="headline" defaultValue={creator?.headline} placeholder="Short one-liner" full />
          <div className="sm:col-span-2">
            <label className="label" htmlFor="bio">Biography</label>
            <textarea id="bio" name="bio" rows={5} defaultValue={creator?.bio ?? ""} className="input resize-y" />
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Media</h2>
        <p className="mt-1 text-xs text-ink/40">Upload from your computer, or paste a link.</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-[200px_1fr]">
          <FileUpload
            name="avatarUrl"
            label="Profile picture"
            initialUrl={creator?.avatarUrl}
            accept="image"
            aspect="square"
          />
          <FileUpload
            name="coverUrl"
            label="Cover image"
            initialUrl={creator?.coverUrl}
            accept="image"
            aspect="wide"
          />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Contact & socials</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Text label="Email" name="email" defaultValue={creator?.email} type="email" />
          <Text label="Phone" name="phone" defaultValue={creator?.phone} />
          <Text label="Instagram URL" name="instagram" defaultValue={creator?.instagram} />
          <Text label="TikTok URL" name="tiktok" defaultValue={creator?.tiktok} />
          <Text label="YouTube URL" name="youtube" defaultValue={creator?.youtube} />
          <Text label="Website URL" name="website" defaultValue={creator?.website} />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Skills & tags</h2>
        <div className="mt-4 grid gap-4">
          <Text label="Languages (comma separated)" name="languages" defaultValue={creator?.languages.join(", ")} placeholder="Arabic, French, English" />
          <Text label="Skills (comma separated)" name="skills" defaultValue={creator?.skills.join(", ")} placeholder="Editing, Color grading" />
          <Text label="Specialties (comma separated)" name="specialties" defaultValue={creator?.specialties.join(", ")} placeholder="Reels, Fashion" />
        </div>

        <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-ink/40">Services</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {services.map((s) => (
            <label
              key={s.id}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-ink/10 bg-paper-card px-3 py-1.5 text-sm has-[:checked]:border-ink has-[:checked]:bg-night has-[:checked]:text-white"
            >
              <input type="checkbox" name="serviceIds" value={s.id} defaultChecked={activeServiceIds.has(s.id)} className="sr-only" />
              {s.name}
            </label>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">Rating & visibility</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Text label="Rating (0–5)" name="ratingAvg" defaultValue={creator?.ratingAvg ?? 0} type="number" />
          <Text label="Reviews count" name="reviewsCount" defaultValue={creator?.reviewsCount ?? 0} type="number" />
          <Text label="Sort order" name="sortOrder" defaultValue={creator?.sortOrder ?? 0} type="number" />
        </div>
        <p className="mt-2 text-xs text-ink/40">
          Rating is normally computed from reviews, but you can override it here.
        </p>
        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={creator?.featured ?? false} className="h-4 w-4 rounded" />
            Featured on homepage
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={creator?.active ?? true} className="h-4 w-4 rounded" />
            Active (visible on site)
          </label>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Submit />
        <Link href="/admin/creators" className="btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}
