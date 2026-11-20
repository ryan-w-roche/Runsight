import type { FatigueRun } from "@/types/fatigue";
import type { CurrentRun } from "@/types/run";
import type { DashboardSummary } from "@/types/summary";
import type { AttributeSelections } from "@/lib/dashboardFilterRanges";

// Server code calls the FastAPI backend directly. The browser goes through the /api proxy in next.config.ts so it only talks to this site's domain.
const API_URL = typeof window === "undefined" ? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000" : "/api";

async function getJson<T>(path: string): Promise<T> {
  // no-store: fetch fresh data on every request instead of once at build time
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`GET ${path} failed with status ${response.status}`);
  return response.json();
}

export const fetchRuns = () => getJson<CurrentRun[]>("/runs");
export const fetchFatigueRuns = () => getJson<FatigueRun[]>("/insights/fatigue");

// Dates are YYYY-MM-DD; an empty string means no limit on that side.
export function fetchSummary(start: string, end: string, excludedRunIds: readonly string[] = [], minPace: number | null = null, maxPace: number | null = null, attributes?: AttributeSelections, minDistance: number | null = null, maxDistance: number | null = null) {
  const params = new URLSearchParams();
  if (start) params.set("start", start);
  if (end) params.set("end", end);
  for (const id of excludedRunIds) params.append("exclude_id", id);
  if (minPace !== null) params.set("min_pace", String(minPace));
  if (maxPace !== null) params.set("max_pace", String(maxPace));
  if (minDistance !== null) params.set("min_distance", String(minDistance));
  if (maxDistance !== null) params.set("max_distance", String(maxDistance));
  for (const [name, value] of Object.entries(attributes ?? {})) if (value) params.set(name, value);
  return getJson<DashboardSummary>(`/runs/summary?${params}`);
}
