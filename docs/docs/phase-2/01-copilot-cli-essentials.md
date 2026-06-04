---
id: copilot-cli-essentials
sidebar_position: 1
title: "Module 1: Copilot CLI Essentials"
---

# Module 1: Copilot CLI Essentials

*Phase 2 · ~60–75 minutes · Practical*

This module is about using Copilot effectively **from the terminal**. The goal is not to memorize commands. The goal is to build a fast, reliable interaction loop: give Copilot the right context, get a useful answer quickly, verify it, and move on.

:::info Two terminal experiences you will see in practice
This module uses the familiar `gh copilot explain` and `gh copilot suggest` commands because they are still widely used and easy to teach. GitHub has deprecated the old `gh-copilot` extension in favor of the newer interactive `copilot` CLI.

In practice, learn both mental models:

- **`gh copilot ...`** → lightweight, one-shot terminal help
- **`copilot`** → interactive, agentic terminal assistant with session memory, tools, and MCP integrations

The prompt habits in this module transfer cleanly to both.
:::

---

## What Copilot CLI is

Copilot CLI is **Copilot in a terminal-first workflow**.

You use it when you want help without switching to your editor, for example:

- explaining a command you found in a README
- generating a shell command you do not quite remember
- debugging an error from a build or test run
- asking the agent to inspect code from the current directory
- summarizing a diff before you commit

At a high level, **Copilot CLI and Copilot in your IDE are different interfaces over the same class of model capabilities**. The model is not magically “smarter” in one place than another. What changes is the workflow surface and the context available.

### CLI vs. IDE: when to use which

| Surface | Best for | Typical interaction | Strengths | Weaknesses |
|---|---|---|---|---|
| **`gh copilot explain`** | Explaining commands or pasted code | One-shot | Fast, low friction | Limited memory, not multi-step |
| **`gh copilot suggest`** | Suggesting shell commands | One-shot | Great for “how do I…” terminal tasks | You still need to inspect before running |
| **Interactive `copilot` CLI** | Multi-step terminal work | Conversational session | Can carry context, use tools, inspect repo | Slightly more overhead |
| **Copilot inline in VS Code** | Writing or editing code in-place | Accept/dismiss suggestions | Extremely fast for local code completion | Weak for big ambiguous tasks |
| **Copilot Chat / Edits in VS Code** | Questions, refactors, tests, docs | Chat or edit session | Rich editor context, reviewable diffs | Easier to over-scope a request |

### A practical rule

- If you are already **in the terminal** and your question is narrow, start with Copilot CLI.
- If you are already **inside a file** and want code inserted at the cursor, start with inline completions.
- If the task spans **multiple files** or needs discussion, use interactive CLI or VS Code Chat/Edits.

---

## Installation and setup

For many engineers, the fastest path is still the GitHub CLI extension flow.

### Prerequisites

You need:

- a GitHub account with Copilot access
- GitHub CLI (`gh`) installed
- terminal access on your machine
- permission to authenticate in a browser

### Install the GitHub CLI extension

```shell
gh auth login --web
gh extension install github/gh-copilot --force
gh copilot auth login
```

### Sanity-check the install

```shell
gh copilot --help
gh copilot suggest "list the ten largest files in this directory"
gh copilot explain 'find . -type f | xargs wc -l | sort -n'
```

If authentication fails, first verify that `gh auth status` works. If you use multiple GitHub hosts, use `--hostname` or `GH_HOST` explicitly.

:::tip Optional quality-of-life setup
The old `gh-copilot` extension can generate shell aliases:

```shell
gh copilot alias -- bash
gh copilot alias -- zsh
gh copilot alias -- pwsh
```

The common helpers are:

- **`ghcs`** → shorthand for `gh copilot suggest`
- **`ghce`** → shorthand for `gh copilot explain`

If you use Copilot from the terminal every day, these are worth setting up.
:::

### The newer interactive CLI

The newer standalone CLI starts as:

```shell
copilot
```

Once inside, you authenticate with `/login` if needed and work in a persistent session. This is the terminal experience that supports slash commands like `/help`, `/resume`, `/memory`, `/mcp`, and `/instructions`.

