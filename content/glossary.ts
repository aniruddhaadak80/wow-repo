/*
 * The glossary: the vocabulary of the open agent stack, defined once.
 *
 * Definitions are written to be read by someone building with these
 * things, not to pad a page. Every `seeAlso` names another term in this
 * file, and a test enforces that, so the graph never points at nothing.
 */

export interface GlossaryTerm {
  /** Lowercase, the way people write it. */
  term: string
  /** One or two sentences a newcomer can act on. */
  definition: string
  /** Longer detail, optional. */
  detail?: string
  /** Other terms in this file that this one leans on. */
  seeAlso?: string[]
  /**
   * The registry kinds this term shows up in, so the glossary can point
   * back at real entries in the catalog.
   */
  kinds?: Array<'skill' | 'mcp' | 'api' | 'protocol' | 'harness' | 'software'>
}

export const glossary: GlossaryTerm[] = [
  {
    term: 'agent',
    definition:
      'A program that decides which steps to take toward a goal, using tools, instead of following a fixed script someone wrote in advance.',
    detail:
      'The useful version loops: observe, decide, act, observe again. The failure mode is an agent that keeps deciding and never finishes.',
    seeAlso: ['tool calling', 'orchestration', 'harness'],
    kinds: ['skill', 'harness'],
  },
  {
    term: 'skill',
    definition:
      'A packaged capability an agent can load on demand: instructions, and sometimes a script, that make the agent good at one job.',
    detail:
      'A skill is the unit that keeps a general model useful without fine-tuning. It loads when the task calls for it and stays out of the way otherwise.',
    seeAlso: ['agent', 'prompt', 'context window'],
    kinds: ['skill'],
  },
  {
    term: 'MCP',
    definition:
      'Model Context Protocol. An open protocol that lets an agent connect to external tools and data through one standard interface.',
    detail:
      'One MCP server exposes tools, resources, and prompts. Any client that speaks the protocol can use all three without bespoke glue code.',
    seeAlso: ['protocol', 'tool calling', 'JSON-RPC'],
    kinds: ['mcp', 'protocol'],
  },
  {
    term: 'tool calling',
    definition:
      'The model emits a structured request to run a function, the runtime runs it, and the result comes back as model-visible context.',
    detail:
      'The contract that matters is the schema: a tool the model misunderstands gets called with the wrong arguments, confidently.',
    seeAlso: ['function calling', 'MCP', 'guardrail'],
    kinds: ['api', 'software'],
  },
  {
    term: 'function calling',
    definition:
      'The provider-level name for tool calling: the model asks to invoke a declared function with declared arguments.',
    seeAlso: ['tool calling', 'schema'],
  },
  {
    term: 'context window',
    definition:
      'Everything the model can see at once: the system prompt, the conversation, tool results, and retrieved text.',
    detail:
      'When it fills up, something gets dropped. What you choose to drop is a design decision, not an implementation detail.',
    seeAlso: ['prompt', 'retrieval', 'token'],
  },
  {
    term: 'prompt',
    definition:
      'The instructions that set up a model run. System prompts set the job; user prompts supply the task.',
    detail:
      'A prompt is code: it is reviewed, versioned, and tested like code, or it breaks like code.',
    seeAlso: ['skill', 'context window'],
  },
  {
    term: 'token',
    definition:
      'The unit models read and write. Roughly three quarters of an English word, depending on the tokenizer.',
    seeAlso: ['context window', 'embedding'],
  },
  {
    term: 'embedding',
    definition:
      'A vector that places text in a space where similar meanings sit near each other, so distance becomes a measure of relevance.',
    detail:
      'Embeddings make search by meaning possible, which is what makes retrieval work when nobody typed the exact words.',
    seeAlso: ['retrieval', 'vector database'],
    kinds: ['api'],
  },
  {
    term: 'vector database',
    definition:
      'A store built for nearest-neighbour lookup over embeddings, with the usual database duties attached.',
    seeAlso: ['embedding', 'retrieval'],
    kinds: ['software'],
  },
  {
    term: 'retrieval',
    definition:
      'Finding the text that answers a question and putting it in the context window before the model runs.',
    detail:
      'Retrieval is often the whole fix: a model that cannot know your data can quote it if you fetch it first.',
    seeAlso: ['RAG', 'embedding', 'context window'],
    kinds: ['skill', 'api'],
  },
  {
    term: 'RAG',
    definition:
      'Retrieval-augmented generation. Retrieve relevant text, then generate an answer grounded in that text.',
    seeAlso: ['retrieval', 'embedding'],
    kinds: ['skill'],
  },
  {
    term: 'orchestration',
    definition:
      'Deciding which agent or tool runs next, in what order, and what happens when one fails.',
    detail:
      'The plan is the product. Two agents calling each other with no supervisor is a race, not a system.',
    seeAlso: ['agent', 'swarm', 'harness'],
  },
  {
    term: 'swarm',
    definition:
      'Many agents working subtasks of one goal in parallel, with the results merged at the end.',
    seeAlso: ['orchestration', 'agent'],
    kinds: ['harness'],
  },
  {
    term: 'harness',
    definition:
      'The runtime around a model: the loop that runs tools, tracks state, retries, and stops when the work is done.',
    detail:
      'Most agent quality problems are harness problems. The model was fine; the loop was not.',
    seeAlso: ['agent', 'orchestration', 'evaluation'],
    kinds: ['harness'],
  },
  {
    term: 'guardrail',
    definition:
      'A check that runs before or after a model action to keep it inside the bounds you actually meant.',
    detail:
      'Guardrails fail closed. A blocked action with a clear message beats a creative action nobody reviewed.',
    seeAlso: ['evaluation', 'tool calling'],
    kinds: ['skill', 'software'],
  },
  {
    term: 'evaluation',
    definition:
      'Running a task set against a system and scoring the results, so quality is a measurement rather than an opinion.',
    seeAlso: ['guardrail', 'harness'],
    kinds: ['skill'],
  },
  {
    term: 'schema',
    definition:
      'The declared shape of a tool input or output, which the model reads before it decides what to send.',
    seeAlso: ['function calling', 'tool calling'],
  },
  {
    term: 'JSON-RPC',
    definition:
      'A small remote-call format over JSON. MCP is built on it, so every tool call is a JSON-RPC request.',
    seeAlso: ['MCP', 'protocol'],
    kinds: ['protocol'],
  },
  {
    term: 'protocol',
    definition:
      'An agreed message format so independent implementations can talk. The value is that nobody owns the glue.',
    seeAlso: ['MCP', 'JSON-RPC'],
    kinds: ['protocol'],
  },
  {
    term: 'A2A',
    definition:
      'Agent2Agent. An open protocol for agents from different vendors to discover and delegate to each other.',
    seeAlso: ['protocol', 'agent', 'orchestration'],
    kinds: ['protocol'],
  },
  {
    term: 'fine-tuning',
    definition:
      'Further training a model on examples so it gets better at one narrow job, at the cost of the general one.',
    detail:
      'Reach for it when prompting and retrieval both fail. It is the slowest option to change and the hardest to debug.',
    seeAlso: ['prompt', 'retrieval'],
  },
  {
    term: 'reasoning model',
    definition:
      'A model trained to spend extra compute thinking before it answers, at the cost of latency.',
    seeAlso: ['agent', 'evaluation'],
  },
  {
    term: 'idempotency',
    definition:
      'The property that running the same action twice leaves the same result as running it once.',
    detail:
      'Agent loops retry. Anything that spends money, sends mail, or writes state needs an idempotency key.',
    seeAlso: ['guardrail', 'harness'],
  },
]

export const GLOSSARY_LETTERS = [
  ...new Set(glossary.map((item) => item.term[0].toUpperCase())),
].sort()
