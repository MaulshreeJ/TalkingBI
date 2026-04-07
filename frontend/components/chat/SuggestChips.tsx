'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api';

interface Props {
  sessionId: string;
  initialSuggestions: string[];
  prefix: string;
  onSelect: (q: string) => void;
}

export function SuggestChips({ sessionId, initialSuggestions, prefix, onSelect }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions?.slice(0, 8) || []);
  const debounceRef = useRef<NodeJS.Timeout>();

  const fetchSuggestions = useCallback(async (q: string) => {
    try {
      const result = await api.suggest(sessionId, q);
      setSuggestions(result.suggestions.slice(0, 8));
    } catch {
      // silently fail
    }
  }, [sessionId]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!prefix.trim()) {
      setSuggestions(initialSuggestions?.slice(0, 8) || []);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(prefix), 200);
    return () => clearTimeout(debounceRef.current);
  }, [prefix, fetchSuggestions, initialSuggestions]);

  if (!suggestions.length) return null;

  return (
    <div className="px-4 pb-2">
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-xs text-zinc-400 hover:text-zinc-200 transition-all duration-200 truncate max-w-[240px]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
