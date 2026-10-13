import Link from "next/link";
import { notFound } from "next/navigation";
import { cyclists } from "@/data/cyclists";
import ProfileHero from "@/components/team/profile/ProfileHero";
import {
  PersonalProfilePanel,
  QuestionsAnswersPanel,
} from "@/components/team/profile/ProfilePanels";
import CareerHighlights, {
  RiderGallery,
} from "@/components/team/profile/CareerHighlights";
import FollowJourneyBanner from "@/components/team/profile/FollowJourneyBanner";

export function generateStaticParams() {
  return cyclists.map((cyclist) => ({ slug: cyclist.slug }));
}

type RiderPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function RiderPage({ params }: RiderPageProps) {
  const { slug } = await params;
  const rider = cyclists.find((cyclist) => cyclist.slug === slug);

  if (!rider) {
    notFound();
  }

  const displayName = rider.name;

  return (
    <main className="min-h-screen bg-brand-navy font-sans text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <Link
          href="/team"
          className="inline-block font-sans text-sm font-semibold text-brand-lime transition-colors hover:text-white"
        >
          ← Back to team
        </Link>

        <div className="mt-6">
          <ProfileHero rider={rider} />
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <PersonalProfilePanel rider={rider} />
          <QuestionsAnswersPanel rider={rider} />
        </div>

        <CareerHighlights rider={rider} />

        <RiderGallery name={displayName} rider={rider} />

        <FollowJourneyBanner />
      </div>
    </main>
  );
}
