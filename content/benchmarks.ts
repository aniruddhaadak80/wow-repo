/*
 * SAMPLE DATASET. Every score, latency, and cost in this file is synthetic
 * demo data shaped like harness output. It is not a real leaderboard and no
 * model or framework was measured to produce it.
 *
 * The shape mirrors what a real harness would emit: a composite score, the
 * delta against the previous run, per-task latency and cost, and a breakdown
 * per benchmark suite. Replace the contents of this file (or point
 * `lib/benchmarks.ts` at a real registry) to ship real numbers.
 */

export const BENCHMARK_TRACKS = ['llm', 'agent'] as const

export type BenchmarkTrack = (typeof BENCHMARK_TRACKS)[number]

export interface Breakdown {
  /** Benchmark suite name, e.g. "SWE-bench Verified". */
  label: string
  /** Score for that suite, 0-100. */
  score: number
}

export interface BenchmarkEntry {
  id: string
  track: BenchmarkTrack
  /** Model or harness name. */
  name: string
  /** Lab or author. */
  org: string
  /** Composite score across the breakdown suites, 0-100. */
  score: number
  /** Points gained or lost against the previous run of the same harness. */
  delta: number
  /** Median seconds per completed task. */
  latency: number
  /** USD per completed task. */
  cost: number
  breakdown: Breakdown[]
  updatedAt: string
}

/** The harness this repository ships, included in the agent track for context. */
export const OWN_HARNESS_ID = 'wow-runner'

