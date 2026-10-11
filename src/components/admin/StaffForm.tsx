"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import Button from "./Button";
import Checkbox from "./Checkbox";
import ConfirmDialog from "./ConfirmDialog";
import ImageUpload from "./ImageUpload";
import { SectionCard } from "./PageHeader";
import TextInput from "./TextInput";
import Textarea from "./Textarea";
import { useToast } from "./Toast";
import { useAuth } from "./AuthProvider";
import { staffApi } from "@/lib/admin/api";
import { errorFieldErrors, errorMessage } from "@/lib/admin/errors";
import type { FieldErrors, StaffMember } from "@/lib/admin/types";

type StaffFormProps = {
  /** Omit to create a new staff member. */
  staff?: StaffMember;
};

/** Create/edit form for a staff member: name, role, bio, photo, order, published. */
export default function StaffForm({ staff }: StaffFormProps) {
  const router = useRouter();
  const { notify } = useToast();
  const { isAdmin } = useAuth();

  const isEdit = Boolean(staff);
  const [name, setName] = useState(staff?.name ?? "");
  const [role, setRole] = useState(staff?.role ?? "");
  const [bio, setBio] = useState(staff?.bio ?? "");
  const [photo, setPhoto] = useState<string | undefined>(staff?.photo);
  const [order, setOrder] = useState(String(staff?.order ?? 1));
  const [published, setPublished] = useState(staff?.published ?? false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError(undefined);

    const draft = {
      name: name.trim(),
      role: role.trim(),
      bio: bio.trim() || undefined,
      photo: photo || undefined,
      order: Number(order),
      published,
    };

    try {
      if (staff) {
        await staffApi.update(staff.id, draft);
        notify(`${draft.name || "Staff member"} saved.`);
      } else {
        const created = await staffApi.create(draft);
        notify(`${created.name} created.`);
      }
      router.push("/admin/staff");
    } catch (error) {
      setErrors(errorFieldErrors(error));
      setFormError(errorMessage(error, "That change could not be saved."));
      notify("That change could not be saved.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!staff) return;
    setDeleting(true);
    try {
      await staffApi.remove(staff.id);
      notify(`${staff.name} moved to deleted.`);
      setConfirmDelete(false);
      router.push("/admin/staff");
    } catch (error) {
      notify(errorMessage(error, "That record could not be deleted."), "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-3xl flex-col gap-6">
      {formError ? (
        <p
          role="alert"
          className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 font-sans text-sm text-red-200"
        >
          {formError}
        </p>
      ) : null}

      <SectionCard title="Profile" description="How this person appears on the public team page.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            id="staff-name"
            label="Full name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={errors.name}
          />
          <TextInput
            id="staff-role"
            label="Role"
            required
            hint="For example Directeur Sportif or Lead Physio."
            value={role}
            onChange={(event) => setRole(event.target.value)}
            error={errors.role}
          />
        </div>

        <Textarea
          id="staff-bio"
          label="Biography"
          rows={5}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          error={errors.bio}
        />

        <ImageUpload
          id="staff-photo"
          label="Photo"
          altText={`Portrait of ${name || "the staff member"}`}
          value={photo}
          onChange={setPhoto}
          error={errors.photo}
        />
      </SectionCard>

      <SectionCard title="Publishing" description="Visibility and position in the staff list.">
        <Checkbox
          id="staff-published"
          label="Published"
          hint="Published staff appear on the public team page."
          checked={published}
          onChange={(event) => setPublished(event.target.checked)}
        />

        <TextInput
          id="staff-order"
          label="Display order"
          type="number"
          inputMode="numeric"
          min={1}
          hint="Lower numbers appear first."
          value={order}
          onChange={(event) => setOrder(event.target.value)}
          error={errors.order}
          className="max-w-40"
        />
      </SectionCard>

      <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button type="submit" variant="primary" busy={saving}>
            {isEdit ? "Save changes" : "Create staff member"}
          </Button>
          <Button variant="secondary" onClick={() => router.push("/admin/staff")}>
            Cancel
          </Button>
        </div>

        {isEdit && isAdmin ? (
          <Button
            variant="ghost"
            onClick={() => setConfirmDelete(true)}
            className="text-red-300 hover:bg-red-500/15 hover:text-red-200"
          >
            Delete staff member
          </Button>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        destructive
        busy={deleting}
        title="Delete this staff member?"
        description={`${staff?.name ?? "This staff member"} will be hidden from the website and moved to deleted. An administrator can restore them later.`}
        confirmLabel="Delete staff member"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </form>
  );
}
