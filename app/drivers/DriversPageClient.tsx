"use client";

import { useState, useMemo, useEffect } from "react";
import { ProcessedDriver } from "@/types/driver";
import { DriverCard } from "@/components/drivers/DriverCard";
import { DriverSearchBar } from "@/components/drivers/DriverSearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { useFavorites } from "@/hooks/useFavorites";
import { usePagination } from "@/hooks/usePagination";

const PAGE_SIZE = 12;
type Tab = "all" | "favorites";

interface DriversPageClientProps {
  standings: ProcessedDriver[];
  season: string;
}

export function DriversPageClient({ standings, season }: DriversPageClientProps) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const { isFavorite, toggleFavorite, favorites } = useFavorites("drivers");

  const searched = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return standings;
    return standings.filter((s) => {
      return (
        s.fullName.toLowerCase().includes(q) || 
        s.teamName.toLowerCase().includes(q) || 
        s.code.toLowerCase().includes(q)
      );
    });
  }, [standings, query]);

  const filtered = useMemo(() => {
    if (activeTab === "favorites") {
      return searched.filter((s) => isFavorite(s.driverId));
    }
    return searched;
  }, [searched, activeTab, isFavorite]);

  const { page, totalPages, paginated, next, prev, reset } = usePagination(filtered, PAGE_SIZE);

  // Reiniciar página al cambiar la búsqueda o pestaña
  useEffect(() => { reset(); }, [query, activeTab, reset]);

  const favCount = favorites.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Pilotos
        </h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Clasificación de pilotos — Temporada {season}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>

        <div className="flex gap-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-1 self-start">
          <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>
            Todos ({standings.length})
          </TabButton>
          <TabButton active={activeTab === "favorites"} onClick={() => setActiveTab("favorites")}>
            ⭐ Favoritos {favCount > 0 && `(${favCount})`}
          </TabButton>
        </div>

        <div className="max-w-xs w-full">
          <DriverSearchBar
            value={query}
            onChange={(q) => { setQuery(q); setActiveTab("all"); }}
            resultCount={query ? filtered.length : undefined}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        activeTab === "favorites" ? (
          <EmptyState
            title="Tu lista está vacía"
            description='Agregá pilotos a favoritos con el botón de 🤍.'
            icon="⭐"
          />
        ) : (
          <EmptyState
            title="No encontramos a ese piloto"
            description={`No hay coincidencias para "${query}". Probá con otro nombre o equipo.`}
            icon="🔍"
          />
        )
      ) : (
        <>
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            {paginated.map((driver) => (
              <DriverCard
                key={driver.driverId}
                driver={driver}
                isFavorite={isFavorite(driver.driverId)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          <div className="mt-8">
            <Pagination page={page} totalPages={totalPages} onNext={next} onPrev={prev} />
          </div>

          {!query && activeTab === "all" && (
            <p className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
              Mostrando {paginated.length} de {standings.length} pilotos en {season}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm font-medium rounded-[var(--radius-sm)] transition-all ${
        active
          ? "bg-[var(--color-f1-red)] text-white"
          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]"
      }`}
    >
      {children}
    </button>
  );
}
