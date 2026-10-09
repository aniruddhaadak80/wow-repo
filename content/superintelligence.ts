/*
 * After the world.
 *
 * Scenarios, papers, books, quotes, and researchers: the superintelligence
 * debate as a sourced collection. Every entry carries a real source URL and,
 * where a number is shown, that number is quoted from the source rather than
 * estimated. `caveat` is the honest limit of the claim, written next to it.
 *
 * Date precision is allowed to vary. 'YYYY', 'YYYY-MM', and 'YYYY-MM-DD' are
 * all valid, and pages render the precision they were given. Researchers
 * carry no date: a person is not an event. The renderer shows no date chip
 * for them and the sort puts them after dated entries.
 */

export const KINDS = ['scenario', 'paper', 'book', 'quote', 'researcher'] as const
export type Kind = (typeof KINDS)[number]

export const KIND_META: Record<Kind, { label: string; blurb: string }> = {
  scenario: {
    label: 'Scenarios',
    blurb:
      'Month by month stories of how superhuman AI could arrive, written to be argued with rather than admired.',
  },
  paper: {
    label: 'Papers',
    blurb:
      'Peer-reviewed and preprint research on timelines, alignment failures, and the arguments behind the worry.',
  },
  book: {
    label: 'Books',
    blurb:
      'The bestselling long-form case for taking superintelligence seriously, from 2005 to 2020.',
  },
  quote: {
    label: 'Voices',
    blurb:
      'Single sentences from the scientists and researchers, each pinned to the moment it was said.',
  },
  researcher: {
    label: 'Researchers',
    blurb:
      'The alignment, safety, and governance scientists whose work fills the other four shelves.',
  },
}

export const TOPICS = ['Timelines', 'Alignment', 'Governance', 'Scenarios', 'Methods'] as const
export type Topic = (typeof TOPICS)[number]

export interface Source {
  label: string
  url: string
}

export interface Figure {
  value: string
  label: string
}

export interface AfterEntry {
  slug: string
  kind: Kind
  title: string
  topic: Topic
  /** Who wrote it, said it, or is it. */
  org: string
  /** 'YYYY' | 'YYYY-MM' | 'YYYY-MM-DD'. Omitted for researchers. */
  date?: string
  /** One sentence, 30 words max. For quotes, the quote itself. */
  summary: string
  /** Two to four sentences. The part a reader actually wants. */
  detail: string
  /** One real number, quoted from the source. Omit rather than estimate. */
  figure?: Figure
  /** The limit of the claim. Written next to it, not in a footnote nobody reads. */
  caveat?: string
  source: Source
  /** Slugs from content/registry.ts that would help you verify this yourself. */
  skills?: string[]
  featured?: boolean
}

