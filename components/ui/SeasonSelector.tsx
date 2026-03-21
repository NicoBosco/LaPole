"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AVAILABLE_SEASONS } from "@/constants/config";

interface SeasonSelectorProps {
  currentSeason: string;
}

export function SeasonSelector({ currentSeason }: SeasonSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function selectSeason(season: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("season", season);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
      {AVAILABLE_SEASONS.map((season) => {
        const isActive = season === currentSeason;
        return (
          <button
            key={season}
            onClick={() => selectSeason(season)}
            className={`
              rounded-md px-3 py-1 text-sm font-semibold tabular-nums transition-all duration-150 cursor-pointer
              ${isActive
                ? "bg-[var(--color-f1-red)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]"
              }
            `}
          >
            {season}
          </button>
        );
      })}
    </div>
  );
}
