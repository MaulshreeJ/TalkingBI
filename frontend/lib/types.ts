// TalkingBI API Types

export interface ColumnMeta {
  type: 'numeric' | 'categorical' | 'datetime' | 'unknown';
  null_pct: number;
  unique: number;
  sample_values: string[];
  stats: Record<string, number>;
}

export interface Dashboard {
  kpis: KpiSpec[];
  charts: ChartSpec[];
  insights: InsightItem[];
}

export interface KpiSpec {
  column: string;
  name: string;
  aggregation?: string;
  value?: number;
  total?: number;
  segment_by?: string;
  time_column?: string;
  business_meaning?: string;
  confidence?: number;
}

export interface ChartSpec {
  type: 'bar' | 'line' | 'pie' | 'scatter';
  kpi: string;
  dimension?: string;
  title?: string;
  data?: ChartDataPoint[];
  x?: string[] | number[];
  y?: number[];
}

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface InsightItem {
  type: 'TOP' | 'LOW' | 'TREND' | 'ANOMALY' | 'CONTRIBUTION' | 'DATASET_AWARENESS' | 'DATASET_QUERY' | 'SUGGESTION' | 'MODE';
  summary: string;
  text: string;
}

export interface ProfileEntry {
  dtype: string;
  semantic_type: 'kpi' | 'date' | 'dimension';
  cardinality_bucket: 'low' | 'med' | 'high';
  null_pct: number;
  unique: number;
  sample_values: string[];
  distribution: Record<string, number>;
  role_scores: { is_kpi: number; is_dimension: number; is_date: number };
}

export interface SuggestionsPayload {
  type: string;
  items: string[];
}

export interface UploadResponse {
  dataset_id: string;
  columns: Record<string, ColumnMeta>;
  row_count: number;
  profile: Record<string, ProfileEntry>;
  mode: string;
  dataset_summary: Record<string, unknown>;
  dataset_summary_text: string;
  dashboard: Dashboard;
  suggestions: SuggestionsPayload;
}

export type QueryStatus = 'RESOLVED' | 'INCOMPLETE' | 'UNKNOWN' | 'AMBIGUOUS' | 'ERROR';

export interface QueryIntent {
  intent: string;
  kpi: string | null;
  kpi_1?: string | null;
  kpi_2?: string | null;
  dimension: string | null;
  filter: unknown;
}

export interface QueryResponse {
  status: QueryStatus;
  query: string;
  session_id: string;
  intent: QueryIntent;
  semantic_meta: Record<string, unknown>;
  data: unknown[];
  charts: ChartSpec[];
  insights: InsightItem[];
  candidates: string[];
  plan: Record<string, unknown>;
  latency_ms: number;
  warnings: string[];
  errors: string[];
  trace: Record<string, unknown>;
  kpis?: KpiSpec[];
}

export interface SuggestResponse {
  session_id: string;
  prefix: string;
  suggestions: SuggestionsPayload;
}

export interface SessionStatus {
  session_id: string;
  status: string;
  created_at: string;
  expires_at: string;
  dataset_shape: [number, number] | null;
  conversation_turns: number;
  evaluation_records: number;
}

export interface MetricsResponse {
  total_queries: number;
  resolved: number;
  incomplete: number;
  unknown: number;
  ambiguous: number;
  avg_latency_ms: number;
  p90_latency_ms: number;
  cache_hit_rate: number;
  queries: unknown[];
}

// Chat message types (frontend only)
export type MessageRole = 'user' | 'assistant';
export type MessageStatus = 'sending' | 'done' | 'error';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  query?: string;
  response?: QueryResponse;
  status: MessageStatus;
  timestamp: number;
}

// Session state (frontend only)
export interface SessionState {
  sessionId: string;
  filename: string;
  rowCount: number;
  mode: string;
  profile: Record<string, ProfileEntry>;
  dashboard: Dashboard;
  suggestions: SuggestionsPayload | string[];
  datasetSummaryText: string;
  columns: Record<string, ColumnMeta>;
}