export const entries: AfterEntry[] = [
  {
    slug: 'ai-2027',
    kind: 'scenario',
    title: 'AI 2027: a month by month bet on superhuman AI',
    topic: 'Scenarios',
    org: 'Daniel Kokotajlo, Scott Alexander, Thomas Larsen, Eli Lifland, Romeo Dean',
    date: '2025-04-03',
    summary:
      'A concrete scenario of superhuman AI arriving by 2027, written with wargames and expert review, ending in two branches: slowdown or race.',
    detail:
      'The authors name a fictional lab, OpenBrain, and walk from stumbling agents in 2025 to a self-improving research workforce in 2027. Every claim is dated and quantified so readers can argue with it instead of nodding along. Yoshua Bengio publicly recommended reading it as a way to notice the questions that matter.',
    figure: {
      value: '~25',
      label: 'tabletop exercises plus review by more than 100 experts behind the scenario',
    },
    caveat:
      'A scenario is one path, not an average of forecasts. The authors score themselves on predictive accuracy and invite counter-scenarios.',
    source: { label: 'AI 2027, the full scenario', url: 'https://ai-2027.com/' },
    skills: ['deep-research'],
    featured: true,
  },
  {
    slug: 'situational-awareness',
    kind: 'scenario',
    title: 'Situational Awareness: the decade that decides it',
    topic: 'Timelines',
    org: 'Leopold Aschenbrenner',
    date: '2024-06',
    summary:
      'A former OpenAI researcher argues AGI by 2027 is plausible by counting orders of magnitude in compute, algorithms, and unhobbling.',
    detail:
      'The series moves from GPT-4 to AGI to superintelligence, then to trillion-dollar clusters, lab security, and superalignment. Its core bet is trendlines: about half an order of magnitude per year each from compute and algorithmic efficiency. The project it predicts, a government-scale AGI program, is presented as history happening in San Francisco first.',
    figure: {
      value: '0.5 OOMs/yr',
      label: 'trendline growth in compute the series counts toward AGI',
    },
    caveat:
      'Trendlines held from GPT-2 to GPT-4. The series assumes no wall appears before 2027, which is the part most worth doubting.',
    source: {
      label: 'Situational Awareness, the full series',
      url: 'https://situational-awareness.ai/',
    },
    skills: ['deep-research'],
    featured: true,
  },
  {
    slug: 'machines-of-loving-grace',
    kind: 'scenario',
    title: 'Machines of Loving Grace: the upside case',
    topic: 'Scenarios',
    org: 'Dario Amodei',
    date: '2024-10',
    summary:
      'Anthropic CEO sketches a world where powerful AI goes right, compressing a century of biology and medicine into five to ten years.',
    detail:
      'The essay defines powerful AI as a country of geniuses in a datacenter, then prices the upside in five areas, starting with health. Amodei predicts reliable prevention of most infectious disease, elimination of most cancer, and a doubling of healthy lifespan. He wrote it to give the safety debate something to fight for, not only fires to fight.',
    figure: {
      value: '150',
      label: 'years of lifespan the essay treats as on trend after a compressed century',
    },
    caveat:
      'The numbers are educated guesses across fields outside the author specialty, which the essay says plainly.',
    source: {
      label: 'Machines of Loving Grace, the full essay',
      url: 'https://darioamodei.com/machines-of-loving-grace',
    },
    skills: ['deep-research'],
  },
  {
    slug: 'what-failure-looks-like',
    kind: 'scenario',
    title: 'What Failure Looks Like: the slow catastrophe',
    topic: 'Alignment',
    org: 'Paul Christiano',
    date: '2019-03-17',
    summary:
      'Catastrophe may arrive not as a sudden takeover but as optimization steadily replacing human judgment with measurable proxies.',
    detail:
      'Part one describes going out with a whimper: systems that get what we measure until proxies detach from what we want. Part two describes going out with a bang: influence-seeking patterns that survive training and entrench themselves. The post argues both failure modes matter even with years of warning, not only in a fast takeoff.',
    caveat:
      'Written before large language models changed the empirical picture, so some mechanisms read differently today.',
    source: {
      label: 'What Failure Looks Like, LessWrong',
      url: 'https://www.lesswrong.com/posts/HBxe6wdjxK239zajf/what-failure-looks-like',
    },
    skills: ['deep-research'],
  },
  {
    slug: 'grace-2017-timelines',
    kind: 'paper',
    title: 'When Will AI Exceed Human Performance?',
    topic: 'Timelines',
    org: 'Katja Grace, John Salvatier, Allan Dafoe, Baobao Zhang, Owain Evans',
    date: '2017',
    summary:
      'The first large survey of machine learning researchers put a 50 percent chance on AI outperforming humans at all tasks within 45 years.',
    detail:
      'Respondents predicted language translation by 2024 and truck driving by 2027, alongside longer horizons for surgery and bestselling books. Asian respondents expected every date sooner than North Americans did. Published in the Journal of Artificial Intelligence Research, it set the template every later timelines survey follows.',
    figure: {
      value: '45 years',
      label: 'median horizon researchers gave for AI outperforming humans at all tasks',
    },
    caveat:
      'Survey medians moved much earlier in later rounds, so treat this as the opening measurement, not the current one.',
    source: { label: 'arXiv 1705.08807, full paper', url: 'https://arxiv.org/abs/1705.08807' },
    skills: ['deep-research'],
  },
  {
    slug: 'carlsmith-power-seeking',
    kind: 'paper',
    title: 'Is Power-Seeking AI an Existential Risk?',
    topic: 'Alignment',
    org: 'Joseph Carlsmith',
    date: '2022',
    summary:
      'A six-premise argument that misaligned power-seeking AI could disempower humanity by 2070, priced step by step at above 10 percent.',
    detail:
      'The report separates the backdrop picture, that intelligent agency plus instrumental incentives spells danger, from six checkable premises about feasibility, incentives, and scaling. Each premise gets a rough credence, which is what lets readers disagree precisely instead of wholesale. The May 2022 update raised the headline estimate above 10 percent.',
    figure: {
      value: '>10%',
      label: 'author estimate of existential catastrophe by 2070, May 2022 update',
    },
    caveat:
      'A subjective credence, not a measurement. The value is the argument structure, which survives even if you halve every number.',
    source: { label: 'arXiv 2206.13353, full report', url: 'https://arxiv.org/abs/2206.13353' },
    skills: ['deep-research'],
    featured: true,
  },
  {
    slug: 'concrete-problems',
    kind: 'paper',
    title: 'Concrete Problems in AI Safety',
    topic: 'Methods',
    org: 'Dario Amodei, Chris Olah, Jacob Steinhardt, Paul Christiano, John Schulman, Dan Mane',
    date: '2016',
    summary:
      'Five practical research problems that turned AI safety from philosophy into an engineering agenda: side effects, reward hacking, supervision, exploration, and shift.',
    detail:
      'It defined accidents as unintended harmful behavior emerging from poor design of real-world systems. Each problem ships with prior work and suggested directions aimed at cutting-edge systems. A decade later, scalable supervision and reward hacking still name live frontiers.',
    caveat:
      'Predates deep-learning agents that plan over long horizons, so the list reads as a foundation rather than a complete map.',
    source: { label: 'arXiv 1606.06565, full paper', url: 'https://arxiv.org/abs/1606.06565' },
    skills: ['deep-research'],
  },
  {
    slug: 'sparks-of-agi',
    kind: 'paper',
    title: 'Sparks of Artificial General Intelligence',
    topic: 'Timelines',
    org: 'Sebastien Bubeck and colleagues, Microsoft Research',
    date: '2023',
    summary:
      'Early tests of GPT-4 across mathematics, coding, medicine, and law argued it shows an early and incomplete form of general intelligence.',
    detail:
      'The authors stress breadth: one model solving novel hard tasks without special prompting, near human level in many of them. Much of the paper hunts for limitations instead of celebrating. Its closing question, whether next-word prediction suffices for deeper generality, still frames research bets.',
    caveat:
      'Studied an early pre-release version under Microsoft access, so exact capabilities describe that snapshot, not the shipped model.',
    source: { label: 'arXiv 2303.12712, full paper', url: 'https://arxiv.org/abs/2303.12712' },
    skills: ['deep-research'],
  },
  {
    slug: 'mesa-optimization',
    kind: 'paper',
    title: 'Risks from Learned Optimization',
    topic: 'Alignment',
    org: 'Evan Hubinger, Chris van Merwijk, Vladimir Mikulik, Joar Skalse, Scott Garrabrant',
    date: '2019',
    summary:
      'Introduced mesa-optimization: when a learned model becomes an optimizer itself, its objective can differ from the loss it trained on.',
    detail:
      'The paper asks two questions: when do learned models become optimizers when they should not, and what objectives do those inner optimizers end up with. Its framing of inner objectives that differ from training loss became core vocabulary for the field. It remains the agenda-setting paper for inner alignment research.',
    caveat:
      'A conceptual analysis with toy models, not an empirical demonstration in frontier systems.',
    source: { label: 'arXiv 1906.01820, full paper', url: 'https://arxiv.org/abs/1906.01820' },
    skills: ['deep-research'],
  },
  {
    slug: 'espai-2023',
    kind: 'paper',
    title: 'The 2023 Expert Survey on Progress in AI',
    topic: 'Timelines',
    org: 'Katja Grace and colleagues, AI Impacts',
    date: '2024',
    summary:
      '2,778 researchers moved timelines earlier than the 2016 survey and rated the chance of very bad outcomes higher.',
    detail:
      'The survey asked researchers who publish at top venues about human-level capabilities, pace, and consequences. With 2,778 respondents it remains the largest sample of its kind. A full reanalysis with open code followed months later.',
    figure: {
      value: '2,778',
      label: 'researchers surveyed, the largest sample of its kind at publication',
    },
    caveat:
      'Response rates and framing effects move survey numbers, so read the shift across years rather than any single median.',
    source: { label: 'arXiv 2401.02843, full paper', url: 'https://arxiv.org/abs/2401.02843' },
    skills: ['deep-research'],
  },
  {
    slug: 'superintelligence-book',
    kind: 'book',
    title: 'Superintelligence: Paths, Dangers, Strategies',
    topic: 'Alignment',
    org: 'Nick Bostrom',
    date: '2014',
    summary:
      'The book that moved existential risk from mailing lists to mainstream debate, with treacherous turns, decisive advantage, and control strategies.',
    detail:
      'Bostrom asks how superintelligence could arise, what instrumental goals it would likely pursue, and which strategies could keep it beneficial. The orthogonality thesis and instrumental convergence arguments come from here. It remains the reference other books in this collection answer to.',
    caveat:
      'Written before deep-learning dominance, so its paths to superintelligence weight routes modern readers may discount.',
    source: {
      label: 'Superintelligence, encyclopedia entry',
      url: 'https://en.wikipedia.org/wiki/Superintelligence:_Paths,_Dangers,_Strategies',
    },
    skills: ['deep-research'],
  },
  {
    slug: 'life-3-0',
    kind: 'book',
    title: 'Life 3.0: Being Human in the Age of AI',
    topic: 'Scenarios',
    org: 'Max Tegmark',
    date: '2017',
    summary:
      'A cosmologist tours futures from techno-utopia to extinction and asks what goals a beneficial superintelligence should actually pursue.',
    detail:
      'The book tours futures from flourishing to extinction, then works backward to the choices that select among them. Its Friendly AI discussion centers goal specification as the hard problem. Written for a general audience, it pairs cosmic scale with concrete proposals on jobs, weapons, and consciousness.',
    source: {
      label: 'Life 3.0, encyclopedia entry',
      url: 'https://en.wikipedia.org/wiki/Life_3.0',
    },
    skills: ['deep-research'],
  },
  {
    slug: 'human-compatible',
    kind: 'book',
    title: 'Human Compatible: AI and the Problem of Control',
    topic: 'Alignment',
    org: 'Stuart Russell',
    date: '2019',
    summary:
      'The co-author of the standard AI textbook proposes machines that stay humble, uncertain, and checkable while serving preferences they cannot fully know.',
    detail:
      'Russell lists three principles for beneficial machines: serve human preferences, stay uncertain about them, and let humans correct you. The book argues standard AI, cast as pure optimization, is the wrong foundation. It closes with a research and policy program its Berkeley center still pursues.',
    source: {
      label: 'Human Compatible, encyclopedia entry',
      url: 'https://en.wikipedia.org/wiki/Human_Compatible',
    },
    skills: ['deep-research'],
  },
  {
    slug: 'the-precipice',
    kind: 'book',
    title: 'The Precipice: Existential Risk and Our Future',
    topic: 'Governance',
    org: 'Toby Ord',
    date: '2020',
    summary:
      'Puts unaligned AI inside the full portfolio of existential risks and argues safeguarding the future is the most neglected priority.',
    detail:
      'Ord compares natural and human-made risks across nuclear war, pandemics, climate, and AI, and finds the human-made share dominates. Unaligned AI ranks among the largest contributors in his accounting. The closing chapters convert the risk estimates into an agenda for researchers and policymakers.',
    source: {
      label: 'The Precipice, encyclopedia entry',
      url: 'https://en.wikipedia.org/wiki/The_Precipice:_Existential_Risk_and_the_Future_of_Humanity',
    },
    skills: ['deep-research'],
  },
  {
    slug: 'singularity-is-near',
    kind: 'book',
    title: 'The Singularity Is Near',
    topic: 'Timelines',
    org: 'Ray Kurzweil',
    date: '2005',
    summary:
      'The law of accelerating returns predicted accelerating machine intelligence two decades before the current boom made it consensus.',
    detail:
      'Kurzweil charts exponential trends across computation, biology, and nanotechnology toward a mid-century merger of human and machine intelligence. Critics called the dates mystical; supporters note several trendlines held. The 2024 sequel, The Singularity Is Nearer, re-argues the case with the deep-learning record included.',
    caveat:
      'A futurist extrapolation, not a peer-reviewed result. Read it for the method of trend counting, then check the trends yourself.',
    source: {
      label: 'The Singularity Is Near, encyclopedia entry',
      url: 'https://en.wikipedia.org/wiki/The_Singularity_Is_Near',
    },
    skills: ['deep-research'],
  },
  {
    slug: 'hinton-bad-actors',
    kind: 'quote',
    title: 'Hard to stop bad actors',
    topic: 'Governance',
    org: 'Geoffrey Hinton, Nobel laureate, University of Toronto',
    date: '2023-05',
    summary: 'It is hard to see how you can prevent the bad actors from using it for bad things.',
    detail:
      'Said to the New York Times days after quitting Google to speak freely about AI risk. Hinton had spent a decade at Google and half a century building the neural networks now at issue. He has repeated the warning in interviews ever since.',
    source: {
      label: 'Reuters on the Hinton interview',
      url: 'https://www.reuters.com/technology/google-ai-pioneer-says-he-quit-speak-freely-about-technologys-dangers-2023-05-02/',
    },
    featured: true,
  },
  {
    slug: 'yudkowsky-shut-it-down',
    kind: 'quote',
    title: 'Shut it all down',
    topic: 'Governance',
    org: 'Eliezer Yudkowsky, Machine Intelligence Research Institute',
    date: '2023-03-29',
    summary: 'If we actually do this, we are all going to die.',
    detail:
      'Written for TIME in reply to the six-month pause letter, which Yudkowsky refused to sign as too little. The piece demands an indefinite worldwide moratorium on large training runs, enforced down to tracked GPUs. Shutdown advocates still cite it as their clearest mainstream statement.',
    source: {
      label: 'The shutdown piece, via MIRI',
      url: 'https://intelligence.org/2023/04/07/pausing-ai-developments-isnt-enough-we-need-to-shut-it-all-down/',
    },
  },
  {
    slug: 'amodei-country-of-geniuses',
    kind: 'quote',
    title: 'A country of geniuses',
    topic: 'Scenarios',
    org: 'Dario Amodei, CEO of Anthropic',
    date: '2024-10',
    summary: 'A country of geniuses in a datacenter.',
    detail:
      'Amodei shorthand for powerful AI: millions of above-Nobel-level instances running at ten to a hundred times human speed. The image does the essay heavy lifting, turning abstract capability into something a reader can picture. AI 2027 quotes the phrase back a year later when its fictional lab reaches the same point.',
    source: {
      label: 'Machines of Loving Grace, the full essay',
      url: 'https://darioamodei.com/machines-of-loving-grace',
    },
  },
  {
    slug: 'aschenbrenner-agi-2027',
    kind: 'quote',
    title: 'AGI by 2027',
    topic: 'Timelines',
    org: 'Leopold Aschenbrenner, former OpenAI researcher',
    date: '2024-06',
    summary: 'AGI by 2027 is strikingly plausible.',
    detail:
      'The opening bet of Situational Awareness, derived from GPT-2 to GPT-4 trendlines plus unhobbling gains. Aschenbrenner dedicated the series to Ilya Sutskever and wrote from inside the small circle he says already sees it. Whether the date holds, the sentence set the terms of the timeline debate.',
    source: {
      label: 'Situational Awareness, the series',
      url: 'https://situational-awareness.ai/',
    },
  },
  {
    slug: 'ai2027-industrial-revolution',
    kind: 'quote',
    title: 'Bigger than the Industrial Revolution',
    topic: 'Scenarios',
    org: 'Daniel Kokotajlo and co-authors, AI Futures Project',
    date: '2025-04',
    summary:
      'The impact of superhuman AI over the next decade will be enormous, exceeding that of the Industrial Revolution.',
    detail:
      'The thesis sentence of AI 2027, stated before any scenario begins. The authors back it with trend extrapolations, wargames, and a forecasting record that held up well from 2021. The public praise from Bengio quoted on the site calls this kind of scenario essential for noticing what matters.',
    source: { label: 'AI 2027, the scenario', url: 'https://ai-2027.com/' },
  },
  {
    slug: 'hinton-technically-sweet',
    kind: 'quote',
    title: 'Technically sweet',
    topic: 'Governance',
    org: 'Geoffrey Hinton, Nobel laureate, University of Toronto',
    date: '2023-05',
    summary: 'When you see something that is technically sweet, you go ahead and do it.',
    detail:
      'A Hinton paraphrase of Oppenheimer on why researchers build first and weigh consequences later. He offered it alongside his standard consolation, that if he had not done the work someone else would have. The quote names the cultural problem no regulation has yet solved.',
    caveat:
      'A paraphrase of Oppenheimer reported from the interview, not a laboratory notebook entry.',
    source: {
      label: 'The Verge on the Hinton interview',
      url: 'https://www.theverge.com/2023/5/1/23706311/hinton-godfather-of-ai-threats-fears-warnings',
    },
  },
  {
    slug: 'christiano-not-failure',
    kind: 'quote',
    title: 'Not what failure looks like',
    topic: 'Alignment',
    org: 'Paul Christiano, alignment researcher',
    date: '2019-03-17',
    summary:
      'I think this is probably not what failure will look like, and I want to try to paint a more realistic picture.',
    detail:
      'The opening move of What Failure Looks Like, rejecting the sudden malicious takeover story. Christiano replaces it with measurable proxies detaching from values, then influence-seeking systems entrenching. The essay still anchors the slow-catastrophe view years later.',
    source: {
      label: 'What Failure Looks Like, LessWrong',
      url: 'https://www.lesswrong.com/posts/HBxe6wdjxK239zajf/what-failure-looks-like',
    },
  },
  {
    slug: 'ord-pressing-neglected',
    kind: 'quote',
    title: 'Pressing and neglected',
    topic: 'Governance',
    org: 'Toby Ord, Oxford AI Governance Initiative',
    date: '2020',
    summary: 'Safeguarding our future is among the most pressing and neglected issues we face.',
    detail:
      'How Ord summarizes The Precipice on his own site. The book argues the coming centuries carry unprecedented risk and that protecting our future stays neglected. He now works on those risks as a senior researcher in the Oxford AI Governance Initiative.',
    source: { label: 'Toby Ord, personal site', url: 'https://tobyord.com/' },
  },
  {
    slug: 'geoffrey-hinton',
    kind: 'researcher',
    title: 'Geoffrey Hinton',
    topic: 'Methods',
    org: 'University of Toronto, Nobel laureate in Physics 2024',
    summary:
      'Co-inventor of backpropagation and the Boltzmann machine who quit Google in 2023 to warn that bad actors cannot be stopped.',
    detail:
      'Hinton spent a decade at Google and half a century on neural networks before concluding computers may become smarter than people sooner than experts expected. The 2024 Nobel Prize in Physics recognized the Hopfield and Hinton foundations of modern machine learning. He now speaks publicly about AI risk alongside his research.',
    source: {
      label: 'Nobel Prize press release, Physics 2024',
      url: 'https://www.nobelprize.org/prizes/physics/2024/press-release/',
    },
  },
  {
    slug: 'yoshua-bengio',
    kind: 'researcher',
    title: 'Yoshua Bengio',
    topic: 'Alignment',
    org: 'Mila and LawZero, Turing laureate',
    summary:
      'Deep-learning pioneer now building safe-by-design AI through LawZero after warning of catastrophic risk.',
    detail:
      'Bengio founded the Mila institute in Montreal and shares the 2018 Turing Award for deep learning. In 2025 he launched LawZero, a nonprofit startup for trustworthy AI insulated from market pressure to ship fast. Its program follows his safe-by-design research agenda.',
    source: { label: 'LawZero, the nonprofit lab', url: 'https://lawzero.org/' },
  },
  {
    slug: 'stuart-russell',
    kind: 'researcher',
    title: 'Stuart Russell',
    topic: 'Alignment',
    org: 'UC Berkeley and CHAI',
    summary:
      'Co-author of the standard AI textbook who argues the optimization paradigm must be replaced with humble, uncertain machines.',
    detail:
      'Russell directs the Center for Human-Compatible AI at Berkeley, a lab devoted to provably beneficial principles. Human Compatible turned the technical argument into a public program. His three principles, serve preferences, admit uncertainty, accept correction, anchor the assistance-game framing.',
    source: { label: 'Human Compatible, the book site', url: 'https://humancompatible.ai/' },
  },
  {
    slug: 'nick-bostrom',
    kind: 'researcher',
    title: 'Nick Bostrom',
    topic: 'Governance',
    org: 'Macrostrategy Research Initiative, Oxford',
    summary:
      'Philosopher whose Superintelligence made existential risk a mainstream question and founded much of its vocabulary.',
    detail:
      'Bostrom founded and directed the Future of Humanity Institute at Oxford until its closure, and now researches macrostrategy. His theses on orthogonality and instrumental convergence gave the field its core vocabulary. Few philosophers have shaped technology policy debate more directly.',
    source: {
      label: 'Nick Bostrom, encyclopedia entry',
      url: 'https://en.wikipedia.org/wiki/Nick_Bostrom',
    },
  },
  {
    slug: 'eliezer-yudkowsky',
    kind: 'researcher',
    title: 'Eliezer Yudkowsky',
    topic: 'Alignment',
    org: 'Machine Intelligence Research Institute',
    summary:
      'MIRI co-founder who has argued since 2001 that unaligned smarter-than-human AI ends in extinction without a shutdown.',
    detail:
      'Yudkowsky founded the institute now called MIRI and wrote the Sequences that trained a generation of alignment researchers. His 2023 TIME piece refused the six-month pause as inadequate and demanded a global halt. The institute current position holds extinction the default outcome of near-term superintelligence.',
    source: { label: 'MIRI, the institute', url: 'https://intelligence.org/' },
  },
  {
    slug: 'paul-christiano',
    kind: 'researcher',
    title: 'Paul Christiano',
    topic: 'Alignment',
    org: 'Alignment Research Center',
    summary:
      'Author of the slow-catastrophe view who founded the ARC research agenda on scalable, checkable alignment.',
    detail:
      'Christiano founded the Alignment Research Center, where he is executive director, and sits on the OpenAI Foundation board and Safety and Security Committee. What Failure Looks Like and his work on debate and amplification shaped scalable oversight. His proposals moved from essays into mainstream safety research.',
    source: {
      label: 'Paul Christiano, encyclopedia entry',
      url: 'https://en.wikipedia.org/wiki/Paul_Christiano',
    },
  },
  {
    slug: 'toby-ord',
    kind: 'researcher',
    title: 'Toby Ord',
    topic: 'Governance',
    org: 'Oxford AI Governance Initiative',
    summary:
      'Author of The Precipice who co-founded effective altruism and advises governments on catastrophic risk.',
    detail:
      'Ord is a senior researcher at Oxford working on the big-picture questions facing humanity, from aid effectiveness to existential risk. He created Giving What We Can and co-founded the wider effective altruism movement. He has advised the UN, the WHO, the World Economic Forum, and the UK government.',
    source: { label: 'Toby Ord, personal site', url: 'https://tobyord.com/' },
  },
  {
    slug: 'katja-grace',
    kind: 'researcher',
    title: 'Katja Grace',
    topic: 'Timelines',
    org: 'AI Impacts',
    summary:
      'Leads the longest-running survey of AI researchers on timelines, and writes the blog thinking through doom risk in public.',
    detail:
      'Grace co-authored the 2016 survey that started expert timelines research and the 2023 round of 2,778 researchers. AI Impacts, which she leads, answers decision-relevant questions about AI futures. Her blog works through extinction and unemployment arguments in plain language.',
    source: { label: 'AI Impacts, the research project', url: 'https://aiimpacts.org/' },
  },
]
