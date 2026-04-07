'use client';

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon } from 'lucide-react';
import type { ChartSpec } from '@/lib/types';
import { useDashboardStore } from '@/lib/stores';
import { columnLabel } from '@/lib/utils';

const COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#f97316', '#3b82f6'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-400 mb-1 font-mono">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {Number(p.value).toLocaleString()}</p>
      ))}
    </div>
  );
};

interface Props { chart: ChartSpec; index: number }

export function ChartCard({ chart, index }: Props) {
  const { chartType, setChartType } = useDashboardStore();
  
  const dimKey = chart.dimension || 'label';
  const displayKpiKey = chart.kpi || 'value';
  const renderKpiKey = chart.data ? 'value' : displayKpiKey;
  
  let data = chart.data ? chart.data.slice(0, 20) : [];
  if (data.length === 0 && chart.x && chart.y) {
    const length = Math.min(chart.x.length, chart.y.length, 20);
    for (let i = 0; i < length; i++) {
      data.push({ [dimKey]: chart.x[i], [renderKpiKey]: chart.y[i] });
    }
  }
  const title = chart.title || `${columnLabel(displayKpiKey)}${chart.dimension ? ` by ${columnLabel(chart.dimension)}` : ''}`;
  const effectiveType = chart.type === 'line' ? 'line' : chartType;

  const axisStyle = { fill: '#71717a', fontSize: 11, fontFamily: 'JetBrains Mono' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 card-hover"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-300">{title}</h3>
        <div className="flex gap-1">
          {(['bar', 'line', 'pie'] as const).map((t) => {
            const Icon = t === 'bar' ? BarChart3 : t === 'line' ? LineIcon : PieIcon;
            return (
              <button
                key={t}
                onClick={() => setChartType(t)}
                className={`p-1.5 rounded-md transition-colors ${
                  effectiveType === t ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-600 hover:text-zinc-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        {effectiveType === 'bar' ? (
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey={dimKey} tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={renderKpiKey} radius={[4, 4, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />)}
            </Bar>
          </BarChart>
        ) : effectiveType === 'line' ? (
          <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey={dimKey} tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey={renderKpiKey} stroke="#6366f1" strokeWidth={2} dot={false} />
          </LineChart>
        ) : (
          <PieChart>
            <Pie data={data} dataKey={renderKpiKey} nameKey={dimKey} cx="50%" cy="50%" outerRadius={90} innerRadius={40}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-zinc-400">{v}</span>} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  );
}
