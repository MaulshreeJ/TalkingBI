'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Brain, Clock } from 'lucide-react';
import type { ChatMessage } from '@/lib/types';
import { statusColor, formatLatency, cn } from '@/lib/utils';
import { InsightPanel } from '@/components/dashboard/InsightPanel';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { KpiCard } from '@/components/dashboard/KpiCard';

interface Props {
  message: ChatMessage;
  onQueryClick?: (q: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  RESOLVED: '✓ Resolved',
  INCOMPLETE: '⟳ Incomplete',
  AMBIGUOUS: '? Ambiguous',
  UNKNOWN: '✕ Unknown',
  ERROR: '✕ Error',
};

export function ChatBubble({ message, onQueryClick }: Props) {
  const [traceOpen, setTraceOpen] = useState(false);

  if (message.role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-indigo-600 text-white text-sm">
          {message.query}
        </div>
      </motion.div>
    );
  }

  // Assistant bubble
  if (message.status === 'sending') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
        <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-zinc-800 border border-zinc-700">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-zinc-500"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (message.status === 'error') {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
        <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm bg-zinc-900 border border-red-500/30 text-sm text-red-400">
          Something went wrong. Please try again.
        </div>
      </motion.div>
    );
  }

  const r = message.response!;
  const hasCharts = r.charts?.length > 0;
  const hasInsights = r.insights?.length > 0;
  const trace = r.trace || {};
  const parserUsed = trace.parser_used as string | undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="max-w-[90%] w-full space-y-3">
        {/* Status header */}
        <div className="flex items-center gap-2 px-1">
          <span className={cn('text-xs font-semibold', statusColor(r.status))}>
            {STATUS_LABELS[r.status] || r.status}
          </span>
          {r.latency_ms > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-zinc-600">
              <Clock className="w-3 h-3" />
              {formatLatency(r.latency_ms)}
            </span>
          )}
          {parserUsed && (
            <span className="flex items-center gap-0.5 text-[10px] text-zinc-600">
              {parserUsed === 'deterministic' ? (
                <Zap className="w-3 h-3 text-amber-500" />
              ) : (
                <Brain className="w-3 h-3 text-indigo-400" />
              )}
              {parserUsed}
            </span>
          )}
        </div>

        {/* KPIs */}
        {r.kpis?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {r.kpis.map((kpi, i) => (
              <KpiCard key={i} kpi={kpi} index={i} />
            ))}
          </div>
        )}

        {/* Charts */}
        {hasCharts && (
          <div className="space-y-3">
            {r.charts.map((chart, i) => (
              <ChartCard key={i} chart={chart} index={i} />
            ))}
          </div>
        )}

        {/* Insights */}
        {hasInsights && <InsightPanel insights={r.insights} stagger={false} />}

        {/* Candidates (ambiguous) */}
        {r.candidates?.length > 0 && (
          <div className="px-4 py-3 rounded-xl bg-zinc-900 border border-purple-500/20">
            <p className="text-xs text-zinc-400 mb-2">Did you mean one of these?</p>
            <div className="flex flex-wrap gap-2">
              {r.candidates.map((c) => (
                <button
                  key={c}
                  onClick={() => onQueryClick?.(c)}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 hover:bg-purple-500/20 transition-colors font-mono"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {r.warnings?.length > 0 && (
          <div className="px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
            {r.warnings.map((w, i) => (
              <p key={i} className="text-xs text-amber-400">{w}</p>
            ))}
          </div>
        )}

        {/* Trace accordion */}
        <button
          onClick={() => setTraceOpen((o) => !o)}
          className="flex items-center gap-1 text-[10px] text-zinc-700 hover:text-zinc-500 transition-colors font-mono"
        >
          {traceOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          trace
        </button>
        {traceOpen && (
          <motion.pre
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-[10px] text-zinc-600 font-mono bg-zinc-950 border border-zinc-900 rounded-lg p-3 overflow-x-auto max-h-48 overflow-y-auto"
          >
            {JSON.stringify(trace, null, 2)}
          </motion.pre>
        )}
      </div>
    </motion.div>
  );
}
