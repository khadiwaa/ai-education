---
id: s1-platform-strategy
sidebar_position: 9
title: "S1: Platform Strategy & Vendor Evaluation"
---

# S1: Platform Strategy & Vendor Evaluation

*Phase 3 · Strategic track · ~90 minutes · For engineers and technical leads choosing where AI should live in the stack*

---

Most engineers encounter AI through a product surface like GitHub Copilot, Cursor, Claude, ChatGPT, Gemini, or an internal assistant. Strategy starts one layer lower. Someone has to decide which provider to trust, which product surface to standardize on, which contracts to sign, how much abstraction to build, and what happens when the model or vendor changes underneath you.

This module is about making those decisions with engineering discipline instead of vibes. You do not need to become procurement. You do need to understand enough to influence platform choices, challenge shallow demos, and make sure your team is not quietly creating a costly, risky AI sprawl problem.

:::tip Practical default

For most engineering organizations, the right starting point is simple: buy a mature product for common productivity workflows, use APIs for differentiated product features, and avoid building your own AI platform unless you have multiple serious use cases that already justify a platform team.

:::

## The AI platform landscape

The fastest way to get confused about the AI market is to compare products that live at different layers. Treat the landscape as three tiers. Tier one is model providers. Tier two is orchestration and product layers. Tier three is open-source and self-hosted alternatives. You can mix and match across the tiers, but you should know where value is actually being created.

### Tier 1: model providers

Model providers build and host the underlying models. When you call an API from OpenAI, Anthropic, Google, Mistral, or a cloud-hosted open-weight model, you are paying for inference, safety systems, tooling around the model, and often an opinionated roadmap.

| Provider | Strengths engineers care about | Tradeoffs to watch | Typical fit |
| --- | --- | --- | --- |
| OpenAI | Broad ecosystem, strong coding and multimodal capabilities, mature API surface | Fast-moving pricing and model lineup, product naming churn, dependency on hosted service | Teams that value ecosystem depth and fast iteration |
| Anthropic | Strong coding and reasoning reputation, safety posture, good enterprise conversations | Less product surface breadth than some competitors, model behavior can shift across releases | Coding assistants, internal tools, regulated teams that value conservative behavior |
| Google | Strong multimodal stack, huge infra footprint, integration with Google Cloud and Workspace | Product surface can feel fragmented, model and API branding changes often | Teams already deep in Google Cloud or needing multimodal scale |
| Mistral | European vendor option, open-weight credibility, flexible deployment stories | Smaller ecosystem and fewer out-of-the-box integrations | Teams that want optionality, EU posture, or smaller-model efficiency |

Do not read that table as a winner chart. The real question is whether the provider is good at your tasks, with your latency budget, under your security constraints, at your scale. The provider that wins benchmark headlines may still be the wrong choice for your environment.

:::warning Benchmark trap

Public benchmarks are useful for rough orientation, not vendor selection. If a provider scores well on HumanEval, MMLU, or some glossy launch chart, that tells you the model might be worth testing. It does not tell you whether it can classify your support tickets, summarize your architecture docs, or generate pull request descriptions that your engineers will actually accept.

:::

### Tier 2: orchestration and product layers

Most engineers do not use raw model APIs all day. They use products and orchestration layers that package prompting, context retrieval, UI, identity, policy, analytics, and workflow into something usable. GitHub Copilot, Cursor, sourcegraph-style assistants, internal chat tools, customer support copilots, and agent frameworks all live here.

- A product layer can create more user value than the underlying model because workflow integration matters more than raw model quality in many day-to-day tasks.
- Good orchestration reduces switching cost by abstracting the model behind a stable interface, but some tools hard-wire themselves to one provider in ways that make future migration painful.
- Integration quality usually matters more than model bragging rights for internal adoption. A slightly weaker model inside the tool your engineers already use can outperform a better model behind a worse workflow.
- This is where SSO, audit logs, policy controls, IDE plugins, MCP support, analytics, and knowledge sources become procurement-critical rather than “nice to have.”

### Tier 3: open-source and self-hosted alternatives

Open-source alternatives matter for three reasons. First, they give you negotiating leverage. Second, they sometimes win on deployment flexibility, especially when data cannot leave your boundary. Third, they create a fallback path if a hosted vendor becomes too expensive, too restrictive, or strategically misaligned.

