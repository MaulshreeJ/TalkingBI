export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatNumber(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function formatPercent(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

export function formatLatency(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function timeAgo(date: string | Date): string {
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function columnLabel(col: string): string {
  return col.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function statusColor(status: string): string {
  switch (status) {
    case 'RESOLVED': return 'text-emerald-400';
    case 'INCOMPLETE': return 'text-amber-400';
    case 'AMBIGUOUS': return 'text-purple-400';
    case 'UNKNOWN': return 'text-red-400';
    default: return 'text-zinc-400';
  }
}

export function insightBadgeColor(type: string): string {
  switch (type) {
    case 'TOP': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'LOW': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'TREND': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    case 'ANOMALY': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'CONTRIBUTION': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  }
}

export function semanticTypeColor(type: string): string {
  switch (type) {
    case 'kpi': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    case 'date': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'dimension': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  }
}
