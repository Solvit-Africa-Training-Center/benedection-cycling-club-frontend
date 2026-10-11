"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/admin/Button";
import TextInput from "@/components/admin/TextInput";
import { useToast } from "@/components/admin/Toast";
import { useAuth } from "@/components/admin/AuthProvider";
import { errorFieldErrors, errorMessage } from "@/lib/admin/errors";
import type { FieldErrors } from "@/lib/admin/types";

/**
 * Self-registration always creates an "editor": creating and editing content.
 * Administrators are promoted by an existing admin, never by signing up, so a
 * stranger cannot give themselves delete rights.
 */
export default function AdminRegisterPage() {
  const { register } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const update = (key: keyof typeof form) => (event: { target: { value: string } }) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setFieldErrors({});
    setFormError(undefined);

    try {
      await register(form);
      notify("Account created. You are signed in as an editor.");
      router.replace("/admin");
    } catch (error) {
      setFieldErrors(errorFieldErrors(error));
      setFormError(errorMessage(error, "We could not create the account. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-md flex-col gap-5 rounded-xl border border-white/10 bg-white/[0.02] p-6"
      >
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase leading-none tracking-wide text-white">
            Create account
          </h1>
          <p className="mt-2 font-sans text-sm text-slate-400">
            New accounts are editors: they can create and edit content, but not delete it.
          </p>
        </div>

        {formError ? (
          <p
            role="alert"
            className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 font-sans text-sm text-red-200"
          >
            {formError}
          </p>
        ) : null}

        <TextInput
          id="register-name"
          label="Full name"
          autoComplete="name"
          required
          value={form.name}
          onChange={update("name")}
          error={fieldErrors.name}
        />

        <TextInput
          id="register-email"
          label="Email address"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={update("email")}
          error={fieldErrors.email}
        />

        <TextInput
          id="register-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          hint="At least 8 characters."
          value={form.password}
          onChange={update("password")}
          error={fieldErrors.password}
        />

        <TextInput
          id="register-confirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          required
          value={form.confirmPassword}
          onChange={update("confirmPassword")}
          error={fieldErrors.confirmPassword}
        />

        <Button type="submit" variant="primary" busy={busy} className="w-full">
          Create account
        </Button>

        <p className="font-sans text-sm text-slate-400">
          Already have an account?{" "}
          <a
            href="/admin/login"
            className="font-semibold text-brand-lime underline underline-offset-2 hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-lime"
          >
            Sign in
          </a>
        </p>
      </form>
    </main>
  );
}
