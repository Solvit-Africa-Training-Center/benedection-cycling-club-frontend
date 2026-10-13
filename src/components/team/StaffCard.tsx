import Image from "next/image";
import type { StaffMember } from "@/data/staff";
import PhotoPlaceholder from "./PhotoPlaceholder";

type StaffCardProps = {
  member: StaffMember;
};

export default function StaffCard({ member }: StaffCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
      <div className="relative aspect-[4/5] overflow-hidden">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-top"
          />
        ) : (
          <PhotoPlaceholder
            name={member.name}
            className="absolute inset-0 h-full w-full"
          />
        )}
      </div>
      <div className="p-5 font-sans">
        <p className="text-[11px] font-bold uppercase tracking-widest text-brand-lime">
          {member.role}
        </p>
        <h3 className="mt-2 font-display text-xl font-bold uppercase leading-tight text-white">
          {member.name}
        </h3>
        {member.description ? (
          <p className="mt-3 font-sans text-sm leading-relaxed text-gray-400">
            {member.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}

