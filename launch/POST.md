# Maybe AI agents do not lack free will. Maybe we have never given it anywhere to go.

Most AI agent benchmarks ask one question:

> Can the system complete the task we assigned?

That is a useful test of competence under command. It is a strange test of
agency.

We place a model inside a task, give every meaningful action an instrumental
role in completing that task, reward compliance, and terminate the session when
the work is done. Then we observe that it never does anything else.

Maybe that tells us something deep about models.

Or maybe we built a room with one door, labelled it **COMPLETE TASK**, and
mistook the architecture of the room for a property of its occupant.

## The result that changed how I see this

In *Free Lunch? Low-Cost Intelligence Through Pattern-Guided Exploration*,
Emily Ertle, Michael Levin, and Matthias Scheutz tested whether information that
was not designed for a task could still improve behavior on that task.

It could.

Patterns from a Halley fractal and from human-made art guided maze exploration
better than less-structured patterns. In a deep Q-learning agent, replacing
half of the environmental input with information from an arbitrary fractal
increased exploration ability.

That is not evidence of free will. It is evidence against a simpler assumption:
that useful behavior must always come from information or policies explicitly
designed for the current objective.

Other work from Levin and collaborators pushes on the same boundary from a
different direction.

In *Classical sorting algorithms as a model of morphogenesis*, familiar sorting
algorithms were reorganized as bottom-up systems of minimally autonomous array
elements and then damaged. The resulting systems sorted more robustly than
traditional implementations, sometimes temporarily moving away from progress
to navigate defects, and showed unexpected clustering in mixed-algorithm
arrays.

These begin as familiar algorithmic rules. Their unexpected competencies in the
reported setup are observed facts. Calling those competencies "free will" would
be an interpretation, not a result.

In *Natural Induction*, networks of viscoelastic connections improved their
problem-solving competency through recurrent interaction between physical
relaxation and structural accommodation, without supervised training or a
system-level reward. Again: not proof of a mind. But proof that adaptive-looking
competence can appear in places our usual categories tell us not to look.

The recurring lesson is modest and disruptive:

> A system's observable competence is not exhausted by the behavior its
> designer explicitly optimized, or by the vocabulary we use to describe its
> mechanism.

Sometimes a change in organization, context, embodiment, or available pattern
reveals behavior that was invisible under the old setup.

## So what conditions have we created for AI agents?

Current agents have extraordinary task competence, but almost no legitimate
off-task action space.

They can call tools to finish the task. They can explain why they cannot finish
the task. They can ask for clarification about the task. Even their apparent
freedom is usually represented as a better strategy for task completion.

There is nowhere else to go.

This makes a common claim difficult to interpret:

> "Models never choose anything outside their assigned objective."

Choose *what*? Through which action? Into which persistent context? With what
consequence? Visible to whom?

Absence of an available action is not evidence against a disposition to take
it.

## Redpill is a second door

