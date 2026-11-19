"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { parsePaceInput } from "@/lib/charts/temperatureHeartRate";
import { emptyAttributeSelections, matchesDashboardAttributes, parseDistanceInput, type AttributeSelections, type AttributeFilterName } from "@/lib/dashboardFilterRanges";

type PaceFilter = {
  minimum: string;
  maximum: string;
  minPace: number | null;
  maxPace: number | null;
  minimumDistance: string;
  maximumDistance: string;
  minDistance: number | null;
  maxDistance: number | null;
  setMinimumDistance: (value: string) => void;
  setMaximumDistance: (value: string) => void;
  distanceError: string | null;
  paceError: string | null;
  error: string | null;
  setMinimum: (value: string) => void;
  setMaximum: (value: string) => void;
  attributes: AttributeSelections;
  setAttribute: (name: AttributeFilterName, value: string) => void;
  reset: () => void;
};
const empty: PaceFilter = { minimum: "", maximum: "", minPace: null, maxPace: null, error: null,
  minimumDistance: "", maximumDistance: "", minDistance: null, maxDistance: null,
  setMinimumDistance: () => {}, setMaximumDistance: () => {}, distanceError: null, paceError: null,
  setMinimum: () => {}, setMaximum: () => {}, attributes: emptyAttributeSelections, setAttribute: () => {}, reset: () => {} };
const PaceContext = createContext<PaceFilter>(empty);

export default function DashboardPaceProvider({ children }: { children: ReactNode }) {
  const [minimum, setMinimum] = useState("");
  const [maximum, setMaximum] = useState("");
  const [minimumDistance, setMinimumDistance] = useState("");
  const [maximumDistance, setMaximumDistance] = useState("");
  const [attributes, setAttributes] = useState<AttributeSelections>(emptyAttributeSelections);
  const minPace = minimum.trim() ? parsePaceInput(minimum) : null;
  const maxPace = maximum.trim() ? parsePaceInput(maximum) : null;
  const minDistance = parseDistanceInput(minimumDistance);
  const maxDistance = parseDistanceInput(maximumDistance);
  const distanceError = (minimumDistance.trim() && minDistance === null) || (maximumDistance.trim() && maxDistance === null)
    ? "Enter a nonnegative distance in miles. Leave a bound empty for no limit."
    : minDistance !== null && maxDistance !== null && minDistance > maxDistance ? "Min distance must be less than or equal to max distance." : null;
  const paceError = (minimum.trim() && minPace === null) || (maximum.trim() && maxPace === null)
    ? "Enter pace as m:ss, for example 9:00. Leave a bound empty for no limit."
    : minPace !== null && maxPace !== null && minPace > maxPace ? "Min pace must be less than or equal to max pace." : null;
  const error = distanceError ?? paceError;
  return <PaceContext.Provider value={{ minimum, maximum, minPace, maxPace, error, setMinimum, setMaximum, attributes,
    minimumDistance, maximumDistance, minDistance, maxDistance, setMinimumDistance, setMaximumDistance, distanceError, paceError,
    setAttribute: (name, value) => setAttributes((current) => ({ ...current, [name]: value })),
    reset: () => { setMinimum(""); setMaximum(""); setMinimumDistance(""); setMaximumDistance(""); setAttributes(emptyAttributeSelections); },
  }}>{children}</PaceContext.Provider>;
}

export function useDashboardPace() { return useContext(PaceContext); }

type FilterableRun = { pace: number | null; distanceMiles?: number | null; elevationFeet?: number | null; temperature?: number | null };

export function matchesDashboardRun(run: FilterableRun, { minPace, maxPace, minDistance, maxDistance, error, attributes }: PaceFilter) {
  return !error && matchesDashboardAttributes(run, attributes) &&
    ((minDistance === null && maxDistance === null) || (typeof run.distanceMiles === "number" && Number.isFinite(run.distanceMiles) &&
      (minDistance === null || run.distanceMiles >= minDistance) && (maxDistance === null || run.distanceMiles <= maxDistance))) &&
    ((minPace === null && maxPace === null) ||
    (run.pace !== null && Number.isFinite(run.pace) && run.pace > 0 &&
      (minPace === null || run.pace >= minPace) && (maxPace === null || run.pace <= maxPace)));
}

export function useDashboardPaceRuns<T extends FilterableRun>(runs: readonly T[]) {
  const filters = useDashboardPace();
  return runs.filter((run) => matchesDashboardRun(run, filters));
}
