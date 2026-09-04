// Converts a Gregorian date to the Ethiopian calendar (Ge'ez calendar).
// The Ethiopian new year falls on Sept 11 (Sept 12 in Gregorian leap years),
// and the Ethiopian calendar runs roughly 7-8 years behind Gregorian.

const ETHIOPIAN_MONTHS_EN = [
  "Meskerem",
  "Tikimt",
  "Hidar",
  "Tahsas",
  "Tir",
  "Yekatit",
  "Megabit",
  "Miazia",
  "Ginbot",
  "Sene",
  "Hamle",
  "Nehase",
  "Pagume",
];

const ETHIOPIAN_MONTHS_AM = [
  "መስከረም", // Meskerem
  "ጥቅምት", // Tikimt
  "ህዳር", // Hidar
  "ታህሳስ", // Tahsas
  "ጥር", // Tir
  "የካቲት", // Yekatit
  "መጋቢት", // Megabit
  "ሚያዝያ", // Miazia
  "ግንቦት", // Ginbot
  "ሰኔ", // Sene
  "ሐምሌ", // Hamle
  "ነሐሴ", // Nehase
  "ጳጉሜ", // Pagume
];

function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function toEthiopianDate(gregorianDate: Date): {
  year: number;
  month: number;
  day: number;
} {
  const year = gregorianDate.getFullYear();
  const newYearDay = isGregorianLeapYear(year) ? 12 : 11;
  const ethNewYear = new Date(year, 8, newYearDay); // September

  let ethYear = year - 8;
  let referenceDate: Date;
  if (gregorianDate >= ethNewYear) {
    ethYear = year - 7;
    referenceDate = ethNewYear;
  } else {
    const prevNewYearDay = isGregorianLeapYear(year - 1) ? 12 : 11;
    referenceDate = new Date(year - 1, 8, prevNewYearDay);
  }

  const diffDays = Math.floor(
    (gregorianDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const month = Math.floor(diffDays / 30) + 1;
  const day = (diffDays % 30) + 1;

  return { year: ethYear, month: Math.min(month, 13), day };
}

export function formatEthiopianDate(
  date: Date,
  locale: "en" | "am" = "en",
): string {
  const { year, month, day } = toEthiopianDate(date);
  const monthNames =
    locale === "am" ? ETHIOPIAN_MONTHS_AM : ETHIOPIAN_MONTHS_EN;
  const monthName = monthNames[Math.min(month - 1, 12)];
  return `${monthName} ${day}, ${year}`;
}
