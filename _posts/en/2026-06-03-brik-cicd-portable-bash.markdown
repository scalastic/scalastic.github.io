---
layout: post
title: "Brik: A Portable CI/CD Written in Bash"
date: 2026-06-03 16:00:00 +0200
description: "Brik is a portable CI/CD written in Bash: a standard workflow, declarative configuration, and the same pipeline on GitLab, Jenkins, and locally. Architecture, registry, scheduling, and concrete features."
img: brik-cicd-portable-bash.jpg
fig-caption: Photo by <a href="https://unsplash.com/fr/@ryanquintal?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ryan Quintal</a> on <a href="https://unsplash.com/fr/photos/blue-cube-jouet-lot-gros-plan-photographie-US9Tc9pKNBU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [CI/CD, Bash, DevOps, GitLab, Jenkins, Kubernetes, GitOps, Pipeline]
lang: en
permalink: /brik-cicd-portable-bash/
status: finished
---

A CI/CD pipeline today is often a few hundred lines of YAML. It describes jobs, dependencies, artifacts, and conditions. Over the months, it accumulates the team's actual delivery logic: how tests are run, how scans are performed, how an image is promoted, how deployments happen.

On paper, it is configuration. In practice, it is code. Business-critical code, not really versioned anywhere else, and above all: written in the dialect of a specific platform.

Change platforms, and you rewrite everything. That is the real cost of CI/CD lock-in. It is not in the monthly bill. It is in the fact that your delivery know-how is not portable.

One could argue that platforms anticipated this problem. GitLab has its [*CI/CD components*](https://docs.gitlab.com/ee/ci/components/){:target="_blank" rel="noopener noreferrer nofollow"}: versioned pipeline fragments published in a catalog and included across projects. Jenkins has its [*shared libraries*](https://www.jenkins.io/doc/book/pipeline/shared-libraries/){:target="_blank" rel="noopener noreferrer nofollow"}: logic factored into Groovy code and loaded by every `Jenkinsfile` in an organization. These are real solutions to copy-and-paste problems, and they work. But they confirm the diagnosis more than they solve it: a GitLab component only runs on GitLab, and a Jenkins shared library only loads in Jenkins. We have made the logic **reusable, not portable**. The know-how remains written in the platform's native dialect; it is simply better organized.

This article introduces **Brik**, a tool that approaches the problem from the opposite direction. I will mix the why and the how: first the guiding principles, then the architecture, the registry, the scheduler, and the concrete features, complete with manifests and real `brik.yml` examples.

{% github_card getbrik/brik %}


<hr class="hr-text" data-content="Table of Contents">

* TOC
{:toc}

<hr class="hr-text" data-content="The Problem">

## The pipeline always ends up becoming platform-specific code

The two major formats start from opposite intentions. The `.gitlab-ci.yml` file bets on a declarative approach: describe, don't program. But YAML is not a programming language, and as soon as requirements become more complex, we end up forcing it into that role anyway. `if` statements disguised as `rules:`. Ever-growing inline scripts. `before_script` sections that duplicate the same sequence from one project to another.

The `Jenkinsfile` takes the opposite approach. It is written in Groovy, a real programming language: nothing stands in the way of logic, so it flows in naturally. But it immediately wraps itself around Jenkins-specific `steps`, plugins, and APIs. YAML imitates a language it is not; Groovy is one, and uses that power to bind itself to its orchestrator. Two opposite paths, one destination: delivery logic becomes code, and that code remains captive to the platform that executes it.

Three symptoms then appear, always the same:

* **Business logic leaks into the platform.** Testing, scanning, and promotion become inseparable from GitLab or Jenkins syntax.
* **Copy-and-paste takes hold, or disguises itself as reuse.** Every new repository starts from a template that slowly drifts away from the original. And even when organized into a component or a shared library, that code remains tied to its platform.
* **CI does not run locally.** "But it works on my machine" becomes a common phrase again, because the machine and the CI are not executing the same code.

From this observation, one idea emerges almost naturally: what if delivery logic were a program in its own right, and the platform merely an execution server?

That is the premise behind Brik.


<hr class="hr-text" data-content="The Approach">

## A standard workflow, declarative configuration

Brik reverses the responsibility. The platform no longer orchestrates the logic: it simply launches Brik. And Brik always follows the same workflow:

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/brik-flux-pipeline.png --alt The workflow of a Brik pipeline %}
  <figcaption>The workflow of a Brik pipeline</figcaption>
</figure>

This workflow is not an arbitrary constraint; it is a proposed standard. It brings together the stages that matter in any serious delivery process: release, build, testing, security analysis, packaging, promotion, and deployment. Each has a predefined place, ensuring that none are forgotten or left to improvisation. You no longer have to decide the order or wonder where to plug in security checks: the structure is already there, and it has been proven in practice.

Lint, SAST, Scan, and Test run in parallel after Build. Package waits for all four and decides whether to continue based on their business outcome, not on the color of a job status. `Promote` retags a candidate image as a release image on tagged commits, and automatically disables itself when it is not configured.

This workflow does not change from one project to another. **What changes is the declaration**: a `brik.yml` file at the root of the repository. It describes *what* your delivery process must do, never *how* to orchestrate it: the stack and its version, tests, quality and security checks, packaging, publishing, and deployment environments. The *how*—the order of stages, their parallelism, and their dependencies—is handled by the workflow itself.

