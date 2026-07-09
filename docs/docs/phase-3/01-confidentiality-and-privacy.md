---
id: confidentiality-and-privacy
sidebar_position: 2
title: "Module 1: Confidentiality, Privacy & Sensitive Data"
---

# Module 1: Confidentiality, Privacy & Sensitive Data

*Phase 3 · ~45 minutes · Essential*

Phase 2 made you effective. Phase 3 makes you trustworthy. And nothing matters more to
that than knowing — precisely, not vaguely — what should and shouldn't go into an AI
tool.

This module is written to be generic on purpose: tools, plans, and policies differ.
Where the specifics matter, the answer is always the same — **check your plan's terms
and your organization's policy.** What this module gives you is the framework to ask
the right questions.

---

## Where your words go

When you send a message to Claude — or any cloud AI tool — the text (and anything you
attached) travels to the provider's servers, gets processed to generate the response,
and is typically stored for some period as your conversation history.

That's not sinister; it's how the product works — your chat history *is* stored
conversations. But it means the practical question is never "is AI safe?" It's the
same question you'd ask about any service that holds work information:

1. **Who can access what I send?**
2. **How long is it kept, and can I delete it?**
3. **Is it used to train future models?**
4. **What has my organization agreed to contractually?**

### The training question

"Will my data train the model?" is the question people worry about most. The honest
general answer:

- **It depends on your plan and settings.** Providers differ, consumer and business
  plans differ, and defaults change over time. Anthropic, for instance, documents its
  data-use policies and gives controls over whether conversations are used for
  training — but you should *read the current terms for your plan*, not trust a
  course, a colleague, or a screenshot from last year.
- **Business plans are generally stricter.** Team and enterprise offerings typically
  come with commitments that customer data isn't used for training, plus admin
  controls, audit options, and contractual data-processing terms. This is a major
  reason organizations buy them (see
  [Module 3](/docs/phase-3/choosing-tools-and-plans)).
- **Check, then set.** Find the data/privacy section of your AI tool's settings
  *today*. Know what your toggles are set to. It takes five minutes.

:::tip The five-minute audit
Open your AI tool's settings and answer: What plan am I on? What does it say about
training? Can I delete conversations, and does deleting actually remove them from
retention? If you can't answer these, you're not ready to paste work material.
:::

---

## The traffic-light rule

You need a rule you can apply in the two seconds before pasting. Use three buckets:

### 🟢 Green — go ahead

Information that's public or generic:

- Anything already published (public reports, news, published policies)
- General questions with no real names or details ("how should a vendor contract
  handle early termination?")
- Your own drafts about non-sensitive topics

### 🟡 Yellow — redact first, or use an approved plan

Internal but not explosive — the day-to-day material of work:

- Internal documents, plans, and correspondence
- Anything naming colleagues, clients, or partners

For yellow material, two paths:

1. **Redact** — swap names for roles (`[CLIENT]`, `[VENDOR A]`), strip identifiers,
   remove numbers that don't matter to the task. Usually costs you nothing in answer
   quality.
2. **Use the plan your organization approved for this.** If your team bought an
   enterprise plan precisely so staff can work on internal documents, that's what
   it's for — *within whatever boundaries the policy sets.*

### 🔴 Red — never, on any plan, in any tool

- **Credentials** — passwords, access codes, account numbers, security answers
- **Personal data about others** where you have a duty of care — client files,
  patient information, employee records, anything covered by privacy law
- **Privileged or legally sensitive material** — attorney–client privileged
  communications, active litigation strategy, material non-public information
- **Anything under an NDA or regulatory regime** that doesn't explicitly permit it

The red list isn't about AI being uniquely dangerous — you shouldn't put these in
unapproved email or file-sharing tools either. AI tools just make the pasting
frictionless, so the discipline has to be conscious.

:::danger Professional duties don't have an AI exception
If you're in law, medicine, finance, HR, or any field with confidentiality
obligations: those obligations apply to AI tools *in full*. "The AI needed the
context" is not a defense. When in doubt, redact, ask whoever owns compliance, or
don't.
:::

---

## Redaction that actually works

Redacting well is a skill — the goal is removing *identity and sensitivity* while
keeping *structure*, because structure is what the AI needs:

```text
# Instead of:
"Our client Meridian Health owes us $2.3M under the 2024 MSA and is
disputing the June invoice over the staffing clause..."

# Paste:
"Our client [CLIENT], a healthcare company, owes us a seven-figure
amount under a master services agreement and is disputing an invoice
over the staffing clause..."
```

The advice you get back will be just as good — clauses, arguments, and structure don't
care about the real names. Habits that help:

- **Consistent placeholders** (`[CLIENT]`, `[EMPLOYEE-1]`) so the AI can track who's who
- **Round the numbers** that don't need precision; drop the ones that do nothing
- **Reread before sending** — the identifying detail that slips through is usually in
  the middle of a paragraph, not the header

---

## Special cases worth knowing

- **Connectors multiply the surface.** A connector that reads your email or files
  ([Phase 2, Module 4](/docs/phase-2/connectors-and-skills#before-you-enable-a-connector))
  means the AI is now processing whatever's *in* those — including other people's
  confidential information. Connect narrow, and only what policy allows.
- **Sharing and publishing.** Shared chat links and published artifacts are
  *publishing*. A "private" link is still a link. Check before sharing anything
  work-derived.
- **Other people's AI.** Meeting transcription bots, AI note-takers, email assistants
  on the other side of a conversation — assume anything you say in a recorded meeting
  may be processed by someone's AI. Disclosure norms are still forming; your
  organization should have a position.
- **Your chat history is a record.** Conversations can be subject to legal discovery
  or internal review like email. Write accordingly.

---

## If your organization has no policy yet

Then *you* are the policy, which is bad for everyone. Push for a simple one — even one
page beats nothing:

1. Which tools and plans are approved
2. The traffic-light lists, made specific to your business
3. Who to ask when unsure
4. What to do if something sensitive gets pasted by mistake (it will happen —
   a no-blame report-and-delete process beats silence)

[Module 4](/docs/phase-3/bringing-ai-to-your-team) covers rolling this out.

---

## Key Takeaways

1. **Know where your words go.** Plan, settings, retention, training — five minutes
   in Settings, today.
2. **Traffic-light everything.** Public/generic → go. Internal → redact or use the
   approved plan. Credentials, others' personal data, privileged material → never.
3. **Redact structure-preservingly.** Placeholder names, rounded numbers — the advice
   stays good, the risk goes away.
4. **Professional obligations apply in full.** No AI exception, ever.
5. **No policy is a policy — a bad one.** A one-page acceptable-use note beats
   everyone guessing.

---

*Next: [Module 2 — Verifying AI Output & Managing Risk](/docs/phase-3/verifying-ai-output)*
