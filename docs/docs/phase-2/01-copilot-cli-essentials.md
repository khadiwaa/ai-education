---
id: copilot-cli-essentials
sidebar_position: 1
title: "Module 1: Copilot CLI Essentials"
---

# Module 1: Copilot CLI Essentials

*Phase 2 · ~60–75 minutes · Practical*

This module is about using Copilot from the terminal — starting a session, driving it with slash commands, managing memory, and building the interaction habits that make you fast.

---

## What Copilot CLI is

Copilot CLI is an **interactive, agentic terminal assistant**. You start a session, have a conversation, and Copilot can read files, run commands, inspect your repo, and take multi-step actions — all without leaving the terminal.

```shell
copilot
```

That one command starts a persistent session. From there you work conversationally, just as you would with a senior engineer sitting next to you.

### How it differs from Copilot in VS Code

| Surface | Best for | Key characteristic |
|---|---|---|
| **Copilot CLI (interactive)** | Terminal-centric workflows, multi-step tasks, agentic tasks | Persistent session, slash commands, tools, MCP |
| **Copilot Chat in VS Code** | Editor-centric Q&A and code changes | Rich editor context, reviewable diffs |
| **Copilot inline (VS Code)** | Fast in-place completions as you type | Lowest friction, very narrow scope |

The underlying model is the same across all surfaces. What differs is the **context** Copilot has access to and the **tools** it can use. In the interactive CLI session, Copilot has the full run of your terminal: it can list files, run shell commands, read outputs, open PRs, and use any MCP servers you have configured.

:::tip Start here
If you only do one thing from this module, start using `copilot` as your default terminal session for any non-trivial task. The slash commands in the next section make the session far more powerful than typing single-shot commands.
:::

---

## Installation and setup

### Prerequisites

