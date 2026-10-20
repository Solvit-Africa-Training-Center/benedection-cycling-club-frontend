type Partner = {
  name: string;
  caption: string;
};

const partners: Partner[] = [
  { name: "BANAFRICA FOREIGN LANGUAGE", caption: "translation, interpreting and language services" },
  { name: "DOLTCINI", caption: "cycling clothing and sportswear." },
  { name: "IPXI CARPETS", caption: "carpets and floor coverings." },
  { name: "BETONWERKEN LOMBAERT", caption: "concrete works and construction" },
  { name: "INYANGE INDUSTRIES", caption: "Food processing, Dairy products  and beverages" },
  { name: "TERRA TREASURE STONE", caption: "stone cutting and paving" },
  { name: "MAGASSIN SPORTSCLASS", caption: "sports equipments and jersey retail"},
  { name: "VAN DERVALK HOTEL BEVEREN", caption: "Hospitality, accomodation and events"}
];

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-stretch gap-4 pr-4"
    >
      {partners.map((partner) => (
        <li
          key={partner.name}
          className="flex h-28 w-56 shrink-0 flex-col items-center justify-center rounded-sm bg-[#222836] px-4 text-center"
        >
          <p className="font-display text-xl font-bold uppercase tracking-wide text-gray-300">
            {partner.name}
          </p>
          <p className="mt-1 text-[8px] uppercase tracking-wider text-gray-500">
            {partner.caption}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function PartnersMarquee() {
  return (
    <div className="marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="marquee-track flex w-max">
        <Group />
        {/* Second copy makes the loop seamless */}
        <Group hidden />
      </div>
    </div>
  );
}