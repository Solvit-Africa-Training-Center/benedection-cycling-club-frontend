"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/LanguageProvider";

type PhotoPlaceholderProps = {
  name: string;
  className?: string;
  src?: string;
  sizes?: string;
};

export default function PhotoPlaceholder({ name, className = "", src, sizes }: PhotoPlaceholderProps) {
  const { t } = useI18n();
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <Image
        src={src}
        alt={name}
        fill
        sizes={sizes}
        unoptimized={src.startsWith("http")}
        className="object-cover object-top"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${t.common.photoSoonFor} ${name}`}
      className={`flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-700 to-slate-900 ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-12 w-12 text-white/40"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
        />
      </svg>
      <span className="font-sans text-xs font-semibold uppercase tracking-widest text-white/50">
        {t.common.photoSoon}
      </span>
    </div>
  );
}