:::note Why this matters
Even if your team still uses `gh copilot suggest` and `gh copilot explain`, it is worth knowing the interactive CLI exists. It is the direction of travel for more advanced terminal workflows.
:::

---

## The basic interaction loop

Good Copilot usage is usually a four-step loop.

### 1. State the task clearly

Bad:

```text
fix this
```

Better:

```text
This TypeScript function should deduplicate users by email, preserve original order, and ignore null emails. What is wrong with it?
```

### 2. Give just enough context

Context usually means one of:

- the exact error message
- the relevant code
- the command you are trying to understand
- the file path
- the language, framework, or test runner

### 3. Inspect the output before acting on it

Accepting a Copilot answer in the terminal means one of two things:

- you **use** the explanation and move on, or
- you **run/adapt** the suggested command

Either way, **you own the judgment**. Copilot is accelerating the first draft, not taking responsibility.

### 4. Tighten and iterate

If the first answer is weak, do not ask the same vague question louder. Add missing context.

Examples:

- “Use Python 3.11 and pytest.”
- “Assume this runs on macOS.”
- “The failure only happens in CI.”
- “Preserve the existing API shape.”
- “Do not use a new dependency.”

### A realistic loop in the terminal

```shell
npm test 2>&1 | tail -50
gh copilot explain "Why is this test failing?" < failing-output.txt
```

Or, without an intermediate file:

```shell
npm test 2>&1 | gh copilot explain "Summarize this failure and suggest the most likely root cause"
```

Then refine:

```shell
gh copilot explain "Given this stack trace, what should I inspect first in src/auth/session.ts?"
```

---

## How context works

Copilot is only as grounded as the context you give it.

### In `gh copilot explain` and `gh copilot suggest`

The old GitHub CLI extension is mostly **prompt-in, answer-out**. It does not roam your repository intelligently. You usually give it context by:

- pasting text directly in the prompt
- redirecting a file with `< file.ts`
- piping command output into it

Example:

```shell
gh copilot explain "what does this do" < src/lib/rateLimiter.ts
```

### In the interactive `copilot` CLI

Context is richer.

The CLI session knows:

- your **current working directory**
- files you explicitly reference with `@path/to/file`
- conversation history in the current session
- any repository-level instructions such as `.github/copilot-instructions.md`
- available tools and MCP integrations configured for that environment

Example:

```text
Explain @src/api/handlers/users.py and tell me where validation happens.
```

### Current working directory matters

If you start the CLI at the repo root, Copilot can reason about the repo root.

If you start it inside a random subdirectory, it may only see part of the codebase clearly. That often produces:

- wrong assumptions about project layout
- suggestions that invent files in the wrong place
- commands that run from the wrong directory

:::warning Common mistake
Engineers often say “Copilot hallucinated the repo structure” when the real problem is simpler: they started in the wrong directory or never referenced the relevant files.
:::

### What Copilot sees vs. what it does not

| If you provide… | Copilot can usually do well | If you omit it… | Typical failure mode |
|---|---|---|---|
| Exact file content | Explain, refactor, summarize | File content | Hand-wavy guesses |
| Full error message | Debug faster | The actual stack trace | Generic troubleshooting |
| Language + framework | Use correct APIs and conventions | Runtime details | Wrong syntax or wrong library |
| Current directory / relevant paths | Follow repo structure | Project layout | Invented filenames |
| Clear constraints | Respect your boundaries | Constraints | Overengineered answers |

### Strong context patterns

**Use stdin when you want code explained quickly**

```shell
gh copilot explain "Summarize the control flow and call out risky edge cases" < src/service.py
```

**Pipe diffs when you want change-aware feedback**

```shell
git diff --staged | gh copilot explain "Explain what this change does and what regressions to look for"
```

**Reference files explicitly in interactive CLI**

```text
Compare @pkg/http/client.go and @pkg/http/retry.go. Where does timeout handling actually happen?
```

---

## Session notes and memory

There are two kinds of memory to understand.

### 1. Conversation memory inside a session

In the interactive `copilot` CLI, the session remembers earlier turns. That means you can build context over time:

