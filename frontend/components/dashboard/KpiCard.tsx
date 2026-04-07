'use client';

import { motion } from 'framer-motion';

import type { KpiSpec } from '@/lib/types';
import { columnLabel, formatNumber } from '@/lib/utils';

interface Props {
  kpi: KpiSpec;
  index: number;
  onClick?: () => void;
}

const COLORS = [
  { gradient: 'from-indigo-500 to-violet-600', glow: 'shadow-indigo-500/20', border: 'border-indigo-500/20', text: 'text-indigo-400' },
  { gradient: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/20', border: 'border-cyan-500/20', text: 'text-cyan-400' },
  { gradient: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/20', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  { gradient: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/20', border: 'border-violet-500/20', text: 'text-violet-400' },
];

export function KpiCard({ kpi, index, onClick }: Props) {
  const color = COLORS[index % COLORS.length];
  const value = typeof kpi.value === 'number' ? kpi.value : (typeof kpi.total === 'number' ? kpi.total : null);
  const label = kpi.name || columnLabel(kpi.column);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl bg-zinc-900 border ${color.border} p-5 cursor-pointer card-hover group shadow-lg ${color.glow}`}
    >
      {/* Top gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${color.gradient}`} />

      {/* Subtle background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</p>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 ${color.text}`}>
            {kpi.aggregation || 'sum'}
          </span>
        </div>

        <div className="mb-3">
          {value !== null ? (
            <p className="text-3xl font-bold text-zinc-50 tracking-tight">
              {formatNumber(value)}
            </p>
          ) : (
            <p className="text-3xl font-bold text-zinc-50">—</p>
          )}
        </div>

        {kpi.business_meaning && (
          <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">{kpi.business_meaning}</p>
        )}

        <div className="mt-3 flex items-center gap-1 text-xs text-zinc-600">
          <span className="font-mono">{kpi.column}</span>
          {kpi.segment_by && (
            <>
              <span className="text-zinc-700">·</span>
              <span>by {kpi.segment_by}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
