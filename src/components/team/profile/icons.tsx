type IconProps = {
  className?: string;
};

function Base({
  className = "",
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className={className}
    >
      {children}
    </svg>
  );
}

export function CalendarIcon({ className = "" }: IconProps) {
  return (
    <Base className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
      />
    </Base>
  );
}

export function LocationIcon({ className = "" }: IconProps) {
  return (
    <Base className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z"
      />
      <circle cx="12" cy="10" r="2.5" />
    </Base>
  );
}

export function BikeIcon({ className = "" }: IconProps) {
  return (
    <Base className={className}>
      <circle cx="6" cy="17" r="3.5" />
      <circle cx="18" cy="17" r="3.5" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 17 9.5 8H15l3 9M9.5 8 8 5.5H5.5M15 8l-2.5-2.5H9.5"
      />
    </Base>
  );
}

export function TeamIcon({ className = "" }: IconProps) {
  return (
    <Base className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM22 19v-1a4 4 0 0 0-3-3.87M15.5 3.13a3.5 3.5 0 0 1 0 6.74"
      />
    </Base>
  );
}

export function FlagIcon({ className = "" }: IconProps) {
  return (
    <Base className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 21V4m0 1h12l-2.5 4L17 13H5"
      />
    </Base>
  );
}

export function GlobeIcon({ className = "" }: IconProps) {
  return (
    <Base className={className}>
      <circle cx="12" cy="12" r="9" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z"
      />
    </Base>
  );
}

export function RulerIcon({ className = "" }: IconProps) {
  return (
    <Base className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3 17 14-14 4 4L7 21l-4-4ZM8 16l1.5 1.5M11 13l1.5 1.5M14 10l1.5 1.5M17 7l1.5 1.5"
      />
    </Base>
  );
}

export function ScaleIcon({ className = "" }: IconProps) {
  return (
    <Base className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v18M5 7l7-4 7 4M5 7l-2.5 6a3.5 3.5 0 0 0 7 0L7 7M19 7l-2.5 6a3.5 3.5 0 0 0 7 0L21 7M8 21h8"
      />
    </Base>
  );
}

export function TrophyIcon({ className = "" }: IconProps) {
  return (
    <Base className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4a1 1 0 0 0-1 1c0 2.5 2 4.5 4.5 4.5M17 6h3a1 1 0 0 1 1 1c0 2.5-2 4.5-4.5 4.5"
      />
    </Base>
  );
}

export function StarIcon({ className = "" }: IconProps) {
  return (
    <Base className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5L2.5 9.4l6.6-.9 2.9-6Z"
      />
    </Base>
  );
}

export function QuoteIcon({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M10 7H6a3 3 0 0 0-3 3v7h7v-7H6.5A1.5 1.5 0 0 1 8 8.5V7h2Zm11 0h-4a3 3 0 0 0-3 3v7h7v-7h-3.5a1.5 1.5 0 0 1 1.5-1.5V7h2Z" />
    </svg>
  );
}

export function XLogoIcon({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L1.6 2H8l4.4 5.9L18.9 2Zm-1.1 18h1.7L7 3.8H5.2L17.8 20Z" />
    </svg>
  );
}

export function YoutubeIcon({ className = "" }: IconProps) {
  return (
    <Base className={className}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path fill="currentColor" stroke="none" d="m10.5 9.5 5 2.5-5 2.5v-5Z" />
    </Base>
  );
}

export function FacebookIcon({ className = "" }: IconProps) {
  return (
    <Base className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V9H6.5v4H9v8h4v-8h2.5l.5-4H13V6.8c0-.5.4-.8.9-.8H15V3Z"
      />
    </Base>
  );
}
