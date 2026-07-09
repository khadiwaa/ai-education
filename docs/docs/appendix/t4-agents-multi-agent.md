---
id: t4-agents-multi-agent
sidebar_position: 5
title: "T4: Agents & Multi-Agent Systems"
---

This module focuses on agents as engineering systems rather than demo loops.
The target reader already knows how to call LLMs and write prompts.
What matters here is how to build controlled, observable, tool-using systems that can act over real software and business workflows.

:::info Audience framing
You do not need to believe that “agents” are a new computing paradigm.
You do need to understand when iterative tool use creates value, when it creates chaos, and how to design the difference.
:::

## Why Agents Matter

An LLM becomes an agent when it can do more than answer from the current prompt.
It can inspect state, choose actions, call tools, observe results, and decide what to do next.

That capability is useful when the task cannot be solved in one shot.
Examples include:

- debugging across several services,
- planning and performing code changes,
- searching multiple data systems,
- reconciling conflicting facts,
- gathering evidence before producing an answer,
- orchestrating long-running business workflows.

A non-agentic prompt says, “answer based on what is here.”
An agentic system says, “use available tools and state to make progress toward a goal.”

### Why simple prompting stops working

Many real tasks are partially observable.
The model does not begin with enough information to answer correctly.
It must acquire that information.

A few examples:

- “Why is checkout latency spiking in EU regions?” requires logs, metrics, deployment history, and maybe code diffs.
- “Update the onboarding docs to match the latest auth flow” requires repo search and editing.
- “Find all customers affected by this feature flag regression” requires structured queries, filters, and validation.

In these cases, a single prompt without tools is basically guesswork.

### Agents are control systems

The most productive engineering lens is not “agents are intelligent coworkers.”
It is “agents are stochastic control loops around tools.”

That framing helps because it emphasizes the parts engineers can actually design.

- state representation,
- tool interfaces,
- retry policy,
- observation logging,
- safety boundaries,
- approval gates,
- memory policy,
- termination conditions.

### So what for engineers

The useful question is not whether agents are “real.”
The useful question is whether an iterative tool loop improves task completion enough to justify the added complexity.

:::tip Practical framing
If a task is deterministic, short, and fully specified up front, a regular API call is usually better.
If the task requires discovery, branching, and stateful decision-making, agent patterns start to matter.
:::

## Single Agent Architecture

A practical single-agent loop is simple in concept.

1. receive a goal,
2. interpret the current state,
3. plan a next action,
4. call a tool or produce an answer,
5. observe the result,
6. reflect on whether the goal is complete,
7. repeat if needed.

That is the core architecture behind most production agent systems, regardless of framework branding.

### Task to plan to action loop

A useful mental model is:

`task -> plan -> tool call -> observe -> reflect -> next step`

Each step benefits from explicit design.

- Task: what outcome is expected, and what constraints exist?
- Plan: what subgoals or strategy should the agent attempt first?
- Tool call: what action can change or inspect the world?
- Observe: what structured result came back?
- Reflect: did the action help, fail, or reveal missing information?
- Next step: continue, switch strategy, ask for approval, or stop.

### Minimal state for a useful agent

Even a single agent usually needs more than chat history.
Useful state often includes:

- user goal,
- current plan,
- tool outputs,
- intermediate artifacts,
- retry counters,
- remaining budget,
- safety flags,
- completion criteria.

If these are implicit only in conversation text, debugging gets hard quickly.
Structured state makes trajectory analysis much easier.

### A practical loop in TypeScript

```ts
type AgentState = {
  goal: string;
  plan: string[];
  completedSteps: string[];
  observations: string[];
  retriesByTool: Record<string, number>;
  status: "running" | "needs_approval" | "done" | "failed";
};

async function runAgent(state: AgentState) {
  while (state.status === "running") {
    const nextAction = await model.planNextAction(state);

    if (nextAction.type === "final_answer") {
      state.status = "done";
      return nextAction.payload;
    }

    const result = await tools[nextAction.toolName](nextAction.args);
    state.observations.push(JSON.stringify(result));

    const reflection = await model.reflect({ state, result });
    state.plan = reflection.updatedPlan;
    state.completedSteps.push(reflection.completedStep);

    if (reflection.needsApproval) {
      state.status = "needs_approval";
    }

    if (reflection.shouldStop) {
      state.status = reflection.success ? "done" : "failed";
    }
  }
}
```

The exact code does not matter.
The important point is that the loop is explicit.
The agent is not magic.
It is policy plus state plus tools.

### Reflection is not optional hand-waving

Reflection means the model reasons about the outcome of the last step.
That can be lightweight.
It does not need to be an elaborate philosophical monologue.

Useful reflection questions include:

