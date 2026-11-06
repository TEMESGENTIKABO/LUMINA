import { Sun, CloudSun, Cloud, CloudRain, CloudLightning } from "lucide-react";

export async function WeatherBadge() {
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

  return (
    <span className="hd-wx">
      {code === 0 ? (
        <Sun size={22} strokeWidth={1.8} />
      ) : code <= 2 ? (
        <CloudSun size={22} strokeWidth={1.8} />
      ) : code <= 48 ? (
        <Cloud size={22} strokeWidth={1.8} />
      ) : code >= 95 ? (
        <CloudLightning size={22} strokeWidth={1.8} />
      ) : (
        <CloudRain size={22} strokeWidth={1.8} />
      )}
      <span>
        <b>{Math.round(temp)}°C</b>{"Add" + "is " + "Ab" + "aba"}
      </span>
    </span>
  );
}
