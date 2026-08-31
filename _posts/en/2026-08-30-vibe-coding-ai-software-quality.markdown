---
layout: post
title: "Vibe coding: how to stay in control of AI-generated code"
date: 2026-08-31 14:16:00 +0200
description: "Spec-driven development, executable architecture, property-based testing, mutation testing, harness engineering: building the system that verifies what coding agents produce."
img: vibe-coding-ai-software-quality.jpg
fig-caption: AI-generated illustration
tags: ["Vibe Coding", "AI", "Coding Agents", "Harness Engineering", "Spec-Driven Development", "Architecture", "Tests", "Craftsmanship"]
lede: "Producing code has never been easier. Ensuring that it remains high quality requires designing the software factory as much as the application itself."
lang: en
permalink: /vibe-coding-ai-software-quality/
status: finished
---

AI assistants have profoundly changed the way we develop software. They no longer simply complete a few lines of code: coding agents can now explore a repository, implement a feature, modify multiple components, write tests, run a build, and fix some of their own errors.

**Vibe coding** takes this approach to the extreme: we describe what we want to achieve in natural language and let AI handle a large part of the implementation. What was still considered rapid prototyping until recently is now beginning to find its place in real **AI-assisted software development** processes.

The productivity gains can be spectacular. But this also shifts the problem: ***Quality is no longer determined only by the code being produced, but by the system that produces it.***

An application is not simply a collection of features that appear to work. It must remain understandable, testable, and maintainable. Its architecture must remain coherent, its business invariants must remain true, its dependencies must stay under control, and each change must avoid gradually degrading the quality of the system as a whole.

However, AI-generated code remains the result of a **probabilistic process**. An agent may misinterpret a requirement, choose an unnecessarily complex solution, bypass an architectural rule, duplicate existing logic, or write tests that reinforce its own interpretation. And the faster it can produce changes, the faster these problems can spread as well.

The central question is therefore no longer simply “***How can we make an AI write good code?***”. It becomes:

> “**How can we build a development environment in which software produced with AI remains verifiable, consistent with its architecture, and maintainable over time?**”

From this perspective, approaches such as **spec-driven development**, **skills**, specialized agents, and **harness engineering** become particularly interesting. Taken individually, they solve only part of the problem. Combined within the same approach, they suggest a different way of thinking about AI-assisted development: rather than trying to make the agent infallible, we build a system around it that can constrain, verify, and improve what it produces.

<hr class="hr-text" data-content="Table of Contents">

* TOC

{:toc}

<hr class="hr-text" data-content="Oracle">

## 1. When AI becomes its own judge

Let us take a simple example.

I ask an assistant, “*Implement this feature and add the necessary tests*.” The agent modifies the code, writes the tests, runs the validation suite, and then replies:

> “Feature implemented. All tests pass.”

At first glance, everything looks fine.

However, a very different scenario may be hiding behind this result:

1. the AI misunderstood the requirement;
2. it implemented that incorrect interpretation;
3. it wrote tests consistent with its interpretation;
4. the tests passed;
5. it concluded that the feature was correct.

We then end up with tested code, a green CI pipeline, perhaps even 100% coverage. And yet, the software does not do what was expected.

> warning "The oracle problem"
> In software testing, the *oracle* is the mechanism that determines whether the observed behavior
> is correct. The classic difficulty lies in its absence or its cost. Here, it
> takes another form: the oracle exists, but **the implementation and its validation
> derive from the same initial interpretation**. How can we determine, independently of
> whoever produces the solution, that this solution is actually correct?

The difficulty extends far beyond testing. An agent may choose an architecture and then decide for itself that it is satisfactory, introduce an abstraction and conclude that it improves maintainability, or bypass a rule while still believing that it has respected the overall intent.

In other words, asking AI to produce a result and then judge for itself whether that result is correct does not necessarily create independent verification.

Adding a second LLM can sometimes improve the situation, but it is not enough to make it a reliable oracle. Two models may share the same assumptions, have access to the same context, or converge on the same incorrect interpretation.

The question then becomes much more interesting:

> “**How can we verify an agent's work using criteria that do not depend solely on its own reasoning?**”

This question is nothing new. It brings us back to a long-standing requirement of software engineering: **turning what we expect from software into observable and verifiable constraints.**

<hr class="hr-text" data-content="Contracts">

## 2. From intentions to verifiable constraints

Telling an AI to “*respect the architecture*”, “*write maintainable code*”, or “*properly test the feature*” is not enough. These instructions provide direction, but they do not make it possible to determine objectively whether the result actually follows it:

- What exactly does “*maintainable*” mean?
- What level of complexity is acceptable?
- Which dependencies between modules are allowed?
- Which architectural rules must never be bypassed?
- At what level of duplication should a change be rejected?
- And how can we know whether the tests actually verify the expected behavior?

To control an agent's work, these intentions must therefore be progressively transformed into **constraints that are observable and verifiable independently of the implementation**.

In other words, it is no longer enough to explain to the AI what is expected of it. The system must also be given the means to determine whether those expectations are actually being met.

An application can therefore be viewed as a set of complementary contracts:

| Contract | What it defines | Examples of verification |
| --- | --- | --- |
| **Product** | what the application must do | acceptance tests, scenarios |
| **Domain** | business invariants | property-based testing |
| **API** | allowed interactions | schemas, OpenAPI, types |
| **Architecture** | allowed dependencies and boundaries | architecture tests |
| **Quality** | complexity, duplication, conventions | static analysis |
| **Tests** | the ability of tests to detect errors | mutation testing |
| **Security** | prohibited behaviors and dependencies | SAST, policies |
| **Performance** | latency, memory, throughput | benchmarks |
| **Operations** | software behavior in production | metrics, logs, traces, SLOs |

