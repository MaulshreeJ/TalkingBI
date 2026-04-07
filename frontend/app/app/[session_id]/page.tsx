'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, MessageSquare, PanelLeft, X, TrendingUp } from 'lucide-react';
import { useSessionStore, useUIStore } from '@/lib/stores';
import { DatasetSidebar } from '@/components/sidebar/DatasetSidebar';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { ChatPanel } from '@/components/chat/ChatPanel';

export default function AppPage({ params }: { params: { session_id: string } }) {
  const router = useRouter();
  const session = useSessionStore((s) => s.session);
  const { sidebarOpen, toggleSidebar, activeTab, setActiveTab } = useUIStore();

  useEffect(() => {
    if (!session || session.sessionId !== params.session_id) {
      router.replace('/');
    }
  }, [session, params.session_id, router]);

  if (!session) return null;

  const tabs = [
    { id: 'dashboard' as const, icon: BarChart3, label: 'Dashboard' },
    { id: 'chat' as const, icon: MessageSquare, label: 'Chat' },
  ];

  return (
    <div className="h-screen flex flex-col bg-zinc-950 overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 h-12 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-sm shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-sm text-gradient">TalkingBI</span>
          </div>
          <span className="text-zinc-700">·</span>
          <span className="text-xs text-zinc-500 font-mono truncate max-w-[200px]">
            {session.filename}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-500 font-mono">
            {session.rowCount.toLocaleString()} rows
          </span>
        </div>
        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-zinc-700 text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${session.mode === 'dashboard' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <span className="text-xs text-zinc-500 capitalize">{session.mode} mode</span>
          <button
            onClick={() => router.push('/')}
            className="ml-2 p-1.5 rounded-md hover:bg-zinc-800 text-zinc-600 hover:text-zinc-300 transition-colors"
            title="New upload"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          animate={{ width: sidebarOpen ? 260 : 0, opacity: sidebarOpen ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="shrink-0 overflow-hidden border-r border-zinc-900 bg-zinc-950"
        >
          <div className="w-[260px] h-full overflow-y-auto">
            <DatasetSidebar session={session} />
          </div>
        </motion.aside>

        {/* Center / Chat */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="flex-1 overflow-y-auto p-6"
            >
              <DashboardGrid session={session} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <ChatPanel session={session} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
