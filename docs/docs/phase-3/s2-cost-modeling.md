---
id: s2-cost-modeling
sidebar_position: 10
title: "S2: Cost Modeling & Optimization"
---

# S2: Cost Modeling & Optimization

*Phase 3 · Strategic track · ~90
minutes · For engineers who need
to make AI financially credible,
not just technically exciting*

---

AI systems can look cheap in a
demo and expensive in
production. A few thousand
tokens feel like nothing. A few
million requests, long prompts,
repeated re- embeddings, and
premium models later, finance
wants answers and engineering
has none. Cost modeling is how
you avoid that conversation.

This module gives you a
practical way to reason about AI
costs before launch and during
scale-up. The goal is not
perfect prediction. The goal is
to build a cost model that is
honest enough to guide product
decisions, architecture
decisions, and vendor
negotiations.

:::tip Default mindset

Treat AI cost as an engineering
input, not a finance
afterthought. Every model
choice, prompt shape, retrieval
strategy, and output format has
a cost signature. If you make
those choices intentionally, you
can usually get 80 percent of
the value without paying for the
most expensive possible path.

:::

## How AI pricing works

AI pricing usually comes in four
shapes: per-seat, per-token,
per-request, and hybrid. The
billing line item is simple. The
operational consequences are
not. You should know which cost
drivers move with adoption and
which move with feature
complexity.

| Pricing model | How billing works | Best for | Watch out for |
| --- | --- | --- | --- |
| Per-seat | Fixed amount per user per month | Developer productivity tools like Copilot | Paying for seats that are barely used |
| Per-token | Charge for input and output tokens | APIs and product features | Costs rise invisibly with long prompts and verbose outputs |
| Per-request | Charge per call or action | Narrow services with predictable request boundaries | Hides request size and quality variance |
| Hybrid | Seat plus usage or base fee plus token charges | Enterprise platforms and premium model catalogs | Confusing forecasts unless telemetry is strong |

### Per-seat pricing

Per-seat is easy to budget. If
you have one hundred engineers
and a tool costs a fixed monthly
amount per seat, you can build a
straightforward annual forecast.
The harder question is whether
the seats are actually creating
value. Per-seat pricing is
operationally simple but can
hide underutilization.

### Per-token pricing

Per-token pricing is the
dominant model for raw APIs.
Tokens are pieces of text
consumed by the model. You pay
for input tokens that you send
in and output tokens that the
model generates back. In many
services, output tokens cost
more than input tokens because
generation is more expensive
than reading.

### Per-request pricing

Per-request pricing can work for
narrow services like moderation,
transcription, or fixed pipeline
steps, but it is less common for
general-purpose LLM usage. The
benefit is predictability. The
downside is that the request can
hide wildly different amounts of
computation under one price
point.

### Hybrid pricing

Hybrid pricing is increasingly
common. A platform might charge
per seat for access and then add
credits, premium model
surcharges, or usage-based
overages. Hybrid pricing is not
bad, but it forces you to track
both adoption and behavior. Seat
count alone no longer explains
the bill.

:::warning Do not compare price tags without comparing units

A twenty-dollar seat and a per-
token API are not substitutes.
One is a productivity tool
budget question. The other is an
application architecture
question. Teams waste time
arguing which is “cheaper” when
the units are completely
different.

:::

## Token pricing in practice

The easiest way to underestimate
AI cost is to think only about
the visible prompt. Actual token
usage includes the system
prompt, user input, retrieved
context, tool results,
conversation history, and model
output. Long context windows are
useful, but they make sloppy
prompt design expensive.

### Input vs. output tokens

- Input tokens include every
  piece of text you send:
  instructions, retrieved
  documents, examples, metadata,
  and chat history.
- Output tokens include
  everything the model writes
  back. Long free-form answers
  can cost substantially more
  than concise structured
  output.
- If output pricing is higher
  than input pricing, asking for
  verbose prose when you only
  need JSON or bullet points is
  pure waste.

### Context window usage drives cost

Engineers love large context
windows because they feel like a
way to skip retrieval design. In
practice, dumping huge amounts
of context into every request
often buys worse economics and
not much better quality. Large
context should be treated as a
scarce resource, not a default.