### On the CI orchestrator side: a simple entry point

And what happens to your `.gitlab-ci.yml` or `Jenkinsfile`? They do not disappear, but they shrink to the bare minimum. They no longer contain any delivery logic: their sole purpose is to fetch Brik and run it.

On GitLab, just a few lines of `include:` pointing to the Brik template:

{% highlight yaml %}
include:
  - project: 'brik/gitlab-templates'
    ref: v0.7.0
    file: '/templates/pipeline.yml'
{% endhighlight %}

On Jenkins, a call to the shared library:

{% highlight groovy %}
@Library('brik') _
brikPipeline()
{% endhighlight %}

That's it. No list of jobs, no dependencies, no conditions: just an entry point into Brik. All the logic lives in `brik.yml`, and that is precisely what makes it portable from one platform to another.


### On the Brik side: everything lives in `brik.yml`

A Node project that only runs tests can get by with a `brik.yml` of about ten lines:

{% highlight yaml %}
version: 1
project:
  name: node-plan-tag
  stack: node
  stack_version: "22"
pipeline:
  selection:
    mode: balanced
test:
  framework: npm
{% endhighlight %}

No job definitions, no artifact management, no parallelism matrix. The workflow is already there. You declare your stack, your testing framework, and, incidentally, the stage selection mode (`balanced`), which we will revisit in detail later.

As requirements grow, the configuration grows with them, without ever turning into platform-specific code. Here is a complete Node project, exactly as it runs in Brik's end-to-end test suite:

{% highlight yaml %}
version: 1
project:
  name: node-complete
  stack: node
  stack_version: '22'
release:
  strategy: semver
  tag_prefix: v
test:
  framework: jest
  reports:
    enabled: true
quality:
  lint:
    enabled: true
    tool: eslint
  format:
    tool: prettier
security:
  secrets: {}
  container:
    severity: critical
package:
  docker:
    image: nexus.briklab.test:8082/brik/node-complete
    dockerfile: Dockerfile
publish:
  docker:
    registry: nexus.briklab.test:8082
    username_var: BRIK_PUBLISH_DOCKER_USER
    password_var: BRIK_PUBLISH_DOCKER_PASSWORD
  npm:
    registry: http://nexus.briklab.test:8081/repository/brik-npm/
    token_var: BRIK_PUBLISH_NPM_TOKEN
{% endhighlight %}

Semantic versioning releases, tests with reports, linting and formatting, secret scanning, a severity threshold for container scanning, Docker packaging, and dual publishing (container image and npm package).

Everything is declared; nothing is programmed.

Also note a healthy practice enforced by the configuration: no hardcoded secrets. You declare the **name** of the environment variable (`token_var`, `password_var`), never its value. The secret remains in the platform's vault; Brik simply resolves it at runtime.

The same structure applies to Java, .NET, Python, Rust, or Docker. Change `stack: node` to `stack: java`, adjust the tools, and the workflow remains exactly the same.

<hr class="hr-text" data-content="The Registry">

## Under the hood: the registry

How can such a short configuration file drive an entire pipeline? The answer lies in a component we have not examined yet: the registry.

The registry is Brik's single source of truth. It is a catalog that describes every stage and every stack: its role in the pipeline workflow, what it blocks, what it consumes, and what it produces. None of this is hardcoded in scattered scripts. Everything is declared as data, which Brik then reads and executes.

These concepts do not come out of nowhere. A CI/CD system, like any application, manipulates domain objects: where a business application reasons in terms of orders, customers, and invoices, a pipeline reasons in terms of stages, stacks, deployments, package managers, rollouts, plans, and findings. These are the entities of its domain. Brik names them explicitly—eleven concepts in total—and gives each a clear responsibility instead of leaving them implicit and dissolved into scripts. The registry is where two of these entities, stages and stacks, are defined as data rather than code.

This choice has a direct consequence: everything else flows from it. The workflow, the dependency graph between stages, and the decision to run or skip a step are not rewritten in every script; they are inferred from what the registry declares. One source of truth to maintain, rather than logic scattered across projects and slowly drifting apart.

Mechanically, these descriptions are stored as **YAML manifests**, located in `lib/registry/manifests`. A compilation script generates a JSON cache from them, and that cache is committed to the repository. The cache is never edited manually: you edit a manifest, then recompile.

A distinction is important here, because the similarity with `brik.yml` can be misleading. The `brik.yml` file is something **you** write—one per project. The manifests, on the other hand, are part of Brik itself: they are shipped with the tool, and you never need to fill them in to configure a pipeline. We are looking at them here to understand how Brik reasons, not because there is anything you need to do with them. Editing them is the responsibility of maintainers, or of anyone who wants to extend Brik, which we will cover later.

Here is the actual manifest for the test stage (`lib/registry/manifests/stages/test.yml`):

{% highlight yaml %}
apiVersion: brik.dev/v1
kind: Stage
metadata:
  id: test
  displayName: Test
spec:
  module: stages.test
  function: stages.test
  placement:
    slot: verify
    group: verify
    after: [build]
    before: [package]
  gate:
    mode: blocking
    contexts: [snapshot, release]
  impact:
    use_stack_impact: test
  consumes: [build.artifact]
  provides: [test.findings, coverage.report]
{% endhighlight %}

