---
id: verifying-ai-output
sidebar_position: 3
title: "Module 2: Verifying AI Output & Managing Risk"
---

# Module 2: Verifying AI Output & Managing Risk

*Phase 3 · ~45 minutes · Essential*

In 2023, lawyers in a US federal case filed a brief citing six court decisions. The
decisions didn't exist — an AI chatbot had invented them, complete with convincing
case names, docket numbers, and quotes. Opposing counsel couldn't find the cases
because there was nothing to find. The court sanctioned the lawyers, and "the
ChatGPT lawyer" became a cautionary tale in every profession.

Here's the thing: nothing in that story requires being a lawyer. The same failure —
*fluent, specific, confidently formatted, fabricated* — can land in a board deck, a
grant application, a medical summary, or a press release. This module is about making
sure it never ships under your name.

---

## Why this happens (30-second recap)

From [Phase 1](/docs/phase-1/using-ai-effectively#hallucination): a language model
generates the most plausible next tokens, not verified facts. Plausible and true
usually overlap — that's why AI is useful — but when they diverge, the output *looks
identical*. There is no font for "I made this up."

Two implications follow:

1. **Fluency is not evidence.** Polish tells you nothing about truth.
2. **Specificity is not evidence.** Invented citations come with page numbers.
   Invented statistics come with decimal points.

The fix is never "trust it more" or "trust it less" — it's *a process* matched to
the stakes.

---

## The stakes ladder

Not everything needs the same rigor. Calibrate verification to the blast radius —
the same [framing you used for agents](/docs/phase-1/ai-in-your-workflow#human-in-the-loop):

| Stakes | Examples | Verification required |
|--------|----------|----------------------|
| **Low** — wrong is cheap | Brainstorms, internal drafts, explanations for your own understanding, formatting | Read it. Does it make sense? Done. |
| **Medium** — wrong is embarrassing | Internal reports, meeting summaries, emails to colleagues | Verify the facts you didn't supply: names, numbers, dates. Spot-check anything surprising. |
| **High** — wrong is costly | Anything external, anything cited, anything feeding a real decision, anything legal/medical/financial | Verify **every** factual claim against a source you trust. Every citation gets clicked. No exceptions. |

The most common verification failure isn't skipping the process — it's misjudging the
stakes. The internal draft becomes the client deck; the "rough numbers" get quoted in
the meeting. **When material moves up the ladder, its verification debt comes due.**

---

## What always gets checked

At medium stakes and above, five categories carry almost all of the risk:

1. **Citations and references** — the canonical failure. Every cited case, paper,
   article, or URL gets opened. You're checking two things: it *exists*, and it *says
   what the AI claims it says* (the subtler, more common failure).
2. **Numbers** — statistics, totals, percentages, prices. Trace to source; recompute
   what's recomputable ([the spot-check habit](/docs/phase-2/everyday-workflows#analyzing-files-and-data)).
3. **Names and titles** — people, companies, products, job titles. Cheap to check,
   mortifying to get wrong.
4. **Dates and sequences** — deadlines, event order, "as of" claims.
5. **Rules** — anything phrased as "the law requires," "the policy says," "the
   standard practice is." Verify against the actual rule or the person who owns it.

---

## Verification techniques that work

**Ground first, verify less.** The cheapest verification is the kind you don't need.
Work from attached documents and web search
([Phase 2, Module 5](/docs/phase-2/everyday-workflows#research-and-summarization)) so
claims arrive with sources instead of from model memory.

**Make the AI show its confidence.** Claude is decent at calibration *when asked*:

```text
Go back over your last answer. Which claims are you least confident
in? Which came from the documents I gave you vs. your general
knowledge? Flag anything I should verify before relying on it.
```

This isn't a substitute for checking — it's a *triage list* that tells you where to
spend your checking time.

**Separate extraction from generation.** "What does the attached policy say about X?"
(extraction — verifiable against the attachment) is much safer than "what's the rule
about X?" (generation — from wherever). Phrase high-stakes questions as extraction
whenever you can.

**Use a second pass, or a second model.** For important analysis, start a fresh chat
and ask Claude to critique the conclusion, or run the same question elsewhere. Two
independent fluent answers that *disagree* are telling you something important.

**Keep humans in the loop where they were always required.** Verification doesn't
replace expert review — the lawyer still reads the brief, the accountant still checks
the filing. AI review helps you *prepare* for expert review, not skip it.

---

## When not to use AI at all

Judgment includes knowing where the tool doesn't belong:

- **Where being wrong is catastrophic and verification is impossible** — if you have
  no way to check the output and the cost of error is severe, the task isn't ready
  for AI.
- **Where the decision is the job.** AI can brief you for a judgment call — lay out
  options, argue both sides — but delegating the *decision* on consequential matters
  (hiring, medical, legal, financial) is an abdication, and in some fields a
  violation.
- **Where authenticity is the point.** A personal apology, a reference letter you're
  vouching with, testimony. People can forgive imperfect writing; they don't forgive
  discovering it was outsourced.
- **Where the rules say no.** Courts requiring AI-use disclosure, exams, regulated
  filings — the rules are evolving; know yours.

---

## Building the habit into a team

If you lead people ([Module 4](/docs/phase-3/bringing-ai-to-your-team) covers the full
rollout), three norms carry most of the value:

1. **"AI-assisted" carries no shame, and no shortcut.** The work is judged by the
   same standard however it was drafted — which means the verifier is always named:
   whoever ships it.
2. **The stakes ladder is shared vocabulary.** "This is going external — has it had
   its high-stakes pass?" should be a normal sentence.
3. **Near-misses get shared.** The fabricated statistic someone *caught* is the best
   training material you'll ever get. Celebrate the catch, don't punish the paste.

---

## Key Takeaways

1. **Fluency and specificity are not evidence.** Fabricated output looks exactly like
   accurate output.
2. **Verify by stakes.** Read-through for low; check-the-facts for medium; everything,
   every citation, for high.
3. **Watch the ladder.** Work that moves up the ladder brings verification debt with it.
4. **Ground, then triage.** Sources beat memory; asking the AI what to double-check
   tells you where to look — not whether to look.
5. **Some tasks aren't AI tasks.** Unverifiable + catastrophic, decisions that are
   the job, authenticity moments, and anywhere the rules say no.

---

*Next: [Module 3 — Choosing AI Tools & Plans](/docs/phase-3/choosing-tools-and-plans)*