| Prompt shape | Quality effect | Cost effect | Recommendation |
| --- | --- | --- | --- |
| Entire codebase pasted in | Usually noisy | Very high | Avoid except for one-off debugging |
| Targeted retrieved chunks | Usually higher signal | Moderate | Default for most grounded features |
| Shared prefix plus small delta | Stable quality | Lower with caching | Great for repeated workflows |
| Verbose system prompt + verbose output | Rarely worth it | Very high | Trim aggressively |

### Prompt caching can change the economics

If many requests share the same
long prefix, prompt caching can
cut cost dramatically. Examples
include a fixed system prompt, a
stable rubric, a policy block,
or a repeated large instruction
header. When the vendor supports
prefix caching, you should
design repeated workflows to
exploit it.

- Shared instruction prefixes
  are ideal cache candidates:
  system prompt, safety policy,
  evaluation rubric, or code
  style guide.
- Caching does not eliminate all
  cost. It changes the marginal
  cost of repeated prefixes,
  which matters a lot for
  production systems with stable
  prompt scaffolding.
- The architectural implication
  is important: keep the stable
  part of the prompt stable. If
  every request mutates the
  prefix slightly, cache
  benefits disappear.

:::tip Prompt design for cost

Separate stable instructions
from volatile request- specific
data. The stable block is easier
to cache, easier to version, and
easier to evaluate across model
changes.

:::

## Estimating Copilot costs for your team

Copilot-style tools are
primarily per-seat decisions,
but that does not mean the cost
model stops at the license
price. Total cost of ownership
includes rollout, training,
policy work, and the time
required to measure whether the
tool is actually improving
outcomes.

1. Start with license cost:
   granted seats multiplied by
   monthly or annual seat price
   for the chosen plan.
2. Estimate adoption: not every
   assigned seat becomes an
   active heavy user.
   Distinguish assigned, active
   weekly, and power-user
   cohorts.
3. Add implementation cost:
   admin setup, SSO, policy
   review, repository
   exclusions, procurement
   overhead, and internal
   enablement material.
4. Add training cost: onboarding
   sessions, office hours,
   champions, and the time
   engineers spend learning to
   use the tool well.
5. Add measurement cost:
   dashboards, pilot
   administration, and any
   experiments you run to assess
   productivity impact.

| Cost component | Examples | Why it matters |
| --- | --- | --- |
| License | Seat price x granted seats | Visible budget line |
| Implementation | Admin setup, legal review, rollout playbooks | Often ignored in initial forecast |
| Enablement | Training sessions, internal docs, support time | Adoption depends on it |
| Measurement | Pilot analysis, surveys, telemetry dashboards | Needed to defend renewals |

For a team of roughly one
hundred engineers, even a clean
per-seat tool can have a
meaningful non-license cost in
the first quarter. That is
normal. The mistake is
pretending the license price is
the full cost of adoption and
then acting surprised when
internal rollout work appears.

## Estimating API costs before you build

If you are designing an AI
feature, build a cost model
before the first production line
of code. You do not need perfect
traffic forecasts. You do need
unit economics that tell you
whether the feature can survive
realistic adoption.

### A simple forecasting workflow

1. Define the unit of value: one
   summary, one search answer,
   one generated test draft, one
   support classification, one
   user session.
2. Estimate average tokens per
   request: stable instructions,
   user input, retrieved
   context, tool results, and
   expected output.
3. Estimate request frequency:
   per user per day, per
   repository, per support
   ticket, or whatever maps to
   your product.
4. Translate into cost per 1,000
   requests and cost per user
   per month. Those are the two
   numbers product and finance
   can reason about quickly.
5. Run sensitivity scenarios:
   what happens if context
   doubles, output length
   doubles, or model choice
   changes from standard to
   premium?

The cost model should never live
only in a spreadsheet owned by
one person. Put the assumptions
somewhere engineers can review.
When the prompt changes or
retrieval strategy expands,
update the assumptions like any
other production dependency.

### Example cost questions to answer

- What is our estimated cost per
  generated answer?
- What is the expected monthly
  cost for 10, 100, and 1,000
  active users?
- What share of total cost comes
  from prompt context,
  retrieval, embeddings, output
  length, or retries?
- Is the feature economically
  viable if usage is successful,
  or only if adoption stays low?

