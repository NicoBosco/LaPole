interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
}

export function EmptyState({
  title = "No encontramos nada",
  description = "Parece que no hay información para mostrar en esta sección por ahora.",
  icon = "🏎️",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
      <span className="text-4xl">{icon}</span>
      <div>
        <p className="font-medium text-[var(--color-text-primary)]">{title}</p>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
    </div>
  );
}
