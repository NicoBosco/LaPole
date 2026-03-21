import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CURRENT_SEASON, PREVIOUS_SEASON } from "@/constants/config";
import { SeasonSelector } from "@/components/ui/SeasonSelector";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/drivers",
  useSearchParams: () => {
    const previousSeason = (new Date().getUTCFullYear() - 1).toString();
    return new URLSearchParams(`season=${previousSeason}&tab=favorites`);
  },
}));

describe("Componente SeasonSelector", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it("mantiene la ruta actual y los parámetros de consulta existentes", () => {
    render(<SeasonSelector currentSeason={PREVIOUS_SEASON} />);

    fireEvent.click(screen.getByRole("button", { name: CURRENT_SEASON }));

    expect(pushMock).toHaveBeenCalledWith(
      `/drivers?season=${CURRENT_SEASON}&tab=favorites`,
    );
  });
});
