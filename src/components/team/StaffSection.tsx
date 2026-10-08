import { staffTeam } from "@/data/cyclists";
import StaffCard from "./StaffCard";

export default function StaffSection() {
  return (
    <section aria-labelledby="staff-heading" className="bg-club-panel/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-club-lime">Behind the team</p>
        <h2 id="staff-heading" className="mt-2 text-3xl font-bold text-white md:text-4xl">
          Staff &amp; support
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-club-muted">
          Coaches, mechanics, and managers keeping the squad fast, healthy, and race-ready.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {staffTeam.map((member) => (
            <StaffCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

