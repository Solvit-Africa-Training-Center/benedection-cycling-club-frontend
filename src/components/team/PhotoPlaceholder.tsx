type PhotoPlaceholderProps = {
  name: string;
  className?: string;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function PhotoPlaceholder({ name, className = "" }: PhotoPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Photo placeholder for ${name}`}
      className={`flex items-center justify-center bg-club-panel-light ${className}`}
    >
      <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-full bg-club-bg text-xl font-bold text-club-lime">
        {getInitials(name)}
      </span>
    </div>
  );
}

