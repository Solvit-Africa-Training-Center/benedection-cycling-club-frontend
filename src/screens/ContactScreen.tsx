"use client";

import Image from "next/image";
import { cloneElement, FormEvent, useState } from "react";
import type { ClubContact } from "@/lib/api/types";

const fallbackDetails = [
  {
    label: "P.O. BOX",
    value: "173, Rubavu",
    href: "https://maps.google.com/?q=Rubavu%2C%20Rwanda",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.2" />
      </svg>
    ),
  },
  {
    label: "Email",
    value: "benedictionclub@gmail.com",
    href: "mailto:benedictionclub@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16v12H4z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "+250 788573195",
    href: "tel:+250788573195",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.5 4.5 5 6c-.8.5-.8 1.6-.5 2.5 1.5 4.8 5.2 8.5 10 10 .9.3 2 .3 2.5-.5l1.5-2.5-4-2-1.4 1.5a12.8 12.8 0 0 1-4.1-4.1L10.5 9l-2-4Z" />
      </svg>
    ),
  },
];

const inputClassName =
  "mt-2 w-full rounded-md border border-white/10 bg-[#30384a] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal";

function detailsFromContacts(contacts?: ClubContact[], location?: string) {
  const place = location?.trim();
  const phone = contacts?.find((item) => item.kind === "phone" && item.value?.trim());
  const email = contacts?.find((item) => item.kind === "email" && item.value?.trim());
  const rows = fallbackDetails.map((detail) => {
    if (detail.label === "Email" && email?.value) {
      return { ...detail, value: email.value, href: `mailto:${email.value}` };
    }
    if (detail.label === "Phone" && phone?.value) {
      return { ...detail, value: phone.value, href: `tel:${phone.value.replace(/\s+/g, "")}` };
    }
    return detail;
  });
  if (!place) return rows;
  const postal = rows[0];
  return [
    {
      label: "Location",
      value: place,
      href: `https://maps.google.com/?q=${encodeURIComponent(place)}`,
      icon: cloneElement(postal.icon),
    },
    ...rows,
  ];
}

export default function ContactScreen({
  contacts,
  location,
}: {
  contacts?: ClubContact[];
  location?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const contactDetails = detailsFromContacts(contacts, location);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitted(false);
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const type = String(data.get("type") ?? "client");
    const message = String(data.get("message") ?? "").trim();
    const subject = `${type[0]?.toUpperCase() ?? "C"}${type.slice(1)} enquiry`;

    setPending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message: phone ? `Phone: ${phone}\n\n${message}` : message,
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Could not send the message.");
      }
      setSubmitted(true);
      form.reset();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not send the message.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-brand-navy text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src="/background.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-brand-navy/65" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-brand-navy/90 via-brand-navy/55 to-brand-navy/45" />

        <div className="mx-auto flex min-h-[230px] max-w-7xl flex-col justify-center px-4 py-12 md:min-h-[280px] md:px-6">
          <h1 className="font-display text-5xl font-bold uppercase leading-none tracking-tight md:text-7xl">
            Contact <span className="text-brand-teal">Us</span>
          </h1>
          <p className="mt-4 text-base text-gray-200 md:text-lg">Get in touch with the team</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <div className="rounded-3xl bg-linear-to-br from-[#1c263c] via-[#202b36] to-[#27331f] px-6 py-9 text-center shadow-lg shadow-black/20 md:px-10">
            <h2 className="font-display text-4xl leading-none text-white md:text-5xl">
              Let&apos;s <span className="text-brand-teal">Connect</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-gray-300 md:text-base">
              Have a question or want to work with us? We would love to hear from you!
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl uppercase leading-none text-white md:text-4xl">
              Direct contact
            </h2>
            <div className="mt-6 space-y-4">
              {contactDetails.map((detail) => (
                <a
                  key={detail.label}
                  href={detail.href}
                  target={detail.label === "P.O. BOX" || detail.label === "Location" ? "_blank" : undefined}
                  rel={detail.label === "P.O. BOX" || detail.label === "Location" ? "noreferrer" : undefined}
                  className="flex items-center gap-3 text-sm text-gray-300 transition-colors hover:text-brand-teal md:text-base"
                >
                  <span className="h-5 w-5 shrink-0 text-brand-teal [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-none [&>svg]:stroke-current [&>svg]:stroke-2">
                    {detail.icon}
                  </span>
                  <span>
                    <span className="sr-only">{detail.label}: </span>
                    {detail.value}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-12 rounded-3xl border-2 border-[#293448] bg-[#0f141f] p-6 shadow-xl shadow-black/10 md:mt-16 md:p-10"
        >
          <div>
            <h2 className="font-display text-3xl uppercase leading-none md:text-4xl">
              Send us a message
            </h2>
            <p className="mt-3 text-sm text-gray-400">
              Fill out the form below and we&apos;ll get back to you as soon as possible.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <label className="font-display text-xl text-gray-200">
              Name <span className="text-red-500">*</span>
              <input className={inputClassName} name="name" required autoComplete="name" />
            </label>
            <label className="font-display text-xl text-gray-200">
              Phone number <span className="text-red-500">*</span>
              <input
                className={inputClassName}
                name="phone"
                type="tel"
                required
                autoComplete="tel"
              />
            </label>
            <label className="font-display text-xl text-gray-200">
              Email <span className="text-red-500">*</span>
              <input
                className={inputClassName}
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </label>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-[7rem_1fr] md:items-start">
            <label htmlFor="contact-type" className="font-display text-xl text-gray-200">
              Type:
            </label>
            <select id="contact-type" name="type" className={inputClassName.replace("mt-2", "mt-0")}>
              <option value="client">Client</option>
              <option value="sponsor">Sponsor</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-[7rem_1fr] md:items-start">
            <label htmlFor="message" className="font-display text-xl text-gray-200">
              Message:
            </label>
            <textarea id="message" name="message" required rows={5} className={inputClassName.replace("mt-2", "mt-0")} />
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              type="submit"
              disabled={pending}
              className="w-full max-w-xs rounded-full bg-[#276b24] px-8 py-3 font-display text-2xl uppercase leading-none text-white transition-colors hover:bg-brand-teal hover:text-brand-navy disabled:opacity-60"
            >
              {pending ? "Sending…" : "Submit"}
            </button>
            {submitted && (
              <p role="status" className="text-sm text-brand-lime">
                Thanks for reaching out. We&apos;ll get back to you soon.
              </p>
            )}
            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
