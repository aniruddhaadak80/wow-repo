/*
 * The frontier log.
 *
 * Two tracks in one typed model:
 *   - "discovery": science that happened. Instruments, trials, papers.
 *   - "signal":     evidence about how fast machine research is compounding.
 *
 * Every entry carries a real source URL and, where a number is shown, that
 * number is quoted from the source rather than estimated. `caveat` is not
 * optional filler: it is the honest limit of the claim, written next to it.
 *
 * Date precision is allowed to vary. 'YYYY', 'YYYY-MM', and 'YYYY-MM-DD' are
 * all valid, and the page renders the precision it was given. Do not invent
 * day precision to make a row look tidier.
 */

export const TRACKS = ['discovery', 'signal'] as const
export type Track = (typeof TRACKS)[number]

export const FIELDS = [
  'Space',
  'Life sciences',
  'Medicine',
  'Frontier methods',
  'AI research',
] as const
export type Field = (typeof FIELDS)[number]

export interface Source {
  label: string
  url: string
}

export interface Figure {
  value: string
  label: string
}

export interface Finding {
  slug: string
  title: string
  track: Track
  field: Field
  /** Who produced the result. */
  org: string
  /** 'YYYY' | 'YYYY-MM' | 'YYYY-MM-DD'. Rendered at the precision given. */
  date: string
  /** One sentence, 28 words max. */
  summary: string
  /** Two to four sentences. The part a reader actually wants. */
  detail: string
  /** One real number, quoted from the source. Omit rather than estimate. */
  figure?: Figure
  /** The limit of the claim. Written next to it, not in a footnote nobody reads. */
  caveat?: string
  source: Source
  /** Slugs from content/skills.ts that would help you verify this yourself. */
  skills: string[]
  featured?: boolean
}

