'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Zap, BarChart3, MessageSquare, Database, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useSessionStore } from '@/lib/stores';
import type { SessionState } from '@/lib/types';

const TYPEWRITER_PHRASES = [
  'revenue by region...',
  'sales trends over time...',
  'top performing products...',
  'compare profit vs cost...',
  'show HR attrition by department...',
];

const FEATURES = [
  {
    icon: Database,
    title: 'Dataset Intelligence',
    desc: 'Instant semantic profiling of every column — KPIs, dimensions, and dates detected automatically.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
  },
  {
    icon: BarChart3,
    title: 'Auto Dashboard',
    desc: 'KPI cards, bar charts, trend lines, and contribution insights generated without a single click.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: MessageSquare,
    title: 'Chat Analytics',
    desc: 'Ask questions in plain English. Powered by deterministic parsing — no hallucinations.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
];

const UPLOAD_STEPS = [
  'Reading CSV file...',
  'Detecting column types...',
  'Profiling dataset...',
  'Generating KPI cards...',
  'Building dashboard...',
  'Extracting insights...',
  'Ready!',
];

export default function HomePage() {
  const router = useRouter();
  const setSession = useSessionStore((s) => s.setSession);

  const [mode, setMode] = useState<'both' | 'dashboard' | 'query'>('both');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState(0);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');

  // Typewriter effect
  useEffect(() => {
    const phrase = TYPEWRITER_PHRASES[phraseIdx];
    if (charIdx < phrase.length) {
      const t = setTimeout(() => {
        setDisplayed(phrase.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, 45);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setCharIdx(0);
        setDisplayed('');
        setPhraseIdx((i) => (i + 1) % TYPEWRITER_PHRASES.length);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [charIdx, phraseIdx]);

  // Step simulator for upload
  useEffect(() => {
    if (!uploading) return;
    const interval = setInterval(() => {
      setUploadStep((s) => Math.min(s + 1, UPLOAD_STEPS.length - 2));
    }, 600);
    return () => clearInterval(interval);
  }, [uploading]);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith('.csv')) {
        toast.error('Please upload a .csv file');
        return;
      }
      setUploading(true);
      setUploadProgress(0);
      setUploadStep(0);
      try {
        const result = await api.upload(file, mode, setUploadProgress);
        setUploadStep(UPLOAD_STEPS.length - 1);
        const session: SessionState = {
          sessionId: result.dataset_id,
          filename: file.name,
          rowCount: result.row_count,
          mode: result.mode,
          profile: result.profile,
          dashboard: result.dashboard,
          suggestions: result.suggestions,
          datasetSummaryText: result.dataset_summary_text,
          columns: result.columns,
        };
        setSession(session);
        await new Promise((r) => setTimeout(r, 500));
        router.push(`/app/${result.dataset_id}`);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Upload failed');
        setUploading(false);
        setUploadStep(0);
      }
    },
    [mode, router, setSession]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: (accepted) => accepted[0] && handleFile(accepted[0]),
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Hero */}
      <div className="hero-grid relative flex-1 flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-3xl" />
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium"
        >
          <Zap className="w-3 h-3" />
          Deterministic · LLM-optional · Zero SQL
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-center leading-tight tracking-tight max-w-4xl"
        >
          Talk to your data.{' '}
          <span className="text-gradient">Like a person.</span>
        </motion.h1>

        {/* Typewriter subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-xl text-zinc-400 text-center max-w-2xl"
        >
          Upload a CSV. Ask about{' '}
          <span className="text-zinc-200 font-mono">{displayed}</span>
          <span className="inline-block w-0.5 h-5 bg-indigo-400 ml-0.5 animate-pulse align-middle" />
        </motion.p>

        {/* Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-full"
        >
          {(['both', 'dashboard', 'query'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                mode === m
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {m === 'both' ? 'Full Mode' : m}
            </button>
          ))}
        </motion.div>

        {/* Dropzone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 w-full max-w-xl"
        >
          <AnimatePresence mode="wait">
            {uploading ? (
              <motion.div
                key="progress"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl bg-zinc-900 border border-zinc-800 p-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-zinc-400 font-mono">
                    {UPLOAD_STEPS[uploadStep]}
                  </span>
                  <span className="text-sm text-indigo-400 font-mono">{uploadProgress}%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  {UPLOAD_STEPS.slice(0, uploadStep + 1).map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-xs text-zinc-500"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {step}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  {...getRootProps()}
                  className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive && !isDragReject
                      ? 'border-indigo-500 bg-indigo-500/5 glow-indigo'
                      : isDragReject
                      ? 'border-red-500 bg-red-500/5'
                      : 'border-zinc-700 hover:border-indigo-500/50 hover:bg-zinc-900/50'
                  }`}
                >
                <input {...getInputProps()} />
                <motion.div
                  animate={{ y: isDragActive ? -6 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <Upload
                    className={`w-10 h-10 mx-auto mb-4 ${
                      isDragActive ? 'text-indigo-400' : 'text-zinc-600'
                    } transition-colors`}
                  />
                </motion.div>
                <p className="text-zinc-300 font-medium text-lg">
                  {isDragActive ? 'Drop your CSV here' : 'Drop a CSV or click to browse'}
                </p>
                <p className="mt-2 text-sm text-zinc-500">Max 10MB · Any CSV format</p>
                <div className="mt-6 flex items-center justify-center">
                  <button
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Choose File
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 text-xs text-zinc-600 text-center"
        >
          Works with sales, HR, finance, logistics, SaaS, and marketing data
        </motion.p>
      </div>

      {/* Features Section */}
      <div className="border-t border-zinc-900 bg-zinc-950 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-3"
          >
            Everything you need from your data
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-center mb-12"
          >
            Upload once. Explore forever.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl p-6 border card-hover ${f.bg} ${f.border}`}
              >
                <div className={`w-10 h-10 rounded-lg ${f.bg} ${f.border} border flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-zinc-100 mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-6 py-6 text-center text-xs text-zinc-700">
        TalkingBI · Deterministic AI Analytics · Built with FastAPI + Next.js
      </footer>
    </div>
  );
}
