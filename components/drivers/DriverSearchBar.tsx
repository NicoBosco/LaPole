"use client";

interface DriverSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
}

export function DriverSearchBar({
  value,
  onChange,
  resultCount,
}: DriverSearchBarProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <svg
          className="h-4 w-4 text-[var(--color-text-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar piloto o equipo..."
        className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-f1-red)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-f1-red)]/30 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer"
        >
          ✕
        </button>
      )}
      {resultCount !== undefined && value && (
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          {resultCount === 0
            ? "Sin resultados para esa búsqueda"
            : `${resultCount} piloto${resultCount !== 1 ? "s" : ""} encontrado${resultCount !== 1 ? "s" : ""}`}
        </p>
      )}
    </div>
  );
}
