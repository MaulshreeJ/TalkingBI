'use client';


import type { SessionState } from '@/lib/types';
import { KpiCard } from './KpiCard';
import { ChartCard } from './ChartCard';
import { InsightPanel } from './InsightPanel';
import { BarChart3, Lightbulb } from 'lucide-react';

interface Props { session: SessionState }

export function DashboardGrid({ session }: Props) {
  const { dashboard } = session;
  const kpis = dashboard.kpis || [];
  const charts = dashboard.charts || [];
  const insights = dashboard.insights || [];

  if (!kpis.length && !charts.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <BarChart3 className="w-12 h-12 text-zinc-700 mb-3" />
        <p className="text-zinc-500">No dashboard data yet.</p>
        <p className="text-xs text-zinc-700 mt-1">Upload with mode=dashboard or mode=both</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* KPI Cards */}
      {kpis.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => (
              <KpiCard key={kpi.column} kpi={kpi} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Charts */}
      {charts.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Charts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {charts.map((chart, i) => (
              <ChartCard key={i} chart={chart} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Insights</h2>
          </div>
          <InsightPanel insights={insights} />
        </section>
      )}
    </div>
  );
}
