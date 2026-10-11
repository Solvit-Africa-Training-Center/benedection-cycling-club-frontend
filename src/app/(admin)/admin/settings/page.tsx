"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/admin/Button";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PageHeader from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/Toast";
import { useAuth } from "@/components/admin/AuthProvider";
import { DEMO_ADMIN } from "@/lib/admin/auth";
import { resetStore } from "@/lib/admin/storage";

/**
 * User settings. Administrators only - the sidebar hides this link for editors,
 * and the api layer refuses delete/restore calls from editors as well.
 */
export default function AdminSettingsPage() {
  const { user, isAdmin } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    setResetting(true);
    resetStore();
    notify("Demo data reset. The seeded records are back.");
    setConfirmReset(false);
    setResetting(false);
    // Force a full reload so every screen re-seeds from scratch.
    router.replace("/admin");
  };

  if (!isAdmin) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <PageHeader title="User settings" />
        <p
          role="alert"
          className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 font-sans text-sm text-red-200"
        >
          Only an administrator can open user settings.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title="User settings"
        description="Your account and the demo data behind this prototype."
      />

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="font-display text-lg font-bold uppercase tracking-widest text-brand-lime">
          Your account
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="font-sans text-xs uppercase tracking-widest text-slate-500">Name</dt>
            <dd className="font-sans text-sm text-white">{user?.name}</dd>
          </div>
          <div>
            <dt className="font-sans text-xs uppercase tracking-widest text-slate-500">Email</dt>
            <dd className="font-sans text-sm text-white">{user?.email}</dd>
          </div>
          <div>
            <dt className="font-sans text-xs uppercase tracking-widest text-slate-500">Role</dt>
            <dd className="font-sans text-sm text-white capitalize">{user?.role}</dd>
          </div>
        </dl>
        <p className="mt-4 font-sans text-xs text-slate-400">
          As an administrator you can create, edit, delete and restore every record. Editors can
          only create and edit.
        </p>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="font-display text-lg font-bold uppercase tracking-widest text-brand-lime">
          Demo data
        </h2>
        <p className="mt-2 font-sans text-sm text-slate-300">
          Everything you have created lives in this browser only. Resetting restores the seeded
          riders, staff and sample articles, and discards your changes.
        </p>
        <p className="mt-2 font-sans text-xs text-slate-400">
          Seeded administrator: {DEMO_ADMIN.email} / {DEMO_ADMIN.password}
        </p>
        <div className="mt-4">
          <Button variant="danger" onClick={() => setConfirmReset(true)}>
            Reset demo data
          </Button>
        </div>
      </section>

      <ConfirmDialog
        open={confirmReset}
        destructive
        busy={resetting}
        title="Reset demo data?"
        description="Every change you made in this browser will be discarded and the seeded records restored."
        confirmLabel="Reset data"
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
