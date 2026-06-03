---
layout: post
title: "Brik : un CI/CD portable écrit en Bash"
date: 2026-06-03 16:00:00 +0200
description: "Brik est un CI/CD portable écrit en Bash : un flux standard, une config déclarative, et le même pipeline sur GitLab, Jenkins et en local. Architecture, registre, planification et fonctionnalités concrètes."
img: brik-cicd-portable-bash.jpg
fig-caption: Photo de <a href="https://unsplash.com/fr/@ryanquintal?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ryan Quintal</a>sur <a href="https://unsplash.com/fr/photos/blue-cube-jouet-lot-gros-plan-photographie-US9Tc9pKNBU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [CI/CD, Bash, DevOps, GitLab, Jenkins, Kubernetes, GitOps, Pipeline]
lang: fr
permalink: /brik-cicd-portable-bash/
status: finished
---


Un pipeline de CI/CD, aujourd'hui, c'est souvent quelques centaines de lignes de YAML. On y décrit des jobs, des dépendances, des artefacts, des conditions. On y empile, au fil des mois, la vraie logique de livraison de l'équipe : comment on teste, comment on scanne, comment on promeut une image, comment on déploie.

Sur le papier, c'est de la configuration. Sur le terrain, c'est du code. Du code métier, critique, versionné nulle part vraiment, et surtout : écrit dans le dialecte d'une plateforme précise.

Changez de plateforme, et vous réécrivez tout. Voilà le vrai coût du lock-in CI/CD. Il n'est pas dans la facture mensuelle. Il est dans le fait que votre savoir-faire de livraison n'est pas portable.

On m'objectera que les plateformes ont vu venir le problème. GitLab a ses [*CI/CD components*](https://docs.gitlab.com/ee/ci/components/){:target="_blank" rel="noopener noreferrer nofollow"} : des fragments de pipeline versionnés, publiés dans un catalogue, et inclus d'un projet à l'autre. Jenkins a ses [*shared libraries*](https://www.jenkins.io/doc/book/pipeline/shared-libraries/){:target="_blank" rel="noopener noreferrer nofollow"} : de la logique factorisée en Groovy, chargée par tous les `Jenkinsfile` d'une organisation. Ce sont de vraies réponses au copier-coller, et elles fonctionnent. Mais elles confirment le diagnostic plus qu'elles ne le résolvent : un component GitLab ne s'exécute que sur GitLab, une shared library Jenkins ne se charge que dans Jenkins. On a rendu la logique **réutilisable, pas portable**. Le savoir-faire reste écrit dans le dialecte de la maison, on l'a simplement mieux rangé.

Cet article présente **Brik**, un outil qui prend ce problème à contre-pied. Je vais y mélanger le pourquoi et le comment : le parti pris d'abord, puis l'architecture, le registre, la planification, et les fonctionnalités concrètes, manifestes et `brik.yml` réels à l'appui.

{% github_card getbrik/brik %}


<hr class="hr-text" data-content="Sommaire">

* TOC
{:toc}

<hr class="hr-text" data-content="Le problème">

## Le pipeline finit toujours par devenir du code de plateforme

Les deux grands formats partent d'une intention opposée. Le `.gitlab-ci.yml` mise sur le déclaratif : décrire, pas programmer. Mais le YAML n'est pas un langage de programmation, et dès que le besoin se complexifie, on l'y force quand même. Des `if` déguisés en `rules:`. Des scripts inline de plus en plus longs. Des `before_script` qui dupliquent la même séquence d'un projet à l'autre.

Le `Jenkinsfile` fait le pari inverse. C'est du Groovy, un vrai langage : rien ne freine la logique, elle entre sans résistance. Mais elle s'enroule aussitôt autour des `steps`, des plugins et des API propres à Jenkins. Le YAML mime un langage qu'il n'est pas ; le Groovy en est un, et s'en sert pour s'arrimer à son orchestrateur. Deux routes opposées, une même destination : la logique de livraison devient du code, et ce code reste captif de la plateforme qui l'exécute.

On observe alors trois symptômes, toujours les mêmes :

- **La logique métier fuit dans la plateforme.** Le test, le scan, la promotion deviennent indissociables de la syntaxe GitLab ou Jenkins.
- **Le copier-coller s'installe, ou se déguise en factorisation.** Chaque nouveau dépôt repart d'un template qui dérive lentement de l'original. Et même rangé dans un component ou une shared library, ce code reste soudé à sa plateforme.
- **La CI ne fonctionne pas en local.** "Pourtant ça passe sur ma machine" redevient une phrase courante, parce que la machine et la CI n'exécutent pas le même code.

À partir de ce constat, une idée s'impose presque naturellement : et si la logique de livraison était un programme à part entière, et la plateforme un simple serveur d'exécution ?

C'est le parti pris de Brik.

<hr class="hr-text" data-content="Le parti pris">

## Un flux standard, une config déclarative

Brik renverse la responsabilité. La plateforme n'orchestre plus la logique : elle se contente de lancer Brik. Et Brik, lui, suit toujours le même flux :

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/brik-flux-pipeline.png --alt Le flux d'une pipeline dans Brik%}
  <figcaption>Le flux d'une pipeline dans Brik</figcaption>
</figure>

Ce flux n'est pas une contrainte arbitraire, c'est une proposition de standard. Il rassemble les étapes qui comptent dans toute livraison sérieuse : release, build, tests, analyses de sécurité, packaging, promotion, déploiement. Chacune a sa place arrêtée, pour qu'aucune ne soit oubliée ni laissée à l'improvisation. Vous n'avez plus à décider de l'ordre, ni à vous demander où brancher les contrôles de sécurité : la structure est déjà là, et elle est éprouvée.