Everything that defines a stage's behavior is there, explicitly declared, not hidden in code:

* **`placement`** describes the stage's position in the workflow (`after: [build]`, `before: [package]`) and its parallel execution group (`group: verify`). This is what places Test, Lint, SAST, and Scan in the same execution wave.
* **`gate`** specifies how the stage blocks the pipeline. `mode: blocking` means that a failure stops the pipeline. The `contexts` define **which types of pipelines** the gate applies to: `snapshot` (a branch push) and `release` (a tag).
* **`consumes` / `provides`** form a genuine dependency graph between stages. Test consumes the build artifact and provides `test.findings` and `coverage.report`. The Package stage, in turn, will consume these `provides`. This graph is not decorative: it is what allows Brik to know what to wait for, what to aggregate, and what to skip.
* **`impact`** indicates what makes the stage relevant. Here, `use_stack_impact: test` delegates to the stack the responsibility of defining which files should be considered test-related.

Compare it with the security scanning stage (`scan.yml`), and the pattern becomes clear:

{% highlight yaml %}
spec:
  placement:
    slot: verify
    group: verify
    after: [build]
    before: [package]
  runner:
    class: scanner
  gate:
    mode: blocking
    contexts: [snapshot, release]
  impact:
    changes:
      - "**/package-lock.json"
      - "**/pom.xml"
      - "**/go.sum"
      - "**/Cargo.lock"
      - "**/requirements.txt"
  consumes: [build.artifact]
  provides: [dependency.findings, secret.findings]
{% endhighlight %}

The Scan stage declares that it runs on a `runner.class: scanner` (a dedicated image equipped with security tooling), and that it is only concerned with changes to dependency lock files. Change a CSS file (`*.css`), and a dependency scan has no reason to run: its `impact` does not match.

Adding a stack or a stage to Brik means writing a manifest like these. Not reprogramming an orchestrator. **Describe, don't code**: the guiding principle can be summed up in those three words.

And this is not reserved for Brik maintainers: the registry was designed to be extended externally. You describe your own stack or stage in a directory of your own, and Brik integrates it just like any native component, without requiring a fork.

