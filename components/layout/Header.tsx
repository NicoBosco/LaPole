"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/drivers", label: "Pilotos" },
  { href: "/constructors", label: "Equipos" },
  { href: "/compare", label: "Comparar" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Cerramos el menú al cambiar de ruta para mejor experiencia en móviles
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group z-50">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-f1-red)] text-white font-bold text-sm select-none transition-transform group-hover:scale-105">
            LP
          </span>
          <span className="font-semibold text-[var(--color-text-primary)] tracking-tight text-lg">
            La<span className="text-[var(--color-f1-red)]">Pole</span>
          </span>
        </Link>

        <nav
          className="hidden sm:flex items-center gap-1"
          aria-label="Navegación principal"
        >
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? "text-[var(--color-text-primary)] bg-[var(--color-surface-raised)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-[var(--color-f1-red)]" />
                )}
              </Link>
            );
          })}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>

        <div className="sm:hidden flex items-center gap-2 z-50">
          <ThemeToggle />
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 space-y-1">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--color-f1-red-muted)] text-[var(--color-f1-red)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-f1-red)]" />
                )}
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
