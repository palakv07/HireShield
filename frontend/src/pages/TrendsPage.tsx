import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  BarChart3,
  CheckCircle,
  Database,
  RefreshCw,
  Info,
} from 'lucide-react';
import type { TrendsData } from '../types';

export const TrendsPage: React.FC = () => {
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/trends');
      if (!res.ok) throw new Error('Failed to load trends data.');
      const data: TrendsData = await res.json();
      setTrends(data);
    } catch (err: any) {
      setError(err.message || 'Error connecting to analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const COLORS = ['#E5484D', '#F5A524', '#1268E8', '#3B82F6', '#8A94A6'];

  return (
    <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1268E8]/10 text-[#1268E8] text-xs font-semibold border border-[#1268E8]/20 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Community Intelligence & Benchmark</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
            Fraud Trends & Heuristic Accuracy
          </h1>
          <p className="text-sm text-[#5B6678] mt-1">
            Aggregated, strictly anonymized data from user reports and benchmark evaluation runs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8A94A6] bg-[#F6F8FB] border border-[#E6ECF3] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#1268E8]" />
            <span>Demo Baseline Data Included</span>
          </span>
          <button
            onClick={fetchTrends}
            className="p-2 text-[#5B6678] hover:text-[#0B1F3A] hover:bg-[#F6F8FB] border border-[#E6ECF3] rounded-lg transition-colors"
            title="Refresh trends"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && !trends ? (
        <div className="card-white p-12 text-center space-y-3">
          <div className="w-6 h-6 border-2 border-[#1268E8] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#5B6678]">Loading real-time trends...</p>
        </div>
      ) : error ? (
        <div className="card-white p-6 border-red-200 text-center text-xs text-red-600">
          {error}
        </div>
      ) : trends ? (
        <>
          {/* Measured Benchmark Accuracy Card (Section 7 Acceptance Criteria) */}
          <div className="card-white p-6 sm:p-8 rounded-2xl border border-[#E6ECF3] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6ECF3] pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1268E8]">
                  Rigorous Verification
                </span>
                <h3 className="text-lg font-bold text-[#0B1F3A] mt-0.5">
                  Prototype Measured Heuristic Accuracy
                </h3>
              </div>
              <span className="text-xs text-[#8A94A6]">
                Evaluated: {trends.benchmark_metrics.evaluated_at}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="card-soft p-4 rounded-xl border border-[#E6ECF3] space-y-1">
                <span className="text-xs text-[#5B6678] font-medium">Planted Scam Detection</span>
                <div className="text-2xl font-extrabold text-[#1268E8] flex items-center gap-1.5">
                  <CheckCircle className="w-5 h-5 text-[#1268E8]" />
                  <span>{trends.benchmark_metrics.detection_rate}%</span>
                </div>
                <p className="text-[11px] text-[#8A94A6]">
                  {trends.benchmark_metrics.scam_samples} synthetic scams tested
                </p>
              </div>

              <div className="card-soft p-4 rounded-xl border border-[#E6ECF3] space-y-1">
                <span className="text-xs text-[#5B6678] font-medium">False Positive Rate</span>
                <div className="text-2xl font-extrabold text-[#0B1F3A]">
                  {trends.benchmark_metrics.false_positive_rate}%
                </div>
                <p className="text-[11px] text-[#8A94A6]">
                  {trends.benchmark_metrics.legitimate_samples} legitimate posts tested
                </p>
              </div>

              <div className="card-soft p-4 rounded-xl border border-[#E6ECF3] space-y-1">
                <span className="text-xs text-[#5B6678] font-medium">Total Test Dataset</span>
                <div className="text-2xl font-extrabold text-[#0B1F3A]">
                  {trends.benchmark_metrics.samples_count}
                </div>
                <p className="text-[11px] text-[#8A94A6]">
                  Full synthetic labeled cases in /backend/tests/data
                </p>
              </div>

              <div className="card-soft p-4 rounded-xl border border-[#E6ECF3] space-y-1">
                <span className="text-xs text-[#5B6678] font-medium">Community Reports</span>
                <div className="text-2xl font-extrabold text-[#1268E8]">
                  {trends.total_reports}
                </div>
                <p className="text-[11px] text-[#8A94A6]">
                  Logged with double server-side redaction
                </p>
              </div>
            </div>

            <p className="text-xs text-[#8A94A6] pt-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>
                These benchmark numbers are computed directly by running <code className="bg-[#F6F8FB] px-1 py-0.5 rounded border border-[#E6ECF3] text-[#0B1F3A]">python evaluate.py</code> against the labeled synthetic test suite.
              </span>
            </p>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reports by Scam Type */}
            <div className="card-white p-6 rounded-2xl border border-[#E6ECF3] space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-[#0B1F3A]">
                  Reports by Scam Type
                </h3>
                <span className="text-[11px] text-[#8A94A6] bg-[#F6F8FB] px-2 py-0.5 rounded border border-[#E6ECF3]">
                  Demo data
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends.by_scam_type} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5B6678' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5B6678' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E6ECF3',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {trends.by_scam_type.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Reports by Platform */}
            <div className="card-white p-6 rounded-2xl border border-[#E6ECF3] space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-[#0B1F3A]">
                  Encounter Platforms
                </h3>
                <span className="text-[11px] text-[#8A94A6] bg-[#F6F8FB] px-2 py-0.5 rounded border border-[#E6ECF3]">
                  Demo data
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends.by_platform} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5B6678' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5B6678' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E6ECF3',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      }}
                    />
                    <Bar dataKey="count" fill="#1268E8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Flag Frequency Chart */}
          <div className="card-white p-6 rounded-2xl border border-[#E6ECF3] space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-[#0B1F3A]">
                  Most Frequent Heuristic Indicators
                </h3>
                <p className="text-xs text-[#5B6678]">
                  Frequency of detected behavioral signals across analyzed offers.
                </p>
              </div>
              <span className="text-[11px] text-[#8A94A6] bg-[#F6F8FB] px-2 py-0.5 rounded border border-[#E6ECF3]">
                Demo data
              </span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trends.flag_frequency}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 60, bottom: 0 }}
                >
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#5B6678' }} />
                  <YAxis dataKey="flag" type="category" tick={{ fontSize: 11, fill: '#0B1F3A' }} width={170} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E6ECF3',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#0B1F3A" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
