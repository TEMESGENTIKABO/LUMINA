// Current Addis Ababa conditions from Open-Meteo (free, no API key).
// Returns nothing if the service is slow or unavailable.
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  type LucideIcon,
} from "lucide-react";

function describe(code: number): { label: string; Icon: LucideIcon } {
  if (code === 0) return { label: "Clear", Icon: Sun };
  if (code <= 3) return { label: "Partly cloudy", Icon: CloudSun };
  if (code === 45 || code === 48) return { label: "Fog", Icon: CloudFog };
  if (code >= 51 && code <= 57) return { label: "Drizzle", Icon: CloudDrizzle };
  if (code >= 61 && code <= 67) return { label: "Rain", Icon: CloudRain };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86)
    return { label: "Snow", Icon: CloudSnow };
  if (code >= 80 && code <= 82) return { label: "Showers", Icon: CloudRain };
  if (code >= 95) return { label: "Thunderstorm", Icon: CloudLightning };
  return { label: "", Icon: Cloud };
}

export async function AddisWeather() {
  let temp: unknown;
  let code: unknown;

  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=9.03&longitude=38.74&current=temperature_2m,weather_code&timezone=Africa%2FAddis_Ababa",
      { next: { revalidate: 1800 }, signal: AbortSignal.timeout(3000) },
    );
    if (!res.ok) return null;
    const data = await res.json();
    temp = data?.current?.temperature_2m;
    code = data?.current?.weather_code;
  } catch {
    return null;
  }

  if (typeof temp !== "number") return null;
  const { label, Icon } =
    typeof code === "number" ? describe(code) : { label: "", Icon: Cloud };

  return (
    <span className="hp-wx">
      <Icon size={15} aria-hidden />
      Addis Ababa <b>{Math.round(temp)}&deg;C</b>
      {label && <span>{label}</span>}
    </span>
  );
}