- Open-weight models are attractive when data residency, edge deployment, or predictable inference cost dominates raw frontier-model capability.
- Self-hosting pushes operational responsibility back onto you: GPU sizing, autoscaling, model upgrades, observability, security patches, tokenizer quirks, prompt compatibility, and incident response.
- Many teams overestimate how much value they get from “owning the stack” and underestimate the labor required to keep self-hosted inference reliable.
- Treat open source as part of your option set, not as an ideology test. It is a good answer for some workloads and a distraction for others.

| Question | Buy hosted answer | Open/self-hosted answer |
| --- | --- | --- |
| Need the best coding quality today? | Usually yes | Only if your eval shows parity for your tasks |
| Need strict deployment control? | Maybe, depending on vendor private deployment options | Often yes |
| Want lowest engineering overhead? | Yes | No |
| Want maximum switchability? | Only with abstraction discipline | Potentially, but operations shift to you |

## GitHub Copilot tiers: what changes and when it matters

For a company with roughly one hundred engineers, Copilot is often the first serious AI platform decision because it affects daily engineering workflow immediately. The wrong comparison is “does Copilot work?” The right comparison is “which plan gives us the governance, context, and control we actually need?”

| Tier | What it is | What it adds | When it is enough |
| --- | --- | --- | --- |
| Individual | Single-user subscription | Personal access, no central admin, minimal org controls | Prototyping or paying for your own seat |
| Business | Managed team plan | Central seat management, org policy, enterprise-ready purchasing path | Most teams that want standardization without deep enterprise context |
| Enterprise | Top-tier managed plan | More advanced controls, enterprise identity features, richer context and customization options | Larger orgs that need policy depth, internal knowledge grounding, or enterprise integration |

### Individual

Individual plans are fine for solo experimentation. They are not a real company rollout plan. If your team says “we already use Copilot” but everyone is on separate personal subscriptions, you do not have a platform strategy. You have unmanaged shadow adoption.

### Business

Business is the normal default for companies that want sanctioned usage, central billing, and basic governance. It usually gets you out of the personal-account mess and into a place where identity, policy, and cost can be managed as a team concern rather than a reimbursement problem.

### Enterprise

Enterprise is worth paying for when identity, policy, and context become first-order needs rather than edge cases. The exact feature matrix changes over time, but the themes stay consistent: stronger SSO and user lifecycle management, better administrative controls, deeper organizational context such as knowledge bases or internal repositories, and access to more customization options such as broader model choice or enterprise-specific capabilities.

- If your legal or security team needs tighter policy enforcement, Enterprise is easier to defend than a looser plan with side agreements and exceptions.
- If engineers need answers grounded in internal repositories, docs, and standards rather than only their local workspace, Enterprise-level knowledge features can materially change adoption.
- If you are large enough to care about seat governance, analytics, and model policy across multiple orgs or business units, Enterprise usually becomes a platform decision, not a tooling decision.
- If none of those are true, Business is often the better economic answer. Do not buy Enterprise because the brand sounds safer. Buy it when specific controls or context features remove real friction.

:::info How to talk about Copilot plans internally

Do not sell Enterprise as “the premium AI.” Sell it as “the plan that closes our governance and internal-context gaps if those gaps are materially limiting us.” That framing keeps the conversation anchored in business need instead of prestige.

:::

## Evaluating AI vendors with an engineering-grade framework

Vendor evaluation should feel like architecture review plus production-readiness review plus finance sanity check. The simplest useful framework has six dimensions: capability, data handling, integration, cost model, lock-in risk, and roadmap stability.

| Dimension | Core question | What good looks like | Common failure mode |
| --- | --- | --- | --- |
| Capability | Can it do our real tasks? | Passes a realistic eval on representative work | Team buys based on a demo |
| Data handling | Can we trust where data goes? | Clear contracts, retention terms, training stance, certifications | Security review happens after purchase |
| Integration | Will engineers actually use it? | Works in existing IDE, CI, identity, APIs, MCP, and workflow | Strong model, weak workflow fit |
| Cost model | Can we predict and control spend? | Transparent pricing and instrumentation path | Great pilot, ugly bill |
| Lock-in risk | How painful is switching? | Prompts, evals, and orchestration are portable | App logic hard-coded to one vendor |
| Roadmap stability | Will this still be viable in two years? | Credible product velocity and enterprise support | Tiny vendor wins pilot then stalls |

