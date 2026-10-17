export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface FlagItem {
  id: string;
  title: string;
  severity: RiskLevel;
  weight: number;
  evidence: string;
  span: [number, number];
  why: string;
}

export interface AnalysisResult {
  analysis_id: string;
  risk_level: RiskLevel;
  score: number;
  summary: string;
  flags: FlagItem[];
  unknowns: string[];
  checklist: string[];
  content_signals: number;
  url_signals: number;
  disclaimer: string;
  confidence_note: string;
}

export interface SensitiveDetection {
  type: string;
  label: string;
}

export interface ReportPayload {
  scam_type: string;
  platform: string;
  redacted_text: string;
}

export interface FeedbackPayload {
  analysis_id?: string;
  helpful: boolean;
  comment?: string;
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface FlagCount {
  flag: string;
  count: number;
}

export interface BenchmarkMetrics {
  detection_rate: number;
  false_positive_rate: number;
  samples_count: number;
  scam_samples: number;
  legitimate_samples: number;
  evaluated_at: string;
}

export interface TrendsData {
  total_reports: number;
  total_analyses: number;
  by_scam_type: CategoryCount[];
  by_platform: CategoryCount[];
  flag_frequency: FlagCount[];
  benchmark_metrics: BenchmarkMetrics;
  is_demo_seed: boolean;
}
