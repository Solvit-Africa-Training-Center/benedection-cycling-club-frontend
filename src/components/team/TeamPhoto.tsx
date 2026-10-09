import Image from "next/image";

type TeamPhotoProps = {
  name: string;
  image?: string;
  aspectClass: string;
};

export default function TeamPhoto({ name, image, aspectClass }: TeamPhotoProps) {
  if (image) {
    return (
      <div className={`relative w-full overflow-hidden ${aspectClass}`}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Photo coming soon for ${name}`}
      className={`flex w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-700 to-slate-900 ${aspectClass}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-12 w-12 text-white/40"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
        />
      </svg>
      <span className="font-sans text-xs font-semibold uppercase tracking-widest text-white/50">
        Photo coming soon
      </span>
    </div>
  );
}
