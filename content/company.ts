/**
 * The demo org.
 *
 * Every entry below is fictional sample data used to demonstrate the
 * surface. Coverage numbers are design targets, not measured results.
 * Swap this file for a live registry and the pages do not change.
 */

export interface Agent {
  id: string
  label: string
  does: string
  /** Skill slugs this agent runs, resolved against content/skills.ts. */
  skills: string[]
}

export interface Department {
  id: string
  name: string
  summary: string
  /** Total runbooks the department owns. */
  runbooks: number
  /** How many of those runbooks an agent can run unattended. Design target. */
  automated: number
  agents: Agent[]
}

export const departments: Department[] = [
  {
    id: 'support',
    name: 'Support',
    summary: 'Triage, refunds, escalations.',
    runbooks: 24,
    automated: 19,
    agents: [
      {
        id: 'triage',
        label: 'triage',
        does: 'Reads every inbound thread, classifies it, and routes it with the reason attached.',
        skills: ['deep-research'],
      },
      {
        id: 'refunds',
        label: 'refunds',
        does: 'Verifies the policy, issues the refund, writes the ledger note.',
        skills: [],
      },
      {
        id: 'escalation',
        label: 'escalation',
        does: 'Watches for churn language and pulls a human in before the thread goes cold.',
        skills: [],
      },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    summary: 'Qualification, account prep, CRM hygiene.',
    runbooks: 18,
    automated: 12,
    agents: [
      {
        id: 'qualifier',
        label: 'qualifier',
        does: 'Scores inbound against the ICP and books the call without a prep email.',
        skills: [],
      },
      {
        id: 'researcher',
        label: 'account-research',
        does: 'Builds the account brief before the call so nobody opens the demo cold.',
        skills: ['deep-research'],
      },
      {
        id: 'hygiene',
        label: 'crm-hygiene',
        does: 'Keeps the CRM honest: stale stages get closed, notes get written.',
        skills: [],
      },
    ],
  },
  {
    id: 'engineering',
    name: 'Engineering',
    summary: 'Incidents, reviews, dependency upkeep.',
    runbooks: 31,
    automated: 22,
    agents: [
      {
        id: 'incident',
        label: 'incident-triage',
        does: 'Pulls the deploy, the logs, and the runbook into one timeline.',
        skills: [],
      },
      {
        id: 'pr-review',
        label: 'pr-review',
        does: 'Reviews for bugs, security, and test gaps in a maintainer tone.',
        skills: ['code-review-cadence'],
      },
      {
        id: 'deps',
        label: 'dependency-triage',
        does: 'Batches version bumps and flags the ones that need a human.',
        skills: ['oss-ship-kit'],
      },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    summary: 'Invoices, spend, month-end close.',
    runbooks: 16,
    automated: 11,
    agents: [
      {
        id: 'match',
        label: 'invoice-match',
        does: 'Matches invoices to purchase orders and flags the ones that do not add up.',
        skills: [],
      },
      {
        id: 'spend',
        label: 'spend-watch',
        does: 'Watches cloud and SaaS spend for anomalies, weekly, with the delta attached.',
        skills: ['data-viz-field-guide'],
      },
      {
        id: 'close',
        label: 'close-check',
        does: 'Runs the month-end checklist and lists what is still open.',
        skills: [],
      },
    ],
  },
  {
    id: 'people',
    name: 'People',
    summary: 'Onboarding, policy, interview loops.',
    runbooks: 14,
    automated: 8,
    agents: [
      {
        id: 'onboarding',
        label: 'onboarding',
        does: 'Builds the first-week plan from the role and the manager notes.',
        skills: [],
      },
      {
        id: 'policy',
        label: 'policy',
        does: 'Answers policy questions with the source document attached.',
        skills: ['deep-research'],
      },
      {
        id: 'scheduling',
        label: 'loop-scheduling',
        does: 'Coordinates interview loops across timezones without the back and forth.',
        skills: [],
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    summary: 'Repurposing, SEO, launch checklists.',
    runbooks: 22,
    automated: 15,
    agents: [
      {
        id: 'repurpose',
        label: 'repurpose',
        does: 'Turns one shipped feature into the post, the thread, and the changelog line.',
        skills: ['thread-writer'],
      },
      {
        id: 'seo',
        label: 'seo-sweep',
        does: 'Crawls for broken metadata and heading drift before search engines do.',
        skills: ['seo-auditor'],
      },
      {
        id: 'launch',
        label: 'launch-checklist',
        does: 'Runs the launch list and blocks the deploy until it is clean.',
        skills: [],
      },
    ],
  },
  {
    id: 'operations',
    name: 'Operations',
    summary: 'Renewals, access reviews, runbooks.',
    runbooks: 27,
    automated: 17,
    agents: [
      {
        id: 'renewals',
        label: 'renewals',
        does: 'Watches contract dates and surfaces the ones worth renegotiating.',
        skills: [],
      },
      {
        id: 'access',
        label: 'access-review',
        does: 'Audits who has access to what, quarterly, and revokes the leftovers.',
        skills: [],
      },
      {
        id: 'runbooks',
        label: 'runbook-audit',
        does: 'Checks that every runbook still matches the system it describes.',
        skills: [],
      },
    ],
  },
  {
    id: 'legal',
    name: 'Legal',
    summary: 'Redlines, data requests, audit trail.',
    runbooks: 12,
    automated: 6,
    agents: [
      {
        id: 'redline',
        label: 'redline',
        does: 'Reads contracts against the playbook and marks the deviations.',
        skills: ['copy-edit-pass'],
      },
      {
        id: 'dsr',
        label: 'data-requests',
        does: 'Handles data subject requests end to end with the audit trail attached.',
        skills: [],
      },
      {
        id: 'audit',
        label: 'audit-trail',
        does: 'Records every agent action, the inputs it was given, and who approved it.',
        skills: [],
      },
    ],
  },
]

export const totalAgents = departments.reduce((sum, dept) => sum + dept.agents.length, 0)

export const totalRunbooks = departments.reduce((sum, dept) => sum + dept.runbooks, 0)

export const automatedRunbooks = departments.reduce((sum, dept) => sum + dept.automated, 0)

export interface RunStep {
  id: string
  /** The agent path, in the form department/agent. */
  agent: string
  label: string
  does: string
  /** How long this step occupies in the replay, in milliseconds. */
  ms: number
}

export interface DemoRun {
  id: string
  title: string
  event: string
  steps: RunStep[]
}

/** A single replayable run. Timings are illustrative, not benchmarks. */
export const demoRun: DemoRun = {
  id: 'refund-request',
  title: 'A refund request, end to end.',
  event: 'A customer writes to support: "I was charged twice for the same invoice."',
  steps: [
    {
      id: 'capture',
      agent: 'support/triage',
      label: 'Capture',
      does: 'Reads the thread, classifies it as a duplicate charge, and pulls both charge IDs from the billing system.',
      ms: 900,
    },
    {
      id: 'verify',
      agent: 'finance/refunds',
      label: 'Verify',
      does: 'Confirms the duplicate, checks the refund policy window, and issues the refund to the original method.',
      ms: 2100,
    },
    {
      id: 'ledger',
      agent: 'finance/ledger',
      label: 'Record',
      does: 'Writes the ledger entry and links it to the ticket so the month-end close picks it up.',
      ms: 1400,
    },
    {
      id: 'crm',
      agent: 'sales/crm-hygiene',
      label: 'Log',
      does: 'Logs the case, updates the account health note, and closes the duplicate record.',
      ms: 1200,
    },
    {
      id: 'reply',
      agent: 'support/draft',
      label: 'Draft',
      does: 'Drafts the reply in the customer tone and queues it for approval instead of sending it.',
      ms: 1600,
    },
    {
      id: 'audit',
      agent: 'legal/audit-trail',
      label: 'Record trail',
      does: 'Writes the audit row: who acted, on what input, under which policy, and who approved it.',
      ms: 1000,
    },
  ],
}

/** What an agent is allowed to do on its own. */
export const agentActs: string[] = [
  'Read the data it needs, and only the data it needs.',
  'Classify, draft, batch, and schedule.',
  'Write to the systems it owns: tickets, notes, ledger rows.',
  'Record every action with the inputs it was given.',
]

/** What still needs a person, no matter how good the agent is. */
export const humanDecides: string[] = [
  'Money leaving the account.',
  'Anything that reaches a customer.',
  'Access changes and role grants.',
  'Legal commitments and contract terms.',
  'Hiring, performance, and departures.',
]
