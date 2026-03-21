interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Ocurrió un error al cargar los datos.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-[var(--radius-lg)] border border-red-500/20 bg-red-500/5 p-10 text-center">
      <div className="text-4xl">⚠️</div>
      <div>
        <p className="font-medium text-[var(--color-text-primary)]">{message}</p>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Verificá tu conexión a internet e intentá de nuevo.
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface)] cursor-pointer"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