### Capability: run a real eval, not a demo

Capability means task performance in your environment, with your prompts, using your data shape. A polished live demo is almost useless because it hides prompt tuning, cherry-picked examples, and idealized latency. Engineers should insist on a small but real evaluation set before declaring anything “good.”

1. Pick five to fifteen task types that matter: code explanation, bug localization, pull request summary, internal search, support-ticket triage, compliance extraction, or whatever your actual work includes.
2. Collect a golden set with known-good answers or at least known-good judging criteria. If you cannot say what success looks like, you are not ready to evaluate.
3. Run each vendor or product on the same tasks with minimal hand-tuning first. That establishes a baseline rather than a bespoke “win condition.”
4. Allow one round of prompt and workflow improvement for each candidate. Real products get tuned; you just want tuning effort to be visible and comparable.
5. Score correctness, completeness, latency, refusal behavior, formatting consistency, and how much human cleanup is still required.
6. Review failures qualitatively. The failure shape matters as much as the pass rate. A vendor that fails safely may be preferable to one that hallucinates confidently.

:::warning Evaluation anti-pattern

If the vendor is allowed to bring their own tasks, their own judges, their own prompts, and their own success criteria, you are not running an evaluation. You are attending marketing.

:::

### Data handling: ask uncomfortable questions early

Security and privacy review cannot be bolted on at the end. AI vendors often sit on code, prompts, internal documents, customer text, and potentially regulated data. The right time to ask hard questions is before your pilot, not after your pilot created demand.

- Where exactly is data processed and stored? Country, region, cloud provider, and whether regional pinning is available.
- Is customer data used for model training by default, never, or only for some plans? Is opt-out contractual or merely a product setting?
- What is retained, for how long, and in which logs? Prompts, outputs, embeddings, telemetry, and feedback signals all matter.
- Does the vendor have SOC 2 Type II? ISO 27001? FedRAMP alignment? HIPAA support or a BAA path if you need it?
- What subprocessors are involved? Many teams review the top-level vendor and forget the chain behind them.
- Can the vendor support deletion requests, data subject rights, and clear incident notification timelines?

:::note HIPAA and regulated data

Do not treat “supports HIPAA” as a marketing checkbox. Ask whether the specific service, model family, storage mode, and logging path are covered by the BAA. Many platform pages describe the vendor broadly while carve-outs live in the legal terms.

:::

### Integration: AI that does not fit the workflow will not stick

Teams often overweight model quality and underweight integration. In practice, engineers adopt the system that appears where they already work and can use their existing identity, repositories, and tools.

- APIs: REST and streaming support, SDK quality, webhook story, retry semantics, rate-limit clarity, and versioning discipline.
- IDE integrations: VS Code, JetBrains, Visual Studio, and any internal editor constraints your teams actually have.
- MCP support: if your organization is leaning into Model Context Protocol, check whether the vendor or tool can consume or expose MCP in a maintainable way.
- SSO and user provisioning: SAML, SCIM, group-based access, offboarding behavior, and role granularity.
- Enterprise knowledge access: private repo indexing, docs connectors, issue trackers, wikis, and permission-aware retrieval.

### Cost model: predictability matters as much as price

AI spend becomes contentious when finance cannot predict it. Per-seat pricing is usually easier to budget but can hide underutilization. Per-token pricing is flexible but can surprise you badly when context balloons. Hybrid pricing creates the most confusion because both seat count and usage can move.

- Ask not only “what does it cost?” but “what makes the bill move?” Seats, tokens, premium model surcharges, connectors, storage, retrieval, and training services can all change the answer.
- Model your high, medium, and low adoption scenarios. The best vendor on paper can become the worst vendor under your actual usage pattern.
- Prefer vendors that expose clear usage telemetry and support export into your own dashboards. If you cannot measure spend by team or workload, you do not really control it.

### Lock-in risk: plan for movement even if you do not expect it

No vendor relationship feels temporary at the beginning. Lock-in shows up later, when prices rise, a model regresses, compliance requirements tighten, or leadership asks for a broader standardization decision. Your job is not to avoid all lock-in. Your job is to keep switching cost proportional.