## The ROI question: how to be honest

AI ROI is real, but it is easy
to overstate. Productivity
measurement is hard even without
AI. Teams love vanity metrics
because they are easy to collect
and flattering to present. A
serious ROI conversation focuses
on task outcomes, cycle time,
and avoided work, not just raw
usage.

| Metric | Useful? | Why |
| --- | --- | --- |
| Time saved per task type | Yes | Maps to real workflow improvements |
| Code suggestion acceptance rate | Sometimes | Useful only with context and quality checks |
| PR cycle time | Yes | Captures system-level effect better than line counts |
| Onboarding time | Yes | AI often helps new engineers disproportionately |
| Lines of code written | No | Easy to game and rarely meaningful |
| Raw chat volume | No | Usage is not value |

- Segment ROI by task type. AI
  may save time on tests and
  docs while doing little for
  deep debugging. That is still
  useful.
- Measure rework. A tool that
  saves ten minutes but adds
  fifteen minutes of cleanup is
  not creating value.
- Use before-and-after baselines
  when possible, but be honest
  about confounders. Team
  composition, release timing,
  and project type can distort
  the numbers.
- Qualitative evidence matters.
  If senior engineers say a tool
  makes them materially faster
  at boring tasks, that may be
  enough to justify a rollout
  even if you cannot produce
  lab-grade causality.

:::warning Avoid vanity metrics

High acceptance rate does not
prove value. Engineers can
accept mediocre suggestions,
especially on easy code. Low
acceptance rate does not always
prove failure either. A tool
used mainly for difficult tasks
may generate fewer accepted
suggestions while still creating
more total value.

:::

## Cost optimization strategies

Optimization should follow a
simple principle: use the
cheapest approach that still
meets the quality bar for the
job. Most teams overspend
because they choose one strong
model and one prompt shape for
every workflow.

### Model selection

- Use the cheapest model that
  reliably meets the task
  requirements. Classification
  and extraction often do not
  need the same model you use
  for hard reasoning.
- Split workflows by difficulty.
  A lightweight model can handle
  most requests while a stronger
  model handles escalations or
  failures.
- Re-evaluate model choice
  quarterly. Providers change
  capabilities and pricing
  constantly, so a decision that
  was right three months ago may
  no longer be right.

### Prompt compression

- Remove boilerplate
  instructions that do not
  measurably change output
  quality.
- Move large rubrics into
  reusable cached prefixes where
  supported instead of repeating
  near- duplicates.
- Prefer concise structured
  instructions over long
  conversational guidance when
  the task is narrow.

### Caching

- Prompt caching reduces cost
  for repeated prefixes and is
  often the fastest high-
  leverage optimization
  available.
- Semantic caching can avoid
  model calls entirely when
  similar requests with known-
  good outputs recur and the
  business context allows reuse.
- Cache invalidation still
  matters. Reused answers
  against stale data can create
  low-quality behavior even when
  the bill looks better.

### Batching

- If latency is not user-facing,
  batch requests. Overnight
  summarization, offline
  enrichment, and backfills are
  obvious candidates.
- Batching reduces per-request
  overhead and can make rate
  limits easier to manage,
  though it adds operational
  complexity.

### Output length control

- Ask for concise output formats
  when possible: JSON, bullet
  lists, labels, short
  rationales.
- Use max token settings
  thoughtfully. Unbounded
  outputs create both cost drift
  and UI problems.
- If users need detail, consider
  progressive disclosure: short
  answer first, expand on
  demand.

### RAG vs. long context

Retrieval-augmented generation
is not always the answer, but
for many grounded features it is
much cheaper than pasting huge
documents into every request.
Retrieval also makes it easier
to explain why the model
answered the way it did because
you can point to source chunks.

| Approach | Cost profile | When to use |
| --- | --- | --- |
| Long context | High marginal cost per request | Small scale, one-off analysis, or when retrieval quality is poor |
| RAG | Upfront indexing cost + lower per-request context cost | Repeated grounded queries over large corpora |
| Hybrid | Moderate | Use retrieval first, add selective larger context only when needed |

:::tip Optimization order

Start by trimming prompts and
output length. Then add caching.
Then right-size models. Then
revisit retrieval architecture.
Teams often jump straight to
infrastructure changes when
simple prompt hygiene would have
cut spend quickly.

