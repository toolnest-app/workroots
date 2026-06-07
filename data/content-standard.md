# Workroots content standard

Curated entries live in:

- `data/showcase.json` — original 11
- `data/showcase-pilot.json` — mixed pilot (39)
- `data/showcase-batch-medicine-military.json` — medicine & military (26)
- `data/showcase-batch-education-media-agriculture-industry.json` — education, media, agriculture & industry (24)
- `data/showcase-batch-arts-entertainment.json` — arts & entertainment (32)
- `data/showcase-batch-law-governance.json` — law & governance (24)
- `data/showcase-batch-maritime-trades.json` — maritime trades (24)
- `data/showcase-batch-hospitality-service.json` — hospitality & service (40)
- `data/showcase-batch-science-engineering.json` — science & engineering (40)
- `data/showcase-batch-religion-ceremony.json` — religion & ceremony (40)
- `data/showcase-batch-aviation-energy.json` — aviation & energy (40)
- `data/showcase-batch-finance-commerce.json` — finance & commerce (40)
- `data/showcase-batch-retail-crafts.json` — retail & crafts (40)
- `data/showcase-batch-sports-games.json` — sports & games (40)
- `data/showcase-batch-fashion-beauty.json` — fashion & beauty (40)
- `data/showcase-batch-technology-it.json` — software & IT (20)

Import all with `npm run import:showcase` (**520 curated** including the technology & IT batch). The import script auto-loads `showcase.json`, `showcase-pilot.json`, and every `data/showcase-batch-*.json` file. All other occupations remain **stub** tier until upgraded.

## Tier rules

| Tier | Meaning |
|------|---------|
| **curated** | Human-researched encyclopedia entry; full fields, lineage, sources |
| **enhanced** | Auto-enriched from Wikidata (aliases, regions, field context, duties sketch) |
| **stub** | Wikidata seed (label + short description only) |

Stubs and enhanced entries show a tier banner on detail pages. Search and browse rank curated first, then enhanced, then stub.

### Stub enrichment pipeline

After `import:wikidata`, run:

```bash
npm run enrich:stubs
```

Options:

- `--limit=500` — process only N upgrades (pilot run)
- `--offset=2500` — resume from a Wikidata batch offset
- `--dry-run` — log matches without writing

The script matches Wikidata occupations to DB rows by English slug, skips curated entries, and sets `contentTier: enhanced` with a Wikidata source link.

## Required fields (curated)

Every curated entry must include:

- `slug`, `name`, `status`, `category`, `eraPrimary`
- `summary` — 2–4 sentences; readable lede, not a dictionary definition
- `duties` — what the worker actually did day-to-day
- `skills` — comma-separated or short prose list
- `tools` — period-appropriate; note modern equivalents where relevant
- `regions` — geographic/historical scope
- `originYear` and/or `originLabel` with `dateConfidence`
- `aliases` — at least one when historically common
- `sources` — at least one citation (title + optional URL + note)
- `events` — at least one for roles with a clear historical arc (two+ for major roles)
- `relations` — link to at least one other curated slug when history supports it

Active or declining roles should also include `educationPath` and `modernSectors` when applicable.

## Voice & style

- **Encyclopedic, not HR.** Write for curious readers, not job applicants.
- **Concrete over abstract.** Prefer "shaped staves and fitted iron hoops" over "manufacturing containers."
- **Era-aware.** Distinguish medieval, industrial, and modern versions of the same name.
- **Honest uncertainty.** Use `dateConfidence: low` and `originLabel` when years are disputed; never invent precision.
- **English-first.** Use common English job titles; put foreign or archaic terms in `aliases`.

## Origin & age

- Set `originYear` only when a defensible anchor exists (first attestation, trade emergence, technology).
- Use `originYearEnd` for roles that existed only in a bounded period.
- `originLabel` fills gaps: e.g. "Bronze Age metalwork traditions", "Municipal plague commissions".
- Confidence guide:
  - **high** — documented invention date or clear institutional record
  - **medium** — scholarly consensus with some debate
  - **low** — prehistoric, mythologized, or sparse sources

## Lineage

Relation types:

- **predecessor** — an older role this one evolved from (scribe → typist)
- **successor** — a newer role that largely replaced this one (typist → data entry)
- **related** — same craft family, parallel trade, or thematic kinship

Only reference slugs that exist in the curated set (or will be added in the same batch).

## Curated batch themes

### Pilot (50 roles)

1. **Crafts** — blacksmith, cooper, carpenter, mason, wheelwright, tailor, weaver, tanner, glassblower, candlemaker
2. **Clerical chain** — scribe → printer → typist → clerk → secretary → bookkeeper → accountant → data entry
3. **Medicine** — plague doctor, apothecary, physician, midwife, nurse
4. **Military & transport** — knight, archer, gunner, sailor, railroad conductor, lighthouse keeper
5. **Tech & comms** — telegraph operator, switchboard operator, lamplighter, electrician, computer programmer, software developer, web developer
6. **Food & land** — brewer, baker, miller, butcher, farmer, shepherd, fisherman
7. **Culture & knowledge** — teacher, librarian, journalist, photographer

### Arts & entertainment (32 roles)

Performance — actor, dancer, ballet dancer, opera singer, circus performer, magician, puppeteer, voice actor, stand-up comedian

Music — musician, composer, conductor, music producer, luthier

Visual & literary — painter, sculptor, illustrator, muralist, calligrapher, tattoo artist, poet, novelist

Stage & screen craft — playwright, screenwriter, cinematographer, film editor, costume designer, set designer, stage manager, choreographer

Business of show — talent agent, impresario

### Law & governance (24 roles)

Courts & counsel — lawyer, judge, barrister, solicitor, prosecutor, public defender, notary, bailiff, sheriff, magistrate

