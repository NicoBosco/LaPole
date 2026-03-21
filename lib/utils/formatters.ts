export function formatRaceDate(dateInput: string | Date): string {
  const date =
    typeof dateInput === "string"
      ? new Date(dateInput + "T12:00:00Z")
      : dateInput;

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatShortDate(dateInput: string | Date): string {
  const date =
    typeof dateInput === "string"
      ? new Date(dateInput + "T12:00:00Z")
      : dateInput;

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function formatRaceTime(timeStr: string): string {
  try {
    const today = new Date().toISOString().split("T")[0];
    const dt = new Date(`${today}T${timeStr}`);
    return dt.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return timeStr;
  }
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + "T00:00:00Z");
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function formatLapTime(time: string): string {
  if (time.includes(":")) return time;
  const totalMs = parseFloat(time) * 1000;
  const mins = Math.floor(totalMs / 60000);
  const secs = ((totalMs % 60000) / 1000).toFixed(3);
  return mins > 0 ? `${mins}:${secs.padStart(6, "0")}` : secs;
}

export function formatPosition(pos: number): string {
  return `${pos}°`;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function getNationalityFlag(nationality: string): string {
  const flags: Record<string, string> = {
    British: "🇬🇧",
    Dutch: "🇳🇱",
    Spanish: "🇪🇸",
    German: "🇩🇪",
    French: "🇫🇷",
    Australian: "🇦🇺",
    Finnish: "🇫🇮",
    Mexican: "🇲🇽",
    Canadian: "🇨🇦",
    Monégasque: "🇲🇨",
    Thai: "🇹🇭",
    American: "🇺🇸",
    Danish: "🇩🇰",
    Chinese: "🇨🇳",
    Italian: "🇮🇹",
    Brazilian: "🇧🇷",
    Japanese: "🇯🇵",
    Argentinian: "🇦🇷",
    Austrian: "🇦🇹",
    Belgian: "🇧🇪",
    Polish: "🇵🇱",
    Swedish: "🇸🇪",
    New_Zealander: "🇳🇿",
  };
  return flags[nationality] ?? "";
}
