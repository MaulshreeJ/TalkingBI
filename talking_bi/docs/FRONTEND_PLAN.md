# TalkingBI — Production Frontend Integration Plan

> Goal: Transform the current 34 KB monolithic `index.html` into a **modern, professional, interactive and fun** web application that feels like Notion × Mixpanel × ChatGPT.

---

## Recommended Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 14 (App Router)** | SSR, file-based routing, API routes for BFF pattern |
| Styling | **Tailwind CSS v3 + shadcn/ui** | Utility-first + headless accessible components |
| Charts | **Recharts + Plotly.js** | Recharts for interactive React charts, Plotly for complex viz |
| Animations | **Framer Motion** | Production-grade, Spring physics, layout animations |
| State | **Zustand** | Lightweight, no boilerplate, perfect for session + chat state |
| Data fetching | **SWR or React Query** | Real-time polling for metrics, optimistic updates |
| Fonts | **Inter + JetBrains Mono** | Modern sans-serif + monospace for code/data |
| Icons | **Lucide React** | Clean, consistent, tree-shakable |
| Drag & Drop | **@dnd-kit** | For dashboard widget reordering |
| File Upload | **react-dropzone** | Polished drag-and-drop CSV uploader |

---

## Design System

### Color Palette (Dark Mode First)
```
Background:    #09090B  (zinc-950)
Surface:       #18181B  (zinc-900)
Card:          #27272A  (zinc-800)
Border:        #3F3F46  (zinc-700)
Primary:       #6366F1  (indigo-500)  → CTA, active states
Accent:        #22D3EE  (cyan-400)    → Chart highlights, success
Warning:       #F59E0B  (amber-500)
Text-primary:  #FAFAFA
Text-muted:    #A1A1AA
```

### Typography
- Headings: `Inter`, weight 700/600
- Body: `Inter`, weight 400/500
- Data/Code: `JetBrains Mono` for column names, queries, numbers

### Motion Principles
- **Page transitions**: 200ms fade + 10px slide up (Framer Motion `AnimatePresence`)
- **Card reveals**: Staggered children with 50ms delay per card
- **KPI counters**: Count-up animation on mount (react-countup)
- **Chart draw**: SVG path animation on first render
- **Micro-interactions**: Button scale on tap (0.97), hover lift on cards (translateY -2px)

---

## Page Architecture

### 1. Landing / Upload Page `/`

**Vibe**: Cinematic dark hero, Stripe-style

**Elements**:
- Full-viewport hero with animated particle/grid background (tsParticles or CSS grid animation)
- Large headline: *"Talk to your data. Like a person."*
- Sub-headline with typewriter effect cycling: *"Ask about revenue... by region... over time..."*
- Giant drag-and-drop zone with dashed animated border, CSV icon that bounces on hover
- Demo button that loads a sample dataset instantly
- 3-feature grid below: Dataset Intelligence | Auto Dashboard | Chat Query
- Social proof bar: "Works with sales, HR, finance, logistics, SaaS data"

**Interactions**:
- Drag-and-drop: file zone glows indigo on drag-over, shows file name + row preview on drop
- Upload progress: animated fill bar + live log: *"Profiling 47 columns... Generating dashboard..."*
- Mode selector: 3 pill tabs (Dashboard / Query / Both) with smooth underline animation
- On upload success: hero morphs into app with a satisfying pop animation

---

### 2. Main App Shell `/app/[session_id]`

**Vibe**: Three-panel analyst workspace (like Linear or Figma)

```
┌─────────────────────────────────────────────────────────────────┐
│  ← TalkingBI       sales_data.csv  47 cols  10k rows    ⚙ ✕   │
├──────────┬──────────────────────────────────┬───────────────────┤
│          │                                  │                   │
│ SIDEBAR  │     DASHBOARD / CHART AREA       │   CHAT PANEL      │
│          │                                  │                   │
│ Dataset  │  KPI Cards (animated counters)   │ 💬 Ask anything   │
│ Profile  │  Charts (Recharts/Plotly)         │                   │
│          │  Insights panel                  │ [Suggested qs]    │
│ Insights │  Drag to reorder widgets         │                   │
│          │                                  │ [Input bar]       │
└──────────┴──────────────────────────────────┴───────────────────┘
```

---

### 3. Dataset Profile Panel (Sidebar)

**Vibe**: GitHub's Copilot sidebar meets a Bloomberg terminal

**Content**:
- Collapsible sidebar (60px icon-only ↔ 260px expanded)
- **Dataset Card**: filename, rows, cols, upload time, quality score badge (e.g. 87% complete)
- **Column Explorer**: table showing each column with:
  - Type chip: `KPI` (indigo) | `Dimension` (cyan) | `Date` (amber)
  - Mini sparkline for numeric cols
  - Null %, unique count
  - Hover → expanded popover with distribution histogram
