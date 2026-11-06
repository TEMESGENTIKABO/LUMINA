// Current Addis Ababa conditions from Open-Meteo (free, no API key).
// Returns nothing if the service is slow or unavailable.

function describe(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code === 45 || code === 48) return "Fog";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 95) return "Thunderstorm";
  return "";
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

  return (
    <span className="whitespace-nowrap font-ui text-xs tabular-nums text-obsidian-grey/70">
      Addis Ababa{" "}
      <strong className="font-semibold text-aksum-black">
        {Math.round(temp)}&deg;C
      </strong>{" "}
      {typeof code === "number" ? describe(code) : ""}
    </span>
  );
}