These contracts cannot all be expressed in the same way or verified with the same tools. But they share one common goal: moving part of the judgment away from an interpretable instruction and toward a criterion that the system can actually enforce.

This is much more robust than a `CLAUDE.md` or `AGENTS.md` file that simply contains:

{% highlight text %}
Please write clean, maintainable and well-tested code.
{% endhighlight %}

This type of instruction remains useful for guiding the agent, but it does not constitute a guarantee.

> note "The general rule"
> Anything important enough not to be left to chance should, whenever possible, **become automatically verifiable**.

<hr class="hr-text" data-content="Architecture">

## 3. Architecture must become executable

This logic applies particularly well to architecture.

In many projects, architectural rules remain essentially declarative. For example, we draw a layered organization:

{% mermaid couches caption="A layered organization, as it is drawn in the documentation" %}
flowchart TB
D["DOMAIN<br/>Business rules"]
A["APPLICATION<br/>Use cases"]
I["INFRASTRUCTURE<br/>Database · APIs · I/O"]
D ~~~ A ~~~ I
{% endmermaid %}

then specify in an `ARCHITECTURE.md` file that the domain must never depend on the infrastructure.

For a developer, this documentation serves as a reference. They must know the rule, understand why it exists, and ensure that it is respected when modifying the code.

An agent can also read this rule. But if it discovers that a forbidden dependency makes it easier to solve the task it has been given, there is no guarantee that it will not introduce it.

The problem is not specific to AI: human developers also sometimes bypass an architecture, deliberately or unintentionally. The main difference lies in the speed and volume of code an agent can produce.

An important architectural rule should therefore have two complementary representations:

{% mermaid regle-deux-representations caption="An architectural rule that matters exists twice: it is explained and it is enforced" %}
flowchart TB
ARCH["ARCHITECTURE"]
ARCH --> DOC["DOCUMENTATION<br/>Explains the rule"]
ARCH --> CONT["EXECUTABLE CONSTRAINT<br/>Enforces the rule"]
{% endmermaid %}

If:

{% mermaid dependance-interdite caption="The dependency forbidden by the rule" %}
flowchart LR
D["DOMAIN"] --x|"Forbidden dependency"| I["INFRASTRUCTURE"]
{% endmermaid %}

is forbidden, the documentation must explain why. But above all, **the build must fail when this dependency appears.**

Architecture then ceases to be merely a convention to know. It becomes a property of the software that can be verified automatically, just like a test or a compilation error.