| Layer | Low lock-in pattern | High lock-in pattern |
| --- | --- | --- |
| Prompting | Prompts stored in versioned config with evaluation tests | Prompts buried inside app code and copied across services |
| Model access | Single internal interface with provider adapters | Direct provider calls everywhere |
| Knowledge layer | Retrieval pipeline decoupled from model provider | Vendor-specific knowledge store deeply embedded |
| Application logic | Business rules outside prompts | Prompt contains hidden business logic |

### Roadmap and stability: ask whether the vendor still matters in two years

Roadmap stability is not about predicting the winner of AI. It is about choosing vendors that will plausibly continue serving your use case, support enterprise customers, and keep shipping the features you need. Engineers should care because vendor instability becomes migration work later.

- Look for evidence of product velocity, not just model launches: release notes, admin features, observability, enterprise support, SDK maintenance, and deprecation discipline.
- Check whether the vendor is likely to remain a platform, not just a model demo factory. Enterprise buyers need support and boring reliability as much as frontier capability.
- A startup vendor is not automatically a bad choice, but the burden of proof is higher. If the company disappears, who owns the migration? Usually engineering.

## Build vs. buy: what should engineers actually recommend?

The build versus buy question is usually misframed. The real options are: buy a finished product, build on top of an API, or build shared infrastructure. Those are different decisions with very different cost profiles.

| Option | Use when | Hidden cost | Opinionated recommendation |
| --- | --- | --- | --- |
| Buy a product | Workflow is common and not strategically unique | Adoption, policy, and seat management still need work | Default choice for coding assistance and generic chat |
| Build on an API | Capability is part of your product differentiation | Evals, monitoring, fallback logic, and product iteration | Good choice for customer-facing or domain-specific features |
| Build AI infrastructure | You have multiple real products that need a shared platform | Everything: model routing, gateways, evals, billing, governance, on-call | Rarely justified early |

- If the workflow is generic and already solved by a strong product, buy it. Do not build your own coding assistant because you dislike a vendor contract.
- If the workflow is part of your product moat, build on top of APIs. Your differentiation is in your data, UX, evaluation, and product logic, not in re-implementing a model provider.
- If several teams are each building similar prompt services, retrieval layers, and cost dashboards, you may eventually justify platform work. But platform should follow proven demand, not precede it.

:::warning Hidden cost of building

The first version of an internal AI platform is rarely the expensive part. The expensive part is the eighteen months after launch: maintaining adapters for changing model APIs, handling provider outages, re-running evals after model updates, operating vector stores, explaining bills, and becoming the de facto support desk for every team experimenting with AI.

:::

## Vendor consolidation vs. multi-vendor

There is no universally correct answer. Standardizing on one platform reduces cognitive load and governance overhead. Multi-vendor strategies preserve leverage and let you choose best-in-class tools. The right answer depends on how different your use cases really are.

| Approach | Benefits | Costs | Good fit |
| --- | --- | --- | --- |
| Consolidate | Lower complexity, simpler support, easier procurement, cleaner policy enforcement | May sacrifice peak performance for some edge use cases | Most teams in years one and two |
| Multi-vendor | Best tool per use case, negotiation leverage, redundancy | Identity sprawl, fragmented telemetry, more training and support burden | Mature orgs with distinct workloads |

- Standardize on one coding assistant unless there is a strong reason not to. Engineering productivity tools benefit heavily from shared training, shared norms, and common support paths.
- Allow more diversity in product-facing AI features, where task requirements, latency, or compliance may legitimately differ by domain.
- If you go multi-vendor, define ownership. Someone must own approved vendors, model-routing rules, data classification policies, and migration playbooks.

## Data residency and compliance

Data residency and compliance are not just security review topics. They directly influence architecture, vendor choice, and whether a proposed use case is viable at all. Engineers should know how to ask the first-pass questions even if legal and security make the final call.

1. What data classes will enter prompts or retrieval indexes: source code, credentials, customer text, support logs, health data, financial records, or internal-only docs?
2. Can the vendor pin processing and storage to a specific region, and is that region contractually guaranteed or just a best-effort control?
3. What happens to prompts and outputs in logs, support tooling, abuse monitoring, and analytics systems?
4. Is a DPA available, and does it clearly describe subprocessors, breach notice timing, and deletion rights?
5. If a BAA is required, is it available for the exact service and deployment mode you intend to use?
6. Can you segregate workloads so only low-risk data touches general-purpose tools while sensitive workloads use stricter controls?

