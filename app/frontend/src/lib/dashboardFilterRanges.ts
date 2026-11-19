type RangeOption = { value: string; min: number | null; max: number | null };
const ranges = (start: number, step: number, count: number): RangeOption[] =>
  Array.from({ length: count }, (_, index) => {
    const min = start + step * index;
    return { value: `${min}–${min + step}`, min, max: min + step };
  });

export const dashboardAttributeFilters = [
  { name: "elevation", field: "elevationFeet", label: "Elevation (ft)", allLabel: "All elevations",
    options: [...ranges(0, 100, 5), { value: "500+", min: 500, max: null }] },
  { name: "temperature", field: "temperature", label: "Temperature (°F)", allLabel: "All temperatures",
    options: [{ value: "<30", min: null, max: 30 }, ...ranges(30, 10, 6), { value: "90+", min: 90, max: null }] },
] as const;

export type AttributeFilterName = (typeof dashboardAttributeFilters)[number]["name"];
export type AttributeSelections = Record<AttributeFilterName, string>;
export const emptyAttributeSelections: AttributeSelections = { elevation: "", temperature: "" };

export function parseDistanceInput(value: string): number | null {
  if (!value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

/** Lower bounds are inclusive, upper bounds exclusive; missing measurements don't match active filters. */
export function matchesDashboardAttributes(
  run: { distanceMiles?: number | null; elevationFeet?: number | null; temperature?: number | null },
  selections: AttributeSelections,
) {
  return dashboardAttributeFilters.every((filter) => {
    const selected = selections[filter.name];
    if (!selected) return true;
    const range = filter.options.find((option) => option.value === selected);
    const value = run[filter.field];
    return !!range && typeof value === "number" && Number.isFinite(value) &&
      (range.min === null || value >= range.min) && (range.max === null || value < range.max);
  });
}
