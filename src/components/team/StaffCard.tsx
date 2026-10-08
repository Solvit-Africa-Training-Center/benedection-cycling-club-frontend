import type { StaffMember } from "@/data/cyclists";
import PhotoPlaceholder from "./PhotoPlaceholder";

type StaffCardProps = {
  member: StaffMember;
};

export default function StaffCard({ member }: StaffCardProps) {
  return (
    <article className="overflow-hidden rounded-xl bg-club-panel ring-1 ring-white/10">
      <PhotoPlaceholder name={member.name} className="aspect-[16/9] w-full" />
      <div className="p-5">
        <h3 className="text-lg font-bold text-white">{member.name}</h3>
        <p className="text-sm font-semibold uppercase tracking-wide text-club-lime">{member.role}</p>
        {member.bio && (
          <p className="mt-3 text-sm leading-relaxed text-gray-300">{member.bio}</p>
        )}
      </div>
    </article>
  );
}

