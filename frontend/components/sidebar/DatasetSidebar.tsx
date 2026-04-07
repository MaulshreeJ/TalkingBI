'use client';

import { motion } from 'framer-motion';
import { FileText, Layers, Hash } from 'lucide-react';
import type { SessionState, ProfileEntry } from '@/lib/types';
import { cn, semanticTypeColor } from '@/lib/utils';

interface Props { session: SessionState }

const TYPE_LABEL: Record<ProfileEntry['semantic_type'], string> = {
  kpi: 'KPI',
  date: 'Date',
  dimension: 'Dim',
};

export function DatasetSidebar({ session }: Props) {
  const cols = Object.entries(session.profile);
  const kpiCols = cols.filter(([, v]) => v.semantic_type === 'kpi');
  const dimCols = cols.filter(([, v]) => v.semantic_type === 'dimension');

  return (
    <div className="p-4 space-y-5">
      {/* Dataset card */}
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs font-medium text-zinc-300 truncate">{session.filename}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Stat icon={Hash} label="Rows" value={session.rowCount.toLocaleString()} />
          <Stat icon={Layers} label="Columns" value={cols.length.toString()} />
          <Stat icon={Hash} label="KPIs" value={kpiCols.length.toString()} color="text-indigo-400" />
          <Stat icon={Hash} label="Dimensions" value={dimCols.length.toString()} color="text-cyan-400" />
        </div>
        {session.datasetSummaryText && (
          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 pt-1 border-t border-zinc-800">
            {session.datasetSummaryText}
          </p>
        )}
      </div>

      {/* Column Explorer */}
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1">Columns</p>
        <div className="space-y-1">
          {cols.map(([name, meta], i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-900 group cursor-default transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={cn(
                    'shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide',
                    semanticTypeColor(meta.semantic_type)
                  )}
                >
                  {TYPE_LABEL[meta.semantic_type]}
                </span>
                <span className="text-xs text-zinc-300 truncate font-mono">{name}</span>
              </div>
              <span className="text-[10px] text-zinc-600 shrink-0 ml-1">
                {meta.null_pct > 0 ? `${(meta.null_pct * 100).toFixed(0)}% null` : `${meta.unique} uniq`}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color = 'text-zinc-300',
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-3 h-3 text-zinc-600" />
      <span className="text-zinc-600">{label}:</span>
      <span className={cn('font-medium', color)}>{value}</span>
    </div>
  );
}
