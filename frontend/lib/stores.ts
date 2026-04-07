import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SessionState, ChatMessage } from '@/lib/types';

// ── Session Store ──────────────────────────────────────────
interface SessionStore {
  session: SessionState | null;
  setSession: (s: SessionState) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      session: null,
      setSession: (s) => set({ session: s }),
      clearSession: () => set({ session: null }),
    }),
    { name: 'talkingbi-session' }
  )
);

// ── Chat Store ─────────────────────────────────────────────
interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (m: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  setLoading: (v: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  updateMessage: (id, updates) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),
  clearMessages: () => set({ messages: [] }),
  setLoading: (v) => set({ isLoading: v }),
}));

// ── Dashboard Store ────────────────────────────────────────
type ChartType = 'bar' | 'line' | 'pie';

interface DashboardStore {
  chartType: ChartType;
  setChartType: (t: ChartType) => void;
  widgetOrder: string[];
  setWidgetOrder: (o: string[]) => void;
  activeKpi: string | null;
  setActiveKpi: (k: string | null) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  chartType: 'bar',
  setChartType: (t) => set({ chartType: t }),
  widgetOrder: [],
  setWidgetOrder: (o) => set({ widgetOrder: o }),
  activeKpi: null,
  setActiveKpi: (k) => set({ activeKpi: k }),
}));

// ── UI Store ───────────────────────────────────────────────
interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  activeTab: 'dashboard' | 'chat' | 'metrics';
  setActiveTab: (t: 'dashboard' | 'chat' | 'metrics') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  activeTab: 'dashboard',
  setActiveTab: (t) => set({ activeTab: t }),
}));
