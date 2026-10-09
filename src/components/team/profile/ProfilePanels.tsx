import type { Cyclist } from "@/data/cyclists";
import {
  BikeIcon,
  CalendarIcon,
  FlagIcon,
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

function rowsFor(rider: Cyclist): ProfileRow[] {
  const rows: ProfileRow[] = [];
  if (rider.dateOfBirth) {
    rows.push({
      key: "dob",
      label: "Date of birth",
      value: rider.dateOfBirth,
      Icon: CalendarIcon,
    });
  } else {
    rows.push({
      key: "age",
      label: "Age",
      value: String(rider.age),
      Icon: CalendarIcon,
    });
  }
  if (rider.country) {
    rows.push({ key: "nationality", label: "Nationality", value: rider.country, Icon: GlobeIcon });
  }
  if (rider.hometown) {
    rows.push({ key: "hometown", label: "Hometown", value: rider.hometown, Icon: LocationIcon });
  }
  if (rider.heightCm !== undefined && rider.heightCm !== null) {
    rows.push({
      key: "height",
      label: "Height",
      value: `${rider.heightCm}cm`,
      Icon: RulerIcon,
    });
  }
  if (rider.weightKg !== undefined && rider.weightKg !== null) {
    rows.push({
      key: "weight",
      label: "Weight",
      value: `${rider.weightKg}kg`,
      Icon: ScaleIcon,
    });
  }
  if (rider.discipline) {
    rows.push({ key: "discipline", label: "Discipline", value: rider.discipline, Icon: BikeIcon });
  }
  if (rider.team) {
    rows.push({ key: "team", label: "Team", value: rider.team, Icon: TeamIcon });
  }
  if (rider.racingSince !== undefined) {
    rows.push({
      key: "racing-since",
      label: "Racing since",
      value: String(rider.racingSince),
      Icon: FlagIcon,
    });
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
  const rows = rowsFor(rider);
  return (
    <section aria-label="Personal profile">
      <PanelTitle>Personal Profile</PanelTitle>
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
            <dd className="font-sans text-sm text-white">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function QuestionsAnswersPanel({ rider }: { rider: Cyclist }) {
  const qa = rider.qa ?? [];
  return (
    <section aria-label="Questions and answers">
      <PanelTitle>Questions &amp; Answers</PanelTitle>
      {qa.length > 0 ? (
        <dl className="mt-4 rounded-sm border border-blue-900/50 bg-[#0c1626]">
          {qa.map((item) => (
            <div
              key={item.question}
              className="flex items-start justify-between gap-4 border-b border-blue-900/50 px-4 py-3 last:border-b-0"
            >
              <dt className="font-sans text-xs font-semibold uppercase tracking-wide text-blue-400">
                {item.question}
              </dt>
              <dd className="max-w-[55%] shrink-0 text-right font-sans text-sm text-white">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-4 font-sans text-sm text-gray-500">Coming soon</p>
      )}
      {qa.length > 0 && rider.quote ? (
        <figure className="mt-4 rounded-lg border border-brand-lime/70 px-5 py-4">
          <div className="flex items-start gap-3">
            <QuoteIcon className="h-6 w-6 shrink-0 text-brand-lime" />
            <blockquote className="flex-1 text-center font-sans text-sm italic leading-relaxed text-white">
              “{rider.quote}”
            </blockquote>
          </div>
        </figure>
      ) : null}
    </section>
  );
}