- GitHub account with Copilot access
- GitHub CLI (`gh`) installed — [cli.github.com](https://cli.github.com)
- Terminal on macOS, Linux, or Windows (WSL recommended on Windows)

### Install

```shell
# Authenticate the GitHub CLI
gh auth login --web

# Install the Copilot CLI extension
gh extension install github/gh-copilot --force

# Verify
copilot --version
```

### Start your first session

```shell
cd /path/to/your-repo
copilot
```

Always start from your **repo root**. Copilot uses your working directory as its primary filesystem anchor. If you start from a subdirectory, it may make incorrect assumptions about your project layout.

---

## Working directory: why it matters

When you run `copilot` in a directory, that directory becomes Copilot's world for the session. It is where Copilot looks for files, runs shell commands, reads project structure, and applies any repo-level instructions you have configured.

This is intentional design: **Copilot's context is anchored to your working directory.** The same way a developer opens a project folder in their editor before writing code, you open the right directory before starting a Copilot session.

For most engineers, that directory is a code repository — and that is the primary use case this curriculum assumes. But the same pattern applies to any directory: a folder of infrastructure configs, a notes repo, a documentation project. Whatever is in the directory shapes how Copilot reasons and responds.

**Practical implications:**

- Open your terminal at the **repo root** before running `copilot`
- If your project is a monorepo, start at the root unless you intentionally want to scope Copilot to a specific package
- Switching projects means exiting the session, `cd`-ing to the new project, and starting fresh

---

## Your first session in a new directory

The first time you run `copilot` in a directory, a few things happen that are worth understanding.

### The trust prompt

When you run `copilot` in a directory for the first time, Copilot asks whether you trust it:

```
Do you trust the files in this directory?
```

**What this is asking:** Copilot can read files in your working directory, execute shell commands, and take actions on your behalf. The trust prompt is a safety gate that prevents Copilot from operating in a directory you did not deliberately open.

**How to think about it:**
- If you opened this directory intentionally and it is your code (or a project you are authorized to work with) → trust it
- If you ended up in a directory by accident, or it belongs to someone else, or you are not sure → do not trust it until you have verified

Trusting a directory does not grant permanent elevated permissions — it simply unlocks Copilot to operate in that location for this session. You can revoke trust and reconfigure at any time.

:::warning Untrusted directories
If you open a directory that someone else gave you — a downloaded project, a vendor archive, a shared folder — review its contents before trusting it. A `.github/copilot-instructions.md` file in that directory could contain instructions that change how Copilot behaves in your session. This is the same logic as reviewing a `Makefile` or a CI config before running it.
:::

### Permissions Copilot requests

Copilot CLI may ask for permission to:

- **Read files** in your working directory — needed to understand your code
- **Run shell commands** — needed for agentic tasks (searching, running tests, checking git status)
- **Write files** — needed when you ask it to create or edit files

These permissions are scoped to the session. Review them and only grant what you are comfortable with for the task at hand. If you are just asking questions and not expecting file writes, you can decline write permissions without losing core functionality.

### Initializing a directory with `/init`

Once you are inside a session in a new project, run:

```text
> /init
```

`/init` walks through setting up Copilot for this repository. It may:

- Create a `.github/copilot-instructions.md` file with an initial template
- Suggest memory entries based on what it sees in the project
- Detect your language, framework, and test runner and configure sensible defaults

You do not have to use `/init` — you can configure everything manually — but it is a fast way to get started in a project where Copilot has no prior context.

:::tip What `/init` creates
The most important output of `/init` is `.github/copilot-instructions.md`. This file contains instructions that apply to every Copilot session in this repo, for everyone on the team. Think of it as a team brief for Copilot — your coding conventions, preferred libraries, project context, things to always or never do.

Module 3 (Skills & Customization) covers this file in detail, including good templates and what to put in it.
:::

---

## The interactive session

Once you run `copilot`, you enter a persistent session. You type messages and Copilot responds — but it is not just a chat window. It can:

- read and write files in your project
- run shell commands and observe the output
- iterate across multiple steps before giving you a final answer
- maintain context from earlier in the conversation
- connect to external services via MCP

### Your first few messages

```text
> Summarize the structure of this repo.

> Now look at @src/auth/session.ts and explain what it does.

> This is throwing: TypeError: Cannot read properties of undefined (reading 'userId')
  Here is the stack trace: [paste stack trace]
  What is the most likely root cause?
```

Notice: you do not need to re-paste the file on the third message because Copilot already read it. **The session remembers earlier turns.**

### How context builds in a session

The key habit is to **start narrow and build outward**:

```text
Turn 1: Explain @src/billing/invoiceService.ts
Turn 2: Now look at how createInvoice handles tax calculations.
Turn 3: Write a test for the edge case where taxRate is null.
```

Each turn builds on the last. You do not restate everything — you extend.

:::warning Start from the right directory
Engineers often say "Copilot hallucinated the repo structure" when the real problem is simpler: they started the session in the wrong directory or never referenced the relevant files. Run `copilot` from your repo root.
:::

---

## Slash commands — the complete reference

Slash commands are how you control the session. Type them at any point in a conversation.

### `/help`

Show all available slash commands and their descriptions.

```text
> /help
```

Run this first in any session if you are unsure what is available. The output is always current for your installed version.

---

### `/clear`

**Clear the current conversation history.**

```text
> /clear
```

Use `/clear` when:
- You have finished one task and are starting a completely different one
- The conversation has drifted into a bad state and you want a clean slate
- You want to reduce context window pressure without compacting

After `/clear`, Copilot has no memory of the previous turns in the session. Persistent `/memory` entries (see below) are unaffected.

:::tip Task boundary habit
At the end of each task, type `/clear` before starting the next one. This prevents old context from bleeding into unrelated requests and reduces the chance of the model getting confused by irrelevant history.
:::

---

### `/compact`

**Summarize and compress the current conversation history.**

```text
> /compact
```

This is one of the most important session management commands. When a long session accumulates many turns, the context window fills up. `/compact` asks the model to summarize what has happened so far and replaces the full history with a compact summary — preserving the important decisions and context while freeing up space.

**When to use `/compact`:**
- After a long exploration phase before switching to implementation
- When Copilot starts forgetting things from earlier in the session
- Before a task that will generate a lot of output (like writing multiple files)
- When the session feels like it is running slow or degrading in quality

**What `/compact` does NOT do:**
- It does not clear the session (you keep the context, just compressed)
- It does not affect persistent `/memory`
- It is not permanent — the original history is gone once compacted

:::note Think of it like squashing git commits
`/compact` is like `git squash` for your conversation: the full history of small steps becomes a clean summary, and you continue from there.
:::

---

### `/model`

**Switch the AI model used in the current session.**

```text
> /model
```

Running `/model` opens a model picker. Use this when:
- You want a faster/cheaper model for simple tasks
- You want a more capable model for a complex task
- You are experimenting with different models to compare outputs

Different models have different strengths:
- Faster, smaller models: great for quick explanations, generating boilerplate, simple rewrites
- More capable models: better for multi-step reasoning, architecture decisions, complex debugging

The model you select applies to subsequent turns in the session. You can switch again at any point.

:::tip Match model to task
Do not use your most powerful (and slowest) model for every task. For "write a docstring for this function," a fast model is fine. For "review this architecture and identify risks," use the best available model.
:::

---

### `/memory`

**View and manage persistent memory across sessions.**

```text
> /memory
```

Memory is how Copilot remembers things about you **between sessions** — not just within a single conversation. When Copilot learns something about your project, team, or preferences that it should always know, you can tell it to remember it.

**Adding something to memory:**

```text
> Remember that we use pnpm, not npm or yarn, for this project.

> Remember that our User type is defined in @src/types/user.ts and should always be imported from there.

> Remember that we never add dependencies without a team discussion first.
```

Copilot stores these as persistent facts and references them in future sessions.

**Viewing what is in memory:**

```text
> /memory
```

This shows you everything Copilot currently has in persistent memory for this context.

**Removing a memory entry:**

```text
> Forget that [X].
```

**What is worth storing in memory:**
- Your stack: languages, frameworks, test runners
- Team conventions: naming, preferred libraries, forbidden patterns
- Important type definitions and where they live
- Constraints: "we do not add dependencies lightly," "we follow conventional commits"
- Project-specific vocabulary

**What is NOT worth storing in memory:**
- Task-specific context ("we are currently debugging the billing service") — use session context for that
- Things that change frequently
- Things already documented in `.github/copilot-instructions.md` (prefer that for team-shared context)

:::info Memory vs. custom instructions
`/memory` is personal — it is tied to your session environment, not the repo.
`.github/copilot-instructions.md` is shared — it applies to everyone on the team when they use Copilot in that repo.

Use custom instructions for team conventions. Use `/memory` for personal preferences and reminders.

See [Module 3: Skills & Customization](/docs/phase-2/skills-and-customization) for custom instructions.
:::

---

### `/resume`

**Resume a previous session.**

```text
> /resume
```

Copilot stores recent sessions. `/resume` shows you a list and lets you pick one to continue. Useful when:
- You had a productive debugging session yesterday and want to continue today
- You need to reference what was decided in an earlier session
- You want to revisit a task you were partway through

Alternatively, from outside the session:

```shell
copilot --continue
```

This resumes the most recent session immediately without the picker.

---

### `/context`

**Inspect current context window usage.**

```text
> /context
```

Shows how much of the context window is currently occupied. Useful for understanding when you are approaching limits and whether a `/compact` is warranted.

---

### `/instructions`

**View the custom instructions currently applied to this session.**

```text
> /instructions
```

Shows the combined instructions from:
- your global Copilot configuration
- `.github/copilot-instructions.md` in the current repo
- any path-specific instruction files

Use this when Copilot is behaving unexpectedly to check whether an instruction is causing it.

---

### `/mcp`

**Manage MCP (Model Context Protocol) server connections.**

```text
> /mcp
```

Lists connected MCP servers and their available tools. See [Module 4: MCP & Integrations](/docs/phase-2/mcp-and-integrations) for a full guide.

---

### Quick reference

| Command | What it does | When to use |
|---|---|---|
| `/help` | Show all available commands | When you are unsure what is available |
| `/clear` | Clear conversation history | Between tasks, or when session has drifted |
| `/compact` | Compress history into a summary | Long sessions before context window fills |
| `/model` | Switch the AI model | Matching model to task complexity |
| `/memory` | View or manage persistent memory | Checking or updating what Copilot always knows |
| `/resume` | Resume a previous session | Continuing yesterday's work |
| `/context` | Check context window usage | Before long tasks to gauge remaining headroom |
| `/instructions` | View active custom instructions | Debugging unexpected behavior |
| `/mcp` | Manage MCP connections | Adding or checking tool integrations |

---

## Memory in depth

Memory is one of the most underused features of Copilot CLI. Here is how to think about it.

### The three levels of context

| Level | Scope | How to set | When to use |
|---|---|---|---|
| **Persistent memory** | All sessions, personal | `/memory` or "Remember that…" | Personal preferences, cross-project facts |
| **Custom instructions** | All sessions in this repo, shared | `.github/copilot-instructions.md` | Team conventions, project context |
| **Session context** | Current session only | Just say it or reference files | Task-specific information |

### Building a useful memory

Think of `/memory` like briefing a new teammate. What would you tell a smart engineer who joined your team today and was about to pair with you?

Good memory entries:

```text
Remember that this project uses TypeScript strict mode.
Remember that tests live in __tests__ next to the source file they test.
Remember that we use React Query for data fetching, not Redux.
Remember that our main API client is in @src/lib/api.ts.
Remember that we prefer explicit error handling over try/catch with generic catch blocks.
```

Poor memory entries (too vague or too specific):

```text
Remember that we are working on a big refactor.    ← task-specific, will be stale
Remember to be helpful.                            ← already true
Remember the bug in billing.                       ← too vague to act on
```

### Seeding memory at project start

A good habit when you start working in a new repo:

```text
> Look at this project structure and suggest what I should add to your memory 
  to make our sessions more productive.
```

Copilot will scan the repo and suggest useful memory entries. Review them, accept the ones that are accurate, and skip the ones that are wrong.

### Keeping memory current

Memory entries can go stale. Review `/memory` occasionally and remove outdated entries. When a major change happens (migrating from npm to pnpm, moving from REST to GraphQL), update the relevant memory entries.

---

## Core task patterns

These patterns work in the interactive session for the most common engineering tasks.

### Explain unfamiliar code

```text
Explain @src/worker/processJobs.ts. Focus on:
- what triggers execution
- what side effects it has
- where it could fail silently
```

### Debug an error

Give Copilot everything it needs to find the root cause:

```text
This is failing in CI but not locally.
Error: AssertionError: expected 201 but got 400
Stack trace: [paste]
Relevant code: @src/api/users/create.ts
What I've already checked: auth headers look correct, the body is valid JSON.
What is the most likely root cause?
```

### Generate code

Specify the contract before asking for the implementation:

```text
Write a TypeScript function:
  normalizeEmails(emails: (string | null)[]): string[]

Requirements:
- lowercase, trim whitespace
- drop nulls and empty strings
- deduplicate, preserve first-seen order
- no new dependencies
```

### Multi-step task

Let Copilot run a full task rather than asking one question at a time:

```text
Find all the places in @src that call UserService.getById with a hardcoded user ID.
List them. Then for each one, explain what the correct variable or lookup should be.
```

### Review a diff

```text
!git diff --staged
Summarize this change for a code reviewer. What changed, what are the risks, 
and what edge cases should the reviewer verify?
```

The `!` prefix runs a shell command inside the session and feeds the output as context for your next message.

---

## Session hygiene habits

These habits make sessions stay productive longer.

**Start every session from the repo root:**
```shell
cd /path/to/your-repo && copilot
```

**Use `/clear` at task boundaries.**
Finished one thing, starting another? Clear. Old context is rarely helpful for new tasks and often confusing.

**Use `/compact` before long generation tasks.**
If you have been exploring for a while and are about to ask Copilot to write something substantial, compact first. You want the context window to have room for the output.

**Reference files explicitly:**
```text
Look at @src/billing/invoiceService.ts and @src/types/invoice.ts
```
Do not assume Copilot has found the right files just because they are in the repo.

**State constraints upfront:**
```text
Do not add dependencies. Preserve the existing public API. Use the test patterns in @src/__tests__/exampleService.test.ts.
```
Constraints are easier to honor when stated at the beginning than corrected at the end.

---

## Common pitfalls

**Pitfall: Starting in the wrong directory**
Copilot invents file paths because it cannot see the actual structure. Fix: always start from the repo root.

**Pitfall: Vague first message**
"Fix this" with no context. Fix: include the error, the relevant file, and the expected behavior.

**Pitfall: Not clearing between tasks**
Old context bleeds into new tasks. Fix: `/clear` at task boundaries.

**Pitfall: Not using /compact in long sessions**
Session quality degrades as history fills the context window. Fix: use `/compact` when sessions run long.

**Pitfall: Trusting generated commands without review**
Copilot can suggest the right command applied to the wrong path. Fix: read every shell command before running it, especially destructive ones.

**Pitfall: Ignoring memory**
Starting every session from scratch, re-explaining project context repeatedly. Fix: invest 5 minutes seeding `/memory` once; save that context on every future session.

---

## Quick-start checklist

### First time

- [ ] Install: `gh extension install github/gh-copilot --force`
- [ ] Verify: `copilot --version`
- [ ] Start your first session from a repo root: `cd your-repo && copilot`
- [ ] When prompted to trust the directory: confirm you are in the right project
- [ ] Run `/init` to set up the repo (creates `.github/copilot-instructions.md`)
- [ ] Run `/help` to see all available commands
- [ ] Ask Copilot to explain a file you know well — calibrate how it handles your codebase

### First week habits

- [ ] Use `/clear` at every task boundary
- [ ] Try `/compact` after a long session
- [ ] Seed memory: ask Copilot to suggest useful `/memory` entries for your project
- [ ] Try `/model` to see what models are available
- [ ] Try `/resume` to see how session history works

### Ongoing

- [ ] Review `/memory` when something changes in your project
- [ ] Explore `/mcp` once you want to connect external services (see Module 4)
- [ ] Set up `.github/copilot-instructions.md` for team-wide context (see Module 3)

---

## Legacy CLI commands

:::note For reference only
`gh copilot suggest` and `gh copilot explain` are older one-shot commands that predate the interactive session. They do not support multi-turn memory, slash commands, tools, or MCP. Use the interactive `copilot` session for real work.

You may encounter these commands in older documentation or scripts. They are still functional but limited:

- `gh copilot suggest "how do I..."` — generates a shell command from an intent
- `gh copilot explain 'some-command'` — explains a specific shell command

If your team is scripting terminal workflows or needs quick one-off command lookups, these still work fine for that narrow use case. For everything else, use the interactive session.
:::

---

## Key Takeaways

1. **The interactive session is the primary tool.** Start with `copilot` and work conversationally.
2. **Slash commands are how you manage the session.** `/clear`, `/compact`, `/model`, and `/memory` are the four you will use most.
3. **`/compact` is critical.** Long sessions degrade without it. Use it before generation-heavy tasks.
4. **Memory persists across sessions.** Invest in seeding it once; it pays off every future session.
5. **Context quality drives output quality.** Reference the right files, state constraints upfront, and give exact errors.

---

## Next Steps

Learn how these same interaction patterns translate to VS Code in [Module 2: Copilot in VS Code](/docs/phase-2/copilot-in-vscode).