Lint, SAST, Scan et Test s'exécutent en parallèle après le Build. Package les attend tous les quatre et décide de continuer en fonction de leur résultat métier, pas de leur couleur de job. `Promote` retague une image candidate en image de release sur les commits tagués, et se désactive tout seul s'il n'est pas configuré.

Ce flux ne change pas d'un projet à l'autre. **Ce qui change, c'est la déclaration** : un fichier `brik.yml`, à la racine du dépôt. C'est lui qui décrit *ce que* votre livraison doit faire, jamais *comment* l'orchestrer : la stack et sa version, les tests, les contrôles de qualité et de sécurité, le packaging, la publication, les environnements de déploiement. Le *comment*, c'est-à-dire l'ordre des étapes, leur parallélisme et leurs dépendances, c'est le flux qui s'en charge.

### Côté orchestrateur de CI : un simple point d'entrée

Et votre `.gitlab-ci.yml` ou votre `Jenkinsfile` dans tout ça ? Ils ne disparaissent pas, mais ils maigrissent jusqu'à l'os. Ils ne portent plus aucune logique de livraison : leur unique rôle est de récupérer Brik et de le lancer.

Sur GitLab, quelques lignes d'`include:` vers le template Brik :

{% highlight yaml %}
include:
  - project: 'brik/gitlab-templates'
    ref: v0.7.0
    file: '/templates/pipeline.yml'
{% endhighlight %}

Sur Jenkins, un appel à la shared library :

{% highlight groovy %}
@Library('brik') _
brikPipeline()
{% endhighlight %}

C'est tout. Aucune liste de jobs, aucune dépendance, aucune condition : juste un point d'entrée vers Brik. Toute la logique vit dans le `brik.yml`, et c'est exactement ce qui la rend portable d'une plateforme à l'autre.

### Côté Brik : tout dans le `brik.yml`

Un projet Node qui ne fait que tester contient un `brik.yml` d'une dizaine de lignes :

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

Pas de description de jobs, pas de gestion d'artefacts, pas de matrice de parallélisme. Le flux est déjà là. Vous déclarez votre stack, votre framework de test et au passage le mode de sélection des stages (`balanced`), sur lequel nous reviendrons en détail.

Quand le besoin grandit, la config grandit avec lui, sans jamais devenir du code de plateforme. Voici un projet Node complet, tel qu'il tourne dans la suite end-to-end de Brik :

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

Release en semver, tests avec rapports, lint et format, scan de secrets, seuil de sévérité du container scan, packaging Docker, publication double (image et paquet npm).

Tout est déclaré, rien n'est programmé.

Notez aussi un réflexe sain, imposé par la config : aucun secret en dur. On déclare le **nom** de la variable d'environnement (`token_var`, `password_var`), jamais sa valeur. Le secret reste dans le coffre de la plateforme, Brik ne fait que le résoudre à l'exécution.

La même structure vaut pour Java, .NET, Python, Rust ou Docker. Vous changez `stack: node` en `stack: java`, vous ajustez les outils, et le flux reste identique.

<hr class="hr-text" data-content="Le registre">

## Sous le capot, le registre

Comment un fichier de config aussi court pilote-t-il un pipeline complet ? La réponse tient dans une pièce qu'on n'a pas encore ouverte : le registre.

Le registre est la source unique de vérité de Brik. C'est un catalogue qui décrit chaque stage et chaque stack : son rôle dans le flux du pipeline, ce qu'il bloque, ce qu'il consomme et ce qu'il produit. Rien de tout cela n'est codé en dur dans des scripts éparpillés. Tout est déclaré comme une donnée, que Brik lit puis exécute.

Ces deux-là ne tombent pas du ciel. Une CI/CD, comme toute application, manipule des objets métier : là où un logiciel de gestion raisonne en commandes, clients et factures, un pipeline raisonne en stages, stacks, déploiements, gestionnaires de paquets, rollout, plan, findings. Ce sont les entités de son domaine. Brik les nomme explicitement, onze notions en tout, et donne à chacune une responsabilité claire au lieu de les laisser implicites, dissoutes dans des scripts. Le registre est l'endroit où deux de ces entités, les stages et les stacks, sont définies comme de la donnée plutôt que comme du code.

Ce choix a une conséquence directe : tout le reste en découle. Le flux, le graphe de dépendances entre stages, la décision de jouer ou de sauter une étape ne sont pas réécrits dans chaque script ; ils se déduisent de ce que le registre déclare. Une seule source à maintenir, plutôt qu'une logique éparpillée qui dérive d'un projet à l'autre.

Côté mécanique, ces descriptions sont des **manifestes YAML**, rangés dans `lib/registry/manifests`. Un script de compilation en tire un cache JSON, qui est commité. On ne touche jamais le cache à la main : on édite un manifeste, on recompile.

Une distinction s'impose, parce que la ressemblance avec le `brik.yml` peut tromper. Le `brik.yml`, c'est vous qui l'écrivez, un par projet. Les manifestes, eux, font partie du code de Brik : livrés avec l'outil, vous n'avez jamais à les remplir pour configurer un pipeline. Si on les ouvre ici, c'est pour montrer comment Brik raisonne, pas parce qu'il y aurait quelque chose à y faire. Les éditer, c'est l'affaire des mainteneurs, ou de qui veut étendre Brik, ce qu'on verra plus loin.

Voici le manifeste réel du stage de test (`lib/registry/manifests/stages/test.yml`) :

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

Tout ce qui définit le comportement d'un stage est là, en clair, et pas dans du code :