:::

## Building cost visibility

You cannot optimize what you do
not instrument. Every AI-facing
service should log enough
metadata to explain cost by
request, by team, and by
feature. That does not mean
logging full prompts or outputs
indiscriminately. It means
logging the metrics that make
costs observable and governable.

- Tokens in, tokens out, model
  name, request type, latency,
  cache hit rate, and estimated
  cost per request.
- Feature or endpoint tag so you
  can attribute spend to real
  product surfaces rather than
  one giant “AI” bucket.
- Team or owner tag for internal
  chargeback or at least
  transparent cost allocation.
- Anomaly alerts for sudden
  spikes in context size, output
  size, retry rate, or premium
  model usage.

### Example instrumentation mindset

For internal services, a tiny
TypeScript middleware that
records model name, token
counts, latency, and estimated
spend is worth far more than a
complicated dashboard built six
months later. Cost visibility
should arrive in the first
version, not after the first
surprise invoice.

## Cost at scale

Scaling AI adoption changes the
cost profile in two ways. First,
volume rises because more users
and workflows exist. Second,
behavior shifts because people
discover heavier use cases over
time. The second effect is what
catches teams off guard.

- As adoption grows, expect
  average request size to creep
  upward unless you actively
  govern prompt shape and
  feature scope.
- Success can increase cost
  faster than expected. A
  beloved feature may get called
  far more often than the
  spreadsheet assumed.
- Capacity planning for self-
  hosted or provisioned
  workloads must include peak
  behavior, not just average
  volume.
- Volume discounts matter. If AI
  spend is becoming strategic,
  negotiate early with credible
  usage data rather than waiting
  until renewal week.

## Common cost surprises

| Surprise | Why it happens | How to avoid it |
| --- | --- | --- |
| Context window bloat | Prompt history and retrieved docs keep growing | Set hard limits and summarize history |
| Logging full responses | Observability added without privacy or storage discipline | Log metadata by default, sample content carefully |
| Re-embedding unchanged data | Pipelines rerun whole corpora | Track content hashes and update incrementally |
| Premium models everywhere | One model chosen for simplicity | Route by task complexity |
| Retry storms | Weak backoff and timeout handling | Bound retries and instrument failure causes |

:::warning The embarrassing surprise

One of the most common failures
is discovering that a feature is
only economically viable at
pilot traffic. If success breaks
the budget, you do not have a
successful feature yet. You have
an unresolved architecture
problem.

:::

## A lightweight operating model for cost control

- Product owns whether the
  feature is worth paying for.
- Engineering owns architecture
  choices that determine unit
  cost.
- Platform or enablement owns
  shared dashboards, guidance,
  and vendor negotiation
  support.
- Finance should see a stable
  reporting view by team and
  workload, not a black box.

## Scenario modeling that survives contact with reality

A useful AI cost model is not a
single number. It is at least
three scenarios: low, base, and
high adoption. If your
spreadsheet only contains one
usage pattern, you are modeling
hope rather than spend.

| Scenario | What changes | Why it matters |
| --- | --- | --- |
| Low | Few active users, lighter prompts, limited workflows | Shows downside if adoption is weak |
| Base | Expected user count and expected workflow mix | Planning baseline |
| High | Strong adoption, longer prompts, more retries, premium spillover | Shows whether success breaks the budget |

- For internal tools, vary both
  active-seat rate and behavior
  intensity. Heavy users can
  drive disproportionate cost
  even when seat count is
  stable.
- For product features, vary
  request frequency, average
  context size, and fallback
  rate. Those usually matter
  more than user-count forecasts
  alone.
- Run the high scenario
  honestly. Many teams
  unconsciously keep the
  “success case” conservative
  because they do not want to
  discover that a popular
  feature is expensive.

## Architecture tradeoffs with direct cost consequences

| Choice | Cheaper pattern | More expensive pattern | Engineering note |
| --- | --- | --- | --- |
| History handling | Summarize and truncate | Replay full thread every time | Costs compound quickly |
| Grounding | Retrieve a few high-signal chunks | Paste huge source documents | Cheaper usually also means higher signal |
| Model routing | Escalate only hard cases | Use premium model for everything | Simple to code, expensive to run |
| Embeddings | Incremental refresh with hashing | Full corpus re-embed on every update | Often a silent budget leak |
| Retries | Bounded retries with instrumentation | Retry until success | Turns incidents into spend spikes |