State & city — diplomat, ambassador, civil servant, mayor, legislator, lobbyist, city manager, registrar, tax collector

Enforcement — police officer, detective, constable, prison guard, coroner

### Maritime trades (24 roles)

Building & design — shipwright, boat builder, naval architect, sailmaker, ropemaker

Sea officers & crew — sea captain, first mate, ship navigator, harbor pilot, merchant mariner, deckhand, boatswain, submarine officer

Port & cargo — longshoreman, stevedore, ship chandler, customs officer, marine surveyor, tugboat captain, canal lock keeper

Craft & trade — rigger, marine engineer, whaler, fishmonger

### Hospitality & service (40 roles)

Hotels & lodging — hotel manager, concierge, bellhop, housekeeper, front desk clerk, resort manager

Food service — waiter, bartender, sommelier, barista, caterer, pastry chef, sous chef, executive chef, maître d', food critic

Travel & events — travel agent, tour guide, event planner, wedding planner, destination marketer, spa attendant

Personal service — butler, valet, nanny, personal chef, dog walker, personal shopper, concierge physician (where applicable)

### Science & engineering (40 roles)

Physical sciences — physicist, chemist, astronomer, geologist, meteorologist, oceanographer, volcanologist, seismologist

Life sciences — biologist, botanist, zoologist, microbiologist, geneticist, ecologist, marine biologist, entomologist

Applied & technical — engineer (civil, mechanical, electrical), architect, surveyor, cartographer, mathematician, statistician, materials scientist, nuclear engineer

### Religion & ceremony (40 roles)

Clergy & ritual — priest, minister, rabbi, imam, monk, nun, chaplain, shaman, cantor, deacon

Ceremony & care — wedding officiant, funeral director, mortician, cemetery caretaker, hospice chaplain

Scholarship & mission — theologian, missionary, religious educator, monastery librarian, pilgrimage guide

### Aviation & energy (40 roles)

Flight — pilot, co-pilot, flight attendant, air traffic controller, aircraft mechanic, flight dispatcher, balloonist

Ground & space — aerospace engineer, astronaut, satellite technician, drone operator

Energy — coal miner, oil rigger, pipeline worker, power plant operator, lineworker, wind turbine technician, solar installer, nuclear plant operator

### Finance & commerce (40 roles)

Banking & markets — banker, investment banker, stock trader, stockbroker, bond trader, forex trader, hedge fund manager, venture capitalist, private equity analyst

Insurance & risk — insurance agent, actuary, underwriter, reinsurance specialist

Real estate & advisory — real estate agent, mortgage broker, appraiser, financial advisor, tax advisor, auditor, comptroller, treasurer

Trade — merchant, wholesaler, importer, exporter, commodity trader, pawnbroker, auctioneer, shopkeeper

### Retail & crafts (40 roles)

Shop floor — retail clerk, store manager, visual merchandiser, loss prevention officer, inventory specialist

Specialty retail — bookseller, pharmacist (retail), optician, gunsmith, watchmaker, locksmith, cobbler

Making & repair — upholsterer, cabinetmaker, instrument maker, gunsmith, farrier, bookbinder, typesetter (historical), sign painter

### Sports & games (40 roles)

Athletes & coaches — athlete, coach, referee, umpire, sports agent, athletic trainer, strength coach

Games & leisure — professional gamer, chess player, croupier, bookmaker, game designer, dungeon master (hobby pro), park ranger (outdoor recreation)

Venue & media — stadium announcer, sports journalist, equipment manager, race steward

### Fashion & beauty (40 roles)

Design & production — fashion designer, pattern maker, dressmaker, textile designer, haute couture artisan, milliner, corsetier

Beauty — makeup artist, cosmetologist, hairdresser, esthetician, manicurist, perfumer, cosmetic chemist

Business of fashion — fashion buyer, stylist, merchandiser, editor, photographer, PR specialist, trend forecaster

## Automation & AI effects (pilot)

Curated assessments live in `data/showcase-pressures.json`. Import with `npm run import:pressures` (re-import clears removed slugs).

**Only include roles with documented task change.** Do not tag nurses, judges, electricians, chefs, etc. as "under pressure" when automation and generative AI have not materially reshaped their core licensed or physical duties.

### Impact types (in pilot use)

| Type | Meaning |
|------|---------|
| **augmented** | Tools assist parts of the work; occupation persists with shifting task mix |
| **displaced_tasks** | Routine tasks automated; identifiable segments have fewer workers |
| **transformed** | How work is produced is changing materially — often accelerating pre-AI trends |

Reserve **resilient** and **emerging** for schema compatibility; omit those roles from the pilot rather than mislabeling them.

### Required fields (pressure overlay)

- `slug` — must match an existing curated occupation
- `pressureType` — augmented, displaced_tasks, or transformed
- `pressureConfidence` — `high` \| `medium` \| `low`
- `summary` — 2–4 sentences; separate pre-2020 automation from generative-AI effects when both apply
- `event` (optional) — timeline row for a documented inflection (label whether RPA, self-checkout, or generative AI)
- `sources` (optional) — at least one when confidence is not `high`; use note `Current pressures citation`

### Voice

- Describe **task change**, not extinction prophecies
- Say when pressure predates generative AI (travel agents, secretaries, cashiers)
- Prefer "evidence is mixed" over confident forecasts
- Never imply a resilient occupation is "under pressure" in UI copy

## Review checklist

Before merging new curated entries:

- [ ] Summary stands alone as an intro paragraph
- [ ] No empty duties/skills/tools
- [ ] At least one source with a meaningful note
- [ ] Relations point to valid slugs
- [ ] Status matches reality (extinct vs declining vs active)
- [ ] Re-run `npm run import:showcase` and spot-check `/jobs/[slug]`