- **`placement`** décrit la position dans le flux (`after: [build]`, `before: [package]`) et le groupe d'exécution parallèle (`group: verify`). C'est ce qui place Test, Lint, SAST et Scan dans la même salve.
- **`gate`** dit comment le stage bloque. `mode: blocking` signifie qu'un échec arrête le pipeline. Les `contexts` précisent **dans quel type de pipeline** le gate s'applique : `snapshot` (un push de branche) et `release` (un tag).
- **`consumes` / `provides`** forment un véritable graphe de dépendances entre stages. Test consomme l'artefact de build et fournit `test.findings` et `coverage.report`. Le stage Package, lui, consommera ces `provides`. Ce graphe n'est pas décoratif : c'est lui qui permet à Brik de savoir quoi attendre, quoi agréger, et quoi sauter.
- **`impact`** indique ce qui rend ce stage pertinent. Ici, `use_stack_impact: test` délègue à la stack le soin de dire quels fichiers comptent comme du test.

Comparez avec le stage de scan de sécurité (`scan.yml`), et le modèle se confirme :

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

Le stage Scan déclare qu'il tourne sur une `runner.class: scanner` (une image dédiée, outillée pour la sécurité), et qu'il n'est concerné que par les changements de fichiers de verrouillage de dépendances. Modifiez un fichier de CSS, `*.css`, le scan de dépendances n'a aucune raison d'être exécuter : son `impact` ne matche pas.

Ajouter une stack ou un stage à Brik, c'est écrire un manifeste comme ceux-là. Pas reprogrammer un orchestrateur. **Décrire, pas coder** : le principe directeur tient dans ces deux mots.

Et ce n'est pas réservé aux mainteneurs de Brik : le registre a été conçu pour être étendu de l'extérieur. Vous décrivez votre propre stack ou stage dans un répertoire à vous, et Brik l'intègre au même titre que les natifs, sans fork.