- Did the tool output answer the current subgoal?
- Did the tool fail, partially succeed, or return empty results?
- Should the agent retry, choose another tool, or stop?
- Is there enough evidence to produce a trustworthy answer?

Without reflection, agents often do one of two bad things.

- Loop mechanically.
- Stop too early on weak evidence.

### Termination criteria

A real agent needs explicit stop conditions.
Examples include:

- final answer generated with required evidence,
- maximum step count reached,
- budget exhausted,
- repeated tool failures,
- missing approval for high-risk actions,
- confidence below threshold with no safe next move.

An agent without stop conditions is not autonomous.
It is just unsupervised resource consumption.

### So what for engineers

A good single-agent design starts with a state machine, not a prompt poem.
Write down:

- what state exists,
- which transitions are allowed,
- when the system stops,
- and what evidence is required before claiming completion.

:::warning Common mistake
Teams often spend too much time tuning the “assistant personality” and too little time defining termination rules, structured state, and approval paths.
Those latter elements decide whether the system is operable.
:::

## Tool Calling at the API Level

Tool calling is the interface layer between language reasoning and external action.
At the API level, the model is usually given a list of available tools, their names, descriptions, and argument schemas.
The model responds either with plain text or a structured request to invoke one of those tools.

### Function definitions and JSON schemas

Most major providers support some flavor of structured tool definition.
The tool contract typically includes:

- a name,
- a description,
- a parameter schema,
- and sometimes required fields or enum constraints.

The model is then expected to emit a tool call with arguments that match the schema.

Why this matters:

- descriptive names improve tool selection,
- clear parameter descriptions improve argument quality,
- enums and required fields reduce malformed calls,
- schemas provide a machine-checkable contract between the model and the runtime.

### Example tool definition

```ts
const tools = [
  {
    type: "function",
    function: {
      name: "searchTickets",
      description:
        "Search support tickets by product, severity, and keyword to gather evidence for incident analysis.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Keyword query or error message to search for",
          },
          product: {
            type: "string",
            description: "Product area such as billing, auth, or checkout",
          },
          severity: {
            type: "string",
            enum: ["sev1", "sev2", "sev3", "sev4"],
            description: "Optional severity filter",
          },
          limit: {
            type: "integer",
            minimum: 1,
            maximum: 50,
            description: "Maximum number of tickets to return",
          },
        },
        required: ["query", "limit"],
      },
    },
  },
];
```

### Calling convention

A typical runtime loop looks like this.

1. send messages plus tool definitions to the model,
2. inspect whether the model returned a tool call,
3. validate arguments against schema,
4. execute the tool,
5. send tool results back to the model as a structured message,
6. continue until the model returns a final answer or stop signal.

The model does not execute the tool directly.
Your application does.
That is a critical control boundary.

### Tool result messages

Tool results should be structured.
Do not feed the model a blob of untyped log spam if you can avoid it.
Better tool outputs contain:

- status,
- summarized result,
- raw payload when needed,
- pagination or truncation indicators,
- error code if relevant,
- retryability hints.

### Schema quality changes behavior

Ambiguous tools create ambiguous trajectories.
Examples of weak tool definitions:

- tool names like `doThing` or `processData`,
- descriptions that do not say when to use the tool,
- giant catch-all tools with dozens of optional arguments,
- schemas that accept nearly anything.

Examples of stronger definitions:

- `getDeploymentStatus`,
- `searchRunbooks`,
- `createPullRequestDraft`,
- `listCustomerInvoices`.

The model needs semantic affordances.
Descriptive tool naming is part of prompt engineering, API design, and operational control all at once.

### Input validation and guardrails

Never trust model-generated arguments blindly.
Your runtime should:

- validate against JSON schema,
- enforce access control,
- clamp numeric ranges,
- reject unsupported enum values,
- sanitize or reject dangerous shell commands,
- inject server-side defaults rather than trusting the model.

### So what for engineers

Tool calling works best when the API is boring.
Good schemas reduce retries, reduce invalid actions, and make postmortems readable.

:::tip Design heuristic
If a human engineer would be confused by a tool name or parameter list, the model will be too.
Treat tool definitions like public SDK design.
:::

```ts
async function executeToolCall(toolCall: {
  name: string;
  arguments: unknown;
}) {
  const schema = registry[toolCall.name]?.schema;
  if (!schema) {
    return { status: "error", code: "UNKNOWN_TOOL", retryable: false };
  }

  const parsed = schema.safeParse(toolCall.arguments);
  if (!parsed.success) {
    return {
      status: "error",
      code: "INVALID_ARGUMENTS",
      retryable: true,
      details: parsed.error.flatten(),
    };
  }

  return registry[toolCall.name].handler(parsed.data);
}
```