- **Session Info**: expires in Xh, mode: both

---

### 4. KPI Dashboard Area (Center)

**Vibe**: Ramp / Stripe Dashboard

**KPI Cards** (animated on mount):
```
┌─────────────────────────┐
│ 📈 Total Revenue         │
│                          │
│  $2,847,392              │  ← count-up animation
│  ↑ 12.4% vs avg          │  ← trend badge
│                          │
│  [sparkline]             │
└─────────────────────────┘
```
- **Drag to reorder** KPI cards with @dnd-kit
- Click a KPI card → chat auto-populates: *"Show revenue by region"*
- **Insight pills** below each card: "North leads contribution at 34%"

**Charts**:
- Recharts `BarChart`, `LineChart`, `PieChart` with custom tooltips
- Chart type switcher: bar | line | pie | scatter (animated transition between types)
- Download chart as PNG button
- **Zoom & brush** on time-series charts
- Chart cards have a subtle gradient top border (indigo → cyan)

**Insights Panel**:
- Each insight is a card with type badge: `TOP` | `LOW` | `TREND` | `ANOMALY` | `CONTRIBUTION`
- ANOMALY cards pulse with amber glow animation
- Clicking an insight expands explanation + chart

---

### 5. Chat Panel (Right)

**Vibe**: ChatGPT × Bloomberg natural language terminal

**Features**:

#### Suggested Queries (from `/suggest` endpoint)
- Scrollable chip row: *"Show revenue by region"*, *"Revenue trend over time"*, *"Compare profit vs cost"*
- Chips animate in on load (staggered fade)
- Prefix-aware: as user types, chips filter dynamically (calls `/suggest?q=...`)

#### Chat Input
- Full-width textarea with `Cmd+Enter` submit
- "Powered by AI" badge → tooltip showing which parser was used (deterministic or LLM)
- Voice input button (Web Speech API) — optional but fun
- Auto-resize textarea

#### Chat Messages
Each response contains:
- **User message bubble** (right, indigo)
- **AI response** (left, dark card) with:
  - Status badge: `✓ RESOLVED` (green) | `⟳ INCOMPLETE` (amber) | `? AMBIGUOUS` (purple)
  - Inline chart (Plotly rendered right in the chat)
  - Data table (sortable, paginated)
  - Insight text
  - Trace accordion (expandable debug info: parser used, latency, normalized query)
  - Typing indicator (3 animated dots) while loading

#### Conversational Context Chip
- Active context shown: *"Context: Revenue (inherited from turn 3)"*
- Click to clear context

---

### 6. Metrics Dashboard `/app/[session_id]/metrics`

**Vibe**: Real-time Datadog lite

- Resolution rate bar (RESOLVED / INCOMPLETE / UNKNOWN / AMBIGUOUS)
- Latency histogram (p50, p90, p99) as area chart
- Parser usage pie: Deterministic vs LLM
- Cache hit rate gauge
- Query timeline: scrollable feed of all queries this session with status pill + latency

---

### 7. Error / Edge States

| State | Treatment |
|-------|-----------|
| Session expired | Full-screen soft modal with "Upload a new file" CTA |
| INCOMPLETE response | Inline clarification cards: "Did you mean...?" with clickable suggestions |
| AMBIGUOUS | Disambiguation picker: "Which do you mean — gross_sales or net_sales?" |
| Upload failed | Shake animation + toast error message |
| Empty result | Illustrated empty state: "No data matches your filter" |
| Network error | Retry button with exponential backoff indicator |

---

## Key "Fun + Wow" Interactive Features

### 🎲 One-Click Demo Mode
- Pre-loads a curated sample dataset (sales, HR, or SaaS depending on click)
- Auto-runs 3 demo queries with animated playback
- "Try with your own data →" CTA at the end

### 🔍 Column Click-to-Query
- In dataset profile sidebar, click any column → chat automatically asks a smart question about it
- e.g. click `revenue` → *"Show revenue distribution by top dimension"*

### 🌊 Live Insight Stream
- On upload, insights animate in one-by-one with a typewriter effect
- Each insight card slides in from below with spring physics

### 🎯 Query Autocomplete
- As user types, suggestions from `/suggest?q=...` appear below input as a dropdown
- Arrow keys to navigate, Enter to select

### 📤 Export Options
- Export chart as PNG / SVG
- Export data table as CSV
- Export session summary as PDF (using `html2pdf.js`)
- Share session link (copy UUID to clipboard with toast confirmation)

### 🌓 Theme Toggle
- Dark (default) ↔ Light mode with smooth CSS variable transition (300ms)
- Persisted in localStorage

