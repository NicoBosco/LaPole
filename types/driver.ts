import { Constructor } from "./constructor";

export interface Driver {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  url?: string;
  givenName: string;
  familyName: string;
  dateOfBirth?: string;
  nationality?: string;
}

export interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}

export interface ProcessedDriver {
  driverId: string;
  code: string;
  number: string;
  firstName: string;
  lastName: string;
  fullName: string;
  nationality: string;
  dob: string;
  teamId: string;
  teamName: string;
  position: number;
  points: number;
  wins: number;
}
