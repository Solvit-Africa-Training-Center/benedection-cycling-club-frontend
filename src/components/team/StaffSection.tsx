import { staff } from "@/data/staff";
import StaffCard from "./StaffCard";

export default function StaffSection() {
  return (
    <section aria-labelledby="staff-heading" className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <h2
        id="staff-heading"
        className="font-display text-3xl font-bold uppercase text-white md:text-4xl"
      >
        Meet the Staff Members
      </h2>
      <p className="mt-3 max-w-3xl font-sans text-sm leading-relaxed text-gray-400 md:text-base">
        Races are won on the road, but championships are built in the service course, feed
        zones, and telemetry vans.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {staff.map((member) => (
          <StaffCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}