export const findings: Finding[] = [
  {
    slug: 'rubin-asteroid-haul',
    title: '11,000 new asteroids, before the survey even started',
    track: 'discovery',
    field: 'Space',
    org: 'NSF DOE Vera C. Rubin Observatory',
    date: '2026-04-02',
    summary:
      'Early engineering data produced the largest single batch of asteroid discoveries submitted in a year, including 33 unknown near-Earth objects.',
    detail:
      'The submission to the Minor Planet Center covers about one million observations taken over six weeks, of over 11,000 new asteroids and more than 80,000 already known. Roughly 380 trans-Neptunian objects came out of it. Two of them reach about 1,000 times the Earth Sun distance at their farthest point, putting them among the 30 most distant minor planets known. The decade-long Legacy Survey of Space and Time had not started yet.',
    figure: { value: '11,000+', label: 'new asteroids submitted to the Minor Planet Center' },
    caveat:
      'Several hundred objects first reported with the First Look release were later reclassified as recoveries rather than discoveries. The 11,000 figure is what survived verification.',
    source: {
      label: 'NOIRLab science release noirlab2608',
      url: 'https://noirlab.edu/public/news/noirlab2608/',
    },
    skills: ['deep-research', 'data-viz-field-guide'],
    featured: true,
  },
  {
    slug: 'co-scientist-aml-candidates',
    title: 'A multi-agent system proposed drug repurposing candidates for AML',
    track: 'discovery',
    field: 'Life sciences',
    org: 'Google DeepMind and Google Research',
    date: '2026-05',
    summary:
      'Co-Scientist generated single-agent drug repurposing candidates for acute myeloid leukaemia without oversight, and the paper reports wet-lab validation of them.',
    detail:
      'The system runs a generate, debate, and evolve loop over agents and was asked to propose repurposing candidates on its own. The published result that matters is not the ranking, it is that the proposals were tested against real assays. That is the line between a co-scientist and a very good literature search.',
    caveat:
      'Validation is reported for the specific assays in the paper. Clinical relevance is a separate question, and an agent that ranks hypotheses well is not an agent that has run a trial.',
    source: {
      label: 'Nature, Accelerating scientific discovery with Co-Scientist',
      url: 'https://www.nature.com/articles/s41586-026-10644-y',
    },
    skills: ['deep-research'],
    featured: true,
  },
  {
    slug: 'virtual-biotech',
    title: 'A drug developer, run as an organisation of agents',
    track: 'discovery',
    field: 'Life sciences',
    org: 'Science, 2026',
    date: '2026-05',
    summary:
      'Researchers modelled a drug-development company as an organisation of agents, with separate responsibilities for target selection, assay design, and analysis.',
    detail:
      'The framework gives agents the roles a biotech actually staffs and routes work between them instead of asking one model to hold the whole pipeline. Read it as a template for what a research org looks like when the headcount is agents: the interesting engineering is the handoff protocol, not any single agent.',
    caveat:
      'The published artifact is a framework plus case studies. No drug from it has reached a patient.',
    source: {
      label: 'Science, The Virtual Biotech',
      url: 'https://www.science.org/doi/10.1126/science.aeg6779',
    },
    skills: ['deep-research', 'technical-article-writer'],
  },
  {
    slug: 'nature-technologies-2026',
    title: 'Seven technologies to watch in 2026',
    track: 'discovery',
    field: 'Frontier methods',
    org: 'Nature',
    date: '2026-01',
    summary:
      'The annual watchlist put xenotransplantation, AI-powered meteorology, and next-generation quantum computing at the front of the queue.',
    detail:
      'The list is a forecast rather than a result, which makes it useful for one thing: knowing which instruments to keep an eye on. AI-powered meteorology earned its place because learned models now routinely compete with numerical ones on the forecasts that actually get used.',
    caveat: 'A watchlist is a bet. Treat it as a reading list, not evidence of progress.',
    source: {
      label: 'Nature, seven technologies to watch in 2026',
      url: 'https://www.nature.com/articles/d41586-026-00188-6',
    },
    skills: ['deep-research'],
  },
  {
    slug: 'gene-edited-pig-kidney-trial',
    title: 'Gene-edited pig kidneys moved from experiment to clinical trial',
    track: 'discovery',
    field: 'Medicine',
    org: 'FDA and United Therapeutics',
    date: '2026',
    summary:
      'A first-in-human study of a gene-edited pig kidney was cleared for end-stage kidney disease, after recipients of pig kidneys progressed onto human donor lists.',
    detail:
      'Tim Andrews received a gene-edited pig kidney in January 2025 and was moved onto the human transplant list in January 2026. That sequence is the one the field has been trying to prove: the animal organ as a bridge that buys time, not as a destination. Regulators then cleared a formal trial of the same idea.',
    caveat:
      'A cleared trial is permission to run an experiment. The endpoint is years of outcome data, and single-patient results do not generalise.',
    source: {
      label: 'Harvard Medical School, on the first recipient to progress to a human transplant',
      url: 'https://hms.harvard.edu/news/patient-who-received-pig-kidney-becomes-first-progress-human-kidney-transplant',
    },
    skills: ['deep-research', 'copy-edit-pass'],
  },
  {
    slug: 'rsi-ai-research-agents',
    title: 'What recursive self-improvement actually means, broken into claims',
    track: 'signal',
    field: 'AI research',
    org: 'arXiv 2609.26457',
    date: '2026-09',
    summary:
      'A survey separates recursive self-improvement into narrower checkable claims, covering agents that automate parts of AI research and the loop that closes when they automate the rest.',
    detail:
      'Agents are beginning to automate research across the AI stack, from training efficiency to inference optimisation. The useful contribution is the taxonomy, because most of what gets discussed as an intelligence explosion is really a bundle of specific claims that can each be measured or falsified. The loop is only interesting because each claim is.',
    source: {
      label: 'arXiv, Recursive self-improvement of AI research agents',
      url: 'https://arxiv.org/html/2609.26457v1',
    },
    skills: ['deep-research'],
    featured: true,
  },
  {
    slug: 'metr-time-horizons',
    title: 'The length of task an agent finishes alone keeps doubling',
    track: 'signal',
    field: 'AI research',
    org: 'METR',
    date: '2026',
    summary:
      'The task length models complete reliably has been doubling roughly every four months, against an earlier trend of every seven.',
    detail:
      'METR measures the horizon at which a model is 50% reliable across a basket of tasks. The published waypoints are explicit: about four minutes in March 2024, about ninety minutes in March 2025, and about twelve hours in March 2026. A doubling time that short is why every capability estimate older than six months is stale.',
    figure: { value: '~4 months', label: 'doubling time for the reliable task horizon' },
    caveat:
      'The 50% reliability line is a specific operating point, not a promise. A model that is 50% reliable on a twelve-hour task is not something you hand an unattended twelve-hour job.',
    source: {
      label: 'METR, measuring AI ability to complete long tasks',
      url: 'https://metr.org/time-horizons/',
    },
    skills: ['deep-research'],
  },
  {
    slug: 'agents-ran-a-research-project',
    title: 'Agents ran an open-ended research project end to end',
    track: 'signal',
    field: 'AI research',
    org: 'Anthropic, alignment research',
    date: '2026-04',
    summary:
      'Given an open question in AI safety, agents proposed the hypotheses, ran the experiments, and recovered 97% of a supervision gap that two human researchers recovered 23% of.',
    detail:
      'The question was whether a weaker model can reliably supervise a stronger one. Agents worked the problem over 800 cumulative hours on roughly 18,000 dollars of compute. Two human researchers working for about a week recovered roughly a quarter of the same gap, which is the comparison that makes the result land.',
    figure: { value: '97% vs 23%', label: 'gap recovered by agents versus two human researchers' },
    caveat:
      'Humans chose the problem and wrote the scoring rubric, and the result did not transfer cleanly to production-scale models. Direction setting was the only part of the loop still done by people.',
    source: {
      label: 'Anthropic, automated weak-to-strong researcher',
      url: 'https://alignment.anthropic.com/2026/automated-w2s-researcher/',
    },
    skills: ['deep-research'],
  },
  {
    slug: 'ai-ships-most-of-the-code',
    title: 'Most of one codebase is now written by agents, and review became the bottleneck',
    track: 'signal',
    field: 'AI research',
    org: 'The Anthropic Institute',
    date: '2026-09-18',
    summary:
      'More than 80% of the code merged into one production codebase was written by its own agents, and output per engineer per day rose eightfold in two years.',
    detail:
      'The same report tracks quality rather than just volume. On open-ended tasks the session success rate reached 76% in May 2026, up fifty percentage points in six months, and an automated reviewer would have caught roughly a third of the bugs behind past incidents before they shipped. The second-order finding is the one to note: as code volume went up, human review became the constraint.',
    figure: { value: '8x', label: 'code merged per engineer per day, 2024 to 2026' },
    caveat:
      'The authors say plainly that lines of code is a quantity measure, so 8x overstates the productivity gain. The acceleration is real; that multiple is not.',
    source: {
      label: 'The Anthropic Institute, When AI builds itself',
      url: 'https://www.anthropic.com/institute/recursive-self-improvement',
    },
    skills: ['code-review-cadence', 'vercel-edge-optimizer'],
  },
]