### ⌨️ Keyboard Shortcuts
- `Cmd+K` → open query input
- `Cmd+/` → toggle sidebar
- `Esc` → clear current query
- `Cmd+Enter` → submit query
- Show shortcut cheatsheet with `?`

### 📱 Responsive Layout
- Mobile: stacked single column, bottom sheet for chat
- Tablet: two-panel (dashboard + chat)
- Desktop: full three-panel

---

## Backend Integration Map

| Frontend Action | API Call | Notes |
|----------------|---------|-------|
| File drop | `POST /upload?mode=both` | Stream progress via onUploadProgress |
| Page load with session | `GET /session/{id}/status` | Validate session still alive |
| Send chat message | `POST /query/{session_id}` | Poll until RESOLVED |
| Type in input | `GET /suggest/{session_id}?q=...` | Debounce 200ms |
| Metrics tab | `GET /metrics/session/{session_id}` | Refresh every 30s |
| Delete session | `DELETE /session/{session_id}` | On window unload or explicit close |

### Optimistic UI Pattern
For the chat: show the user message immediately, show skeleton card while fetching, then animate in the real response. Never block on network.

---

## Project Structure (Next.js)

```
talkingbi-frontend/
  app/
    page.tsx                  ← Upload / Landing
    app/
      [session_id]/
        page.tsx              ← Main dashboard + chat
        metrics/page.tsx      ← Metrics view
  components/
    upload/
      DropZone.tsx
      UploadProgress.tsx
    dashboard/
      KpiCard.tsx
      ChartCard.tsx
      InsightCard.tsx
      DashboardGrid.tsx       ← @dnd-kit drag container
    chat/
      ChatPanel.tsx
      ChatMessage.tsx
      SuggestChips.tsx
      QueryInput.tsx
      TraceAccordion.tsx
    sidebar/
      DatasetProfile.tsx
      ColumnExplorer.tsx
      SessionInfo.tsx
    shared/
      StatusBadge.tsx
      ThemeToggle.tsx
      Skeleton.tsx
      EmptyState.tsx
  stores/
    sessionStore.ts           ← Zustand: session_id, df profile, mode
    chatStore.ts              ← Zustand: messages, loading
    dashboardStore.ts         ← Zustand: widget order, active chart type
  lib/
    api.ts                    ← Type-safe API client (fetch wrapper)
    formatters.ts             ← Number / date formatters
  styles/
    globals.css               ← Tailwind + CSS variables
```

---

## Build Roadmap

### Phase 1 — Foundation (Week 1)
- [ ] Next.js project setup with Tailwind + shadcn/ui
- [ ] Upload page with animated dropzone
- [ ] API client (`lib/api.ts`) wrapping all 5 endpoints
- [ ] Session routing (`/app/[session_id]`)
- [ ] Basic 3-panel shell with responsive layout

### Phase 2 — Dashboard (Week 2)
- [ ] KPI cards with count-up animations
- [ ] Recharts integration for bar/line/pie
- [ ] Chart type switcher (animated)
- [ ] Insight cards with type badges
- [ ] Drag-to-reorder dashboard with @dnd-kit

### Phase 3 — Chat (Week 2–3)
- [ ] Chat message list with typing indicator
- [ ] Inline Plotly charts in chat responses
- [ ] Suggest chips with prefix filtering
- [ ] Status badge (RESOLVED / INCOMPLETE / AMBIGUOUS / UNKNOWN)
- [ ] Trace accordion for debug visibility
- [ ] Context chip (inherited KPI indicator)

### Phase 4 — Polish (Week 3–4)
- [ ] Framer Motion page transitions + card stagger
- [ ] One-click demo mode
- [ ] Keyboard shortcuts
- [ ] Dark/Light theme toggle
- [ ] Export (PNG, CSV, PDF)
- [ ] Mobile responsive layout
- [ ] Error & empty states

### Phase 5 — Production (Week 4–5)
- [ ] Metrics dashboard
- [ ] Session expiry UX
- [ ] Column click-to-query
- [ ] Voice input (Web Speech API)
- [ ] Rate limit feedback UI
- [ ] Performance audit (Lighthouse > 90)
- [ ] Deploy to Vercel (connect to FastAPI on Railway/Render)

---

## Deployment Architecture (Production)

```
Vercel (Next.js frontend)
       ↕ HTTPS
Railway / Render (FastAPI backend)
  [In-memory session store — upgrade to Redis]
```

For production:
- Add `NEXT_PUBLIC_API_URL` env var pointing to FastAPI
- Add CORS on FastAPI for the Vercel domain
- Upgrade session store to Redis (replace `SESSION_STORE` dict)
- Add reverse proxy (Nginx) for the FastAPI backend
