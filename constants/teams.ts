
export interface TeamMeta {
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
}

export const TEAMS: Record<string, TeamMeta> = {
  red_bull: {
    name: "Red Bull Racing",
    shortName: "Red Bull",
    primaryColor: "#3671C6",
    secondaryColor: "#CC1E4A",
  },
  ferrari: {
    name: "Scuderia Ferrari",
    shortName: "Ferrari",
    primaryColor: "#E8002D",
    secondaryColor: "#FFF200",
  },
  mercedes: {
    name: "Mercedes-AMG Petronas",
    shortName: "Mercedes",
    primaryColor: "#27F4D2",
    secondaryColor: "#1C1C1C",
  },
  mclaren: {
    name: "McLaren F1 Team",
    shortName: "McLaren",
    primaryColor: "#FF8000",
    secondaryColor: "#1E3C5A",
  },
  aston_martin: {
    name: "Aston Martin Aramco",
    shortName: "Aston Martin",
    primaryColor: "#229971",
    secondaryColor: "#005539",
  },
  alpine: {
    name: "BWT Alpine F1 Team",
    shortName: "Alpine",
    primaryColor: "#0093CC",
    secondaryColor: "#FF87BC",
  },
  williams: {
    name: "Williams Racing",
    shortName: "Williams",
    primaryColor: "#64C4FF",
    secondaryColor: "#005AFF",
  },
  rb: {
    name: "Visa Cash App RB",
    shortName: "RB",
    primaryColor: "#6692FF",
    secondaryColor: "#1B3FAB",
  },
  haas: {
    name: "MoneyGram Haas F1",
    shortName: "Haas",
    primaryColor: "#B6BABD",
    secondaryColor: "#E8002D",
  },
  // Cambio a Audi en 2026
  sauber: {
    name: "Audi F1 Team",
    shortName: "Audi",
    primaryColor: "#BB0A21",
    secondaryColor: "#C0C0C0",
  },
  audi: {
    name: "Audi F1 Team",
    shortName: "Audi",
    primaryColor: "#BB0A21",
    secondaryColor: "#C0C0C0",
  },
  // Nuevo equipo a partir de 2026
  cadillac: {
    name: "Cadillac F1 Team",
    shortName: "Cadillac",
    primaryColor: "#CC0004",
    secondaryColor: "#003DA9",
  },
};

export function getTeamMeta(constructorId: string): TeamMeta {
  return (
    TEAMS[constructorId] ?? {
      // Capitalizar nombre de equipo desconocido
      name: constructorId.charAt(0).toUpperCase() + constructorId.slice(1),
      shortName: constructorId.charAt(0).toUpperCase() + constructorId.slice(1),
      primaryColor: "#a1a1aa",
      secondaryColor: "#52525b",
    }
  );
}
