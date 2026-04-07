'use client';

import { motion } from 'framer-motion';
import type { InsightItem } from '@/lib/types';
import { insightBadgeColor, cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, AlertTriangle, Star, Percent, Info } from 'lucide-react';

const ICONS: Record<string, React.ElementType> = {
  TOP: Star,
  LOW: TrendingDown,
  TREND: TrendingUp,
  ANOMALY: AlertTriangle,
  CONTRIBUTION: Percent,
  DATASET_AWARENESS: Info,
  DATASET_QUERY: Info,
};

interface Props {
  insights: InsightItem[];
  stagger?: boolean;
}

export function InsightPanel({ insights, stagger = true }: Props) {
  if (!insights.length) return null;
  return (
    <div className="space-y-2">
      {insights.map((insight, i) => {
        const Icon = ICONS[insight.type] || Info;
        const isAnomaly = insight.type === 'ANOMALY';
        return (
          <motion.div
            key={i}
            initial={stagger ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stagger ? i * 0.1 : 0, duration: 0.3 }}
            className={cn(
              'flex items-start gap-3 px-4 py-3 rounded-xl border text-sm',
              insightBadgeColor(insight.type),
              isAnomaly && 'glow-amber'
            )}
          >
            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 block mb-0.5">
                {insight.type}
              </span>
              <p className="leading-relaxed">{insight.text || insight.summary}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
