interface PaginationProps {
  page: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onNext,
  onPrev,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <button
        onClick={onPrev}
        disabled={page <= 1}
        aria-label="Página anterior"
        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-all hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-30"
      >
        ‹
      </button>

      <span className="text-sm text-[var(--color-text-secondary)]">
        <span className="font-semibold text-[var(--color-text-primary)]">
          {page}
        </span>
        {" / "}
        <span>{totalPages}</span>
      </span>

      <button
        onClick={onNext}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-all hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-30"
      >
        ›
      </button>
    </div>
  );
}
