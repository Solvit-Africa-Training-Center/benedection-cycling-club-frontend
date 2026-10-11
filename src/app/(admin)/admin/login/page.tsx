"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/admin/Button";
import TextInput from "@/components/admin/TextInput";
import { useToast } from "@/components/admin/Toast";
import { useAuth } from "@/components/admin/AuthProvider";
import { DEMO_ADMIN } from "@/lib/admin/auth";
import { errorFieldErrors, errorMessage } from "@/lib/admin/errors";
import type { FieldErrors } from "@/lib/admin/types";
import { cx } from "@/lib/admin/utils";

function LoginForm() {
  const { login } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setFieldErrors({});
    setFormError(undefined);

    try {
      await login(email, password);
      notify("Signed in. Welcome back.");
      const next = searchParams.get("next");
      // Only follow same-site relative paths, so `next` cannot be used as an open redirect.
      router.replace(next && next.startsWith("/admin") ? next : "/admin");
    } catch (error) {
      setFieldErrors(errorFieldErrors(error));
      setFormError(errorMessage(error, "We could not sign you in. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full max-w-md flex-col gap-5 rounded-xl border border-white/10 bg-white/[0.02] p-6"
    >
      <div>
        <h1 className="font-display text-3xl font-extrabold uppercase leading-none tracking-wide text-white">
          Sign in
        </h1>
        <p className="mt-2 font-sans text-sm text-slate-400">
          Benediction Cycling Club admin dashboard.
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
        id="login-email"
        label="Email address"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
      />

      <TextInput
        id="login-password"
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={fieldErrors.password}
      />

      <Button type="submit" variant="primary" busy={busy} className="w-full">
        Sign in
      </Button>

      <div className="rounded-lg border border-brand-teal/30 bg-brand-teal/10 px-3 py-3">
        <p
          className={cx(
            "font-display text-xs font-bold uppercase tracking-widest text-brand-teal",
          )}
        >
          Demo account
        </p>
        <p className="mt-1 font-sans text-sm text-slate-300">
          {DEMO_ADMIN.email} &middot; {DEMO_ADMIN.password}
        </p>
        <p className="mt-1 font-sans text-xs text-slate-400">
          Sign in as an administrator to see delete and restore actions. Editors can create
          and edit only.
        </p>
      </div>

      <p className="font-sans text-sm text-slate-400">
        Need an account?{" "}
        <a
          href="/admin/register"
          className="font-semibold text-brand-lime underline underline-offset-2 hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-lime"
        >
          Create an editor account
        </a>
      </p>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      {/* useSearchParams needs a Suspense boundary during prerendering. */}
      <Suspense fallback={<p className="font-sans text-sm text-slate-400">Loading&hellip;</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
