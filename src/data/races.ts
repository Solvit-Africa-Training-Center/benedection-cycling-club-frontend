// Official race calendar (dates, locations, squad). Used when the API row has no date or location.

export type Team = "men" | "women" | "junior" | "all";

export type Race = {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  seasonYear?: number;
  location: string;
  team: Team;
};

export type RaceResult = {
  place: number;
  riderSlug: string;
  riderName?: string;
  cyclistId?: number;
  race: string;
  time: string;
};

export type ClubStat = {
  value: number;
  label: string;
  roster?: "men" | "women" | "junior";
};

export function getRaceStatus(race: Race, todayIso: string): "upcoming" | "ongoing" | "completed" | "season" {
  if (!race.startDate) {
    if (!race.seasonYear) return "season";
    const todayYear = Number(todayIso.slice(0, 4));
    if (race.seasonYear < todayYear) return "completed";
    if (race.seasonYear > todayYear) return "upcoming";
    return "season";
  }
  const end = race.endDate ?? race.startDate;
  if (end < todayIso) {
    return "completed";
  }
  if (race.startDate <= todayIso) {
    return "ongoing";
  }
  return "upcoming";
}

export function todayInKigali(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Kigali",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function raceNameKey(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function raceYear(race: Pick<Race, "startDate" | "seasonYear">): string {
  if (race.startDate && race.startDate.length >= 4) return race.startDate.slice(0, 4);
  return race.seasonYear ? String(race.seasonYear) : "";
}

function calendarKey(race: Pick<Race, "name" | "startDate" | "seasonYear">): string {
  return `${raceNameKey(race.name)}|${raceYear(race)}`;
}

/** Official club calendar used when the API has no date or location yet. */
export const races: Race[] = [
  { id: "1", name: "Rwanda Cycling Cup Final", startDate: "2025-12-06", endDate: "2025-12-07", location: "Rwanda", team: "all" },
  { id: "2", name: "Heroes Cycling Cup", startDate: "2026-01-24", location: "Rwanda", team: "all" },
  { id: "3", name: "Tour du Rwanda", startDate: "2026-02-22", endDate: "2026-03-01", location: "Rwanda", team: "men" },
  { id: "4", name: "Race to Remember", startDate: "2026-04-25", endDate: "2026-04-26", location: "Rwanda", team: "all" },
  { id: "5", name: "Rwanda National Championships", startDate: "2026-06-27", endDate: "2026-06-28", location: "Rwanda", team: "all" },
  { id: "6", name: "Rwanda Cycling Classic", startDate: "2026-10-12", endDate: "2026-10-18", location: "Rwanda", team: "all" },
  { id: "7", name: "Amstel Gold Race", startDate: "2027-04-13", location: "Netherlands", team: "men" },
  { id: "8", name: "Tour du Rwanda", startDate: "2027-04-20", endDate: "2027-04-27", location: "Rwanda", team: "men" },
  { id: "9", name: "Flèche Wallonne", startDate: "2027-04-23", location: "Belgium", team: "women" },
  { id: "10", name: "Liège-Bastogne", startDate: "2027-04-27", location: "Belgium", team: "men" },
  { id: "11", name: "Vuelta a España", startDate: "2027-07-05", endDate: "2027-07-07", location: "Spain", team: "men" },
  { id: "12", name: "UCI Championships", startDate: "2027-08-23", endDate: "2027-09-28", location: "Switzerland", team: "all" },
  { id: "13", name: "Tour de l'Avenir", startDate: "2027-09-21", endDate: "2027-09-28", location: "France", team: "junior" },
  { id: "14", name: "Tour de France", startDate: "2027-11-08", endDate: "2027-11-10", location: "France", team: "men" },
];

export function mergeRaceCalendar(apiRaces: Race[], calendar: Race[] = races): Race[] {
  const unused = new Map(calendar.map((race) => [calendarKey(race), race] as const));
  const merged: Race[] = [];

  for (const race of apiRaces) {
    const exact = unused.get(calendarKey(race));
    const sameName = [...unused.values()].filter((item) => raceNameKey(item.name) === raceNameKey(race.name));
    const byYear = sameName.find((item) => raceYear(item) === raceYear(race));
    const cal = exact || byYear || (!raceYear(race) && !race.startDate && !race.location ? sameName[0] : undefined);

    if (cal) unused.delete(calendarKey(cal));

    const next: Race = {
      ...race,
      name: cal?.name || race.name,
      startDate: cal?.startDate || race.startDate,
      endDate: cal?.endDate || race.endDate,
      location: cal?.location || race.location || "",
      team: cal?.team && cal.team !== "all" ? cal.team : race.team !== "all" ? race.team : cal?.team ?? race.team,
      seasonYear: race.seasonYear ?? (cal?.startDate ? Number(cal.startDate.slice(0, 4)) : cal?.seasonYear),
    };

    if (next.startDate || next.location || cal) merged.push(next);
  }

  merged.push(...unused.values());
  return merged;
}

export const raceResults: RaceResult[] = [
  { place: 1, riderSlug: "mugisha-moise", race: "Tour du Rwanda", time: "4:23:10" },
  { place: 2, riderSlug: "masengesho-vainqueur", race: "Tour du Rwanda", time: "4:23:24" },
  { place: 3, riderSlug: "uwiduhaye-mike", race: "Tour du Rwanda", time: "4:23:41" },
  { place: 4, riderSlug: "manizabayo-eric", race: "Tour du Rwanda", time: "4:24:05" },
  { place: 5, riderSlug: "nzafashwanayo-jean-claude", race: "Tour du Rwanda", time: "4:24:32" },
];

export const clubStats: ClubStat[] = [
  { value: 51, label: "Wins by Benediction Club Men team in 2026", roster: "men" },
  { value: 12, label: "Wins by Benediction Club Women team in 2026", roster: "women" },
  { value: 8, label: "Wins by Benediction Club Junior Team", roster: "junior" },
];
