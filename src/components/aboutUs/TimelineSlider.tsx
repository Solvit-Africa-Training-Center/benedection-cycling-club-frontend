"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path d="M19 12H5M11 6l-6 6 6 6" />
      ) : (
        <path d="M5 12h14M13 6l6 6-6 6" />
      )}
    </svg>
  );
}

export default function TimelineSlider({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  function update() {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 8);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 8);
  }

  // Re-check the arrows whenever the row changes size
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  function slide(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return;
    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement | undefined;
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  const arrowClass =
    "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-lime text-brand-navy shadow-lg transition-opacity hover:opacity-90";

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={update}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <div className="flex w-[85%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)] [&>*]:flex-1">
            {child}
          </div>
        ))}
      </div>

      {canPrev && (
        <button
          type="button"
          onClick={() => slide(-1)}
          aria-label="Previous milestones"
          className={`${arrowClass} -left-3 md:-left-5`}
        >
          <Arrow direction="left" />
        </button>
      )}
      {canNext && (
        <button
          type="button"
          onClick={() => slide(1)}
          aria-label="Next milestones"
          className={`${arrowClass} -right-3 md:-right-5`}
        >
          <Arrow direction="right" />
        </button>
      )}
    </div>
  );
}