"use client";

import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";
import { PieChart } from "@/components/charts/pie-chart";
import { PieSlice } from "@/components/charts/pie-slice";
import { PieCenter } from "@/components/charts/pie-center";
import { formatMoney } from "@/lib/format";
import type { MonthPoint, RankedSlice } from "@/lib/analytics";

/* Validated brand palette: teal #1ca3b1 income, amber #c0692a expenses. */
const TEAL = "#1ca3b1";
const AMBER = "#c0692a";
/* Single-hue teal ramp (dark→light) for ranked part-to-whole slices. */
const TEAL_RAMP = ["#0e6f78", "#1ca3b1", "#57c1cb", "#9bd9df", "#c8ebef"];

/* ============================ Income vs Expenses ============================ */

export function IncomeExpenseChart({ data }: { data: MonthPoint[] }) {
  if (data.length === 0) {
    return <p className="py-12 text-center text-sm text-mist-600">No transactions recorded yet.</p>;
  }

  return (
    <figure>
      <BarChart
        data={data as unknown as Record<string, unknown>[]}
        xDataKey="label"
        aspectRatio="5 / 2"
        barGap={0.3}
        margin={{ top: 12, right: 16, bottom: 30, left: 16 }}
      >
        <Grid horizontal />
        <Bar dataKey="income" fill={TEAL} lineCap="round" />
        <Bar dataKey="expense" fill={AMBER} lineCap="round" />
        <BarXAxis />
        <ChartTooltip
          showDatePill={false}
          rows={(point) => [
            { color: TEAL, label: "Income", value: formatMoney(Number(point.income) || 0) },
            { color: AMBER, label: "Expenses", value: formatMoney(Number(point.expense) || 0) },
          ]}
        />
      </BarChart>
      <figcaption className="mt-3 flex items-center justify-center gap-6 text-xs text-mist-700">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: TEAL }} aria-hidden />
          Income
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: AMBER }} aria-hidden />
          Expenses
        </span>
      </figcaption>
    </figure>
  );
}

/* ============================ Breakdown donut ============================ */

export function BreakdownDonut({
  data,
  centerLabel,
  emptyLabel = "No data yet.",
}: {
  data: RankedSlice[];
  centerLabel: string;
  emptyLabel?: string;
}) {
  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-mist-600">{emptyLabel}</p>;
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const slices = data.map((d, i) => ({
    label: d.label,
    value: d.value,
    color: TEAL_RAMP[Math.min(i, TEAL_RAMP.length - 1)],
  }));

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="shrink-0">
        <PieChart
          data={slices}
          size={176}
          innerRadius={58}
          padAngle={0.03}
          cornerRadius={4}
          hoverOffset={8}
        >
          {slices.map((item, i) => (
            <PieSlice index={i} key={item.label} />
          ))}
          <PieCenter defaultLabel={centerLabel} prefix="K" formatOptions={{ maximumFractionDigits: 0 }} />
        </PieChart>
      </div>
      <ul className="w-full min-w-0 flex-1 space-y-2.5">
        {slices.map((s) => {
          const share = total > 0 ? Math.round((s.value / total) * 100) : 0;
          return (
            <li key={s.label} className="flex items-center gap-3 text-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} aria-hidden />
              <span className="min-w-0 flex-1 truncate text-mist-800">{s.label}</span>
              <span className="shrink-0 font-semibold text-mist-950">{formatMoney(s.value)}</span>
              <span className="w-8 shrink-0 text-right text-xs text-mist-500">{share}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
