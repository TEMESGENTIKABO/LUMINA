"use client";

import useEmblaCarousel from "embla-carousel-react";

export function Carousel({ children }: { children: React.ReactNode }) {
  const [emblaRef] = useEmblaCarousel({ align: "start", dragFree: true });

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-6">{children}</div>
    </div>
  );
}
