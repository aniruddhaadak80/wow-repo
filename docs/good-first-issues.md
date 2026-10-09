# Good first issues

Five issues to file before Hacktoberfest opens up. Each one is scoped to a
single file or pair of files, has the acceptance criteria already written, and
can be finished in an evening by someone who has never seen this repo.

The same data drives the Contribute section of the site, in
[`content/issues.ts`](../content/issues.ts). A test asserts every path in this
document still exists, so if a file moves, this document is wrong and the test
says so.

## How to file them

Copy the section under each heading, paste it into the body of a new issue, and
apply the labels listed in that section:

```bash
gh issue create --repo aniruddhaadak/wow-repo --web
```

The label `good first issue` has to be spelled exactly like that: it is what
the Contribute section links to and what contributors filter by.

---

## 1. Copy an install command from a catalog card

**Labels:** `good first issue`, `enhancement`, `Design`
**Files:** `components/skill-card.tsx`, `components/copy-button.tsx`

### Body

A skill card shows the skill, its tagline, and its craft, but the thing a
visitor wants, the install command, is one click away on the detail page. Add
it to the card itself.

Add a control to `components/skill-card.tsx` that copies that skill's install
command to the clipboard. Reuse `components/copy-button.tsx` so the feedback
matches the detail page: the same pill, the same check state, the same timing.

### Acceptance criteria

- [ ] The control is a `<button>` with an accessible name that includes the
      skill name, not just "Copy".
- [ ] Keyboard reachable with a visible focus ring, hit area at least 36px.
- [ ] Uses the existing command from the data, not a hand-typed string.
- [ ] `bun run check` passes.
- [ ] A screenshot in the PR, before and after.

### Hints

- The install command already lives on the entry as `command`. Do not
  hardcode one.
- The card is a `<Link>`, so a button inside a link is not valid HTML. Either
  lift the copy control outside the link, or make the title a link and leave
  the control outside it. Worth a sentence in the PR description explaining
  which you chose.

---

## 2. Keyboard-navigate the skills explorer

**Labels:** `good first issue`, `enhancement`, `Design`, `accessibility`
**Files:** `components/skills-explorer.tsx`

### Body

The category filter is a row of buttons. With a mouse it is fine; with a
keyboard you have to tab through all of them to reach the one you want.

Make the filter group a roving-tabindex group: one tab stop, arrow keys move
selection, Home and End jump to the ends. The result count is already a live
region, so keep it that way. Do not change which skills appear for any given
filter.

### Acceptance criteria

- [ ] The group is `role="group"` with an accessible name, and exactly one
      button is in the tab order at a time.
- [ ] Arrow keys move selection and wrap; Home and End go to the ends.
- [ ] Selection does not follow focus unless the button is activated.
- [ ] Existing tests and `bun run check` still pass.
- [ ] New test covering the keyboard behaviour.

### Hints

- React and the ARIA authoring practices disagree on whether the group should
  be `radiogroup` or a plain group of buttons. Pick one and say why in the PR.

---

## 3. Cover the registry query layer with tests

**Labels:** `good first issue`, `testing`
**Files:** `lib/registry.ts`, `lib/registry.test.ts` (new)

### Body

`lib/registry.ts` is the query layer between the registry dataset and every
page and API route: search across kinds and triggers, craft filtering, related
entries, the counts, and the date formatting. Thirteen modules import it and
nothing tests it.

`content/registry.test.ts` guards the dataset itself, and it is thorough. This
is the other half: the functions that turn the dataset into an answer.

### Acceptance criteria

- [ ] Search matches on name, tagline, description, and triggers, all
      case-insensitively, across every kind and not just skills.
- [ ] An empty or whitespace-only query returns the whole list.
- [ ] Craft filtering returns only that craft, and an unknown craft is treated
      the same as none.
- [ ] Related entries never include the entry itself, and prefer the same craft.
- [ ] `getRegistryCounts` matches the data, and the slugs list is the same
      length as the dataset.
- [ ] `formatEntryDate` and `formatShortDate` agree on the year precision the
      data actually ships.
- [ ] `bun run check` passes.

### Hints

- Use the real dataset, not a fixture. This is a query-integrity test as much
  as a unit test, and the registry is growing.
- Read the existing signatures before writing assertions. If a function turns
  out to be unused, say so in the PR rather than testing dead code.

---

## 4. Cover the findings query layer with unit tests

**Labels:** `good first issue`, `testing`
**Files:** `lib/findings.ts`, `lib/findings.test.ts` (new)

### Body

`/discoveries` and the frontier log read from `content/findings.ts` through
`lib/findings.ts`. The dataset has its own test; the query layer does not.

### Acceptance criteria

- [ ] Whatever ordering the page promises is what the function returns, and the
      test pins it with two rows that would fail if it were reversed.
- [ ] Filtering narrows the list and an unknown filter value is handled rather
      than silently returning everything.
- [ ] The frontier log rows the page renders have every field the component
      reads, so a missing field fails a test instead of rendering `undefined`.
- [ ] `bun run check` passes.

### Hints

- Read the component before the module. The test should assert what the page
  needs, not what the module happens to have.
- Keep the existing dataset untouched. If a row looks wrong, raise it as an
  issue rather than fixing it inside a test PR.

---

## 5. Document the reduced-motion contract

**Labels:** `good first issue`, `documentation`
**Files:** `docs/reduced-motion.md` (new), plus one audit pass

### Body

`CONTRIBUTING.md` says motion must honour `prefers-reduced-motion`. Nobody has
written down what that means component by component, so a contributor has to
reverse-engineer it from the code.

Walk every animated component, record which ones gate behind
`useReducedMotion`, and which honour it through CSS only. Then write
`docs/reduced-motion.md` with a table: component, what it animates, how it
degrades, whether it is covered.

### Acceptance criteria

- [ ] The table covers every component that imports from `motion/react` or
      defines an animation.
- [ ] Anything that is not gated is listed as a gap, not quietly omitted.
- [ ] The doc says what to do when adding a new animated component, in one
      paragraph.
- [ ] If you find a component that ignores reduced motion, fix it and say so
      in the PR description.
- [ ] `bun run check` passes.

### Hints

- Start from the components named in the doc's own estimate, then grep for
  `animate` and `useScroll` to be sure you found them all.
- This one is documentation, but the checklist still applies: a stale doc is a
  bug report waiting to be filed by the next contributor.
