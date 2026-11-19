import type { CurrentRun } from "@/types/run";

// Health values joined to a run by date; null means unavailable.
export type FatigueRun = Pick<CurrentRun, "id" | "date" | "sleepHours" | "pace"> &
  Partial<Pick<CurrentRun, "distanceMiles" | "elevationFeet" | "temperature">> & {
  activeEnergyKcal: number | null; // Daily active energy, distinct from workout calories.
  steps: number | null; // Daily step count; zero is valid.
};