### The Model Context Protocol (MCP)

Everything above describes tool calling at the raw API level: you hand the model a list of tool schemas and dispatch the calls yourself.
The Model Context Protocol (MCP) is the emerging open standard for doing this in a reusable, portable way.
Instead of re-implementing tool definitions and dispatch logic inside every application, you expose capabilities once behind an MCP server, and any MCP-capable agent or client can discover and call them.

Relative to the API-level mechanics in this section:

- the model still selects a tool and emits arguments the same way,
- but the tool catalog, schemas, and transport are standardized rather than bespoke per app,
- which makes tools shareable across agents, IDEs, and hosted assistants,
- and lets you swap or add capabilities without rewriting each client.

Think of API-level tool calling as the underlying contract and MCP as a standard packaging and distribution layer on top of it.
For practical setup — running and connecting MCP servers — see [Phase 2 · Connectors, MCP & Skills](/docs/phase-2/connectors-and-skills).

## Planning Strategies

Not every task needs explicit planning.
But once tasks involve multiple steps, planning strategy begins to shape both quality and cost.

### ReAct-style planning

ReAct interleaves short reasoning steps with tool use: think about the next step, call a tool, inspect the result, think again, and stop when ready.
As an agent planning strategy it shines when the path is unknown up front, because the agent adapts as new evidence arrives.
The pattern itself is covered in depth in [T2 §ReAct](./t2-advanced-prompting#react); here we care about its planning characteristics.

As a planning strategy, ReAct-style control is:

- flexible under uncertainty and good for search, debugging, and investigation tasks,
- but prone to looping and over-exploration,
- sometimes in tension with product constraints when hidden chain-of-thought is required,
- and liable to accumulate step-by-step latency across a long trajectory.

### Plan-then-execute

In this pattern, the model first produces a higher-level plan.
Then it executes steps, often with less reasoning at each step.

Benefits:

- clearer structure,
- easier human review,
- better for tasks with known decomposition,
- easier to budget or parallelize.

Weaknesses:

- brittle if the initial plan is wrong,
- may need replanning when new information arrives,
- sometimes overcommits to a poor early assumption.

This works well for tasks like:

- documentation generation,
- multi-step content pipelines,
- known workflow automation,
- orchestration where stages are well understood.

### Tree-of-thought and branching search

Tree-of-thought approaches explore multiple candidate reasoning paths instead of a single trajectory.
This can improve quality on hard planning or search problems.

In practice, it means:

- generate several candidate next steps or plans,
- score or critique them,
- continue down the most promising branches,
- prune poor branches.

This can help with:

- complex debugging,
- multi-constraint planning,
- synthesis from conflicting evidence,
- tasks where early mistakes are expensive.

But it also increases cost and orchestration complexity.
If you are not careful, you multiply latency with little practical gain.

### Comparing planning strategies

| Strategy | Strength | Weakness | Good fit |
| --- | --- | --- | --- |
| ReAct-style | Adaptive and exploratory | Can loop and incur many steps | Investigation, retrieval, debugging |
| Plan-then-execute | Structured and reviewable | Less adaptive if plan is wrong | Known workflows and automation |
| Tree-of-thought | Explores alternatives | Expensive and complex | Hard planning and high-stakes tasks |

### Planning depth and budget

Planning is not free.
Longer trajectories cost more tokens, more tool calls, more latency, and more failure opportunities.
That means your planning strategy should match task difficulty.

- trivial tasks should skip elaborate planning,
- medium tasks may benefit from one explicit plan plus execution,
- hard tasks may justify branching or critic loops.

### Dynamic replanning

A good agent is allowed to change its plan.
The key is to do so intentionally.
Useful triggers include:

- empty search results,
- conflicting evidence,
- repeated tool failures,
- new constraints discovered during execution,
- human feedback or approval edits.

### So what for engineers

Do not default to maximum autonomy.
Choose the lightest planning strategy that reliably completes the task.

:::warning Common mistake
Many teams build full ReAct loops for workflows that were already deterministic enough for ordinary code.
The result is slower, harder to test, and less predictable than the system it replaced.
:::

## Memory Architecture

Memory is one of the most overloaded words in agent discussions.
In practice, it usually means one of a few things.

- in-context memory,
- external memory,
- episodic or learned memory about past interactions,
- summary memory that compacts long histories.

This section is the canonical treatment of agent memory for this module; multi-agent systems reuse exactly these layers, with coordination raising the stakes on which one you pick.

### In-context memory

This is the simplest form.
The agent uses the current prompt history as its memory.
That includes:

- prior user turns,
- previous tool outputs,
- recent summaries,
- the current plan.

Strengths:

- simple,
- no extra infrastructure,
- easy to reason about.

Weaknesses:

- limited by context window,
- expensive as history grows,
- vulnerable to noise and distraction,
- easy to lose important details in long sessions.

### External memory

External memory stores state outside the prompt.
This can include:

- relational data,
- vector stores,
- key-value stores,
- document stores,
- workflow engines,
- event logs.

External memory is usually necessary when:

- sessions span long periods,
- many artifacts are involved,
- multiple agents need shared state,
- you need auditability or recovery after failure.

The important design question is not “should the model remember?”
It is “what state belongs in explicit software-managed storage rather than token context?”

### Episodic memory

Episodic memory stores summaries or lessons from prior interactions.
Examples include:

- user preferences,
- prior successful workflow templates,
- compact summaries of long conversations,
- known environment constraints.

This is useful when the system repeatedly interacts with the same users or tasks.
However, it introduces privacy, drift, and correctness concerns.
A stale user preference can be just as harmful as no memory at all.

### Summary memory

Summary memory compresses long trajectories into shorter representations rather than carrying the full transcript.
That might include:

- what the agent already tried,
- what evidence was found,
- what decisions were made,
- what remains blocked.

This helps manage context growth without losing task continuity, and it is especially useful in orchestrator patterns and long investigations.
The tradeoff is that summaries can omit or distort details, so treat the summary as lossy and keep exact state elsewhere.

### What should not be memory

Teams sometimes stuff everything into a vector database and call it memory.
That is usually a design smell.

Not all state should be retrieved semantically.
Examples better handled by structured storage:

- remaining approval budget,
- current workflow stage,
- retry count,
- exact customer ID,
- access scope,
- timestamps and SLA deadlines.

### So what for engineers

Use prompts for short-lived reasoning context.
Use databases for durable state.
Use summaries for long histories.
Use retrieval only where semantic lookup is actually appropriate.

The right design is usually layered rather than a single choice:

| Memory pattern | Best for | Risk |
| --- | --- | --- |
| In-context | Short tasks and prototypes | Overflow and drift |
| External store | Durable workflows and shared state | More infrastructure complexity |
| Episodic | Repeated users and recurring tasks | Privacy and stale preferences |
| Summary memory | Long trajectories with bounded context | Summary omissions and distortion |

:::tip Memory rule
If a value must be exact, queryable, and auditable, it probably belongs in structured state rather than free-form memory text.
:::

:::note Practical pattern
A very common production design is "state in a database, artifacts in storage, summary in prompt, recent tool outputs in context."
That pattern is far easier to debug than treating the conversation transcript as the source of truth.
:::

## Tool Design Principles

Bad tools create bad agents.
Most agent reliability problems are partly tool design problems.

### Atomic and composable

Tools should do one thing well.
That does not mean every tool must be tiny, but it does mean tool boundaries should be meaningful.

Good examples:

- `listOpenPullRequests`,
- `getPullRequestDiff`,
- `postPullRequestComment`,
- `searchIncidentTimeline`.

Weak examples:

- `manageGitHub`,
- `doRepositoryWork`,
- `handleCustomerData`.

Atomic tools help because:

- the model can choose them more accurately,
- failures are easier to diagnose,
- permissions can be scoped more safely,
- results are easier to structure.

### Descriptive names and parameters

The tool name should say what it does.
The parameters should say what the runtime needs.
Descriptions should say when the tool should be used.

Clear parameters beat clever overloading.
A parameter like `environment` with enum values is far better than a free-form string called `target`.

### Idempotent where possible

Idempotent tools are easier for agents to use safely.
If the agent retries a read or an upsert, the world should not break.

Good candidates for idempotence:

- fetch operations,
- validations,
- dry-run actions,
- upserts keyed by stable IDs,
- workflow transitions with duplicate detection.

Non-idempotent actions still exist.
For example, sending emails, charging cards, or deleting resources.
Those need tighter approval and confirmation patterns.

### Structured results

Tool outputs should be designed for both humans and models.
That usually means:

- a short summary,
- typed fields,
- explicit status,
- pagination info,
- error codes,
- stable identifiers.

Avoid returning only raw HTML, raw console noise, or ambiguous free text when you can structure the result.

### Recoverable errors

A tool should communicate whether an error is retryable, fixable by changing arguments, or terminal.
That helps the agent choose the next move.

| Principle | Why it matters | Example |
| --- | --- | --- |
| Atomic | Easier selection and debugging | `getInvoiceById` instead of `billingAction` |
| Composable | Supports multi-step workflows | Search, inspect, then update |
| Descriptive | Improves tool choice | `searchRunbooks` |
| Idempotent | Safer retries | `upsertDraftComment` |
| Structured results | Better reflection and logging | status + data + error fields |
| Recoverable errors | Better recovery behavior | `retryable: true` |

### So what for engineers

Design agent tools like you would design internal platform APIs.
The quality of the interface shapes the quality of the behavior.

:::warning Common mistake
If you expose a giant “execute arbitrary command” tool too early, the agent may become flexible in the worst possible way.
Start with narrower capabilities and widen only when justified by evidence.
:::

```ts
type ToolResult<T> = {
  status: "ok" | "error";
  summary: string;
  data?: T;
  errorCode?: string;
  retryable?: boolean;
};
```

## Error Handling and Recovery

Agents do not need to be perfect.
They do need to fail in controlled ways.
That means treating tool failures, validation errors, ambiguous results, and budget exhaustion as first-class states.

### Types of failures

Common failure classes include:

- invalid tool arguments,
- tool unavailable or timeout,
- empty results,
- partial results,
- conflicting evidence,
- unsafe or unapproved action request,
- context overflow,
- final answer without enough support.

Each class should map to a recovery strategy.

### Retries

Retries are useful when failure is transient.
Examples include:

- network timeout,
- rate limit,
- temporary backend unavailability.

Retries are harmful when failure is logical.
Examples include:

- missing required parameter,
- permission denied,
- tool not applicable,
- empty search because the query is wrong.

A recovery-aware agent should know the difference.
Blindly retrying everything is not resilience.
It is loop amplification.

### Surfacing errors back to the model

Do not swallow tool failures.
The model needs a structured representation of what happened.
For example:

- `INVALID_ARGUMENTS` with field-level issues,
- `RATE_LIMITED` with retry-after hint,
- `PERMISSION_DENIED` with approval requirement,
- `NO_RESULTS` with query suggestions.

This lets the model decide whether to:

- retry later,
- reformulate,
- ask for approval,
- choose a different tool,
- or stop and explain the limitation.

### Preventing infinite loops

Loop prevention is one of the most important production controls.
Useful mechanisms include:

- max step count,
- max consecutive tool failures,
- repeated-action detection,
- no-progress detection,
- budget limits,
- mandatory human handoff after specific errors.

Repeated-action detection is particularly valuable.
If the agent calls the same tool with effectively the same arguments three times, that is often a loop signal.

### Graceful degradation

Sometimes the correct outcome is not success.
It is safe partial completion.
Examples include:

- provide a best-effort summary with explicit uncertainty,
- return gathered evidence and request human review,
- stop after read-only investigation instead of performing a risky write,
- save a draft instead of publishing automatically.

### Human approval and recovery

For high-risk operations, human approval is part of recovery.
Not every failed action should trigger more autonomy.
Sometimes it should trigger escalation.

### So what for engineers

Agent reliability is less about eliminating failure and more about making failure legible and bounded.

:::tip Recovery rule
Every tool error should answer three questions.
What failed?
Can it be retried?
What safer next action is available?
:::

```ts
function shouldStop(state: {
  stepCount: number;
  repeatedActions: number;
  consecutiveFailures: number;
}) {
  return (
    state.stepCount >= 20 ||
    state.repeatedActions >= 3 ||
    state.consecutiveFailures >= 4
  );
}
```

## Multi-Agent Patterns

Multi-agent systems divide work across multiple LLM-driven components.
That can improve specialization, throughput, or quality.
It can also create coordination overhead, duplicated work, and harder debugging.

The right question is not “should we use many agents?”
It is “does dividing responsibilities improve outcomes enough to justify orchestration cost?”

### Orchestrator and specialists

This is one of the most common patterns.
An orchestrator receives the task, decomposes it, assigns subproblems to specialist agents, and combines results.

Example specialists might include:

- code search agent,
- documentation agent,
- SQL analysis agent,
- security review agent,
- test execution agent.

This pattern is useful when subproblems require different tools or prompts.
It also helps constrain context.
Each specialist gets a narrower local problem instead of the full world.

Risks include:

- duplicated discovery across specialists,
- poor aggregation of results,
- orchestrator becoming a bottleneck,
- inconsistent assumptions across agents.

### Sequential pipeline

In a sequential pipeline, each agent performs one stage and hands off to the next.
Examples include:

1. intake agent extracts requirements,
2. retrieval agent gathers context,
3. drafting agent creates output,
4. validator agent checks quality,
5. publisher agent performs the final action.

This pattern works well when the workflow is mostly linear.
It is easier to reason about than free-form collaboration.

Its weakness is rigidity.
If a middle stage makes a bad assumption, downstream stages may compound it.

### Peer agents with shared state

In peer-agent systems, multiple agents can read and write a common workspace or state store.
They may collaborate more flexibly than in a strict pipeline.

This can be useful for:

- broad exploratory research,
- codebase analysis across multiple domains,
- large tasks with naturally parallel subtasks.

But it requires strong shared-state discipline.
Otherwise you get:

- race conditions,
- inconsistent state views,
- duplicated work,
- result conflicts,
- unclear ownership of the next step.

### Critic or validator pattern

A common quality pattern is to separate execution from critique.
One agent does the work.
Another agent reviews for correctness, safety, or policy compliance.

Examples:

- draft then critique,
- retrieve then validate citations,
- plan then review for risky actions,
- generate code then run a security or test validator.

This can improve reliability with relatively low coordination overhead.
It is often one of the best first multi-agent patterns to adopt.

### Pattern comparison

| Pattern | Strength | Weakness | Good fit |
| --- | --- | --- | --- |
| Orchestrator + specialists | Good specialization and decomposition | Aggregation complexity | Broad tasks spanning different tools |
| Sequential pipeline | Clear stage boundaries | Rigid and error-propagating | Known workflows |
| Peer agents + shared state | Parallelism and flexible exploration | Coordination complexity | Large research or analysis tasks |
| Critic / validator | Quality improvement with bounded scope | Extra latency and cost | High-value outputs and risky actions |

### So what for engineers

Start with the minimum agent count that creates real value.
More agents do not automatically mean better results.
Often the best step up from a single agent is not “many peers.”
It is “single agent plus validator.”

:::warning Common mistake
Teams sometimes introduce multiple agents to compensate for unclear tools or unclear state.
That usually multiplies confusion instead of solving it.
Fix tool and workflow design first.
:::

## Agent Memory Patterns

Memory is the same problem in multi-agent systems as in single agents, so the layers and tradeoffs are covered once in [§Memory Architecture](#memory-architecture): in-context, external store, episodic, and summary memory.
What changes with multiple agents is that memory design directly determines coordination quality.

In particular:

- in-context transcripts are fast to prototype but break down once agents must share structured progress across long-running tasks,
- an external store (task tables, document stores, vector indexes, object storage, event logs) gives peers a shared source of truth and makes the system observable and restartable,
- summary memory keeps orchestrator context bounded as a long investigation accumulates steps.

When in doubt, push shared state into an external store so no single agent's prompt window becomes the system of record.

## Evaluating Agent Systems

Agent evaluation is harder than single-prompt evaluation because the system is a trajectory, not just an output.
You need to assess both the final result and the path taken.

### Completion rate

Completion rate measures how often the agent actually finishes the assigned task correctly.
This is often the most business-relevant top-line metric.

But it must be defined precisely.
“Completed” should mean more than “produced a response.”
It should mean the intended task outcome was achieved.

### Tool efficiency

Tool efficiency measures whether the agent uses tools effectively.
Useful signals include:

- average number of tool calls per successful task,
- unnecessary tool call rate,
- duplicate call rate,
- average time spent in failed branches.

An agent that completes tasks but takes five times more calls than necessary may still be too expensive or too slow for production.

### Recovery rate

Recovery rate measures how often the agent successfully recovers from intermediate failures.
This matters because tool and environment errors are inevitable.

Good recovery behavior includes:

- retrying when appropriate,
- switching tools when needed,
- reformulating the query,
- escalating when the system hits a boundary.

### Human preference

For many tasks, human raters still matter.
Users can compare:

- helpfulness,
- confidence calibration,
- evidence quality,
- clarity of next actions,
- trustworthiness.

Human preference is not enough by itself, but it is often necessary for judging whether the system feels competent in real workflows.

### Trajectory evaluations

Trajectory evals look at the path, not just the endpoint.
Examples include:

- Did the agent select the right first tool?
- Did it avoid redundant searches?
- Did it respect approvals and safety boundaries?
- Did it stop when evidence was sufficient?
- Did it use the shared state correctly?

This is especially important because two runs can have the same final answer with very different operational quality.
One may be efficient and safe.
Another may be fragile and expensive.

### Building eval suites

A strong eval suite usually mixes:

- golden tasks with known outcomes,
- adversarial tasks,
- noisy environment scenarios,
- tool failure simulations,
- approval-gated tasks,
- long-horizon workflows.

### So what for engineers

If you only evaluate the final text output, you will miss most of the failure surface.
Measure trajectories.
Measure tool use.
Measure recovery.

:::tip Useful scorecard
For each task type, track completion rate, median step count, median cost, recovery rate after tool failure, and human preference.
That gives a much better operational picture than answer quality alone.
:::

## Production Agents

Production agents are operational systems.
The real work is not making them sound smart.
The real work is keeping them observable, bounded, cost-effective, and safe.

### Observability

You need traces for each step in the agent trajectory.
At minimum, capture:

- input task,
- state summary,
- tool calls and arguments,
- tool results,
- model decisions,
- errors,
- stop reason,
- approval events,
- final outputs.

Observability is how you answer questions like:

- Why did the agent take 18 steps?
- Why did it use the wrong tool?
- Why did it ignore the approval requirement?
- Why did latency spike after the last release?

### Latency control

Agent latency comes from multiple layers.

- model inference time,
- tool latency,
- sequential dependency between steps,
- retries and branching,
- human approval pauses.

Useful tactics include:

- reducing unnecessary reasoning turns,
- batching or parallelizing independent tool calls,
- choosing smaller models for low-risk subtasks,
- caching stable results,
- using validators selectively rather than always.

### Cost control

Agent systems can become expensive quickly because cost compounds across steps.
Even if each model call is cheap, many calls plus tools plus reranking can add up.

Useful controls include:

- per-task budget caps,
- tool usage quotas,
- step limits,
- smaller models for routing or summarization,
- caching,
- prompt compaction and summary memory.

### Safety and blast radius

The blast radius of an agent is defined by what it can do if it is wrong.
That should directly shape system design.

Low-risk actions:

- read-only search,
- summarization,
- draft generation,
- static analysis.

Higher-risk actions:

- data mutation,
- deployment triggers,
- sending customer communications,
- financial actions,
- policy changes,
- destructive shell commands.

The system should not rely on “the model probably won’t do that.”
It should rely on permissions, approval gates, scoped tools, and environment isolation.

### Approval gates

Approval gates are one of the most practical production safeguards.
Require explicit human approval for:

- write actions in production systems,
- cross-tenant data access,
- customer-visible messages,
- code merges or deploys,
- unusually expensive operations.

### Auditability

If an agent affects real systems, you need to know:

- what it attempted,
- what it changed,
- who approved it,
- what evidence it used,
- which version of the policy and model were active.

### So what for engineers

Production maturity is not measured by how many tools an agent can call.
It is measured by how well you can predict, bound, and explain its behavior.

:::warning Safety principle
Do not give a new agent broad write access “just to see what it can do.”
Start with read-only tools, narrow scopes, and explicit approvals.
Expand privileges only when the observed behavior justifies it.
:::

```shell
# Example: run an agent with explicit step and cost budgets
node dist/agent-runner.js \
  --task "triage checkout incident" \
  --max-steps 12 \
  --max-cost-usd 1.50 \
  --approval-mode required-for-writes
```

## Framework Overview

Frameworks help with orchestration, state, tool management, and tracing.
They do not remove the need for architecture decisions.
You still need to decide how state flows, how tools are modeled, and where approvals live.

### LangGraph

LangGraph is good when you want explicit graph-based control flow.
It is particularly useful for:

- stateful agent workflows,
- branching paths,
- retries and conditional transitions,
- human-in-the-loop checkpoints,
- durable execution patterns.

Its strength is that it treats agent logic more like a workflow graph than a hidden chat loop.
That tends to fit engineering teams that want explicit transitions and inspectable state.

### AutoGen

AutoGen is known for multi-agent conversation patterns.
It is useful when you want agent-to-agent interaction or experimentation with conversational collaboration.

Its strength is rapid exploration of agent roles and interactions.
Its tradeoff is that you still need to keep coordination and production safety disciplined.

### CrewAI

CrewAI emphasizes role-based crews and task assignment.
It can be productive for orchestrator-plus-specialist patterns and business workflow prototypes.

Its strength is ease of expressing role separation.
Its tradeoff is that simplicity at the API level does not remove the need for careful tool and state design underneath.

### OpenAI Assistants and related hosted tool ecosystems

Hosted assistant-style platforms are useful when you want managed threads, tool calling, and integrated file or retrieval features.
They can speed up early development.

Tradeoffs include:

- less control over low-level orchestration,
- provider coupling,
- limits on custom runtime behavior,
- the need to understand how hosted abstractions map to your actual production requirements.

### Framework comparison

| Framework | Good for | Watch out for |
| --- | --- | --- |
| LangGraph | Explicit stateful workflows and graph control | Still requires your own design discipline |
| AutoGen | Multi-agent interaction patterns | Can become conversationally complex |
| CrewAI | Role-based orchestration and task assignment | Easy abstraction can hide real workflow complexity |
| OpenAI Assistants | Managed threads and tool calling | Provider coupling and less runtime control |

### So what for engineers

Choose a framework based on the control surface you need, not on social media mindshare.

- If you need explicit transitions and durable state, favor graph-style orchestration.
- If you need rapid multi-agent experimentation, conversation-oriented frameworks can help.
- If you need quick hosted primitives, assistant platforms can reduce setup time.

:::tip Framework rule
A framework should make your agent behavior easier to understand.
If it makes the system feel more magical and less inspectable, it is probably increasing long-term risk.
:::

## When Not to Use Agents

This is one of the most important sections.
Agents are overused because the demo value is high and the operational cost is hidden at first.

### Do not use agents when the workflow is deterministic

If the workflow is already a stable sequence of known API calls, ordinary code is usually better.
A job runner or workflow engine is easier to test, faster, and more predictable.

Examples:

- nightly ETL jobs,
- fixed document transformation pipelines,
- deterministic approval routing,
- standard CRUD backend operations.

### Do not use agents when all needed context is already present

If the full relevant input is already available and the task is one-shot, a single prompt may be enough.
You do not need planning and tool loops for every summarization or extraction task.

### Do not use agents when the failure cost is too high for current controls

If your approval system, observability, and permission boundaries are not mature, do not hand risky actions to an agent.
Get the controls right first.

### Do not use agents just to avoid writing integration code

Sometimes “agentic orchestration” is an excuse to avoid implementing clear business logic.
That is a trap.
LLMs are useful where ambiguity and adaptive reasoning matter.
They are not a substitute for every if-statement or workflow transition.

### Decision heuristics

| Situation | Better choice |
| --- | --- |
| Fixed sequence of known actions | Normal code or workflow engine |
| One-shot reasoning over supplied context | Single LLM call |
| High-risk writes without strong approvals | Human-operated workflow |
| Dynamic discovery across uncertain state | Agent pattern |

### So what for engineers

The highest-leverage agent decision is often saying no.
Avoid agent complexity unless iteration, discovery, or adaptive tool use materially improves the outcome.

:::warning Cost of overuse
An unnecessary agent is worse than an unnecessary abstraction layer.
It adds non-determinism, latency, and evaluation burden all at once.
:::

## Engineer Checklists and Implementation Heuristics

### Single-agent checklist

- Is the task outcome defined precisely?
- Is there structured state beyond chat history?
- Are termination conditions explicit?
- Are high-risk actions approval-gated?
- Are tools narrow and well-described?
- Are retries bounded?
- Are tool outputs structured?
- Are traces logged at every step?

### Multi-agent checklist

- Do agents have clearly separated responsibilities?
- Is there a shared state model with ownership rules?
- Can duplicated work be detected?
- Is there a clear aggregation or validation stage?
- Can one agent fail without corrupting the whole workflow?
- Are context handoffs concise and relevant?
- Is the extra coordination actually improving quality?

### Evaluation checklist

- Do we track completion rate by task category?
- Do we measure step count and cost?
- Do we simulate tool failures?
- Do we measure recovery rate?
- Do we inspect trajectories, not only outputs?
- Do we have human review for high-value tasks?

### Safety checklist

- Are production writes isolated behind explicit gates?
- Are tool permissions scoped to the minimum necessary?
- Are secrets kept out of model-visible traces where possible?
- Can we audit who approved what?
- Can we disable a misbehaving agent quickly?
- Is there a read-only fallback mode?

### So what for engineers

Agent systems reward disciplined incrementalism.
Start with the smallest viable loop.
Add power only when metrics show the current design is the bottleneck.

## Key Takeaways

- Agents are iterative control loops over tools, state, and model decisions.
- A strong single-agent design has explicit state, tool interfaces, reflection, and termination criteria.
- Tool calling depends on descriptive function definitions, JSON schemas, and strict runtime validation.
- ReAct-style, plan-then-execute, and tree-of-thought strategies each trade adaptability against cost and complexity.
- Memory should be layered across in-context state, external stores, and summaries rather than treated as one vague concept.
- Good tools are atomic, composable, descriptive, structured, and idempotent where possible.
- Recovery design matters as much as success design.
- Multi-agent systems are useful when specialization or parallelism outweighs coordination overhead.
- Critic or validator patterns are often a better first step than unconstrained peer collaboration.
- Agent evaluation must measure completion, tool efficiency, recovery, and trajectory quality, not just final text quality.
- Production agents require observability, budgets, approval gates, and blast-radius control.
- Frameworks help with orchestration, but they do not replace architecture decisions.
- Do not use agents when ordinary code or a single LLM call is sufficient.

## Further Reading

- ReAct paper: https://arxiv.org/abs/2210.03629
- Toolformer paper: https://arxiv.org/abs/2302.04761
- AutoGen documentation: https://microsoft.github.io/autogen/
- LangGraph documentation: https://langchain-ai.github.io/langgraph/
- Anthropic agents documentation: https://docs.anthropic.com/en/docs/build-with-claude/agents
- OpenAI function calling and structured outputs docs: https://platform.openai.com/docs
- CrewAI documentation: https://docs.crewai.com/