```text
First, summarize @src/worker.py.
Now focus only on retry behavior.
Now propose tests for the timeout path.
```

This is the right way to work on a multi-step task. You do **not** need to re-paste everything every turn if the current session already has the important context.

Useful commands:

| Command | Why you would use it |
|---|---|
| `/resume` | Reopen an earlier session |
| `copilot --continue` | Fast way to continue the last session |
| `/compact` | Summarize history to keep the session focused and reduce context bloat |
| `/memory` | Enable or inspect memory across sessions if your environment supports it |
| `/share` | Save or export the conversation when it is useful to keep |
| `/instructions` | Inspect custom instruction files affecting the session |

### 2. Persistent repo context

For things Copilot should know **every time**, do not rely on chat history. Put them in a durable place:

- `.github/copilot-instructions.md`
- path-specific instruction files in `.github/instructions/`
- stable README sections
- useful comments around tricky code

### How to keep a session useful

Good session note pattern:

```text
We are debugging a flaky integration test in the billing service.
Hypothesis so far: the queue consumer retries on timeout but the idempotency key is regenerated.
Constraints: do not add a new dependency, preserve the current public API.
```

That short note is often enough to keep a long session on the rails.

:::tip Practical habit
When a session starts to drift, do not keep arguing with the model. Reset the frame:

- summarize what is true
- summarize what is not true
- restate the exact goal
- restate the constraints
:::

### Important limitation

`gh copilot explain` and `gh copilot suggest` are effectively one-shot commands. They do **not** give you durable multi-turn memory the way the interactive CLI does.

---

## Core task patterns

The fastest way to become effective is to reuse a small set of prompt patterns.

### Pattern 1: Explain code

Use this when you want a quick understanding of unfamiliar code.

```shell
gh copilot explain "what does this do" < file.ts
```

Better versions are usually more specific:

```shell
gh copilot explain "Summarize this file in plain English, then list the three most important side effects" < src/worker/processJobs.ts
```

```shell
gh copilot explain "Explain this Python module to a new teammate. Focus on control flow and failure modes." < app/tasks/reconcile.py
```

#### What to ask for

- “Summarize the control flow.”
- “What are the inputs, outputs, and side effects?”
- “Where could this throw?”
- “What would I need to change to add X?”
- “What assumptions does this code make?”

#### Strong follow-up questions

```text
Which parts are business logic vs. plumbing?
What edge cases are not handled?
If this fails in production, what would the symptoms look like?
```

### Pattern 2: Fix errors

Copilot is much better at debugging when the prompt is **information-complete**.

Weak prompt:

```text
why is this broken
```

Strong prompt:

```text
Here is the error, the stack trace, and the relevant function. Explain the most likely root cause first, then suggest the smallest safe fix.
```

Example:

```shell
gh copilot explain "Fix this error. Use the stack trace and point to the likeliest root cause first." < build-error.txt
```

Even better if you include both the error and the code:

```text
This function should accept ISO timestamps and return a UTC datetime.
Current error: ValueError: Invalid isoformat string.
Here is the code:
...
```

#### Debugging checklist to include

- exact error message
- relevant stack trace
- relevant code, not the whole service
- what you expected to happen
- what actually happened
- what you already tried

### Pattern 3: Generate code

Copilot generates better code when you specify:

- language
- inputs and outputs
- type information
- edge cases
- constraints

Weak prompt:

```text
write a parser
```

Better prompt:

```text
Write a Go function parseConfig(input []byte) (Config, error).
The input is YAML.
Missing values should use defaults.
Unknown keys should return an error.
Do not add new dependencies.
```

Another example:

```text
Write a Python function normalize_emails(emails: list[str | None]) -> list[str].
Requirements:
- lowercase everything
- trim whitespace
- drop None and empty strings
- preserve original order
- return unique values only
```

### Pattern 4: Suggest commands

This is the classic `suggest` use case.

```shell
gh copilot suggest "how do I list all files larger than 50MB under the current directory"
```

```shell
gh copilot suggest "how do I find which process is listening on port 3000 on macOS"
```

```shell
gh copilot suggest "how do I see commits on this branch that are not on main"
```