> info "Going further: writing an extension"
>
> * [`docs/operations/extensions.md`](https://github.com/getbrik/brik/blob/main/docs/operations/extensions.md){:target="_blank" rel="noopener noreferrer nofollow"}: the step-by-step guide (add a manifest, compile it, provide the Bash module).
> * `BRIK_REGISTRY_EXTENSIONS_DIRS`: the variable that points registry compilation to your extension directories.
> * [`schemas/registry/v1/stack.schema.json`](https://github.com/getbrik/brik/blob/main/schemas/registry/v1/stack.schema.json){:target="_blank" rel="noopener noreferrer nofollow"}, [`stage.schema.json`](https://github.com/getbrik/brik/blob/main/schemas/registry/v1/stage.schema.json){:target="_blank" rel="noopener noreferrer nofollow"}: the schemas that your manifests share with native concepts.
> * `brik extension test <directory>`: the harness that validates your extension against the contract before publication.

The scope remains intentionally modest—there is no marketplace or signed manifests yet—but the extension point is open: the mechanism you use to extend Brik is the very same mechanism that describes Brik itself.


<hr class="hr-text" data-content="Stacks and Runners">

## Stack detection and runner images

The stack manifest applies the same logic on the language side. Here is a real excerpt from `stacks/node.yml`:

{% highlight yaml %}
kind: Stack
metadata:
  id: node
spec:
  detect:
    markers:
      any:
        - package.json
  runner:
    image: ghcr.io/getbrik/brik-runner-node
    defaultVersion: "22"
    versions: ["22", "24"]
  frameworks:
    test:
      jest: {stack: node}
      vitest: {stack: node}
      npm: {stack: node}
  impact:
    source:
      - "**/*.js"
      - "**/*.ts"
    test:
      - "**/*.test.js"
      - "**/*.spec.ts"
  defaults:
    build_tool: npm
    test_framework: jest
    lint_tool: eslint
    format_tool: prettier
{% endhighlight %}

The image referenced here, `ghcr.io/getbrik/brik-runner-node`, is not built by Brik itself. It comes from a separate repository, [`brik-images`](https://github.com/getbrik/brik-images){:target="_blank" rel="noopener noreferrer nofollow"}, where a single matrix (`versions.json`) describes, stack by stack, the versions and tooling to include: one image per language (`node`, `python`, `java`, ...), plus dedicated images for controls—`scanner` for security checks and `analysis` for SAST. The Scan manifest's `runner.class: scanner` refers to one of these images.

Several practical consequences follow from this:

* **Detection is automatic.** A `package.json` at the repository root is enough for Brik to know it is dealing with a Node stack. You can explicitly set `stack: node` in your configuration, but convention comes before configuration.
* **The runner image is tied to the stack, not to your `.gitlab-ci.yml`.** `ghcr.io/getbrik/brik-runner-node`, versions 22 and 24. The `stack_version: "22"` declaration in your `brik.yml` selects the image. You no longer manage runner images in platform-specific configuration.
* **Defaults are opinionated.** Without declaring anything, Node projects test with Jest, lint with ESLint, and format with Prettier. These are the defaults of a serious Node team. You only override them if your needs differ.
* **Impact globs (`source`, `test`) are the raw material for selective execution.** We'll get to that next.

<hr class="hr-text" data-content="The Plan">

## Selective execution: a plan before execution

Let's return to the `balanced` mode we encountered earlier. This is Brik's second major architectural decision, and arguably the one that has the biggest impact on day-to-day use.

**Before launching anything, Brik computes a plan—it does not execute it.** This plan, materialized as a `plan.json` file, contains for each stage: the run-or-skip decision, and, more importantly, the **reason** for that decision. It is platform-agnostic and reproducible byte-for-byte for a given HEAD and a given `brik.yml`.

The selection mode determines these decisions:

* **`safe`**: everything runs. No stage is skipped. This is the mode for release pipelines, where no risks are taken.
* **`balanced`**: Brik cross-references the files changed since the base revision with the `impact` globs of stages and stacks. A pull request that only touches documentation triggers neither build, test, nor scan stages. A pull request that modifies a `package-lock.json` wakes up the dependency scan. Every skip is justified, not guessed.

The most aggressive mode is still deferred. It targets monorepos: an impact graph per subproject, triggering stages only for the subprojects whose files have changed, whereas `balanced` still reasons at the repository-wide level. Today, the planner explicitly refuses to support it, out of deliberate caution: it is better to have a tool that can say "I cannot do this safely yet" than a tool that skips checks without being able to justify why.

In practice, you can ask Brik to explain what it is going to do—and why—**before** it does it:

{% highlight bash %}
brik plan --explain
brik validate --config brik.yml
{% endhighlight %}

`validate` checks your configuration against the reference JSON Schema (the validation chain prefers [`jv`](https://github.com/santhosh-tekuri/jsonschema){:target="_blank" rel="noopener noreferrer nofollow"}, a Go binary, and falls back to [`check-jsonschema`](https://github.com/python-jsonschema/check-jsonschema){:target="_blank" rel="noopener noreferrer nofollow"} in Python if needed). `plan --explain` gives you the reasoned decision, stage by stage. CI stops being a black box whose verdict you wait for. It becomes a plan you can read, validate, and replay.

And because platform adapters execute this plan instead of recomputing it, `plan.json` is what guarantees that GitLab, Jenkins, and your workstation make exactly the same decisions.

> info "Going further: the plan"
>
> * [`lib/planning/`](https://github.com/getbrik/brik/tree/main/lib/planning){:target="_blank" rel="noopener noreferrer nofollow"}: plan computation (selection, impact analysis, reading and writing).
> * `.brik-logs/plan.json`: the generated plan, justified stage by stage.
> * `brik plan --explain` / `brik plan gate`: inspect the plan, then execute it.
> * [`schemas/config/v1/brik.schema.json`](https://github.com/getbrik/brik/blob/main/schemas/config/v1/brik.schema.json){:target="_blank" rel="noopener noreferrer nofollow"}: the schema applied by `brik validate`.

<hr class="hr-text" data-content="Security">

## Security is not an option, it's a slot

Look again at the workflow. Three of the four parallel stages are security stages: SAST, Scan, and later Container Scan after Package. This is not a presentation choice. It is an architectural choice.

* **SAST** performs static code analysis (analysis-class tools such as [semgrep](https://semgrep.dev/){:target="_blank" rel="noopener noreferrer nofollow"} or [checkov](https://www.checkov.io/){:target="_blank" rel="noopener noreferrer nofollow"} for IaC).
* **Scan** covers dependencies and secrets. Its manifest declares this explicitly: it provides `dependency.findings` and `secret.findings`.
* **Container Scan** runs after Package, against the built image, using dedicated tools ([grype](https://github.com/anchore/grype){:target="_blank" rel="noopener noreferrer nofollow"}, [syft](https://github.com/anchore/syft){:target="_blank" rel="noopener noreferrer nofollow"} for SBOM generation, [osv](https://github.com/google/osv-scanner){:target="_blank" rel="noopener noreferrer nofollow"}, and [hadolint](https://github.com/hadolint/hadolint){:target="_blank" rel="noopener noreferrer nofollow"} for Dockerfile analysis). Its threshold is declared explicitly: `security.container.severity: critical`.

The `gate.contexts` introduced earlier become particularly meaningful here. The same stage can block differently depending on whether it is running on a branch push (`snapshot`) or a tag (`release`). You can tolerate a warning during development and make it blocking for releases, without duplicating a single line of pipeline configuration.

And the final gate does not rely on job status colors. **Package makes its decision based on business outcomes**, aggregated into a report (`aggregate-report.json`). A job that appears green for the wrong reasons—because a tool accidentally returned 0, or because a step was silently skipped—does not pass the gate. It is a subtle but crucial distinction: Brik reasons about what the checks actually found, not about their exit codes.

<hr class="hr-text" data-content="Deployment">

## Promotion and deployment: conditions, not workarounds

The `Promote` stage deserves special attention because it encodes a best practice that is often reinvented by hand. Its manifest:

{% highlight yaml %}
kind: Stage
metadata:
  id: promote
spec:
  placement:
    slot: pre-deploy
    after: [container-scan]
    before: [deploy]
  gate:
    contexts: [release]
  dry_run:
    destructive: true
  consumes: [package.artifact, container.findings]
  provides: [release.image_ref, release.image_digest]
{% endhighlight %}

Promote is only activated in the `release` context (a tag). It consumes both the package artifact **and** the container scan results: an image that has not passed the scan is not promoted. It provides the reference and digest of the release image. It is also marked `dry_run.destructive: true`, which means Brik knows this is a side-effecting operation that must be handled carefully during simulation. The separation between candidate and release images is no longer a script improvised by each team: it is a stage in the workflow, complete with built-in safeguards.

Deployment, meanwhile, declares its environments and activation rules in a readable way. Here is the actual configuration from `node-workflow-trunk`:

{% highlight yaml %}
deploy:
  workflow: trunk-based
  environments:
    staging:
      target: k8s
      namespace: brik-e2e-workflow
      manifest: k8s/deployment.yaml
      when: "branch == 'main'"
    production:
      target: k8s
      namespace: brik-e2e-workflow
      manifest: k8s/deployment.yaml
      when: "tag =~ 'v*'"
{% endhighlight %}

Staging on `main`, production on a `v*` tag. The promotion logic between environments lives in the configuration, plainly visible, rather than buried inside a tangle of platform-specific `rules:`.

Better still, `workflow: trunk-based` references a built-in **deployment profile**. Brik ships with three preconfigured profiles—`trunk-based`, `git-flow`, and `github-flow`—which provide sensible defaults that you only need to override when necessary. The trunk-based profile, for example, already defines:

{% highlight yaml %}
deploy:
  environments:
    staging:
      when: "branch == 'main'"
      target: k8s
      namespace: staging
    production:
      when: "tag =~ 'v*'"
      target: k8s
      namespace: production
{% endhighlight %}

You can adopt a proven branching model with a single line, and then only adjust what is specific to your environment (the namespace, the manifest, the target).

And the targets are real, not theoretical. Six deployment adapters are provided: **Kubernetes, Helm, Compose, SSH, GitOps, and ArgoCD**. GitOps is treated as a first-class target: instead of pushing directly to a cluster, Brik writes to a configuration repository that a controller then reconciles.

{% highlight yaml %}
deploy:
  environments:
    staging:
      target: gitops
      repo: http://gitea.briklab.test:3000/brik/config-deploy-gitops.git
      path: k8s
      controller: argocd
      app_name: brik-e2e-gitops
{% endhighlight %}

Rollout is built from three components, and you only declare two of them. The **profile** is the `workflow` you have already chosen: it establishes the environment conventions. The **strategy** is configured per environment. As for **health checks**, they are not declared.

{% highlight yaml %}
deploy:
  workflow: trunk-based
  environments:
    production:
      strategy: canary
{% endhighlight %}

The profile has already defined when and where production should be deployed; you only specify the rollout approach: `rolling`, `blue-green`, or `canary`. As for health checks, there is no field to fill in. On Kubernetes, Brik simply waits for the deployment to converge (`kubectl rollout status`, with a default timeout) before validating the step. Strategy, profiles, and health verification: all of this logic lives in Brik's core, not copied from one project to another.

> info "Going further: deployment and rollout"
>
> * [`lib/deployments/`](https://github.com/getbrik/brik/tree/main/lib/deployments){:target="_blank" rel="noopener noreferrer nofollow"}: the six adapters (`k8s`, `helm`, `compose`, `ssh`, `gitops`, `argocd`).
> * [`lib/rollout/`](https://github.com/getbrik/brik/tree/main/lib/rollout){:target="_blank" rel="noopener noreferrer nofollow"}: health checks, strategies, and post-deployment profiles.
> * [`lib/rollout/data/deploy-profiles/`](https://github.com/getbrik/brik/tree/main/lib/rollout/data/deploy-profiles){:target="_blank" rel="noopener noreferrer nofollow"}: the `trunk-based`, `git-flow`, and `github-flow` profiles.

<hr class="hr-text" data-content="The report">

## The report: a pipeline you can read

A pipeline that goes green tells you very little. What you actually want to know is what it did: which stages ran, which were skipped and why, what the scanners found, which version was promoted. Brik condenses all of that into an **aggregate report**, produced on every run in three forms drawn from a single source.

{% highlight text %}
aggregate-report.json   # the aggregated data, for machines
aggregate-report.md     # the summary, for the terminal and PR comments
aggregate-report.html   # the rich view, for the browser
{% endhighlight %}

The JSON is the report itself: the pipeline's aggregated data, conforming to a versioned schema (`schema_version: "1.1"`) that external consumers read without surprises. The Markdown drops into a merge request comment or reads straight in the terminal. And the HTML is a self-contained report, one you share or keep as evidence.

Here is a real example, exactly as Brik produces it: the `v0.1.0` release of the `node-deploy-gitops` project, played on GitLab and deployed via GitOps. Twelve stages, eleven passing, `promote` stepping aside because the deployment only targets a non-production environment (`staging`), and a `warning` business outcome: the container scan did find vulnerabilities, but the organization policy exempted them, so the gate passes without blocking.

<figure class="article">
  <a href="/assets/brik/aggregate-report.html" target="_blank" rel="noopener noreferrer">
    {% picture {{site.baseurl}}/assets/img/brik-pipeline-report.png --alt The HTML report of a Brik pipeline%}
  </a>
  <figcaption>The HTML report of a Brik run (<code>node-deploy-gitops</code> project) — click the image to open the full interactive report</figcaption>
</figure>

What you read, top to bottom: the commit identity (author, message, repository), the platform and context (`snapshot` or `release`), a `DRY-RUN` banner when the run was a simulation, then the stage-by-stage detail—status, duration, runner image, and for every skipped stage the **reason** inherited from the plan. Then comes the business outcome (`success`, `warning`, or `error`) with its counts, the active policy, and the findings: those that block, those that are ignored along with their exemption source, and the ranking of the most severe ones, with linked CVE, proposed fix, and tool.

One engineering detail explains the richness of the page, which nonetheless needs no server and no dependency. The HTML **embeds its own data**: the aggregate JSON and the `plan.json` are included in the page as data islands, and a script renders them client-side—severity filters, search, tabs, collapsible sections. CSS, JS, and logo are inlined. The result: a single, self-contained file you open offline and that travels with the run. The HTML is not a frozen snapshot of the report: it is the JSON made browseable.

> info "Going further: the report"
>
> * [`docs/operations/pipeline-report.md`](https://github.com/getbrik/brik/blob/main/docs/operations/pipeline-report.md){:target="_blank" rel="noopener noreferrer nofollow"}: the field contract, version by version.
> * [`docs/operations/policy.md`](https://github.com/getbrik/brik/blob/main/docs/operations/policy.md){:target="_blank" rel="noopener noreferrer nofollow"}: the organization policy that exempts findings (CVE and path allow-lists).
> * [`schemas/report/v1.1/`](https://github.com/getbrik/brik/tree/main/schemas/report/v1.1){:target="_blank" rel="noopener noreferrer nofollow"}: the report schema.

<hr class="hr-text" data-content="The artifacts">

## The artifacts: the evidence, right where you already look

The report is the visible part. Beneath it, every run leaves a complete evidence tree, and Brik is strict about its structure: everything a pipeline produces lands in two directories at the root of the workspace.

{% highlight text %}
brik-artifacts/              # the canonical evidence tree (public API)
├── aggregate-report.{json,md,html}
├── init/init.json
├── build/build.json
├── test/test.json
├── test/junit.xml
├── test/coverage/coverage.xml
├── scan/deps.sarif
├── scan/secret.sarif
├── scan/sbom.cdx.json
├── sast/sast.sarif
├── container-scan/container-scan.sarif
├── package/package.json
└── ...
.brik-logs/                  # the operational tree (logs, plan.json, pipeline.env)
{% endhighlight %}

Two trees, two roles. `brik-artifacts/` is the **public API**: one subdirectory per stage, its `<stage>.json` fragment, and the tooled reports in standard formats—SARIF for findings (dependencies, secrets, SAST, container scan), CycloneDX for the SBOM, JUnit for tests, Cobertura or Jacoco for coverage. `.brik-logs/` is the operational tree: per-stage logs, `plan.json`, `pipeline.env`, lock files. Debugging material, not a contract.

In CI, each stage runs in its own container and ships its `brik-artifacts/<stage>/` as a job artifact. The `notify` stage, at the end of the run, collects all the fragments and merges them into `aggregate-report`. But—and this is the point that matters—**Brik invents no proprietary vault**. It writes to that canonical tree, and the thin adapters expose it through each platform's native mechanisms.

On GitLab, every job declares `brik-artifacts/` as `artifacts.paths`, `when: always`, kept for one week; the Notify job republishes the entire tree under the name `aggregate-report-<pipeline-id>`, kept for one month. And native integration surfaces the findings exactly where GitLab already expects them:

{% highlight yaml %}
artifacts:
  reports:
    junit: brik-artifacts/test/junit.xml
    coverage_report:
      coverage_format: cobertura
      path: brik-artifacts/test/coverage/coverage.xml
    sast: brik-artifacts/gl-sast-report.json
{% endhighlight %}

Tests show up in the merge request widget, coverage becomes a badge, SAST findings populate the Security tab. On Jenkins, it's `archiveArtifacts`: the `brik-artifacts/` tree is browseable directly in the build's archive.

The everyday consequence is the same as for the rest of Brik: you consult the evidence where you already look—job artifacts and native tabs on GitLab, the build archive on Jenkins—not in some third-party interface you have to learn. And the self-contained HTML report travels with the run: you download it, open it offline, and it stays readable without Brik or the platform. Locally, same story: the run drops the same tree, and you re-read exactly the same evidence as CI.

<hr class="hr-text" data-content="Why Bash">

## Why Bash for business logic

That leaves the choice that surprises people the most, so it is worth addressing it directly: everything I have described so far is written in Bash. Not Go. Not Python. Not Rust.

This is not a nostalgic stance. It is an industrialization decision.

Any CI runner, regardless of the platform, already knows how to execute shell scripts. It is the lowest common denominator across the industry. A compiled binary, by contrast, must be distributed, versioned for each architecture, installed, and updated. Bash can simply be cloned and executed. Anywhere, immediately, without a toolchain.

Brik relies on three tools that every CI engineer already knows: [`yq`](https://github.com/mikefarah/yq){:target="_blank" rel="noopener noreferrer nofollow"} for parsing YAML, and [`jq`](https://jqlang.github.io/jq/){:target="_blank" rel="noopener noreferrer nofollow"} for manipulating JSON. The business logic remains readable to the person debugging a failed job at 2 a.m., because it is written in the same material as the job itself.

Bash has a bad reputation, and often for good reasons: fragile scripts, unquoted variables, errors silently swallowed. Brik's answer is not to avoid Bash, but to **treat it as a real engineering language**. In practice, that means:

* **Convention-based function naming.** Every function follows the pattern `<concept>.<submodule>.<verb>`: `stages.build`, `stacks.node.test`, `deploy.k8s.run`. A loader resolves concepts from the directory structure. You can read a function name and immediately know where it lives.
* **Centralized helpers, never reimplemented.** Reading indirect variables goes through a single helper, tool resolution relies on a three-level registry, YAML editing is handled by a dedicated layer, and polling loops use a shared `transverse.wait.until`. No stage reinvents the wheel.
* **Short files and serious test coverage.** Files are typically 200 to 400 lines long, with an upper limit of 800. The specification tree mirrors the code tree, and the test suite contains more than 3,600 examples, measured with kcov.

That last point deserves special attention because it is rare. Bash is rarely tested, and its coverage is measured even less often. Brik does both.

The tests themselves are written with [**ShellSpec**](https://shellspec.info/){:target="_blank" rel="noopener noreferrer nofollow"}, a BDD framework for shell scripting. Each example follows the ***given / when / then*** structure: a context, an action, and an expected outcome. Line coverage is collected with [**kcov**](https://github.com/SimonKagstrom/kcov){:target="_blank" rel="noopener noreferrer nofollow"}, which instruments scripts during execution. In this way, shell code benefits from the same metrics as a compiled project.

Disciplined Bash is still Bash. But with discipline, it becomes industrial-grade.

> info "Going further: code architecture"
>
> * [`docs/internals/layout.md`](https://github.com/getbrik/brik/blob/main/docs/internals/layout.md){:target="_blank" rel="noopener noreferrer nofollow"}: the eleven core concepts and their directory structure.
> * [`docs/concepts/architecture.md`](https://github.com/getbrik/brik/blob/main/docs/concepts/architecture.md){:target="_blank" rel="noopener noreferrer nofollow"}: the reasoning behind the architectural choices.
> * [`Makefile`](https://github.com/getbrik/brik/blob/main/Makefile){:target="_blank" rel="noopener noreferrer nofollow"}: `make test`, `make lint`, `make coverage`.

<hr class="hr-text" data-content="Portability">

## Portability in practice

This is where all the previous design choices pay off.

Because the logic lives in Brik and platform adapters execute a plan instead of recalculating it, the same pipeline runs on **GitLab CI, Jenkins, and locally**, without any rewrites. The adapters are thin: they translate the plan into the scheduling model of the host platform, then hand control over to Brik via `brik plan gate`. The decision-making logic itself is never duplicated.

The consequence for everyday work is immediate: the command that runs on your workstation is the same one that runs in CI. The classic "it works on my machine" loses much of its footing, because the machine and the CI system are executing the same program, from the same plan.

One architectural detail deserves special attention because it is uncommon: **the Brik runtime is not embedded in the runner images.** The images contain the prerequisites (Bash, yq, jq, Git, and the stack toolchain), but Brik itself is cloned during CI by the shared library. The images and the runtime have decoupled release cycles. You can fix pipeline behavior without rebuilding or redistributing a single Docker image. Meanwhile, all of these images are rebuilt periodically to absorb operating system CVEs, independently of your code.

And since we're talking about images: the image used by each stage is not fixed either. The mapping between a runner class and its image lives in a single file, `runner_classes.yml`, which can be overridden through the `BRIK_RUNNER_CLASSES_FILE` variable without modifying the shipped defaults. This is exactly what the end-to-end test suite uses to validate the workflow: it points the variable to a definition where every class resolves to the same lightweight image, `brik-runner-stub`, whose real tools (scanners, toolchains, deployment utilities) are replaced with stubs. The entire workflow can then be replayed—including decisions and gates—without performing any real actions or producing actual artifacts.

> info "Going further: platform adapters"
>
> * [`shared-libs/gitlab/`](https://github.com/getbrik/brik/tree/main/shared-libs/gitlab){:target="_blank" rel="noopener noreferrer nofollow"}: GitLab pipeline generation from the plan.
> * [`shared-libs/jenkins/`](https://github.com/getbrik/brik/tree/main/shared-libs/jenkins){:target="_blank" rel="noopener noreferrer nofollow"}: the Jenkins equivalent.
> * [`shared-libs/local/`](https://github.com/getbrik/brik/tree/main/shared-libs/local){:target="_blank" rel="noopener noreferrer nofollow"}: local execution, same plan, same decisions.

<hr class="hr-text" data-content="Limitations">

## What Brik is not

Let's be honest about the scope, because a tool that claims to do everything usually does nothing particularly well.

Brik is not an orchestrator, nor is it a platform. It does not replace GitLab or Jenkins: it runs on top of them. It enforces a standard workflow, which is precisely its strength, but that is also an intentional constraint. If your use case requires an arbitrary and completely free-form job graph, this workflow is a framework, not a blank canvas.

The most aggressive planning mode is still deferred: today, the available modes are `safe` and `balanced`. And the project is actively evolving: version 0.7.0 at the time of writing. It is a young tool, but not a prototype. Its test suite—and an end-to-end validation framework that replays real pipelines against real orchestrators, GitLab and Jenkins, with Kubernetes deployment and ArgoCD reconciliation—demonstrate that.

<hr class="hr-text" data-content="What's Next">

## Open initiatives

Brik already covers the full workflow of a serious delivery process. But a few pieces are still missing before a CI/CD system can be considered truly coherent end to end, and they matter just as much as what is already in place. I'm outlining them here openly, because they define the roadmap ahead.

### Breaking up the monolithic pipeline

Today, deployment lives inside a CI run. But CI and CD operate at different rhythms: sometimes you want to redeploy an already-built and already-validated version without rerunning build, test, and scan stages.

| In place | Still to do |
|---|---|
| The platform-agnostic and reproducible `plan.json` already separates the deployment decision from its execution. That's the first milestone. | Trigger a deployment from a promoted artifact, without going through a full CI run again. |

### Pinning runner images

| In place | Still to do |
|---|---|
| The image production pipeline is hardened: every `brik-runner-*` image is signed with [cosign](https://github.com/sigstore/cosign){:target="_blank" rel="noopener noreferrer nofollow"}, accompanied by an SBOM and a [SLSA](https://slsa.dev/){:target="_blank" rel="noopener noreferrer nofollow"} provenance attestation, scanned, and rebuilt every week to absorb operating system CVEs. | On the consumption side, reference these images by digest rather than by tag, and verify their signatures before execution, so that no unattested image can enter a pipeline. |

### Hardening the delivery pipeline itself

A pipeline is only as trustworthy as the CI system that runs it.

| In place | Still to do |
|---|---|
| On the GitHub Actions side, [security hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions){:target="_blank" rel="noopener noreferrer nofollow"} is underway: actions pinned to full commit SHAs, secret scanning, [Dependabot](https://docs.github.com/en/code-security/dependabot){:target="_blank" rel="noopener noreferrer nofollow"}, [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repos-settings-and-features/customizing-your-repository/about-code-owners){:target="_blank" rel="noopener noreferrer nofollow"}, branch protection, and signed commits. | Carry this hardening through until a compromised CI dependency can never alter a deliverable. |

### Industrializing installation on orchestrators

Brik's runtime is portable, but its installation on orchestrators is not yet.

| In place | Still to do |
|---|---|
| Locally, the story is solid: `brew install brik` installs the CLI on both macOS and Linux, and the tap is updated with every release ([Brik Homebrew Tap](https://github.com/getbrik/homebrew-tap){:target="_blank" rel="noopener noreferrer nofollow"}). | On a CI platform, an operator who wants to host Brik still has to write their own runbook: create the GitLab group, register the runner, increase the dotenv variable limit, configure around fifteen CI/CD variables, or, on the Jenkins side, install fourteen plugins and configure JCasC manually. The initiative extends the principle of thin adapters to distribution itself: Terraform modules for GitLab, a Helm chart layered on top of the official Jenkins chart, and native Linux packages for the local CLI beyond Homebrew (APT, RPM, and AUR), integrating with the native tooling of each platform, without a proprietary binary or committed code generation. The objective is measurable: reduce GitLab adoption from one or two days to thirty minutes, and Jenkins from two or three days to one hour. |

### Auditing generated pipelines with Plumber

Brik generates pipelines, but those pipelines still need to be checked against security best practices once rendered on the target platform. That is the role of [Plumber](https://getplumber.io/){:target="_blank" rel="noopener noreferrer nofollow"}, an open-source CI/CD pipeline compliance scanner that verifies, among other things, image pinning by digest, authorized image sources, branch protection, and dangerous variable expansions.

| In place | Still to do |
|---|---|
| The effort is underway in [plumber-audit](https://github.com/getbrik/plumber-audit){:target="_blank" rel="noopener noreferrer nofollow"}, which audits the GitLab pipelines generated by Brik and is being extended to GitHub. | Give Jenkins an equivalent, which does not exist yet. |

<hr class="hr-text" data-content="Conclusion">

## Taking back control of delivery

The real question Brik raises is not a technical one. It is a strategic one.

Why do we still accept that delivery logic—one of a team's most critical assets—is written in a single platform's language, captive to it? Why should the know-how that defines how we test, secure, and deploy software have to be rewritten every time we migrate?

Brik is not a silver bullet. It is a direction. A direction toward a CI/CD model where the workflow is standardized, where configuration remains declarative, where business logic is a tested and portable program, and where the platform becomes what it should always have been: a place to execute your pipeline, not its owner.

The code is open: [github.com/getbrik/brik](https://github.com/getbrik/brik). The workflow is readable. The manifests read like documentation. And the next platform migration might, for once, be nothing more than a change of adapter.

The next stage, the next stack, and the next adapter could come from you.
