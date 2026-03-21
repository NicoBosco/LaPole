import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DriverCard } from "@/components/drivers/DriverCard";
import type { ProcessedDriver } from "@/types/driver";

const driver: ProcessedDriver = {
  driverId: "charles_leclerc",
  code: "LEC",
  number: "16",
  firstName: "Charles",
  lastName: "Leclerc",
  fullName: "Charles Leclerc",
  nationality: "Monégasque",
  dob: "1997-10-16",
  teamId: "ferrari",
  teamName: "Ferrari",
  position: 2,
  points: 188,
  wins: 3,
};

describe("DriverCard", () => {
  it("builds the profile link with the selected season", () => {
    render(<DriverCard driver={driver} season="2026" />);

    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "/drivers/charles_leclerc?season=2026"
    );
  });

  it("calls the favorite handler without triggering navigation intent", () => {
    const onToggleFavorite = vi.fn();

    render(
      <DriverCard
        driver={driver}
        season="2026"
        isFavorite={false}
        onToggleFavorite={onToggleFavorite}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Agregar Leclerc a favoritos" }));

    expect(onToggleFavorite).toHaveBeenCalledWith("charles_leclerc");
  });
});