### Pattern 5: Summarize a diff

Very useful before code review or commit time.

```shell
git diff --staged | gh copilot explain "Summarize this diff for a reviewer. What changed, why, and what risks should I double-check?"
```

### Pattern 6: Generate a commit message draft

```shell
git diff --staged | gh copilot explain "Write a concise commit message for these changes. Prefer imperative mood."
```

If you use Conventional Commits, say so explicitly:

```shell
git diff --staged | gh copilot explain "Write a conventional commit message for these changes. Use feat/fix/chore style."
```

---

## `gh copilot explain` vs. `gh copilot suggest`

Treat these as different tools, not interchangeable synonyms.

### `explain`

Use `explain` when the input is **already concrete** and you want understanding.

Typical inputs:

- a shell command
- source code
- a stack trace
- a diff
- log output

Example:

```shell
gh copilot explain 'tar -czf backup.tgz ./data --exclude="*.tmp"'
```

What you are really asking:

- what does this do?
- what are the flags?
- what are the risks?
- why might this fail?

### `suggest`

Use `suggest` when the input is **an intent**, and you want Copilot to propose a command.

Example:

```shell
gh copilot suggest "how do I recursively replace foo with bar in all .py files"
```

What you are really asking:

- given my goal, what command should I run?
- what is the safest version of that command?
- what options do I need for my OS or toolchain?

### Quick decision rule

| If you have… | Use |
|---|---|
| A command and you want to understand it | `gh copilot explain` |
| A goal and you want a command | `gh copilot suggest` |
| A multi-step task in a repo | interactive `copilot` |

---

## Using Copilot CLI for shell commands

One of the most valuable terminal use cases is **command generation with human review**.

### Safe workflow for `suggest`

1. Describe the goal precisely.
2. Ask for the command.
3. Read it carefully.
4. Check destructive flags like `rm`, `mv`, `git push --force`, or `sed -i`.
5. Adapt it for your shell and OS if needed.
6. Only then run it.

Example:

```shell
gh copilot suggest "how do I delete all local git branches already merged into main except main and develop"
```

Then inspect for safety before pasting anything into your shell.

:::warning Never outsource destructive judgment
Copilot can suggest the right command and still apply it in the wrong directory, to the wrong branch, or with the wrong glob.

This is especially true for:

- file deletion
- history rewriting
- permission changes
- bulk text replacement
- database or production commands
:::

### Good terminal prompt patterns

```shell
gh copilot suggest "on macOS, how do I recursively find broken symlinks under the current directory"
```

```shell
gh copilot suggest "with ripgrep, how do I search for TODO or FIXME in src and tests only"
```

```shell
gh copilot suggest "write a curl command to POST this JSON body with a bearer token"
```

```shell
gh copilot suggest "how do I pretty-print a JSON file from the shell without jq installed"
```

### Ask for explanation after suggestion

A strong pattern is two-step:

```shell
gh copilot suggest "how do I find the five largest directories under the current directory"
gh copilot explain 'du -sh ./* | sort -hr | head -5'
```

First get the candidate command. Then make sure you understand it.

---

## Keyboard shortcuts and workflow tips

The interactive CLI is where shortcuts matter most.

### Useful interactive CLI shortcuts

| Shortcut | What it does |
|---|---|
| <kbd>Shift</kbd>+<kbd>Tab</kbd> | Toggle plan mode |
| <kbd>Esc</kbd> | Cancel current thinking / current action |
| <kbd>Ctrl</kbd>+<kbd>S</kbd> | Run command while preserving input |
| <kbd>Ctrl</kbd>+<kbd>G</kbd> | Edit prompt in `$EDITOR` |
| <kbd>Ctrl</kbd>+<kbd>L</kbd> | Clear screen |
| <kbd>Ctrl</kbd>+<kbd>T</kbd> | Toggle reasoning display |
| `@file` | Add a file to prompt context |
| `!command` | Run a shell command directly without calling the model |
| `/help` | Show interactive command help |
| `/context` | Inspect context window usage |
| `/resume` | Resume an old session |

### Fast workflow tips

