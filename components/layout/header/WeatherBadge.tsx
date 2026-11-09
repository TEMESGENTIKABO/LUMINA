import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from "lucide-react";
import { hdLabels } from "./utils";

// Open-Meteo uses WMO weather codes.
function WeatherIcon({ code }: { code: number }) {
  const p = { size: 22, strokeWidth: 1.8, "aria-hidden": true } as const;
  if (code === 0) return <Sun {...p} />;
  if (code <= 2) return <CloudSun {...p} />;
  if (code === 3) return <Cloud {...p} />;
  if (code <= 48) return <CloudFog {...p} />;
  if (code >= 95) return <CloudLightning {...p} />;
  if ((code >= 71 && code <= 77) || code === 85 || code === 86)
    return <CloudSnow {...p} />;
  return <CloudRain {...p} />;
}

export async function WeatherBadge({ locale = "en" }: { locale?: string }) {
  let temp: number;
  let code = 0;

  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=9.03&longitude=38.74&current=temperature_2m,weather_code",
      { next: { revalidate: 1800 }, signal: AbortSignal.timeout(3000) },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const currentTemp = data?.current?.temperature_2m;
    if (typeof currentTemp !== "number") return null;
    temp = currentTemp;
    code = data.current.weather_code ?? 0;
  } catch {
    return null;
  }

  const city = hdLabels(locale).city;
  const t = Math.round(temp);

  return (
    <span className="hd-wx" role="group" aria-label={`${city}: ${t}°C`}>
      <WeatherIcon code={code} />
      <span>
        <b>{t}°C</b>
        {city}
      </span>
    </span>
  );
}
