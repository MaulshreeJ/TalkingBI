'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuid } from 'uuid';
import { Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useChatStore } from '@/lib/stores';
import type { SessionState, ChatMessage } from '@/lib/types';
import { ChatBubble } from './ChatBubble';
import { SuggestChips } from './SuggestChips';

interface Props { session: SessionState }

export function ChatPanel({ session }: Props) {
  const { messages, isLoading, addMessage, updateMessage, setLoading } = useChatStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = useCallback(async (query: string) => {
    const q = query.trim();
    if (!q || isLoading) return;
    setInput('');

    const msgId = uuid();
    const userMsg: ChatMessage = { id: msgId, role: 'user', query: q, status: 'sending', timestamp: Date.now() };
    addMessage(userMsg);
    updateMessage(msgId, { status: 'done' });

    const aiId = uuid();
    const aiMsg: ChatMessage = { id: aiId, role: 'assistant', status: 'sending', timestamp: Date.now() };
    addMessage(aiMsg);
    setLoading(true);

    try {
      const result = await api.query(session.sessionId, q);
      updateMessage(aiId, { response: result, status: 'done' });
    } catch (err: unknown) {
      updateMessage(aiId, { status: 'error' });
      toast.error(err instanceof Error ? err.message : 'Query failed');
    } finally {
      setLoading(false);
    }
  }, [isLoading, session.sessionId, addMessage, updateMessage, setLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(input);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center gap-4 py-20"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-300 mb-1">Ask about your data</h3>
              <p className="text-sm text-zinc-600 max-w-xs">
                Type a question in plain English. Try clicking a suggestion below to get started.
              </p>
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} onQueryClick={handleSubmit} />
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-4"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-indigo-500"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                />
              ))}
            </div>
            <span className="text-xs text-zinc-600">Thinking...</span>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggest chips */}
      <SuggestChips
        sessionId={session.sessionId}
        initialSuggestions={session.suggestions}
        onSelect={handleSubmit}
        prefix={input}
      />

      {/* Input bar */}
      <div className="px-4 pb-4">
        <div className="flex items-end gap-2 bg-zinc-900 border border-zinc-700 rounded-xl p-3 focus-within:border-indigo-500/50 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your data..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none max-h-32"
            style={{ lineHeight: '1.5' }}
          />
          <button
            onClick={() => handleSubmit(input)}
            disabled={!input.trim() || isLoading}
            className="shrink-0 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-[10px] text-zinc-700 mt-1 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
