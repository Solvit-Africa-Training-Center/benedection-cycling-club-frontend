"use client";

import type { Cyclist } from "@/data/cyclists";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { AppLang } from "@/lib/i18n/config";
import { ageFromDateOfBirth } from "@/data/cyclists";
import {
  BikeIcon,
  CalendarIcon,
  GlobeIcon,
  LocationIcon,
  QuoteIcon,
  RulerIcon,
  ScaleIcon,
  TeamIcon,
} from "./icons";

type RowIcon = (props: { className?: string }) => React.JSX.Element;

type ProfileRow = {
  key: string;
  label: string;
  value: string;
  Icon: RowIcon;
};

function localizeProfileValue(key: string, value: string, t: Dictionary, lang: AppLang): string {
  if (lang !== "nl-BE") return value;
  if (key === "discipline" && /^road cycling$/i.test(value)) return t.team.roadCycling;
  if (key === "nationality") {
    if (/^rwanda$/i.test(value)) return t.team.rwanda;
    if (/^belgium$/i.test(value)) return t.team.belgium;
  }
  return value;
}

function rowsFor(rider: Cyclist, t: Dictionary): ProfileRow[] {
  const labels = t.team;
  const rows: ProfileRow[] = [];
  if (rider.dateOfBirth !== undefined || rider.age !== undefined) {
    rows.push({
      key: "age",
      label: labels.age,
      value: rider.dateOfBirth !== undefined ? String(ageFromDateOfBirth(rider.dateOfBirth)) : String(rider.age),
      Icon: CalendarIcon,
    });
  }
  if (rider.birthplace !== undefined) {
    rows.push({ key: "birthplace", label: labels.birthplace, value: rider.birthplace, Icon: LocationIcon });
  }
  if (rider.country !== undefined) {
    rows.push({ key: "nationality", label: labels.nationality, value: rider.country, Icon: GlobeIcon });
  }
  if (rider.height !== undefined) {
    rows.push({ key: "height", label: labels.height, value: rider.height, Icon: RulerIcon });
  }
  if (rider.weight !== undefined) {
    rows.push({ key: "weight", label: labels.weight, value: rider.weight, Icon: ScaleIcon });
  }
  if (rider.discipline !== undefined) {
    rows.push({ key: "discipline", label: labels.discipline, value: rider.discipline, Icon: BikeIcon });
  }
  if (rider.team !== undefined) {
    rows.push({ key: "team", label: labels.teamLabel, value: rider.team, Icon: TeamIcon });
  }
  return rows;
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white">
      {children}
    </h2>
  );
}

export function PersonalProfilePanel({ rider }: { rider: Cyclist }) {
  const { t, lang } = useI18n();
  const rows = rowsFor(rider, t);
  return (
    <section aria-label={t.team.personalProfile}>
      <PanelTitle>{t.team.personalProfile}</PanelTitle>
      <dl className="mt-4 rounded-sm border border-blue-900/50 bg-[#0c1626]">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-center gap-3 border-b border-blue-900/50 px-4 py-3 last:border-b-0"
          >
            <row.Icon className="h-4 w-4 shrink-0 text-blue-400" />
            <dt className="w-28 shrink-0 font-sans text-xs font-semibold uppercase tracking-wide text-blue-400">
              {row.label}
            </dt>
            <dd className="font-sans text-sm text-white">
              {localizeProfileValue(row.key, row.value, t, lang)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function QuestionsAnswersPanel({ rider }: { rider: Cyclist }) {
  const { t, lang } = useI18n();
  const qa = rider.qa ?? [];
  const quote = lang === "nl-BE" ? rider.quoteNl ?? rider.quote : rider.quote;
  return (
    <section aria-label={t.team.qa}>
      <PanelTitle>{t.team.qa}</PanelTitle>
      {qa.length > 0 ? (
        <dl className="mt-4 rounded-sm border border-blue-900/50 bg-[#0c1626]">
          {qa.map((item, index) => (
            <div
              key={`${item.question}-${index}`}
              className="flex items-start justify-between gap-4 border-b border-blue-900/50 px-4 py-3 last:border-b-0"
            >
              <dt className="font-sans text-xs font-semibold uppercase tracking-wide text-blue-400">
                {item.question === "favorite_food" || /favorite food/i.test(item.question)
                  ? t.team.favoriteFood
                  : t.team.qaQuestions[index] ?? item.question}
              </dt>
              <dd className="max-w-[55%] shrink-0 text-right font-sans text-sm text-white">
                {lang === "nl-BE" ? item.answerNl ?? item.answer : item.answer}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-4 font-sans text-sm text-gray-500">{t.common.comingSoon}</p>
      )}
      {quote ? (
        <figure className="mt-4 rounded-lg border border-brand-lime/70 px-5 py-4">
          <div className="flex items-start gap-3">
            <QuoteIcon className="h-6 w-6 shrink-0 text-brand-lime" />
            <blockquote className="flex-1 text-center font-sans text-sm italic leading-relaxed text-white">
              “{quote}”
            </blockquote>
          </div>
        </figure>
      ) : null}
    </section>
  );
}
