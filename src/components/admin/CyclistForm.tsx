"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Button from "./Button";
import Checkbox from "./Checkbox";
import ConfirmDialog from "./ConfirmDialog";
import ImageUpload from "./ImageUpload";
import ListEditor from "./ListEditor";
import { SectionCard } from "./PageHeader";
import Select from "./Select";
import TextInput from "./TextInput";
import Textarea from "./Textarea";
import { useToast } from "./Toast";
import { useAuth } from "./AuthProvider";
import { cyclistsApi } from "@/lib/admin/api";
import { errorFieldErrors, errorMessage } from "@/lib/admin/errors";
import type { Achievement, Cyclist, CyclistCategory, FieldErrors } from "@/lib/admin/types";
import { calculateAge, createId, slugify } from "@/lib/admin/utils";

const CATEGORY_OPTIONS = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "junior", label: "Junior (under 18)" },
];

const MAX_GALLERY = 4;

type FormState = {
  name: string;
  slug: string;
  role: string;
  category: CyclistCategory;
  nationality: string;
  birthplace: string;
  dateOfBirth: string;
  heightCm: string;
  weightKg: string;
  bio: string;
  photo?: string;
  gallery: string[];
  achievements: Achievement[];
  guardianConsent: boolean;
  published: boolean;
  order: number;
};

function toFormState(cyclist?: Cyclist): FormState {
  return {
    name: cyclist?.name ?? "",
    slug: cyclist?.slug ?? "",
    role: cyclist?.role ?? "",
    category: cyclist?.category ?? "men",
    nationality: cyclist?.nationality ?? "Rwanda",
    birthplace: cyclist?.birthplace ?? "",
    dateOfBirth: cyclist?.dateOfBirth ?? "",
    heightCm: cyclist?.heightCm ? String(cyclist.heightCm) : "",
    weightKg: cyclist?.weightKg ? String(cyclist.weightKg) : "",
    bio: cyclist?.bio ?? "",
    photo: cyclist?.photo,
    gallery: cyclist?.gallery ?? [],
    achievements: cyclist?.achievements ?? [],
    guardianConsent: cyclist?.guardianConsent ?? false,
    published: cyclist?.published ?? false,
    order: cyclist?.order ?? 1,
  };
}

type CyclistFormProps = {
  /** Omit to create a new rider. */
  cyclist?: Cyclist;
};

/**
 * Create/edit form for a cyclist, split into Profile, Photos, Achievements and
 * Publishing sections. Shared by /admin/cyclists/new and /admin/cyclists/[id].
 */