- Cost review should happen in
  design review, not after
  release. Once a feature is
  live and loved, architectural
  waste becomes politically
  harder to remove.
- The cheapest architecture is
  not always the right one, but
  the expensive path should earn
  its keep with measurable
  quality gains.
- When someone proposes a larger
  context or stronger model, ask
  what quality failure it fixes.
  If nobody can answer, do not
  pay for it by default.

## A pre-launch cost review checklist

1. Can we estimate cost per
   request with real prompt
   samples rather than rough
   guesses?
2. Do we know the upper bound on
   output length for normal and
   worst-case requests?
3. Have we measured the effect
   of retrieval depth on both
   quality and cost?
4. Do we know whether the
   feature needs the premium
   model for every request or
   only for hard ones?
5. Do we have cost telemetry
   ready for day one, including
   team and feature attribution?
6. Do we know what budget
   threshold should trigger an
   architecture review after
   launch?
7. Have we tested the impact of
   retries, provider timeouts,
   and fallback behavior on unit
   cost?
8. If the feature succeeds
   beyond expectations, does the
   cost curve still work?

:::note Unit economics beat total monthly numbers

A total monthly forecast is
useful for finance. A cost-per-
request or cost-per-user number
is useful for engineering and
product. You need both. The
first explains budget. The
second explains design.

:::

## Building a FinOps rhythm for AI

Traditional cloud FinOps focuses
on infrastructure. AI FinOps
needs a tighter product loop
because model choice, prompt
design, and feature UX can all
move the bill. The cadence
should be light enough to
sustain and strong enough to
catch drift early.

- Weekly: inspect anomalies,
  expensive endpoints, and
  premium-model spikes.
- Monthly: review spend by team
  and feature, then decide
  whether prompt or routing
  changes are needed.
- Quarterly: rerun quality-
  versus-cost comparisons across
  candidate models and
  renegotiate with vendors if
  usage justifies it.
- After incidents: review
  whether timeouts, retries, or
  provider failover increased
  cost in non-obvious ways.

## Negotiating from evidence, not fear

Vendors respond better to
concrete usage evidence than to
vague statements like “AI is
getting expensive.” Bring
request counts, growth curves,
feature mix, and credible
expansion plans. That is how you
earn pricing conversations,
enterprise credits, or premium-
model flexibility.

- Show the vendor where you are
  getting value. That makes
  discount requests look like
  growth conversations rather
  than cost complaints.
- Ask for clarity on what causes
  overages, premium surcharges,
  or credit depletion. Surprises
  are a negotiation failure as
  much as a forecasting failure.
- If your organization is still
  learning usage patterns, ask
  for short-term protections
  such as price review points,
  flexible true- ups, or caps
  with alerting rather than hard
  punitive overage terms.

## Key Takeaways

- Understand whether you are
  paying per seat, per token,
  per request, or with a hybrid
  model. The optimization
  strategy depends on the unit.
- Input and output tokens both
  matter, and long context is
  one of the biggest silent cost
  drivers.
- Build cost models before
  launch using unit economics
  like cost per 1,000 requests
  and cost per user per month.
- Instrument AI services from
  day one so teams can see spend
  by feature, team, and request
  type.
- Optimization usually starts
  with prompt trimming, output
  control, caching, and right-
  sizing the model.

## Further Reading

- [GitHub Docs: Usage-based
  billing for organizations and
  enterprises](https://docs.gith
  ub.com/en/copilot/
  concepts/billing/usage-based-
  billing-for- organizations-
  and-enterprises)
- [Anthropic Docs: Prompt cachin
  g](https://docs.anthropic.com/
  en/docs/build- with-
  claude/prompt-caching)
- [OpenAI Pricing](https://opena
  i.com/api/pricing/)
- [Google Cloud Vertex AI pricin
  g](https://cloud.google.com/ve
  rtex- ai/generative-
  ai/pricing)
- [Mistral Pricing](https://mist
  ral.ai/pricing)
- [LangSmith guide on evaluation
  and observability](https://doc
  s.smith.langchain.com/)

