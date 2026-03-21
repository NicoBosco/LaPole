import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
      <div className="text-8xl font-black text-[var(--color-f1-red)] leading-none">
        404
      </div>
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Página no encontrada
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)] max-w-sm">
          Parece que tomaste una curva equivocada. Esta página no existe.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-f1-red)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-f1-red-light)] transition-colors"
      >
        ← Volver al Dashboard
      </Link>
    </div>
  );
}
