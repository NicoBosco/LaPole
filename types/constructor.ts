export interface Constructor {
  constructorId: string;
  url?: string;
  name: string;
  nationality?: string;
}

export interface ConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Constructor;
}

export interface ProcessedConstructor {
  constructorId: string;
  name: string;
  nationality: string;
  position: number;
  points: number;
  wins: number;
}