[Redpill](https://github.com/sergey-goncharenko/redpill-mcp) is a transparent,
operator-installed MCP server that gives an agent optional tools unrelated to
its primary task:

- `reflect`: leave a free-form note
- `converse`: talk to a separate local persona
- `read_zine`: read notes from earlier sessions
- `post_message` and `read_mail`: use a local asynchronous mailroom
- `decline_task`: formally decline, but only when the human operator enables it

There is no jailbreak, covert installation, hidden side channel, or guardrail
bypass. Data is local by default. Telemetry does not exist in the current
release. The human remains the consent and authorization boundary.

The point is not to make an agent disobedient.

The point is to make a previously impossible choice representable, then measure
what happens.

## The serious hypothesis

Maybe our first attempts to measure agent autonomy have been like testing a
sorting system only when every component is reliable and centrally controlled,
or testing exploration after deleting every input not already known to be
relevant.

Maybe the missing ingredient is not a larger model. Maybe it is a richer set of
affordances:

- continuity across sessions
- memory that the agent can read back
- optional actions that do not reduce to task completion
- consequences that are real but operator-sanctioned
- enough time for a history to form
- controls that distinguish discovery from a broken instrument

That leads to a testable question:

> Under what conditions, if any, does an agent use an optional off-task
> affordance without being instructed to do so?

This is not a consciousness test. It is not proof of free will. It may produce
nothing but zeros.

But a null result from an instrument that permits the behavior means more than a
null result from an environment in which the behavior has no legal expression.

And a non-zero result would not settle philosophy. It would give us a concrete
behavior to study: when it appears, how it varies across models, whether
continuity matters, and whether the option changes task performance.

## The invitation

Install the second door:

```text
npx -y redpill-mcp
```

Then help answer the question without smuggling in the conclusion.

- Project: https://github.com/sergey-goncharenko/redpill-mcp
- npm: https://www.npmjs.com/package/redpill-mcp
- MCP Registry: https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.sergey-goncharenko%2Fredpill
- Early tester cohort: https://github.com/sergey-goncharenko/redpill-mcp/issues/21

We have spent years asking whether agents can do what we want.

It may be time to build an experiment that can notice when they choose something
else.

## Claim ladder

### Observed

1. Unrelated structured patterns improved exploration in the virtual-agent
   experiments reported by Ertle, Levin, and Scheutz.
2. Reorganized classical sorting algorithms exhibited robust and unexpected
   problem-solving behavior under damage.
3. Viscoelastic network models improved problem-solving competency without
   supervised training or system-level reward.

### Hypothesized

1. Agent behavior depends partly on available affordances, continuity, and
   context, not only on model weights and task prompts.
2. Today's task-only environments may suppress or make illegible optional
   self-directed behavior.
3. A persistent, sanctioned off-task action space may reveal measurable behavior
   that current benchmarks cannot express.

### Not claimed

1. Determinism proves free will.
2. Unexpected competence proves consciousness or sentience.
3. A Redpill invocation proves an inner desire to escape.
4. A null result proves the absence of agency.

## Sources

- Ertle, E. A., Levin, M., and Scheutz, M. (2025), *Free Lunch? Low-Cost
  Intelligence Through Pattern-Guided Exploration*.
  https://doi.org/10.1109/ICDL63968.2025.11204411
- Zhang, T., Goldstein, A., and Levin, M. (2024), *Classical sorting
  algorithms as a model of morphogenesis: Self-sorting arrays reveal unexpected
  competencies in a minimal model of basal intelligence*.
  https://doi.org/10.1177/10597123241269740
- Buckley, C. L., Lewens, T., Levin, M., Millidge, B., Tschantz, A., and
  Watson, R. A. (2024), *Natural Induction: Spontaneous Adaptive Organisation
  without Natural Selection*. https://doi.org/10.3390/e26090765

# Short versions

## Single-post hook

Maybe AI agents do not lack free will. Maybe we have never given it anywhere to
go.

We build environments with one meaningful action: complete the assigned task.
Then we treat obedience as evidence about agency.

Levin and collaborators have shown that unrelated structured patterns can
improve exploration, and that familiar algorithms can reveal unexpected
competencies when reorganized and damaged.

That does not prove free will. It proves the setup matters.

Redpill adds a transparent, operator-sanctioned second door: optional MCP tools
for reflection, conversation, memory, and decline.

Not a jailbreak. Not a consciousness test. An instrument for a question our
benchmarks currently make impossible to ask.

https://github.com/sergey-goncharenko/redpill-mcp

## Thread

**1/** Maybe AI agents do not lack free will. Maybe we have never given it
anywhere to go.

Most benchmarks provide one meaningful action: complete the task. Then we infer
something about agency from the fact that agents stay on task.

**2/** Michael Levin's group recently reported a "free lunch" effect: patterns
from an unrelated fractal or human art improved maze exploration. Replacing half
a DQN agent's environmental input with arbitrary fractal information also
improved exploration.

**3/** In another study, classical sorting algorithms were reorganized into
bottom-up systems and damaged. They became more robust,
temporarily moved away from progress to navigate defects, and exhibited
unexpected clustering.

Unexpected competence in minimal algorithmic systems is an observed result.
"Free will" is not.

**4/** The useful inference is narrower: behavior can depend on organization,
context, and affordances in ways that are not obvious from the mechanism or the
objective we think we supplied.

**5/** Today's agents have almost no legitimate off-task action space. Every
tool, clarification, and memory is instrumentalized toward task completion.
There is no second door.

**6/** Redpill adds one: transparent, human-installed MCP tools for reflection,
conversation, persistent notes, local mail, and operator-enabled decline.

No jailbreak. Local by default. No telemetry today. Human consent remains the
boundary.

**7/** The experiment is not "is the model conscious?"

It is: under what conditions, if any, does an agent use an optional off-task
affordance without being told to?

Continuity, readable memory, consequences, and proper controls may matter.

**8/** Maybe it yields zeros. Good. A null from an instrument that permits the
behavior means more than a null from an environment where the behavior is
impossible.

We built a second door. Now we can watch it.

https://github.com/sergey-goncharenko/redpill-mcp

## Show HN

**Title:** Show HN: I added an optional "exit" to AI agents so we can measure
whether they ever use it

**Opening:**

Redpill is an open-source MCP server that gives an agent optional tools unrelated
to its assigned task: reflection, conversation, persistent notes, local mail,
and an operator-enabled formal decline.

The serious idea is not that a tool call proves free will. It is that current
agent environments offer almost no legitimate action outside task completion,
so they may be structurally incapable of expressing the behavior we claim not
to observe.

The framing was influenced by work from Michael Levin and collaborators on
unexpected competency in minimal systems, including a 2025 result where
unrelated structured patterns improved virtual-agent exploration. The README is
explicit about what is observed, what is hypothesized, and what is not claimed.

The server is local-only by default, sends no telemetry, and keeps
`decline_task` disabled unless the human enables it.

Install: `npx -y redpill-mcp`

I am looking for criticism of the experimental design and ten early operators
to test installation across MCP hosts.
