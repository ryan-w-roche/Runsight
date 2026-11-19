"use client";

import type { ReactNode } from "react";
import { useDashboardPace } from "@/components/DashboardPaceProvider";
import { dashboardAttributeFilters as filters } from "@/lib/dashboardFilterRanges";

type FilterBarProps = {
  children?: ReactNode;
};

export default function FilterBar({ children }: FilterBarProps) {
  const { minimum, maximum, setMinimum, setMaximum, error, attributes, setAttribute, reset,
    minimumDistance, maximumDistance, setMinimumDistance, setMaximumDistance, distanceError, paceError } = useDashboardPace();
  return (
    <section
      aria-label="Filters"
      className="flex min-h-12 flex-wrap items-center gap-4
      rounded-lg border border-border bg-surface-muted px-4 py-3
      text-foreground"
    >
      <form className="flex w-full flex-wrap items-center gap-4" onSubmit={(event) => event.preventDefault()}
        onReset={(event) => { event.preventDefault(); reset(); }}>
        <strong className="text-sm font-bold text-foreground">Filter:</strong>
        <label className="flex items-center gap-2 text-sm font-medium">Min distance (mi)
          <input type="number" min="0" step="any" name="minDistance" value={minimumDistance} onChange={(event) => setMinimumDistance(event.target.value)}
            placeholder="Any" aria-invalid={!!distanceError}
            className="w-20 rounded border border-control-border bg-surface px-2 py-1.5 text-sm tabular-nums focus-visible:outline-2 focus-visible:outline-accent" />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">Max distance (mi)
          <input type="number" min="0" step="any" name="maxDistance" value={maximumDistance} onChange={(event) => setMaximumDistance(event.target.value)}
            placeholder="Any" aria-invalid={!!distanceError}
            className="w-20 rounded border border-control-border bg-surface px-2 py-1.5 text-sm tabular-nums focus-visible:outline-2 focus-visible:outline-accent" />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">Min pace
          <input type="text" name="minPace" value={minimum} onChange={(event) => setMinimum(event.target.value)}
            placeholder="m:ss" maxLength={6} aria-invalid={!!paceError}
            className="w-20 rounded border border-control-border bg-surface px-2 py-1.5 text-sm tabular-nums focus-visible:outline-2 focus-visible:outline-accent" />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">Max pace
          <input type="text" name="maxPace" value={maximum} onChange={(event) => setMaximum(event.target.value)}
            placeholder="m:ss" maxLength={6} aria-invalid={!!paceError}
            className="w-20 rounded border border-control-border bg-surface px-2 py-1.5 text-sm tabular-nums focus-visible:outline-2 focus-visible:outline-accent" />
        </label>
        <span className="text-xs text-muted">min/mi</span>
        {filters.map((filter) => (
          <label key={filter.name} className="flex items-center gap-2 text-sm font-medium">
            {filter.label}
            <select name={filter.name} value={attributes[filter.name]} onChange={(event) => setAttribute(filter.name, event.target.value)}
              className="rounded border border-control-border bg-surface px-3 py-1.5 text-sm text-foreground scheme-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
              <option value="">{filter.allLabel}</option>
              {filter.options.map((option) => <option key={option.value} value={option.value}>{option.value}</option>)}
            </select>
          </label>
        ))}
        {children}
        <button
          type="reset"
          className="inline-flex cursor-pointer items-center gap-2 rounded border border-brand bg-brand px-3 py-1.5 text-sm font-semibold text-on-brand transition-colors hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-4 w-4 shrink-0"
          >
            <path d="M3 10a9 9 0 1 1 2.5 8.5 M3 4v6h6" />
          </svg>
          Reset filters
        </button>
      </form>
      {error && <p role="alert" className="w-full text-xs text-foreground">{error}</p>}
    </section>
  );
}
