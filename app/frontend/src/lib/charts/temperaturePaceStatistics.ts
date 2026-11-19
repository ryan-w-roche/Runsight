import { quantileSorted } from "d3-array";

/** Nearest-temperature window; include boundary ties so input order cannot affect quartiles. */
export function temperaturePaceStatistics(runs: readonly { temperature: number; pace: number }[], windowSize = 10) {
  if (!Number.isInteger(windowSize) || windowSize < 1) throw new RangeError("Window size must be a positive integer.");
  const valid = runs.filter((run) => Number.isFinite(run.temperature) && Number.isFinite(run.pace) && run.pace > 0);
  const temperatures = [...new Set(valid.map((run) => run.temperature))].sort((a, b) => a - b);
  return temperatures.map((temperature) => {
    const distances = valid.map((run) => Math.abs(run.temperature - temperature)).sort((a, b) => a - b);
    const cutoff = distances[Math.min(windowSize, distances.length) - 1];
    const paces = valid.filter((run) => Math.abs(run.temperature - temperature) <= cutoff + 1e-9)
      .map((run) => run.pace).sort((a, b) => a - b);
    return { temperature, count: paces.length, q1: quantileSorted(paces, 0.25)!,
      median: quantileSorted(paces, 0.5)!, q3: quantileSorted(paces, 0.75)! };
  });
}