export default function CyclistForm({ cyclist }: CyclistFormProps) {
  const router = useRouter();
  const { notify } = useToast();
  const { isAdmin } = useAuth();

  const isEdit = Boolean(cyclist);
  const [form, setForm] = useState<FormState>(() => toFormState(cyclist));
  /** Stops the slug from being overwritten once someone edits it by hand. */
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const patch = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const age = useMemo(() => calculateAge(form.dateOfBirth || undefined), [form.dateOfBirth]);
  const isJunior = form.category === "junior";

  /** Publishing is blocked until guardian consent is recorded for an under-18 rider. */
  const consentMissing = isJunior && form.published && !form.guardianConsent;

  const buildDraft = () => ({
    name: form.name.trim(),
    slug: form.slug.trim(),
    role: form.role.trim(),
    category: form.category,
    nationality: form.nationality.trim(),
    birthplace: form.birthplace.trim() || undefined,
    // An empty date means "unknown", stored as undefined so the age stays blank.
    dateOfBirth: form.dateOfBirth || undefined,
    heightCm: form.heightCm ? Number(form.heightCm) : undefined,
    weightKg: form.weightKg ? Number(form.weightKg) : undefined,
    bio: form.bio.trim() || undefined,
    photo: form.photo || undefined,
    gallery: form.gallery.filter(Boolean).slice(0, MAX_GALLERY),
    achievements: form.achievements
      .filter((item) => item.event.trim() || item.result.trim())
      .map((item) => ({ ...item, year: Number(item.year) })),
    guardianConsent: isJunior ? form.guardianConsent : false,
    published: form.published,
    order: form.order,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Hard stop on the under-18 rule, in addition to the api-side check.
    if (consentMissing) {
      setErrors((current) => ({
        ...current,
        guardianConsent:
          "Under-18 rider: written guardian consent is required before publishing.",
      }));
      notify("Guardian consent is required before publishing this rider.", "error");
      return;
    }

    setSaving(true);
    setErrors({});
    setFormError(undefined);

    try {
      const draft = buildDraft();
      if (cyclist) {
        await cyclistsApi.update(cyclist.id, draft);
        notify(`${draft.name || "Rider"} saved.`);
      } else {
        const created = await cyclistsApi.create(draft);
        notify(`${created.name} created.`);
      }
      router.push("/admin/cyclists");
    } catch (error) {
      setErrors(errorFieldErrors(error));
      setFormError(errorMessage(error, "That change could not be saved."));
      notify("That change could not be saved.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!cyclist) return;
    setDeleting(true);
    try {
      await cyclistsApi.remove(cyclist.id);
      notify(`${cyclist.name} moved to deleted.`);
      setConfirmDelete(false);
      router.push("/admin/cyclists");
    } catch (error) {
      notify(errorMessage(error, "That record could not be deleted."), "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {formError ? (
        <p
          role="alert"
          className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 font-sans text-sm text-red-200"
        >
          {formError}
        </p>
      ) : null}

      <SectionCard
        title="Profile"
        description="How this rider appears on the public team page."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            id="cyclist-name"
            label="Full name"
            required
            value={form.name}
            onChange={(event) => {
              const name = event.target.value;
              patch("name", name);
              // Keep the slug in step with the name until it is edited by hand.
              if (!slugEdited) patch("slug", slugify(name));
            }}
            error={errors.name}
          />

          <TextInput
            id="cyclist-slug"
            label="Slug"
            required
            hint="Used in the rider's page address. Generated from the name."
            value={form.slug}
            onChange={(event) => {
              setSlugEdited(true);
              patch("slug", event.target.value);
            }}
            error={errors.slug}
          />

          <TextInput
            id="cyclist-role"
            label="Role"
            hint="For example Climber, Sprinter or Domestique."
            value={form.role}
            onChange={(event) => patch("role", event.target.value)}
            error={errors.role}
          />

          <Select
            id="cyclist-category"
            label="Category"
            options={CATEGORY_OPTIONS}
            value={form.category}
            onChange={(event) => patch("category", event.target.value as CyclistCategory)}
            error={errors.category}
          />

          <TextInput
            id="cyclist-nationality"
            label="Nationality"
            required
            value={form.nationality}
            onChange={(event) => patch("nationality", event.target.value)}
            error={errors.nationality}
          />

          <TextInput
            id="cyclist-birthplace"
            label="Birthplace"
            hint="Optional. Leave empty until the club has verified it."
            value={form.birthplace}
            onChange={(event) => patch("birthplace", event.target.value)}
            error={errors.birthplace}
          />

          <TextInput
            id="cyclist-dob"
            label="Date of birth"
            type="date"
            hint="Optional. Age is calculated from it and shown in the list."
            value={form.dateOfBirth}
            onChange={(event) => patch("dateOfBirth", event.target.value)}
            error={errors.dateOfBirth}
            trailing={age === null ? undefined : `${age} years old`}
          />

          <TextInput
            id="cyclist-height"
            label="Height (cm)"
            type="number"
            inputMode="numeric"
            min={100}
            max={250}
            hint="Between 100 and 250."
            value={form.heightCm}
            onChange={(event) => patch("heightCm", event.target.value)}
            error={errors.heightCm}
          />

          <TextInput
            id="cyclist-weight"
            label="Weight (kg)"
            type="number"
            inputMode="numeric"
            min={30}
            max={150}
            hint="Between 30 and 150."
            value={form.weightKg}
            onChange={(event) => patch("weightKg", event.target.value)}
            error={errors.weightKg}
          />
        </div>

        <Textarea
          id="cyclist-bio"
          label="Biography"
          rows={5}
          hint="A short paragraph about the rider."
          value={form.bio}
          onChange={(event) => patch("bio", event.target.value)}
          error={errors.bio}
        />
      </SectionCard>

      <SectionCard title="Photos" description="Main portrait plus up to 4 gallery photos.">
        <ImageUpload
          id="cyclist-photo"
          label="Main photo"
          altText={`Portrait of ${form.name || "the rider"}`}
          value={form.photo}
          onChange={(value) => patch("photo", value)}
          error={errors.photo}
          hint="Shown on the roster card and the rider's page."
        />

        <div className="flex flex-col gap-3">
          <p className="font-sans text-sm font-medium text-slate-200">
            Gallery photos ({form.gallery.length}/{MAX_GALLERY})
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: MAX_GALLERY }).map((_, index) => (
              <ImageUpload
                key={index}
                id={`cyclist-gallery-${index}`}
                label={`Gallery photo ${index + 1}`}
                altText={`Gallery photo ${index + 1} of ${form.name || "the rider"}`}
                value={form.gallery[index]}
                onChange={(value) => {
                  const next = [...form.gallery];
                  if (value) {
                    next[index] = value;
                  } else {
                    next.splice(index, 1);
                  }
                  patch("gallery", next);
                }}
                hint={index === 0 ? "Optional." : undefined}
              />
            ))}
          </div>
          {errors.gallery ? (
            <p role="alert" className="font-sans text-xs font-medium text-red-300">
              {errors.gallery}
            </p>
          ) : null}
        </div>
      </SectionCard>


      <SectionCard
        title="Achievements"
        description="Race results shown on the rider's page. Reorder with the arrows."
      >
        <ListEditor<Achievement>
          label="Achievements"
          items={form.achievements}
          onChange={(items) => patch("achievements", items)}
          createItem={() => ({ id: createId("ach"), year: new Date().getFullYear(), event: "", result: "" })}
          itemLabel={(item) => `${item.event || "achievement"} ${item.year}`.trim()}
          addLabel="Add achievement"
          emptyMessage="No achievements yet. Add the rider's race results."
          error={errors.achievements}
          rowErrors={Object.fromEntries(
            Object.entries(errors)
              .filter(([key]) => key.startsWith("achievements."))
              .map(([key, message]) => [Number(key.split(".")[1]), message]),
          )}
          renderItem={({ item, index, update }) => (
            <div className="grid gap-3 md:grid-cols-[7rem_1fr_1fr]">
              <TextInput
                id={`achievement-year-${index}`}
                label="Year"
                type="number"
                inputMode="numeric"
                min={1990}
                max={new Date().getFullYear()}
                value={String(item.year)}
                onChange={(event) => update({ year: Number(event.target.value) })}
                error={errors[`achievements.${index}.year`]}
              />
              <TextInput
                id={`achievement-event-${index}`}
                label="Event"
                placeholder="Tour du Rwanda"
                value={item.event}
                onChange={(event) => update({ event: event.target.value })}
              />
              <TextInput
                id={`achievement-result-${index}`}
                label="Result"
                placeholder="Stage 3 winner"
                value={item.result}
                onChange={(event) => update({ result: event.target.value })}
              />
            </div>
          )}
        />
      </SectionCard>

      <SectionCard title="Publishing" description="Visibility and where the rider sits in the list.">
        <Checkbox
          id="cyclist-published"
          label="Published"
          hint="Published riders appear on the public team page."
          checked={form.published}
          onChange={(event) => patch("published", event.target.checked)}
        />

        {isJunior ? (
          <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-3">
            <p className="font-sans text-sm font-semibold text-amber-200">
              Under-18 rider: written guardian consent is required
            </p>
            <p className="mt-1 font-sans text-xs text-amber-200/80">
              A junior cannot be published until a parent or guardian has signed the
              club&rsquo;s consent form and the box below is ticked.
            </p>
            <div className="mt-3">
              <Checkbox
                id="cyclist-consent"
                label="Written guardian consent is on file"
                checked={form.guardianConsent}
                onChange={(event) => patch("guardianConsent", event.target.checked)}
                error={errors.guardianConsent}
              />
            </div>
          </div>
        ) : null}

        <TextInput
          id="cyclist-order"
          label="Display order"
          type="number"
          inputMode="numeric"
          min={1}
          hint="Lower numbers appear first on the roster."
          value={String(form.order)}
          onChange={(event) => patch("order", Number(event.target.value))}
          error={errors.order}
          className="max-w-40"
        />
      </SectionCard>

      <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button type="submit" variant="primary" busy={saving}>
            {isEdit ? "Save changes" : "Create rider"}
          </Button>
          <Button variant="secondary" onClick={() => router.push("/admin/cyclists")}>
            Cancel
          </Button>
        </div>

        {isEdit && isAdmin ? (
          <Button
            variant="ghost"
            onClick={() => setConfirmDelete(true)}
            className="text-red-300 hover:bg-red-500/15 hover:text-red-200"
          >
            Delete rider
          </Button>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        destructive
        busy={deleting}
        title="Delete this rider?"
        description={`${cyclist?.name ?? "This rider"} will be hidden from the website and moved to deleted. An administrator can restore them later.`}
        confirmLabel="Delete rider"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </form>
  );
}

