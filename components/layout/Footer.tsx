export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-sm text-[var(--color-text-muted)]">
            © {year}{" "}
            <span className="text-[var(--color-text-secondary)]">LaPole</span> —
            Datos de{" "}
            <a
              href="https://api.jolpi.ca/ergast/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-f1-red)] hover:underline transition-colors"
            >
              Jolpica F1 API
            </a>
          </p>
          <p className="text-xs text-[var(--color-text-muted)] text-center sm:text-right">
            Dashboard de F1 — Portfolio Project de Bosco Mateo Nicolás
          </p>
        </div>
      </div>
    </footer>
  );
}