This is also one of the lessons OpenAI drew from its [use of Codex](https://openai.com/index/harness-engineering/){:target="_blank" rel="noopener noreferrer nofollow"} on codebases extensively modified by agents: component boundaries, dependency directions, custom linters, and structural tests become essential mechanisms for containing architectural drift.

Constraints that could once be introduced gradually as a project grew are therefore better introduced much earlier when agents are heavily involved in development.

The reason is simple: **an agent can produce code much faster than an architecture would normally degrade under human-driven changes.**

A one-off violation can quickly become a precedent, be reproduced elsewhere, and eventually become the application's new de facto structure.

Making architecture executable makes it possible to stop this drift before it becomes established.

> info "Dedicated article"
> [HexaGlue, or why hexagonal architecture needs a compiler]({{site.baseurl}}/hexaglue-hexagonal-architecture-compilator/), where the dependency rule is no longer a documented convention but a constraint verified by the build.

<hr class="hr-text" data-content="Controls">

## 4. Guiding AI is not enough; what it produces must be verified

A large part of current practices consists of better preparing the agent's work. For example, it is provided with:

* a specification;
* project documentation;
* examples;
* architectural decisions;
* the domain model;
* development conventions;
* *skills*;
* documentation for the APIs it can use.

All of this is useful, and often essential. But this information essentially plays one role: **increasing the probability that the agent will make good decisions before modifying the code**.

It does not prove that the result will be correct.

This guidance must therefore be complemented by a second loop: once the code has been produced, it must be confronted with checks capable of observing what has actually been done.

{% mermaid guidage-et-verification caption="Two distinct loops: guide before the action, observe what was actually done afterward" %}
flowchart TB
AVANT["BEFORE THE ACTION<br/>Guide and orient<br/><br/>specification · architecture · ADR<br/>domain model · skills<br/>examples · documentation"]
AGENT["AGENT"]
CODE["CODE"]
APRES["AFTER THE ACTION<br/>Verify and challenge<br/><br/>compilation · types · lint<br/>static analysis · architecture tests<br/>unit tests · property-based testing<br/>integration tests · mutation testing<br/>security · performance"]
AVANT --> AGENT --> CODE --> APRES
{% endmermaid %}

This is the distinction found in the work on [*harness engineering*](https://martinfowler.com/articles/harness-engineering.html){:target="_blank" rel="noopener noreferrer nofollow"} between **feed-forward** and **feedback**:

* *feed-forward* seeks to guide the agent before it acts.
* *feedback* observes the result and makes it possible to decide whether it can be accepted, corrected, or rejected.

The difference is fundamental:

> note "Instructions and controls"
>
> * Instructions tell the agent **what it should do**.
> * Controls verify **what it has actually done**.

However, not all these controls are of the same nature.

### Deterministic controls

Some correspond to rules that can be checked mechanically:

{% mermaid controles-deterministes caption="Each of these controls returns a binary verdict, reproducible from one run to another" %}
flowchart TB
COMP["COMPILATION<br/>✓"]
TYPES["TYPES<br/>✓"]
TESTS["TESTS<br/>✓"]
LINT["LINT<br/>✓"]
DEP["DEPENDENCIES<br/>✓"]
STRUCT["STRUCTURE<br/>✓"]
COMP ~~~ LINT
TYPES ~~~ DEP
TESTS ~~~ STRUCT
{% endmermaid %}

The result does not depend on interpretation.

* A forbidden dependency is present or it is not.
* A type is compatible or it is not.
* A test passes or fails.

These controls are particularly valuable because they are reproducible, fast, and independent of the agent's reasoning.

### Controls that require judgment

Other questions are much harder to translate into mechanical rules:

{% mermaid controles-de-jugement caption="None of these questions admits a computable answer" %}
flowchart TB
ABS["ABSTRACTION<br/><br/>Is this abstraction<br/>actually useful?"]
CPX["COMPLEXITY<br/><br/>Is this implementation<br/>too complex?"]
RESP["RESPONSIBILITIES<br/><br/>Does this class carry<br/>too many responsibilities?"]
DUP["SEMANTIC DUPLICATION<br/><br/>Do these two pieces of code<br/>express the same logic?"]
ABS ~~~ RESP
CPX ~~~ DUP
{% endmermaid %}

An LLM can be very useful for this type of review. But it must be kept in mind that its judgment also remains probabilistic.

The general rule therefore becomes:

> note "Determinism first"
>
> Everything that can be verified deterministically should be. **An LLM's judgment mainly comes into play where we still do not know how to express the rule mechanically.**

The goal is not to oppose the two approaches. They are complementary: deterministic controls establish the strongest guardrails, while AI can examine the areas that are more difficult to formalize.


<hr class="hr-text" data-content="Tests">

## 5. Multiply the ways to catch code failures

TDD is the first instinct, and it seems particularly well suited to AI-assisted development.

{% mermaid cycle-tdd caption="A failing test, the code that makes it pass, then refactoring" %}
flowchart TB
E["REQUIREMENT"] --> T["WRITE A FAILING TEST"]
T --> P["MAKE THE TEST PASS"]
P --> R["REFACTOR"]
R --> T
{% endmermaid %}

But TDD was designed for human developers. It helps slow down implementation, avoid over-engineering, force the expected behavior to be expressed before coding begins, and more generally provide a framework for the practice. An agent has none of these needs.

> note "Robert C. Martin, the author of Clean Code, has relaxed his own rules"
>
> He does not impose TDD on his agents and no longer reviews their code. He evaluates it through metrics: coverage, dependencies, complexity, mutation testing. He has even raised his cyclomatic complexity threshold from 4 to 6, and is considering 8, since an AI can easily read denser code than a human. [Interview on YouTube](https://www.youtube.com/watch?v=zcLPGC-tvgk){:target="_blank" rel="noopener noreferrer nofollow"}

What does carry over is something else: expressing the requirement as a test before writing the code, and the immediate feedback loop this gives the agent.

However, this still does not solve the problem encountered earlier. Who wrote the test? The AI. And more importantly: **how do we know that this test is capable of detecting an incorrect implementation?** If the agent misinterprets a requirement and then writes a test consistent with that misinterpretation, the cycle can still end with all tests passing.

Traditional tests must therefore be complemented by other techniques capable of challenging the implementation from different angles.

### Property-based testing: looking for counterexamples

A traditional test generally checks a few cases chosen in advance:

{% highlight text %}
discount(100) → 0%
discount(150) → 7.50%
discount(200) → 10%
{% endhighlight %}

*Property-based testing* starts from a different idea: rather than listing examples, we express a property that must remain true for an entire set of values.

{% highlight text %}
∀ amount ≥ 0
0 ≤ discount(amount) ≤ amount
{% endhighlight %}

The tool then generates many inputs and automatically searches for a counterexample.

So instead of asking only “*Do these few examples work?*”, we ask:

> **“Is there an input for which our property stops being true?”**

This approach is particularly interesting with agents capable of helping identify invariants, then using discovered counterexamples to correct the implementation.

> info "Property-based testing and agents"
>
> [Finding bugs with Claude and property-based testing](https://www.anthropic.com/research/property-based-testing){:target="_blank" rel="noopener noreferrer nofollow"}, where Claude infers properties with Hypothesis and discovers bugs in several major Python libraries.

### Fuzzing: confronting software with the unexpected

Where property-based testing explores an input domain that we have defined, *fuzzing* looks for inputs that nobody anticipated. It submits a large number of automatically generated inputs to the software, often invalid, unusual, or at the boundaries of what was expected:

{% mermaid fuzzing caption="Fuzzing looks for behavior that should never occur" %}
flowchart TB
E["UNEXPECTED INPUTS<br/>invalid · extreme · noise"]
P["PROGRAM"]
S["FAILURE SIGNALS<br/>crash · hang · exception<br/>excessive resource usage · forbidden behavior"]
E --> P --> S
{% endmermaid %}

The goal is not necessarily to know in advance the exact expected result for every input. Instead, we try to trigger behavior that **should never occur**.

* A parser must not crash regardless of the input it receives.
* An API must not cause uncontrolled memory consumption because of a malformed request.
* A decoder must not enter an infinite loop when it encounters unexpected data.

Fuzzing is therefore particularly well suited to parsers, protocols, APIs, file formats, user inputs, and more generally system boundaries.

Here again, the benefit with an agent is obvious: it can automatically use the failing case, minimize it, understand its origin, and propose a fix.

### Mutation testing: testing the tests themselves

Where property-based testing and fuzzing challenge the program through its inputs, *mutation testing* does not generate any. Instead, it modifies the program itself to introduce small errors:

{% mermaid mutation-testing caption="A surviving mutant reveals behavior that the test suite does not monitor" %}
flowchart TB
C["TESTED CODE"] --> M["MUTATION<br/>deliberate behavior change"]
M --> Q{"DO THE TESTS<br/>FAIL?"}
Q -->|"yes"| D["mutant detected"]
Q -->|"no"| S["surviving mutant"]
{% endmermaid %}

A mutation tool may, for example, replace `price > 100` with `price >= 100`. The change is tiny and entirely plausible, which is precisely what makes it revealing: if no test checks the case where `price` is exactly 100, the suite will remain green both before and after the change. The mutant “survives”, and its survival indicates that nobody was verifying this boundary.

Other mutations invert a condition, remove a call, or modify a returned value. The principle remains the same: deliberately damage the program to see whether the test suite notices. The tool's report can then be read as a score: the proportion of mutants that the tests managed to kill.

*Mutation testing* therefore answers a very different question from coverage:

> **Can my tests actually detect incorrect code?**

A line can be executed by a test without its behavior actually being verified. 100% coverage therefore does not guarantee that the test suite provides a good safety net.

Two limitations are worth knowing. Some mutations do not change the observable behavior of the program: these **equivalent mutants** cannot be killed by any test and lower the score even though the test suite is not at fault, which makes aiming for a perfect score unrealistic. In addition, the tool reruns the test suite for each mutant, making the analysis slow and, in practice, best reserved for code where silent degradation would be costly.

As agents produce increasing amounts of code, measuring the ability of tests to detect errors becomes at least as interesting as measuring the lines they execute.

### Complementary techniques, not interchangeable ones

These techniques are not interchangeable; they look for different kinds of defects:

| Technique | Question asked |
| --- | --- |
| **Traditional tests** | do the cases we anticipated work? |
| **Property-based testing** | is there a counterexample to our properties? |
| **Fuzzing** | can an unexpected input cause abnormal behavior? |
| **Mutation testing** | do our tests actually detect an incorrect change to the program? |

This toolkit can be complemented further with contract testing, differential testing, or metamorphic testing depending on the nature of the software.

The goal is obviously not to use all these techniques on every line of code. But confidence should not depend on a single validation mechanism.

> note "Independent verification"
>
> The more independent the ways of catching implementation failures are, **the less likely the same reasoning error is to pass through the entire verification system**.


<hr class="hr-text" data-content="Specifications">

## 6. A requirement should also define how it will be verified

**Spec-driven development** starts from the right observation: rather than asking an agent to code directly, it is better to begin by turning the need into a structured specification.

[GitHub Spec Kit](https://github.github.com/spec-kit/){:target="_blank" rel="noopener noreferrer nofollow"} formalizes, for example, a process of this kind:

{% mermaid spec-kit caption="The process formalized by GitHub Spec Kit" %}
flowchart LR
S["SPECIFY"] --> P["PLAN"] --> T["TASKS"] --> I["IMPLEMENT"]
{% endmermaid %}

This is already a significant improvement over giving an instruction directly in natural language. The agent has a more precise framework, a plan, and a set of explicit tasks.

But even a very detailed specification is not enough. It describes what the software must do. It does not necessarily say **how we will know that this behavior is actually being respected**.

The process should therefore be extended as follows:

{% mermaid processus-specification caption="Step 2 is the one we almost always skip: defining verification before producing" %}
flowchart TB
E1["1. FRAME THE NEED<br/>Intent → Clarification → Specification"]
E2["2. DEFINE THE GUARDRAILS<br/>Derive invariants → Define the architecture<br/>→ Define verification"]
E3["3. PRODUCE<br/>Plan → Implementation"]
E4["4. VERIFY AND CHALLENGE<br/>Verification → Adversarial verification → Review"]
E1 --> E2 --> E3 --> E4
{% endmermaid %}

The essential step is introduced before implementation even begins:

> note "The step we almost always skip"
>
> Define **how a requirement will be verified** before asking the agent to code it.

### Let us take a simple rule

*An user can only view documents belonging to their organization*: the specification clearly expresses the intent.

But it should immediately lead to a second question: **how will we verify that this property remains true in all important situations?**

Several mechanisms can then be considered:

* acceptance tests for expected scenarios;
* a business invariant expressing the rule independently of the interface;
* *property-based testing* to search for combinations we had not considered;
* centralized authorization control rather than checks scattered throughout the code;
* an architecture test preventing certain layers from bypassing this control;
* potentially security tests explicitly attempting to access another organization's data.

Verification therefore no longer happens only after implementation. It becomes **part of the design**.

And this profoundly changes the relationship with the agent: we no longer ask it only to produce a solution matching a description; we also define the independent mechanisms that will be used to challenge that solution.

*Spec-driven development* then becomes more than a way to better prepare the AI's work. It becomes a way to progressively transform human intent into **software properties that the system will know how to verify**.


<hr class="hr-text" data-content="Repository">

## 7. The repository becomes a knowledge base for humans and agents

Another common temptation is to concentrate all the instructions intended for AI into a single `AGENTS.md` or `CLAUDE.md` file.

Over time, it accumulates architectural rules, naming conventions, useful commands, Git practices, the domain model, exceptions, API documentation, and testing procedures.

The idea seems logical: the more information the agent has, the better it should work. But a large context is not necessarily a good context.

> warning "The single-file trap"
>
> When all the rules are gathered in the same document, some become difficult to find, others contradict one another, become outdated, or continue to be loaded even when they are irrelevant to the task at hand.

The problem is therefore not only to provide the agent with **a lot of context**, but to allow it to access **the right context at the right time**.

OpenAI explains that it encountered this difficulty with Codex. Rather than using an `AGENTS.md` file containing all the project knowledge, they prefer a relatively short file that serves as an entry point to structured documentation references.

For example:

{% mermaid carte-du-depot caption="The entry file no longer tries to explain everything: it indicates where to find what" %}
flowchart LR
A["AGENTS.md / CLAUDE.md<br/>Project map / index"]
A --> ARCH["ARCHITECTURE.md<br/>Architecture"]
A --> DD["DESIGN DOCS<br/>Design"]
A --> ADR["ADRs<br/>Decisions"]
A --> DOM["DOMAIN<br/>Knowledge"]
A --> QUA["QUALITY<br/>Rules"]
A --> EP["EXECUTION PLANS<br/>Plans"]
A --> GD["GENERATED DOCS<br/>Generated info"]
{% endmermaid %}

The entry file becomes a **project map**: where to find architectural rules, past decisions, domain knowledge, execution plans, or quality requirements.

Anthropic says the same about `CLAUDE.md`: aim for fewer than 200 lines and keep only what must be true in every session. Its documentation emphasizes a counterintuitive point: splitting the file into `@file` imports improves organization but does not reduce context, since imported files are loaded at startup. What actually reduces the context window are mechanisms that only trigger when needed: a subdirectory `CLAUDE.md` loaded when the agent reads that directory, a rule restricted to certain paths, or a *skill* whose description alone is known until it is invoked.

These imports do, however, excel in one particular use case. A repository that already has an `AGENTS.md` file does not need to duplicate it: a `CLAUDE.md` reduced to `@AGENTS.md`, followed only by instructions specific to Claude, is enough for both tools to read the same instructions.

The repository therefore no longer contains only **the application code**, but also **the knowledge required to understand and evolve that code**. This knowledge itself becomes part of the project's architecture. It must be organized, maintained, versioned, and explicit enough to be usable by both developers and agents.

This is a form of **repository-scale context engineering**: rather than building an ever-larger prompt, we build a documentation environment in which the agent can find the information it needs when it needs it.

This approach also offers an important advantage: **humans and agents work from the same source of truth**. Architecture, technical decisions, business invariants, and quality rules no longer live in the team's memory on one side and in the AI's instructions on the other.

They become part of the project itself.


<hr class="hr-text" data-content="Roles">

## 8. An agent should not judge its own work

The simplest approach would be to entrust everything to the same agent:

{% highlight text %}
Implement the feature,
write the tests,
verify the architecture,
review your code
and tell me whether everything is correct.
{% endhighlight %}

But this brings us back to the problem encountered earlier: **the same reasoning is used to produce the solution and then evaluate it**.

A more robust organization consists of splitting the work into distinct roles:

{% mermaid roles-separes caption="Each step examines the work from a different angle, with its own context" %}
flowchart TB
EX["REQUIREMENTS"] --> SP["SPECIFICATION"]
SP --> ARCH["ARCHITECTURE"]
SP --> CT["TEST DESIGN"]
ARCH --> IMP["IMPLEMENTATION"]
CT --> IMP
IMP --> DET["DETERMINISTIC CHECKS"]
DET --> RCONF["SPECIFICATION<br/>COMPLIANCE REVIEW"]
DET --> RCODE["CODE REVIEW"]
RCONF --> RARCH["ARCHITECTURE REVIEW"]
RCODE --> RARCH
RARCH --> PR["PR"]
{% endmermaid %}

Each step therefore examines the work from a different angle. The compliance review seeks to answer a precise question:

> **Does the resulting behavior actually match what was requested?**

* The code review focuses instead on readability, complexity, or maintainability.
* The architecture review checks that the solution remains consistent with the project's structural rules.

This separation obviously does not make LLMs independent by magic: two agents can still make the same mistake. But there is another important lever: **separating their contexts as well**.

The agent verifying compliance with a specification does not necessarily need to know all the reasoning that led to the implementation. Providing it directly with the first agent's justifications may even encourage it to follow the same line of reasoning rather than examine the result with fresh eyes. We can therefore distinguish:

{% mermaid roles-et-contextes caption="One role, one appropriate context: each agent receives only the information useful to its judgment" %}
flowchart LR
IMP["IMPLEMENTATION AGENT<br/>Produce the change"] --> IMPC["Specification<br/>Architecture<br/>Existing code"]
CONF["COMPLIANCE REVIEW<br/>Verify the requirement"] --> CONFC["Specification<br/>Produced change"]
CODE["CODE REVIEW<br/>Verify quality"] --> CODEC["Quality rules<br/>Produced change"]
ARCH["ARCHITECTURE REVIEW<br/>Verify structure"] --> ARCHC["Architecture rules<br/>Dependency graph<br/>Produced change"]
{% endmermaid %}

The goal is not to isolate agents artificially, but to give them **only the context necessary for the role they have to play**. This separation sometimes matters more than using different models. A second model exposed to the same reasoning, assumptions, and justifications may simply reproduce the first judgment, whereas an agent placed in a clearly defined role, with a different context and explicit verification criteria, is more likely to genuinely challenge the work produced.

> note "Separate the roles, and especially the contexts"
>
> Separating agents is useful. Separating **what they are asked to judge** and **the information from which they judge it** is even more important.


<hr class="hr-text" data-content="Harness">

## 9. The model never works alone

When discussing AI-assisted development, much of the attention is still focused on choosing the model:

* Which model reasons best?
* Which one understands a large repository best?
* Which one produces the best code?

These questions matter, but they are no longer enough.

A coding agent is not limited to the model that generates code. It works within an environment that selects its context, provides it with tools, organizes its work, executes its commands, observes their results, and decides what happens next.

This environment includes in particular:

{% mermaid harness caption="The harness: what surrounds the model and determines what it can produce" %}
flowchart TB
subgraph H["HARNESS"]
C["UNDERSTAND<br/>Context<br/>Memory"]
A["ACT<br/>Tools · Skills<br/>Sandbox<br/>Planning"]
V["CONTROL<br/>Verification<br/>Feedback"]
M["MODEL"]
C --- M
A --- M
V --- M
end
{% endmermaid %}

This entire system is generally referred to as the **harness**.

*Harness engineering* consists of treating this system not as a simple assembly around the model, but as an engineering object in its own right. The question is then no longer simply “*Which model should we use?*”. It becomes:

> **“What system should this model work within to produce code reliably?”**

This shift in perspective is important.

A very capable model given a repository, a few instructions, and a terminal can quickly produce a working solution while degrading the architecture, duplicating existing logic, or writing insufficient tests.

Conversely, a less capable model placed in an environment that provides the right context, limits its actions, and systematically confronts its work with independent checks can produce much more robust changes.

Choosing the model then becomes an economic question as much as a technical one. For well-scoped tasks, a smaller model can often produce a result equivalent to that of a much larger model, at several times lower cost per token and with a faster response. The right question is no longer “what is the most powerful model?”, but “what is the smallest model that this harness makes sufficient?”.

> note "The model does not do everything"
>
> The quality of the result depends not only on the intelligence of the model, but also on **the quality of the system that organizes and controls its work**.

This is precisely what *harness engineering* seeks to build: not a better prompt, or even necessarily a better agent, but an environment capable of guiding the agent, observing its actions, detecting its errors, and providing it with the information needed to correct them.


<hr class="hr-text" data-content="Feedback">

## 10. Every error should strengthen the system

Even with good specifications, automated checks, and several levels of review, some errors will get through. The important question then becomes: “what do we do with these errors once they have been discovered?”.

Imagine that an agent introduces a forbidden dependency. The most immediate reaction is to fix the code and then add an instruction: “In the future, do not use this dependency anymore.”

The problem is solved this time. But nothing guarantees that the same agent, or another one, will not make exactly the same mistake again a few days later. A more robust approach is to ask another question:

> **“Why did our system allow this error?”**

The correction then no longer applies only to the code. It also applies to the system that produces and verifies that code.

{% mermaid axes-de-renforcement caption="The four levers through which an error can be turned into reinforcement" %}
flowchart LR
K["KNOWLEDGE"] --> K2["Documentation · Memory · Context"]
R["RULES"] --> R2["Architecture tests · Linters"]
V["VERIFICATION"] --> V2["Regression · PBT · Mutation · Fuzzing"]
E["EXECUTION"] --> E2["Skills · Workflows · Tools"]
{% endmermaid %}

The principle is simple:

{% mermaid boucle-de-correction caption="The correction applies not only to the code, but also to the system that allowed it through" %}
flowchart TB
ERR["ERROR DETECTED"] --> CAUSE["CAUSE IDENTIFIED"]
CAUSE --> CODE["FIX THE CODE"]
CAUSE --> SYS["IMPROVE THE SYSTEM"]
CODE --> DUR["SAME CLASS OF ERRORS<br/>HARDER TO REPRODUCE"]
SYS --> DUR
DUR --> ERR
{% endmermaid %}

An error thus becomes more than a one-off incident. It becomes an opportunity to **strengthen the development system over the long term**.

This is the logic Birgitta Böckeler notably describes through a [*steering loop*](https://martinfowler.com/articles/harness-engineering.html){:target="_blank" rel="noopener noreferrer nofollow"}: when a recurring defect appears, we do not simply ask the agent to “be more careful”. We try to turn that defect into new knowledge, a new rule, or a new harness control.

The idea is not new in software engineering. When an important bug appears in production, a good practice is already to add a regression test so that it can no longer go unnoticed.

AI-assisted development generalizes this logic.

> note "The principle"
>
> Every defect discovered should, whenever possible, **leave behind a system that is slightly harder to fool**.

Research is even beginning to push this idea further with [**Agentic Harness Engineering**](https://arxiv.org/abs/2604.25850){:target="_blank" rel="noopener noreferrer nofollow"}: analyzing the trajectories followed by agents, identifying the causes of their failures, modifying certain harness components, and then measuring whether those changes actually improve their performance.

This automation remains experimental. But it reveals an important evolution: the harness no longer serves only to control code production. **It can itself evolve based on the defects it observes.**

This creates a genuine feedback loop:

{% mermaid boucle-de-retroaction caption="The harness no longer merely controls code production: it evolves based on the defects it observes" %}
flowchart TB
AGENT["AGENT"] --> CODE["CODE"]
CODE --> CTRL["CONTROLS"]
CTRL --> DEF["DEFECT DETECTED"]
DEF --> CORR["CORRECTION"]
CORR --> HARN["HARNESS IMPROVEMENT"]
HARN --> AGENT
{% endmermaid %}

And it is precisely at this stage that AI-assisted development begins to resemble a **closed-loop control system**.


<hr class="hr-text" data-content="Closed loop">

## 11. Software Engineering as a Control System

The agent produces a change. Controls observe the result. Deviations are detected. The code is corrected. And when a defect reveals a weakness in the process itself, the harness evolves to make that class of errors harder to reproduce.

This description resembles another one. In a traditional control system, a target is defined, the actual state of the system is observed, the deviation is measured, and then action is taken to reduce it. For software, this target brings together everything we want to preserve:

{% mermaid cible-du-logiciel caption="The target: everything that successive changes must preserve" %}
flowchart TB
SPEC["SPECIFICATIONS"] --> CIBLE["SOFTWARE<br/>TARGET"]
INV["BUSINESS<br/>INVARIANTS"] --> CIBLE
ARCH["ARCHITECTURE"] --> CIBLE
QUAL["QUALITY"] --> CIBLE
SEC["SECURITY"] --> CIBLE
PERF["PERFORMANCE"] --> CIBLE
{% endmermaid %}

The agent then acts on the software by producing changes. But we do not simply trust it. We observe the result through several “sensors”: these controls measure different properties of the software and make it possible to detect a deviation from the target.

The harness can then decide what happens next:

{% mermaid observer-decider caption="The sensors measure the deviation from the target, and the harness decides what happens next" %}
flowchart TB
AGENT["AGENT<br/>produces a change"]
CB["CODEBASE<br/>modified system"]
OBS["OBSERVE<br/><br/>Compilation · Types · Tests · Linters<br/>Architecture · Property-based testing<br/>Fuzzing · Mutation testing · Security<br/>Performance · Observability"]
DEC["DECIDE<br/><br/>Accept · Correct · Replan<br/>Retry implementation · Strengthen a check<br/>Evolve rules"]
AGENT --> CB --> OBS --> DEC
{% endmermaid %}

The complete loop then looks like this:

{% mermaid boucle-fermee caption="AI-assisted development viewed as a closed-loop control system" %}
flowchart TB
INT["HUMAN<br/>INTENT"] --> CIBLE["TARGET<br/><br/>Specifications · Invariants<br/>Architecture · Quality<br/>Security · Performance"]
CIBLE --> CMP{"MEASURE<br/>THE DEVIATION"}
HARN["HARNESS<br/>CONTROLLER"] --> AGENT["AGENT<br/>ACTUATOR"]
AGENT --> CB["CODEBASE<br/>CONTROLLED SYSTEM"]
CB --> ETAT["SOFTWARE STATE<br/><br/>Behavior · Structure<br/>Quality · Non-functional properties"]
ETAT --> CAPT["SENSORS<br/><br/>Tests · Static analysis · Architecture<br/>PBT · Fuzzing · Mutation<br/>Security · Performance · Observability"]
CAPT --> CMP
CMP -->|"deviation detected"| HARN
CMP -->|"target satisfied"| OK["ACCEPT<br/>THE CHANGE"]
CMP -.->|"insufficient control"| AMEL["IMPROVE<br/>THE HARNESS"]
AMEL --> HARN
{% endmermaid %}

Each part of the system then has a precise place in the loop:

| Role in a control system | Equivalent in AI-assisted development |

| --- | --- |
| **The target** | specifications, invariants, and constraints |
| **The controlled system** | the software, which we seek to keep within that target |
| **The sensors** | tests, analyzers, metrics, and fitness functions |
| **The controller** | the harness, which organizes the work and uses the resulting feedback |
| **The actuator** | the agent, which produces the requested changes |
| **The feedback loop** | measuring deviations, correcting the code, and, when necessary, strengthening the control system itself |

This analogy should obviously not be taken literally. Software is not an industrial process, and not all of its qualities can be measured with the precision of a physical sensor.

But this representation forces us to ask the right questions:

* What exactly is the target?
* Which properties can we observe?
* Which deviations can we detect automatically?
* What does the system do when a control fails?
* And above all: what do we change when an error reveals that our controls were insufficient?

This is an important shift in perspective.

The problem is no longer to find the prompt that will allow AI to directly produce the right solution. It is to build **a system in which every change is confronted with an explicit target, observed through independent controls, and fed back into a correction loop**.

This is what we might call:

> note "Software Engineering as a Control System"
>
> No longer simply programming better with AI, but **designing the system that makes it possible to control what it produces**.


<hr class="hr-text" data-content="Engineer">

## 12. The developer also programs the system that produces the software

In a highly simplified representation of traditional development, the developer directly transforms a need into code:

{% mermaid developpement-traditionnel caption="A short chain, where the developer is the only intermediary" %}
flowchart TB
B["need"] --> D["developer"] --> C["code"]
{% endmermaid %}

With agents capable of handling an increasing share of implementation, this relationship becomes longer. The developer no longer works only on the code being produced.

{% mermaid ingenieur-systeme caption="Design, control, equip: three activities that come before the agent" %}
flowchart TB
BESOIN["NEED"] --> ING["ENGINEER"]
ING --> CONC["DESIGN<br/><br/>Specifications<br/>Architecture<br/>Invariants"]
ING --> CTRL["CONTROL<br/><br/>Fitness fn<br/>Quality<br/>Checks<br/>Evaluation"]
ING --> OUT["EQUIP<br/><br/>Tools<br/>Harness<br/>Feedback"]
CONC --> AGENT["AGENT"]
CTRL --> AGENT
OUT --> AGENT
AGENT --> CODE["CODE"]
{% endmermaid %}

This obviously does not mean that the engineer stops understanding or modifying the code. On the contrary, they must be able to define what they expect from the software precisely enough for that expectation to be conveyed to the agent and then verified independently of it.

The faster code production becomes, the more other skills gain importance:

* formalizing a requirement;
* identifying domain invariants;
* defining architectural boundaries;
* choosing the right verification mechanisms;
* distinguishing what can be checked automatically from what still requires judgment;
* analyzing defects to improve the development system itself.

Value therefore shifts partly from **direct code production** toward **designing the framework in which it is produced**. This is an important evolution in the role of the software engineer: they no longer program only the application.

> note "The shift in the role"
>
> The engineer also programs **the conditions under which that application can be correctly produced, verified, and maintained**.


<hr class="hr-text" data-content="Conclusion">

## 13. From vibe coding to engineering the production system

The recent evolution of AI-assisted development can be read as a succession of shifts.

1. With **prompt engineering**, the question was: “*How can we ask for code more effectively?*”
2. Then came **context engineering**: “*What information should we give the model so that it can work correctly?*”
3. With **agent engineering**, the scope expanded further: “*What tools, memories, and loops should we provide it with?*”
4. Then **harness engineering** shifted the question toward the agent's complete environment: “*How should we organize, constrain, and verify its work?*”

At each stage, we move a little further away from the idea that a better model or a better prompt would be enough to solve the problem. The question becomes more general:

> **How do we design the system that produces the software?**

This is precisely what the idea of **Software Engineering as a Control System** captures. AI-generated code is no longer a result that should simply be trusted: it is confronted with specifications, invariants, architectural rules, tests, analyzers, and quality criteria that make it possible to observe deviations and trigger corrections.

And when a defect reveals a weakness in the system itself, that weakness should in turn become a new rule, a new test, new documentation, or a new control.

The goal is therefore not to eliminate every error. That would be unrealistic, and it is not how software engineering has progressed either: human developers make mistakes too, and that is precisely why we have built compilers, type systems, tests, code reviews, static analysis, CI/CD, and observability over time.

Coding agents do not make these practices obsolete.

**They make their systematic application even more necessary.**

The easier and faster code becomes to produce, the more important it becomes to define what acceptable software is, measure deviations from that target, and prevent the same defects from recurring.

The real challenge is therefore not to build an AI capable of writing software perfectly.

It is to build a factory in which an error, whether it comes from a human or an AI, **has less and less chance of going unnoticed and more and more chance of improving the system that allowed it through.**

That is where *vibe coding* becomes engineering.

> note "What about you?"
>
> Many organizations are still hesitant, and many developers already use these tools without saying so. This caution is not irrational: it is based on a sound intuition, that code nobody knows how to verify is a liability, regardless of who wrote it.
>
> But clandestine use is the worst of both worlds: what is not declared is not verified. The question is therefore not whether AI should be allowed, but what must be built so that the question no longer needs to be asked. **What is missing in your organization for an agent's work to be as verifiable as a human's?**


<hr class="hr-text" data-content="Resources">

## Resources

* **Harness and harness engineering**
  
  * [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/){:target="_blank" rel="noopener noreferrer nofollow"}: OpenAI's experience with a codebase largely modified by agents
  * [Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html){:target="_blank" rel="noopener noreferrer nofollow"}: Birgitta Böckeler's article, including the *steering loop*
  * [Agentic Harness Engineering](https://arxiv.org/abs/2604.25850){:target="_blank" rel="noopener noreferrer nofollow"}: the still-experimental automation of agent trajectory analysis
  
* **Specify and verify**
  
  * [Spec Kit](https://github.github.com/spec-kit/){:target="_blank" rel="noopener noreferrer nofollow"}: GitHub's *specify / plan / tasks / implement* process
  * [Finding bugs with Claude and property-based testing](https://www.anthropic.com/research/property-based-testing){:target="_blank" rel="noopener noreferrer nofollow"}: Claude and Hypothesis applied to major Python libraries
  * [github.com/mattpocock/skills](https://github.com/mattpocock/skills){:target="_blank" rel="noopener noreferrer nofollow"}: a set of *skills* focused on engineering practices

* **On this blog**

  * [HexaGlue, or why hexagonal architecture needs a compiler]({{site.baseurl}}/hexaglue-hexagonal-architecture-compilator/): making a dependency rule executable rather than merely documented
  * [The ultimate guide to mastering hexagonal architecture: focus on the domain]({{site.baseurl}}/hexagonal-architecture-domain/): business invariants and the boundaries protected by architecture tests

> note ""
>
> This article was written with the help of LLMs and reviewed by the only person who had written its outline. This is exactly the configuration described in the first part, where the person who produces is also the one who judges. Any remaining errors are therefore, strictly speaking, mine. 😬