> info "Aller plus loin : écrire une extension"
> - [`docs/operations/extensions.md`](https://github.com/getbrik/brik/blob/main/docs/operations/extensions.md){:target="_blank" rel="noopener noreferrer nofollow"} : le guide pas à pas (déposer un manifeste, le compiler, fournir le module Bash).
> - `BRIK_REGISTRY_EXTENSIONS_DIRS` : la variable qui pointe la compilation du registre vers vos répertoires d'extension.
> - [`schemas/registry/v1/stack.schema.json`](https://github.com/getbrik/brik/blob/main/schemas/registry/v1/stack.schema.json){:target="_blank" rel="noopener noreferrer nofollow"}, [`stage.schema.json`](https://github.com/getbrik/brik/blob/main/schemas/registry/v1/stage.schema.json){:target="_blank" rel="noopener noreferrer nofollow"} : les schémas que vos manifestes partagent avec les notions natives.
> - `brik extension test <dossier>` : le harnais qui valide votre extension contre le contrat avant publication.

Le périmètre reste volontairement modeste, pas encore de marketplace ni de manifestes signés, mais le point d'extension est ouvert : la mécanique qui vous sert à étendre Brik est celle qui décrit Brik lui-même.

<hr class="hr-text" data-content="Stacks et runners">

## La détection de stack et les images de runner

Le manifeste de stack pousse la même logique côté langage. Voici un extrait réel de `stacks/node.yml` :

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

L'image référencée ici, `ghcr.io/getbrik/brik-runner-node`, n'est pas construite par Brik. Elle vient d'un dépôt distinct, [`brik-images`](https://github.com/getbrik/brik-images){:target="_blank" rel="noopener noreferrer nofollow"}, où une matrice unique (`versions.json`) décrit, stack par stack, les versions et l'outillage à embarquer : une image par langage (`node`, `python`, `java`...), plus des images dédiées aux contrôles, `scanner` pour la sécurité et `analysis` pour le SAST. C'est l'une d'elles que désignait le `runner.class: scanner` du manifeste de scan.

Plusieurs choses concrètes en découlent :

- **La détection est automatique.** Un `package.json` à la racine, et Brik sait qu'il a affaire à une stack Node. Vous pouvez forcer `stack: node` dans votre config, mais la convention précède la configuration.
- **L'image de runner est liée à la stack, pas à votre `.gitlab-ci.yml`.** `ghcr.io/getbrik/brik-runner-node`, versions 22 et 24. La déclaration `stack_version: "22"` dans votre `brik.yml` sélectionne l'image. Vous ne gérez plus d'image dans la config de plateforme.
- **Les défauts sont opinionnés.** Sans rien déclarer, Node teste avec jest, lint avec eslint, formate avec prettier. Ce sont les choix d'une équipe Node sérieuse, fournis par défaut. Vous ne les surchargez que si vous divergez.
- **Les globs d'impact (`source`, `test`) sont la matière première de l'exécution sélective.** On y arrive.

<hr class="hr-text" data-content="Le plan">

## L'exécution sélective : un plan avant l'exécution

Revenons au `mode: balanced` croisé tout à l'heure. C'est la deuxième décision d'architecture majeure de Brik, et celle qui change le plus le quotidien.

**Avant de lancer quoi que ce soit, Brik calcule un plan, il ne l'exécute pas.** Ce plan, matérialisé dans un `plan.json`, contient pour chaque stage : la décision run ou skip, et surtout la **raison** de cette décision. Il est agnostique de la plateforme et reproductible à l'octet près pour un même HEAD et un même `brik.yml`.

Le mode de sélection arbitre ces décisions :

- **`safe`** : tout tourne. Aucun stage ne saute. C'est le mode des pipelines de release, où l'on ne prend aucun risque.
- **`balanced`** : Brik croise les fichiers modifiés depuis la base avec les globs d'`impact` des stages et des stacks. Une PR qui ne touche que de la documentation ne déclenche ni build, ni test, ni scan. Une PR qui modifie un `package-lock.json` réveille le scan de dépendances. Chaque skip est motivé, pas deviné.

Le mode le plus agressif, lui, est encore différé. Il vise le monorepo : un graphe d'impact par sous-projet, qui ne déclenche les stages d'un sous-projet que si ses propres fichiers ont changé, là où `balanced` raisonne encore à l'échelle du dépôt entier. Le planificateur le refuse explicitement aujourd'hui, par prudence assumée : on préfère un outil qui sait dire "je ne sais pas encore le faire sans risque" plutôt qu'un outil qui saute des contrôles sans pouvoir le justifier.

Concrètement, vous pouvez demander à Brik d'expliquer ce qu'il va faire, et pourquoi, **avant** qu'il ne le fasse :

{% highlight bash %}
brik plan --explain
brik validate --config brik.yml
{% endhighlight %}

Le `validate` confronte votre config au schéma JSON de référence (la chaîne de validation préfère [`jv`](https://github.com/santhosh-tekuri/jsonschema){:target="_blank" rel="noopener noreferrer nofollow"}, un binaire Go, et retombe sur [`check-jsonschema`](https://github.com/python-jsonschema/check-jsonschema){:target="_blank" rel="noopener noreferrer nofollow"} en Python si besoin). Le `plan --explain` vous donne la décision motivée, stage par stage. La CI cesse d'être une boîte noire dont on attend le verdict. Elle devient un plan que l'on peut lire, valider et rejouer.

Et parce que les adaptateurs de plateforme exécutent ce plan plutôt que de le recalculer, c'est lui, le `plan.json`, qui garantit que GitLab, Jenkins et votre poste prennent exactement les mêmes décisions.

> info "Aller plus loin : le plan"
> - [`lib/planning/`](https://github.com/getbrik/brik/tree/main/lib/planning){:target="_blank" rel="noopener noreferrer nofollow"} : le calcul du plan (sélection, analyse d'impact, lecture et écriture).
> - `.brik-logs/plan.json` : le plan produit, motivé stage par stage.
> - `brik plan --explain` / `brik plan gate` : inspecter le plan, puis l'exécuter.
> - [`schemas/config/v1/brik.schema.json`](https://github.com/getbrik/brik/blob/main/schemas/config/v1/brik.schema.json){:target="_blank" rel="noopener noreferrer nofollow"} : le schéma que `brik validate` applique.

<hr class="hr-text" data-content="Sécurité">

## La sécurité n'est pas une option, c'est un slot

Regardez à nouveau le flux. Trois des quatre stages parallèles sont des stages de sécurité : SAST, Scan, et plus loin le Container Scan après Package. Ce n'est pas un hasard de présentation. C'est une position dans l'architecture.

- **SAST** fait l'analyse statique du code (outils de la classe analysis, type [semgrep](https://semgrep.dev/){:target="_blank" rel="noopener noreferrer nofollow"} ou [checkov](https://www.checkov.io/){:target="_blank" rel="noopener noreferrer nofollow"} pour l'IaC).
- **Scan** couvre les dépendances et les secrets. Son manifeste le déclare : il fournit `dependency.findings` et `secret.findings`.
- **Container Scan** s'exécute après le Package, sur l'image construite, avec des outils dédiés ([grype](https://github.com/anchore/grype){:target="_blank" rel="noopener noreferrer nofollow"}, [syft](https://github.com/anchore/syft){:target="_blank" rel="noopener noreferrer nofollow"} pour le SBOM, [osv](https://github.com/google/osv-scanner){:target="_blank" rel="noopener noreferrer nofollow"}, [hadolint](https://github.com/hadolint/hadolint){:target="_blank" rel="noopener noreferrer nofollow"} pour le Dockerfile). Son seuil se déclare en clair : `security.container.severity: critical`.

Les `gate.contexts` introduits plus haut prennent ici tout leur sens. Un même stage peut bloquer différemment selon qu'on est sur un push de branche (`snapshot`) ou sur un tag (`release`). On peut tolérer un avertissement en développement et le rendre bloquant à la release, sans dupliquer la moindre ligne de pipeline.

Et le gate de fin ne se fie pas à la couleur des jobs. **Package décide sur le résultat métier**, agrégé dans un rapport (`aggregate-report.json`). Un job affiché en vert pour de mauvaises raisons, parce qu'un outil a renvoyé 0 par accident ou parce qu'une étape a été avalée, ne passe pas le gate. C'est une distinction subtile mais décisive : Brik raisonne sur ce que les contrôles ont réellement trouvé, pas sur leur code de sortie.

<hr class="hr-text" data-content="Déploiement">

## Promotion et déploiement : des conditions, pas des bricolages

Le stage `Promote` mérite qu'on s'y arrête, parce qu'il encode une bonne pratique souvent réinventée à la main. Son manifeste :

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

Promote ne s'active que dans le contexte `release` (un tag). Il consomme l'artefact de package **et** les résultats du container scan : on ne promeut pas une image qui n'a pas passé le scan. Il fournit la référence et le digest de l'image de release. Et il est marqué `dry_run.destructive: true`, ce qui veut dire que Brik sait qu'il s'agit d'une opération à effet de bord, à traiter avec précaution en simulation. La séparation candidate / release n'est plus un script bricolé par chaque équipe : c'est un stage du flux, avec ses garde-fous.

Le déploiement, lui, déclare ses environnements et leurs règles d'activation de façon lisible. Voici la config réelle de `node-workflow-trunk` :

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

Staging sur `main`, production sur un tag `v*`. La logique de promotion entre environnements vit dans la config, en clair, et non dans un enchevêtrement de `rules:` propres à une plateforme.

Mieux : le `workflow: trunk-based` référence un **profil de déploiement intégré**. Brik fournit trois profils préconfigurés, `trunk-based`, `git-flow` et `github-flow`, qui posent des défauts raisonnables que vous n'avez qu'à surcharger. Le profil trunk-based, par exemple, définit déjà :

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

Vous adoptez un modèle de branchement éprouvé d'une seule ligne, puis vous n'ajustez que ce qui diffère chez vous (le namespace, le manifeste, la cible).

Et les cibles sont réelles, pas théoriques. Six adaptateurs de déploiement sont fournis : **Kubernetes, Helm, Compose, SSH, GitOps et ArgoCD**. Le GitOps est traité comme une cible de première classe : au lieu de pousser vers un cluster, Brik écrit dans un dépôt de configuration qu'un contrôleur réconcilie.

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

Le rollout tient en trois pièces, et vous n'en déclarez que deux. Le **profil**, c'est le `workflow` déjà choisi : il pose les conventions d'environnement. La **stratégie** se règle par environnement. La **santé**, elle, ne se déclare pas.

{% highlight yaml %}
deploy:
  workflow: trunk-based
  environments:
    production:
      strategy: canary
{% endhighlight %}

Le profil a déjà fixé quand et où déployer la production ; vous n'ajoutez que la manoeuvre : `rolling`, `blue-green` ou `canary`. Quant à la santé, il n'y a pas de champ à remplir : côté Kubernetes, Brik attend que le déploiement converge (`kubectl rollout status`, avec un délai d'attente par défaut) avant de valider l'étape. Stratégie, profils et vérification de santé : toute cette logique vit dans le coeur de Brik, pas recopiée d'un projet à l'autre.

> info "Aller plus loin : déploiement et rollout"
> - [`lib/deployments/`](https://github.com/getbrik/brik/tree/main/lib/deployments){:target="_blank" rel="noopener noreferrer nofollow"} : les six adaptateurs (`k8s`, `helm`, `compose`, `ssh`, `gitops`, `argocd`).
> - [`lib/rollout/`](https://github.com/getbrik/brik/tree/main/lib/rollout){:target="_blank" rel="noopener noreferrer nofollow"} : santé, stratégie et profils post-déploiement.
> - [`lib/rollout/data/deploy-profiles/`](https://github.com/getbrik/brik/tree/main/lib/rollout/data/deploy-profiles){:target="_blank" rel="noopener noreferrer nofollow"} : les profils `trunk-based`, `git-flow`, `github-flow`.

<hr class="hr-text" data-content="Le rapport">

## Le rapport : une pipeline qui se lit

Une pipeline qui passe au vert ne dit pas grand-chose. Ce qu'on veut savoir, c'est ce qu'elle a réellement fait : quels stages ont tourné, lesquels ont sauté et pourquoi, ce que les scanners ont trouvé, quelle version a été promue. Brik condense tout cela dans un **rapport agrégé**, produit à chaque run sous trois formes tirées d'une même source.

{% highlight text %}
aggregate-report.json   # les données agrégées, pour les machines
aggregate-report.md     # le résumé, pour le terminal et les commentaires de PR
aggregate-report.html   # la vue riche, pour le navigateur
{% endhighlight %}

Le JSON est le rapport lui-même : les données agrégées de la pipeline, conformes à un schéma versionné (`schema_version: "1.1"`) que des consommateurs externes lisent sans surprise. Le Markdown se colle dans un commentaire de merge request ou se lit à même le terminal. Et le HTML est un rapport auto-portant, que l'on partage ou que l'on garde comme preuve.

Voici un exemple réel, tel que Brik le produit : la release `v0.1.0` du projet `node-deploy-gitops`, jouée sur GitLab et déployée en GitOps. Douze stages, onze réussis, `promote` qui se met en retrait parce que le déploiement ne vise qu'un environnement hors-production (`staging`), et une issue métier en `warning` : le scan de conteneur a bien trouvé des vulnérabilités, mais la policy de l'organisation les a exemptées, et le gate passe sans bloquer.

<figure class="article">
  <a href="/assets/brik/aggregate-report.html" target="_blank" rel="noopener noreferrer">
    {% picture {{site.baseurl}}/assets/img/brik-pipeline-report.png --alt Le rapport HTML d'une pipeline Brik%}
  </a>
  <figcaption>Le rapport HTML d'un run Brik (projet <code>node-deploy-gitops</code>). Cliquez sur l'image pour ouvrir le rapport interactif complet.</figcaption>
</figure>

Ce qu'on y lit, de haut en bas : l'identité du commit (auteur, message, dépôt), la plateforme et le contexte (`snapshot` ou `release`), une bannière `DRY-RUN` quand le run était une simulation, puis le détail stage par stage, avec le statut, la durée, l'image de runner, et pour chaque stage sauté la **raison** héritée du plan. Vient ensuite l'issue métier (`success`, `warning` ou `error`) avec ses compteurs, la policy active, et les findings : ceux qui bloquent, ceux qui sont ignorés avec leur source d'exemption, et le palmarès des plus sévères, CVE liée, correctif proposé et outil à l'appui.

Un détail d'ingénierie éclaire la richesse de la page, qui se passe pourtant de serveur et de dépendance. Le HTML **embarque sa propre donnée** : le JSON agrégé et le `plan.json` sont inclus dans la page comme îlots de données, qu'un script rend côté navigateur. On dispose alors de filtres par sévérité, d'une recherche, d'onglets et de sections repliables. CSS, JS et logo sont inlinés. Le résultat est un fichier unique et autoporté, qu'on ouvre hors-ligne et qui voyage avec le run. Le HTML n'est pas une capture figée : c'est le JSON rendu navigable.

> info "Aller plus loin : le rapport"
> - [`docs/operations/pipeline-report.md`](https://github.com/getbrik/brik/blob/main/docs/operations/pipeline-report.md){:target="_blank" rel="noopener noreferrer nofollow"} : le contrat de champs, version par version.
> - [`docs/operations/policy.md`](https://github.com/getbrik/brik/blob/main/docs/operations/policy.md){:target="_blank" rel="noopener noreferrer nofollow"} : la policy de l'organisation qui exempte les findings (allow-list de CVE et de chemins).
> - [`schemas/report/v1.1/`](https://github.com/getbrik/brik/tree/main/schemas/report/v1.1){:target="_blank" rel="noopener noreferrer nofollow"} : le schéma du rapport.

<hr class="hr-text" data-content="Les artéfacts">

## Les artéfacts : la preuve, là où vous la cherchez déjà

Le rapport est la partie visible. Sous lui, chaque run laisse un arbre de preuves complet, et Brik est strict sur sa structure : tout ce qu'une pipeline produit atterrit dans deux dossiers à la racine de l'espace de travail.

{% highlight text %}
brik-artifacts/              # l'arbre de preuves canonique (API publique)
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
.brik-logs/                  # l'arbre opérationnel (logs, plan.json, pipeline.env)
{% endhighlight %}

Deux arbres, deux rôles. `brik-artifacts/` est l'**API publique** : un sous-dossier par stage, son fragment `<stage>.json`, et les rapports outillés à des formats standard. On y trouve du SARIF pour les findings (dépendances, secrets, SAST, scan de conteneur), du CycloneDX pour le SBOM, du JUnit pour les tests, du Cobertura ou du Jacoco pour la couverture. `.brik-logs/`, lui, est l'arbre opérationnel : logs par stage, `plan.json`, `pipeline.env`, verrous. De la matière de débogage, pas un contrat.

En CI, chaque stage tourne dans son propre conteneur et publie son `brik-artifacts/<stage>/` comme artéfact de job. Le stage `notify`, en fin de course, ramasse tous les fragments et les fusionne en `aggregate-report`. Mais, et c'est le point qui compte, **Brik n'invente aucun coffre propriétaire**. Il écrit dans cet arbre canonique, et les adaptateurs fins l'exposent via les mécanismes natifs de chaque plateforme.

Sur GitLab, chaque job déclare `brik-artifacts/` en `artifacts.paths`, `when: always`, conservé une semaine ; le job Notify republie l'arbre entier sous le nom `aggregate-report-<pipeline-id>`, conservé un mois. Et l'intégration native fait remonter les findings là où GitLab les attend déjà :

{% highlight yaml %}
artifacts:
  reports:
    junit: brik-artifacts/test/junit.xml
    coverage_report:
      coverage_format: cobertura
      path: brik-artifacts/test/coverage/coverage.xml
    sast: brik-artifacts/gl-sast-report.json
{% endhighlight %}

Les tests s'affichent dans le widget de merge request, la couverture devient un badge, les findings SAST peuplent l'onglet Sécurité. Sur Jenkins, c'est `archiveArtifacts` : l'arbre `brik-artifacts/` est navigable directement dans l'archive du build.

La conséquence pour le quotidien est la même que pour le reste de Brik : vous consultez les preuves là où vous regardez déjà, dans les artéfacts de job et les onglets natifs sur GitLab, dans l'archive du build sur Jenkins, et non dans une interface tierce à apprendre. Et le rapport HTML autoporté, lui, voyage avec le run : on le télécharge, on l'ouvre hors-ligne, il reste lisible sans Brik ni plateforme. En local, même histoire : le run dépose le même arbre, et vous relisez exactement les mêmes preuves que la CI.

<hr class="hr-text" data-content="Pourquoi Bash">

## Pourquoi Bash pour la logique métier

Reste le choix qui surprend le plus, alors autant l'assumer franchement : tout ce que je viens de décrire est écrit en Bash. Pas en Go, pas en Python, pas en Rust.

Ce n'est pas une posture nostalgique. C'est une décision d'industrialisation.

Un runner de CI, quel qu'il soit, sait déjà faire tourner du shell. C'est le plus petit dénominateur commun de toute l'industrie. Un binaire compilé, lui, doit être distribué, versionné par architecture, installé, mis à jour. Du Bash, vous le clonez et il s'exécute. Partout, immédiatement, sans toolchain.

Brik s'appuie sur trois outils que tout ingénieur CI connaît déjà : [`yq`](https://github.com/mikefarah/yq){:target="_blank" rel="noopener noreferrer nofollow"} pour parser le YAML, [`jq`](https://jqlang.github.io/jq/){:target="_blank" rel="noopener noreferrer nofollow"} pour manipuler le JSON. La logique métier reste lisible par celui qui la débogue à 2 heures du matin dans un job en échec, parce qu'elle est faite de la même matière que le job lui-même.

Le Bash a mauvaise réputation, et souvent à juste titre : scripts fragiles, variables non quotées, erreurs avalées en silence. La réponse de Brik n'est pas d'éviter le Bash, mais de le **traiter comme un vrai langage d'ingénierie**. Concrètement :

- **Des fonctions nommées par convention.** Chaque fonction suit le schéma `<notion>.<sous-module>.<verbe>` : `stages.build`, `stacks.node.test`, `deploy.k8s.run`. Un chargeur résout les notions depuis l'arborescence. On lit un nom de fonction et on sait où il vit.
- **Des helpers centralisés, jamais réimplémentés.** La lecture de variables indirectes passe par un helper unique, la résolution d'outils par un registre à trois niveaux, les éditions YAML par une couche dédiée, les boucles d'attente par un `transverse.wait.until` commun. On ne réinvente pas la roue à chaque stage.
- **Des fichiers courts et une couverture sérieuse.** 200 à 400 lignes par fichier, 800 au maximum, une arborescence de specs qui reflète celle du code, et une suite de plus de 3600 exemples, mesurée par kcov.

Ce dernier point mérite qu'on s'y arrête, parce qu'il est rare. On teste peu le Bash, et on en mesure la couverture presque jamais. Brik fait les deux.

Les tests, justement, s'écrivent avec [**ShellSpec**](https://shellspec.info/){:target="_blank" rel="noopener noreferrer nofollow"}, un framework BDD pour shell. Chaque exemple suit la logique ***given / when / then*** : un contexte, une action, le résultat attendu. La couverture de lignes, elle, est relevée par [**kcov**](https://github.com/SimonKagstrom/kcov){:target="_blank" rel="noopener noreferrer nofollow"}, qui instrumente les scripts pendant leur exécution. Le shell hérite ainsi des mêmes métriques qu'un projet compilé.

Du Bash discipliné reste du Bash. Mais discipliné, il s'industrialise.

> info "Aller plus loin : l'architecture du code"
> - [`docs/internals/layout.md`](https://github.com/getbrik/brik/blob/main/docs/internals/layout.md){:target="_blank" rel="noopener noreferrer nofollow"} : les onze notions et leur arborescence.
> - [`docs/concepts/architecture.md`](https://github.com/getbrik/brik/blob/main/docs/concepts/architecture.md){:target="_blank" rel="noopener noreferrer nofollow"} : le pourquoi des choix d'architecture.
> - [`Makefile`](https://github.com/getbrik/brik/blob/main/Makefile){:target="_blank" rel="noopener noreferrer nofollow"} : `make test`, `make lint`, `make coverage`.

<hr class="hr-text" data-content="Portabilité">

## La portabilité, concrètement

Voilà où tous les choix précédents paient leur dette.

Parce que la logique vit dans Brik et que les adaptateurs de plateforme exécutent un plan plutôt que de le recalculer, le même pipeline tourne sur **GitLab CI, Jenkins, et en local**, sans réécriture. Les adaptateurs sont fins : ils traduisent le plan dans l'ordonnancement de la plateforme hôte, et passent la main à Brik via `brik plan gate`. La logique de décision, elle, ne se duplique jamais.

La conséquence pour le quotidien est directe : la commande qui tourne sur votre poste est la même que celle qui tourne en CI. Le "ça marche chez moi" perd son terrain, parce que la machine et la CI exécutent le même programme, à partir du même plan.

Un point d'architecture mérite d'être souligné, parce qu'il est rare : **le runtime de Brik n'est pas embarqué dans les images de runner.** Les images embarquent les prérequis (bash, yq, jq, git, le toolchain de la stack), mais Brik est cloné au moment de la CI par la librairie partagée. Les images et le runtime ont des cycles de release découplés. Vous corrigez un comportement de pipeline sans reconstruire ni redistribuer la moindre image Docker. Et toutes ces images sont rebuildées périodiquement pour absorber les CVE de l'OS, indépendamment de votre code.

Et puisqu'on parle d'images : celle qui s'exécute à chaque stage n'est pas figée non plus. La correspondance entre une classe de runner et son image vit dans un fichier unique, `runner_classes.yml`, que l'on peut surcharger à l'aide de la variable, `BRIK_RUNNER_CLASSES_FILE`, sans toucher au défaut livré. C'est exactement ce dont se sert la suite end-to-end pour valider le workflow : elle fait pointer la variable vers une définition où chaque classe retombe sur une même image légère, `brik-runner-stub`, dont les outils réels (scanners, toolchains, déploiement) sont remplacés par des stubs. On peut alors rejouer le flux entier, décisions et gates compris, sans réelle action ni livrable.

> info "Aller plus loin : les adaptateurs de plateforme"
> - [`shared-libs/gitlab/`](https://github.com/getbrik/brik/tree/main/shared-libs/gitlab){:target="_blank" rel="noopener noreferrer nofollow"} : la génération du pipeline GitLab à partir du plan.
> - [`shared-libs/jenkins/`](https://github.com/getbrik/brik/tree/main/shared-libs/jenkins){:target="_blank" rel="noopener noreferrer nofollow"} : l'équivalent Jenkins.
> - [`shared-libs/local/`](https://github.com/getbrik/brik/tree/main/shared-libs/local){:target="_blank" rel="noopener noreferrer nofollow"} : l'exécution locale, même plan, mêmes décisions.

<hr class="hr-text" data-content="Limites">

## Ce que Brik n'est pas

Soyons honnêtes sur le périmètre, parce qu'un outil qui prétend tout faire, ne fait rien de bien.

Brik n'est pas un ordonnanceur, ni une plateforme. Il ne remplace ni GitLab ni Jenkins : il s'exécute dessus. Il impose un flux standard, ce qui est précisément sa force, mais c'est aussi une contrainte assumée : si votre besoin réclame un graphe de jobs arbitraire et entièrement libre, ce flux est un cadre, pas une feuille blanche.

Le mode de planification le plus agressif est encore différé : aujourd'hui, on raisonne en `safe` et `balanced`. Et le projet vit : version 0.7.0 au moment où j'écris ces lignes. C'est un outil jeune, mais pas un prototype. La suite de tests et une validation end-to-end qui rejoue de vrais pipelines contre de vrais orchestrateurs, GitLab et Jenkins, avec déploiement Kubernetes et réconciliation ArgoCD, en témoignent.

<hr class="hr-text" data-content="La suite">

## Les chantiers ouverts

Brik couvre déjà le flux complet d'une livraison sérieuse. Mais quelques pièces manquent encore pour qu'un CI/CD soit cohérent de bout en bout, et elles comptent autant que ce qui est en place. Je les pose ici, en toute transparence, parce qu'elles dessinent la suite.

### Casser le pipeline monolithique

Aujourd'hui, le déploiement vit à l'intérieur d'un passage de CI. Or CI et CD répondent à des rythmes différents : on veut parfois redéployer une version déjà construite et déjà validée, sans rejouer build, tests et scans.

| En place | Reste à faire |
|---|---|
| Le `plan.json`, agnostique de la plateforme et reproductible, sépare déjà la décision de déploiement de son exécution. C'est le premier jalon. | Déclencher un déploiement à partir d'un artefact promu, sans repasser par une CI complète. |

### Pinner les images de runner

| En place | Reste à faire |
|---|---|
| La chaîne de production des images est durcie : chaque image `brik-runner-*` est signée avec [cosign](https://github.com/sigstore/cosign){:target="_blank" rel="noopener noreferrer nofollow"}, accompagnée d'un SBOM et d'une attestation de provenance [SLSA](https://slsa.dev/){:target="_blank" rel="noopener noreferrer nofollow"}, scannée et reconstruite chaque semaine pour absorber les CVE de l'OS. | Côté consommation, référencer ces images par digest plutôt que par tag, et vérifier leur signature avant de les exécuter, pour qu'aucune image non attestée n'entre dans un pipeline. |

### Durcir la chaîne de livraison elle-même

Un pipeline ne vaut que si la CI qui le fait tourner n'est pas le maillon faible.

| En place | Reste à faire |
|---|---|
| Côté [GitHub Actions, le durcissement](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions){:target="_blank" rel="noopener noreferrer nofollow"} est entamé : actions épinglées à un SHA de commit complet, scan de secrets, [Dependabot](https://docs.github.com/en/code-security/dependabot){:target="_blank" rel="noopener noreferrer nofollow"}, [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repos-settings-and-features/customizing-your-repository/about-code-owners){:target="_blank" rel="noopener noreferrer nofollow"}, protection de branche et signature des commits. | Poursuivre ce durcissement jusqu'à ce qu'une dépendance de CI compromise ne puisse jamais altérer un livrable. |

### Industrialiser l'installation sur les orchestrateurs

Le runtime de Brik est portable mais sa mise en place sur un orchestrateur ne l'est pas encore.

| En place | Reste à faire |
|---|---|
| En local, l'histoire est bonne : `brew install brik` pose le CLI sur macOS comme sur Linux, et le tap se met à jour à chaque release ([Tap Homebrew de Brik](https://github.com/getbrik/homebrew-tap){:target="_blank" rel="noopener noreferrer nofollow"}). | Sur une plateforme CI, un opérateur qui veut accueillir Brik doit encore écrire son propre runbook : créer le groupe GitLab, enregistrer le runner, relever la limite de variables dotenv, poser une quinzaine de variables CI/CD, ou côté Jenkins installer quatorze plugins et configurer JCasC à la main. Le chantier étend le principe des adaptateurs minces à la distribution : modules Terraform pour GitLab, chart Helm en surcouche du chart officiel Jenkins, et paquets natifs Linux pour le CLI local au-delà de Homebrew (apt, rpm, AUR), composés avec les outils natifs de chaque plateforme, sans nouveau binaire propriétaire ni génération de code commitée. Objectif chiffré : faire tomber l'adoption GitLab de un ou deux jours à trente minutes, et Jenkins de deux ou trois jours à une heure. |

### Auditer les pipelines générés, avec Plumber

Brik produit des pipelines, encore faut-il vérifier qu'ils respectent les bonnes pratiques de sécurité une fois rendus sur la plateforme. C'est le rôle de [Plumber](https://getplumber.io/){:target="_blank" rel="noopener noreferrer nofollow"}, un scanner de conformité open-source pour pipelines CI/CD, qui contrôle entre autres l'épinglage des images par digest, les sources d'images autorisées, la protection de branche ou les expansions de variables dangereuses.

| En place | Reste à faire |
|---|---|
| Le chantier est lancé dans [plumber-audit](https://github.com/getbrik/plumber-audit){:target="_blank" rel="noopener noreferrer nofollow"} : il passe au crible les pipelines GitLab générés par Brik, et s'étend à GitHub. | Doter Jenkins d'un équivalent, qui n'existe pas encore. |

<hr class="hr-text" data-content="Conclusion">

## Reprendre la main sur sa livraison

La vraie question que pose Brik n'est pas technique. Elle est stratégique.

Pourquoi acceptons-nous encore que la logique de livraison, l'un des actifs les plus critiques d'une équipe, soit rédigée dans le langage d'une seule plateforme, au point d'en rester prisonnière ? Pourquoi le savoir-faire qui dit comment on teste, comment on sécurise et comment on déploie devrait-il être réécrit à chaque migration ?

Brik n'est pas une solution miracle. C'est une direction. Celle d'un CI/CD où le flux est un standard, où la config reste déclarative, où la logique métier est un programme testé et portable, et où la plateforme redevient ce qu'elle aurait toujours dû rester : un endroit où exécuter votre pipeline, pas son propriétaire.

Le code est ouvert : [github.com/getbrik/brik](https://github.com/getbrik/brik). Le flux est lisible. Les manifestes se lisent comme de la documentation. Et la prochaine migration de plateforme, pour une fois, pourrait n'être qu'un changement d'adaptateur.

Le prochain stage, la prochaine stack, le prochain adaptateur peuvent venir de vous.
