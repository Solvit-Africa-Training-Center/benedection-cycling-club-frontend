const fallbackPartners = [
  { name: "Skol", caption: "Official Beverage" },
  { name: "Minisports", caption: "Republic of Rwanda" },
  { name: "Ferwacy", caption: "Rwanda Cycling Fed." },
  { name: "Rubavu", caption: "Home District" },
  { name: "Visit Rwanda", caption: "Global Tourism" },
  { name: "UCI Tour", caption: "Africa Continental" },
];

export default function Partners({
  partners = fallbackPartners,
}: {
  partners?: { name: string; caption?: string }[];
}) {
  return (
    <section className="bg-[#1b212d] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
        {/* Header */}
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Propelled by national &amp; international alliances
          </p>
          <h2 className="mt-2 font-display text-xl font-bold uppercase tracking-wide text-gray-100 md:text-2xl">
            Our official club partners
          </h2>
        </div>

        {/* Tiles */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col items-center justify-center rounded-sm bg-[#222836] px-3 py-5 text-center"
            >
              <p className="font-display text-xl font-bold uppercase tracking-wide text-gray-300">
                {partner.name}
              </p>
              {partner.caption ? (
              <p className="mt-1 text-[8px] uppercase tracking-wider text-gray-500">
                {partner.caption}
              </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}