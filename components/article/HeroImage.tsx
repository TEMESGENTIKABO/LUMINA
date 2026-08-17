// HeroImage.tsx
import Image from "next/image";
import { clsx } from "clsx";

export function HeroImage({
  src,
  alt,
  caption,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={clsx("max-w-page mx-auto px-6 mt-6", className)}>
      <div className="relative aspect-[21/9] overflow-hidden rounded-lg shadow-sm bg-obsidian-grey/5">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover transition-transform duration-700 hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-aksum-black/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {caption && (
        <figcaption className="font-ui text-[length:var(--text-label)] text-obsidian-grey/60 mt-2 max-w-content mx-auto italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
