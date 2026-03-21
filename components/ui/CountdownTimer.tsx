"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string | Date;
  targetTime?: string;
}

function computeCountdown(targetDate: string | Date, targetTime?: string) {
  const target =
    typeof targetDate === "string"
      ? targetTime
        ? new Date(`${targetDate}T${targetTime}`)
        : new Date(`${targetDate}T00:00:00Z`)
      : targetDate;

  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0)
    return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, past: false };
}

export function CountdownTimer({
  targetDate,
  targetTime,
}: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(() =>
    computeCountdown(targetDate, targetTime),
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const interval = setInterval(() => {
      setTime(computeCountdown(targetDate, targetTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  if (!mounted) {
    return (
      <div className="flex items-end gap-2 opacity-0 animate-pulse">
        <CountUnit value={0} label="días" />
        <CountUnit value={0} label="h" />
        <CountUnit value={0} label="m" />
        <CountUnit value={0} label="s" small />
      </div>
    );
  }

  if (time.past) {
    return (
      <span className="text-sm font-semibold text-[var(--color-text-muted)]">
        Carrera finalizada
      </span>
    );
  }

  return (
    <div className="flex items-end gap-2">
      {time.days > 0 && (
        <CountUnit
          value={time.days}
          label={time.days === 1 ? "día" : "días"}
          accent
        />
      )}
      <CountUnit value={time.hours} label="h" />
      <CountUnit value={time.minutes} label="m" />
      <CountUnit value={time.seconds} label="s" small />
    </div>
  );
}

function CountUnit({
  value,
  label,
  accent = false,
  small = false,
}: {
  value: number;
  label: string;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div className="text-center leading-none">
      <span
        className={`font-black tabular-nums leading-none ${
          small ? "text-2xl" : "text-4xl"
        } ${accent ? "text-[var(--color-f1-red)]" : "text-[var(--color-text-primary)]"}`}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="block text-xs text-[var(--color-text-muted)] mt-0.5 font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