:::warning Common red flags

Vendors that cannot answer where data is stored, rely on vague “we may improve our services” language, or treat training opt-out as a support ticket rather than a contractual term should be treated cautiously. Another red flag is when sales says yes to everything but the actual agreement stays silent.

:::

## Piloting before committing

A real pilot should look like a controlled engineering experiment, not a vendor-sponsored roadshow. Ninety days is a good default because it is long enough to move past novelty and short enough to keep scope disciplined.

### A practical 90-day pilot design

1. Recruit a cohort of around twenty engineers across different seniority levels and tech stacks. Include strong engineers, average engineers, and at least a few skeptics.
2. Choose a small set of workflows to measure: coding assistance, pull request summaries, internal search, test generation, or whatever matters to your org.
3. Define success metrics before the pilot starts. Examples: weekly active users, task-level time saved, code suggestion acceptance, reduced onboarding friction, or improved documentation throughput.
4. Set baseline measures for at least two weeks before the pilot if possible. Without a baseline, everything will feel better because it is new.
5. Provide lightweight training. Under-trained users produce bad pilot results and then conclude the tool is weak when the real issue was enablement.
6. Collect both telemetry and narrative feedback. Adoption data tells you who used the tool. Interviews tell you why they did or did not trust it.

| Metric category | Examples | Why it matters |
| --- | --- | --- |
| Adoption | Weekly active users, usage frequency, returning users | Shows whether the workflow fit is real |
| Outcome | Task time saved, PR cycle time, onboarding speed | Connects usage to business value |
| Quality | Acceptance rate, rework needed, hallucination rate | Prevents “usage = value” mistakes |
| Risk | Policy violations, prompt data incidents, support burden | Surfaces hidden rollout cost |

### How to present pilot results

- Lead with the business question, not the tool. Example: “We can reduce onboarding time for new engineers by improving codebase Q&A” is better than “The cohort liked Vendor X.”
- Show both wins and limits. A credible recommendation explains where the tool performed poorly and how that affects rollout scope.
- Present the recommendation as a deployment shape: approve, approve with restrictions, extend pilot, or decline. Leaders need a decision, not a pile of screenshots.
- Include the operating model: who owns rollout, training, security review, and success measurement after purchase.

## Contract considerations engineers should care about

Legal owns contract language, but engineering should influence the terms because you will live with the consequences. The contract determines whether your architecture remains flexible and whether your bill stays sane.

| Clause area | What to ask for | Why engineering cares |
| --- | --- | --- |
| Usage caps | Clear alerts and options before overage pain | Prevents surprise throttling or runaway spend |
| Price locks | Multi-year pricing or discount protection | Helps with budgeting and reduces migration pressure |
| Data clauses | Explicit no-training or scoped data-use terms | Protects code and customer data |
| SLA | Availability, support response times, service credits | AI outages become product outages |
| Exit provisions | Data export, deletion commitments, transition support | Makes migration survivable |

:::note Do not forget rate limits

A vendor can meet a formal uptime SLA and still fail your workload if the practical rate limits are too low, too bursty, or too opaque. Ask for realistic throughput numbers tied to your planned usage pattern.

:::

## Monitoring and governance after deployment

The platform decision is not done at contract signature. Models change. Usage grows. Costs drift. New connectors appear. Teams find creative ways to misuse whatever you bought. Post-deployment governance is where strategy becomes an operating system rather than a slide deck.

- Usage dashboards: active users, seats assigned versus used, request volume by team, premium model usage, and knowledge-source usage.
- Cost alerts: budget thresholds, sudden token spikes, expensive workflow detection, and alerts when usage shifts to premium models.
- Policy enforcement: repository exclusions, data classification rules, approved connectors, and review for custom integrations.
- Model update review: when a provider changes a default model, rerun critical evals before declaring the change harmless.
- Quarterly business review: adoption, value, incidents, contract posture, and whether the platform is still aligned to the company’s needs.

## A lightweight decision worksheet

