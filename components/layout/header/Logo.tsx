import Link from "next/link";
import { Emblem } from "./Emblem";
import { hdLabels } from "./utils";

export function Logo({
  siteName,
  locale,
  emblem,
  tagline,
  onClick,
}: {
  siteName: string;
  locale: string;
  emblem: boolean;
  tagline: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={`/${locale}`}
      className="hd-logo"
      aria-label={`${siteName} — ${hdLabels(locale).home}`}
      onClick={onClick}
    >
      {emblem && <Emblem className="hd-emb" />}
      <span>
        <span className="hd-name hd-serif">{siteName}</span>
        {tagline && <small className="hd-tag">TRUTH · INSIGHT · IMPACT</small>}
      </span>
    </Link>
  );
}