export const benchmarkEntries: BenchmarkEntry[] = [
  {
    id: 'claude-sonnet-4-5',
    track: 'llm',
    name: 'Claude Sonnet 4.5',
    org: 'Anthropic',
    score: 76.3,
    delta: 2.1,
    latency: 38.4,
    cost: 0.42,
    breakdown: [
      { label: 'SWE-bench Verified', score: 77.2 },
      { label: 'Terminal-Bench 2.0', score: 62.8 },
      { label: 'GPQA Diamond', score: 83.1 },
      { label: 'AIME 2026', score: 87.0 },
      { label: 'TAU-bench', score: 71.4 },
    ],
    updatedAt: '2026-10-04',
  },
  {
    id: 'gpt-5-2',
    track: 'llm',
    name: 'GPT-5.2',
    org: 'OpenAI',
    score: 74.9,
    delta: 1.4,
    latency: 29.7,
    cost: 0.36,
    breakdown: [
      { label: 'SWE-bench Verified', score: 75.4 },
      { label: 'Terminal-Bench 2.0', score: 66.1 },
      { label: 'GPQA Diamond', score: 81.6 },
      { label: 'AIME 2026', score: 84.2 },
      { label: 'TAU-bench', score: 67.3 },
    ],
    updatedAt: '2026-10-03',
  },
  {
    id: 'gemini-3-pro',
    track: 'llm',
    name: 'Gemini 3 Pro',
    org: 'Google DeepMind',
    score: 73.6,
    delta: 3.2,
    latency: 24.1,
    cost: 0.31,
    breakdown: [
      { label: 'SWE-bench Verified', score: 73.9 },
      { label: 'Terminal-Bench 2.0', score: 61.2 },
      { label: 'GPQA Diamond', score: 82.4 },
      { label: 'AIME 2026', score: 88.3 },
      { label: 'TAU-bench', score: 62.0 },
    ],
    updatedAt: '2026-10-05',
  },
  {
    id: 'grok-4-1',
    track: 'llm',
    name: 'Grok 4.1',
    org: 'xAI',
    score: 71.2,
    delta: -0.8,
    latency: 21.3,
    cost: 0.28,
    breakdown: [
      { label: 'SWE-bench Verified', score: 71.8 },
      { label: 'Terminal-Bench 2.0', score: 58.4 },
      { label: 'GPQA Diamond', score: 79.2 },
      { label: 'AIME 2026', score: 82.1 },
      { label: 'TAU-bench', score: 64.5 },
    ],
    updatedAt: '2026-10-01',
  },
  {
    id: 'deepseek-v3-2',
    track: 'llm',
    name: 'DeepSeek V3.2',
    org: 'DeepSeek',
    score: 69.8,
    delta: 4.4,
    latency: 33.6,
    cost: 0.11,
    breakdown: [
      { label: 'SWE-bench Verified', score: 70.1 },
      { label: 'Terminal-Bench 2.0', score: 54.7 },
      { label: 'GPQA Diamond', score: 76.8 },
      { label: 'AIME 2026', score: 85.4 },
      { label: 'TAU-bench', score: 61.8 },
    ],
    updatedAt: '2026-10-02',
  },
  {
    id: 'kimi-k2-thinking',
    track: 'llm',
    name: 'Kimi K2 Thinking',
    org: 'Moonshot AI',
    score: 68.4,
    delta: 1.1,
    latency: 41.2,
    cost: 0.19,
    breakdown: [
      { label: 'SWE-bench Verified', score: 69.3 },
      { label: 'Terminal-Bench 2.0', score: 60.4 },
      { label: 'GPQA Diamond', score: 74.1 },
      { label: 'AIME 2026', score: 78.6 },
      { label: 'TAU-bench', score: 59.7 },
    ],
    updatedAt: '2026-09-30',
  },
  {
    id: 'qwen3-max',
    track: 'llm',
    name: 'Qwen3-Max',
    org: 'Alibaba',
    score: 66.9,
    delta: 0.6,
    latency: 26.8,
    cost: 0.14,
    breakdown: [
      { label: 'SWE-bench Verified', score: 68.2 },
      { label: 'Terminal-Bench 2.0', score: 53.1 },
      { label: 'GPQA Diamond', score: 73.9 },
      { label: 'AIME 2026', score: 79.4 },
      { label: 'TAU-bench', score: 59.9 },
    ],
    updatedAt: '2026-09-29',
  },
  {
    id: 'llama-4-maverick',
    track: 'llm',
    name: 'Llama 4 Maverick',
    org: 'Meta',
    score: 61.5,
    delta: -1.9,
    latency: 19.4,
    cost: 0.09,
    breakdown: [
      { label: 'SWE-bench Verified', score: 62.7 },
      { label: 'Terminal-Bench 2.0', score: 47.3 },
      { label: 'GPQA Diamond', score: 71.2 },
      { label: 'AIME 2026', score: 74.8 },
      { label: 'TAU-bench', score: 51.4 },
    ],
    updatedAt: '2026-09-27',
  },
  {
    id: 'wow-runner',
    track: 'agent',
    name: 'wow-runner',
    org: 'this repo',
    score: 78.1,
    delta: 5.3,
    latency: 44.1,
    cost: 0.24,
    breakdown: [
      { label: 'Plan adherence', score: 84.6 },
      { label: 'Tool-call accuracy', score: 81.2 },
      { label: 'Recovery from errors', score: 73.9 },
      { label: 'Context discipline', score: 76.4 },
      { label: 'Cost per task', score: 74.3 },
    ],
    updatedAt: '2026-10-06',
  },
  {
    id: 'harbor',
    track: 'agent',
    name: 'harbor',
    org: 'skill router',
    score: 72.4,
    delta: 0.9,
    latency: 36.8,
    cost: 0.27,
    breakdown: [
      { label: 'Plan adherence', score: 79.1 },
      { label: 'Tool-call accuracy', score: 74.6 },
      { label: 'Recovery from errors', score: 68.2 },
      { label: 'Context discipline', score: 71.5 },
      { label: 'Cost per task', score: 68.7 },
    ],
    updatedAt: '2026-10-04',
  },
  {
    id: 'latch',
    track: 'agent',
    name: 'latch',
    org: 'planner-executor',
    score: 69.7,
    delta: -1.2,
    latency: 52.3,
    cost: 0.33,
    breakdown: [
      { label: 'Plan adherence', score: 76.4 },
      { label: 'Tool-call accuracy', score: 71.8 },
      { label: 'Recovery from errors', score: 61.7 },
      { label: 'Context discipline', score: 66.9 },
      { label: 'Cost per task', score: 71.6 },
    ],
    updatedAt: '2026-10-02',
  },
  {
    id: 'cinder',
    track: 'agent',
    name: 'cinder',
    org: 'tool-use loop',
    score: 64.2,
    delta: 2.4,
    latency: 28.6,
    cost: 0.18,
    breakdown: [
      { label: 'Plan adherence', score: 68.9 },
      { label: 'Tool-call accuracy', score: 70.2 },
      { label: 'Recovery from errors', score: 54.3 },
      { label: 'Context discipline', score: 62.1 },
      { label: 'Cost per task', score: 65.4 },
    ],
    updatedAt: '2026-09-30',
  },
  {
    id: 'meridian',
    track: 'agent',
    name: 'meridian',
    org: 'planner-executor',
    score: 58.9,
    delta: -2.6,
    latency: 61.7,
    cost: 0.41,
    breakdown: [
      { label: 'Plan adherence', score: 64.2 },
      { label: 'Tool-call accuracy', score: 59.8 },
      { label: 'Recovery from errors', score: 48.6 },
      { label: 'Context discipline', score: 57.3 },
      { label: 'Cost per task', score: 64.7 },
    ],
    updatedAt: '2026-09-28',
  },
  {
    id: 'spool',
    track: 'agent',
    name: 'spool',
    org: 'single-pass',
    score: 52.6,
    delta: 0.4,
    latency: 17.2,
    cost: 0.07,
    breakdown: [
      { label: 'Plan adherence', score: 55.1 },
      { label: 'Tool-call accuracy', score: 58.4 },
      { label: 'Recovery from errors', score: 41.2 },
      { label: 'Context discipline', score: 54.7 },
      { label: 'Cost per task', score: 53.6 },
    ],
    updatedAt: '2026-09-26',
  },
]