If you are advising leadership on an AI platform choice, use a simple scorecard. Do not pretend it produces truth. It forces the right questions and makes tradeoffs visible.

| Question | Weight | Vendor A | Vendor B | Notes |
| --- | --- | --- | --- | --- |
| Passes our real eval? | High |  |  | Use task-level evidence |
| Meets data-handling requirements? | High |  |  | Include legal/security feedback |
| Fits our existing workflow? | High |  |  | IDE, API, SSO, MCP, connectors |
| Cost is predictable at scale? | Medium |  |  | Seat + usage model |
| Switching cost is acceptable? | Medium |  |  | Adapters, prompt portability, export |
| Vendor looks stable for 24 months? | Medium |  |  | Roadmap, enterprise support, pace |

:::tip Opinionated recommendation for most engineering orgs

Standardize on one managed coding-assistance platform, insist on a real pilot before enterprise expansion, use API-based building for product differentiation, and only invest in internal AI platform work after multiple teams have proven recurring demand. That sequence keeps complexity behind demonstrated value.

:::

## Questions to ask in the first serious vendor conversation

By the time a vendor call reaches engineering, the conversation is often already drifting toward brand and roadmap. Pull it back to implementation reality. A good first conversation should leave you with enough information to decide whether a pilot is worth the time of your engineers and security team.

1. What are the exact tasks where customers similar to us see strong results, and what are the failure modes where they do not?
2. Which parts of your platform are stable APIs or admin surfaces, and which parts are changing rapidly enough that we should expect rework?
3. What data is retained, where is it retained, and which logs or telemetry streams contain customer inputs or outputs?
4. How do identity, provisioning, SSO, and offboarding work in practice, not just in the architecture diagram?
5. What is the path to export, delete, or migrate our data if we terminate the relationship?
6. What would your own solutions engineer warn us not to do in the first ninety days?

:::tip A strong signal

Good vendors answer these questions directly and admit where their product still has rough edges. Weak vendors keep redirecting to benchmark slides, generic trust language, or “our customers love it” stories.

:::

## Writing a decision memo leadership can act on

A vendor recommendation should not look like a transcript of the evaluation. It should look like an engineering decision memo: problem statement, options, evidence, risks, recommendation, and operating model. The goal is to make the decision auditable later.

| Section | What to include | Mistake to avoid |
| --- | --- | --- |
| Problem | What workflow or business need the platform solves | Starting with the vendor name |
| Options | The real choices considered, including “do nothing for now” | Pretending there was only one candidate |
| Evidence | Pilot results, user feedback, security findings, cost scenarios | Using screenshots as proof |
| Risks | Lock-in, compliance gaps, migration cost, support burden | Hiding weak spots |
| Recommendation | Approve, restrict, pilot longer, or decline | Ending with “it depends” |
| Operating model | Who owns rollout, training, support, and governance | Assuming ownership will emerge naturally |

- Keep the recommendation short enough that a VP can read it in one pass and detailed enough that a staff engineer does not feel hand-waved.
- Include one paragraph on why rejected options were rejected. That saves time when the same debate returns six months later.
- State what evidence would cause you to revisit the decision. That is how you keep strategy adaptive instead of ideological.

## Key Takeaways

- Separate model providers, product layers, and open-source deployment options. They solve different problems.
- Evaluate vendors on real tasks, not demos. Capability without workflow fit is not enough.
- Enterprise AI decisions are mostly about governance, data handling, and integration, not just model quality.
- Build on APIs when AI is part of your product differentiation. Buy finished products for common workflows.
- Run a 90-day pilot with defined metrics before large rollout, and treat post-deployment governance as part of the platform itself.

## Further Reading

- [GitHub Docs: Plans for GitHub Copilot](https://docs.github.com/en/copilot/about-github-copilot/subscription-plans-for-github-copilot)
- [GitHub Docs: About data use for GitHub Copilot](https://docs.github.com/en/copilot/about-github-copilot/github-copilot-data-privacy)
- [Anthropic Trust Center](https://trust.anthropic.com/)
- [OpenAI Enterprise Privacy](https://openai.com/enterprise-privacy/)
- [Google Cloud: Generative AI governance and security documentation](https://cloud.google.com/security/compliance)
- [Mistral Platform documentation](https://docs.mistral.ai/)