#### Tip 1: Start from the right directory

The terminal equivalent of “open the right workspace” is “start from the repo root.”

```shell
cd /path/to/repo
copilot
```

#### Tip 2: Keep prompts task-shaped

Good:

```text
Explain why @src/cache.py can return stale values after invalidation.
```

Weak:

```text
read the repo and tell me stuff
```

#### Tip 3: Use shell tools to create context quickly

```shell
git diff --staged | gh copilot explain "Write reviewer notes"
pytest 2>&1 | gh copilot explain "Summarize this failure"
```

#### Tip 4: Ask for the format you want

- “Give me the answer in bullets.”
- “Return only the command.”
- “List likely root causes in priority order.”
- “Show the smallest safe change first.”

#### Tip 5: Prefer smallest-safe-change prompts

This reduces overengineering.

```text
Suggest the smallest safe fix that preserves the current API and does not add dependencies.
```

---

## Common pitfalls and how to avoid them

### Pitfall 1: Asking without enough context

Symptom: generic or obviously wrong answer.

Fix: include the error, the code, the OS, the language, or the exact file.

### Pitfall 2: Dumping too much irrelevant context

Symptom: answer misses the real issue.

Fix: include the **relevant** 30–150 lines, not the whole service, unless you truly need codebase-wide reasoning.

### Pitfall 3: Trusting shell suggestions blindly

Symptom: you run the command and regret it.

Fix: read every destructive command as if it came from a stranger in a chat room.

### Pitfall 4: Not specifying constraints

Symptom: Copilot suggests a rewrite when you wanted a patch.

Fix: say things like:

- “Do not add dependencies.”
- “Preserve public API.”
- “Keep this as a shell one-liner.”
- “Use pytest, not unittest.”

### Pitfall 5: Using the wrong tool mode

Symptom: you are forcing `gh copilot suggest` to do multi-step repo reasoning.

Fix: use interactive `copilot` or VS Code Chat for broader tasks.

### Pitfall 6: Treating one bad answer as proof the tool is useless

Often the issue is not the model. It is the prompt or the missing context. Before giving up, try one more turn with:

- clearer scope
- concrete constraints
- better grounding
- the actual file or error text

:::note Calibration matters
Copilot is very strong at:

- syntax recall
- command scaffolding
- summarization
- first-draft explanations
- generating obvious tests and docs

It is much weaker at:

- hidden product assumptions
- ambiguous requirements
- risky judgment calls
- deciding tradeoffs without context
:::

---

## Quick-start checklist

Use this the first week you try Copilot CLI seriously.

### Setup

- [ ] Run `gh auth login --web`
- [ ] Install the extension: `gh extension install github/gh-copilot --force`
- [ ] Authenticate Copilot: `gh copilot auth login`
- [ ] Verify `gh copilot suggest` and `gh copilot explain` work
- [ ] If available, try the newer `copilot` interactive CLI too

### Habits

- [ ] Start from the repo root
- [ ] Use `explain` for concrete inputs
- [ ] Use `suggest` for shell goals
- [ ] Include exact errors and relevant code
- [ ] State language/framework/constraints explicitly
- [ ] Inspect commands before running them

### Upgrade path

- [ ] Learn `@file` references in interactive CLI
- [ ] Learn `/resume`, `/compact`, and `/memory`
- [ ] Learn how repo instructions shape answers
- [ ] Learn how MCP servers extend the CLI

---

## Key Takeaways

1. **Copilot CLI is a workflow surface, not a different brain.** The model quality matters, but context and interface matter just as much.
2. **Use `explain` and `suggest` differently.** `explain` is for understanding something concrete. `suggest` is for generating a command from intent.
3. **Context quality drives answer quality.** Exact files, errors, diffs, and constraints beat vague requests every time.
4. **Interactive CLI is where session memory lives.** Use it for multi-step tasks, and use durable instructions for repo-level context.
5. **You still own the judgment.** Especially in the shell, inspect before you run.

---

## Next Steps

Next, learn how the same Copilot patterns show up inside the editor in [Module 2: Copilot in VS Code](/docs/phase-2/copilot-in-vscode).
