---
layout: post
title: "CrewAI, Ollama, Mixtral : Une Squad Agile dans votre Ordinateur"
date: 2024-02-12 14:49:00 +0100
description: "Découvrez comment l'IA transforme le dev logiciel avec une squad Agile virtuelle, améliorant efficacité et vélocité."
img: crewai-mixtral-agile-team.jpg
fig-caption: Une Squad Agile dans votre Ordinateur avec <a href="#">DALL•E</a>
tags: [AI, Agile, LLM, Mixtral, Development, DevOps]
lang: fr
permalink: /crewai-mixtral-agile-team/
status: finished
---

Dans le domaine de l'IT, l'Intelligence Artificielle (IA) se présente comme un phénomène révolutionnaire, porteur, à la 
fois, de promesses et de défis. Au cœur des discussions professionnelles, deux courants de pensée se distinguent 
nettement. D'un côté, nous avons une population de développeurs sceptiques, doutant fortement que l'IA puisse un jour 
remplacer l'expertise humaine et l'intuition créative nécessaires à leur travail. De l'autre, une seconde population
considère cette possibilité avec une certaine résignation, se demandant davantage « quand » cela se produira plutôt que 
« si » cela est possible.

Cet article se propose d'évaluer les avancées de l'IA dans le domaine du développement logiciel,
en s'appuyant sur un cas typique que l'on retrouve dans les équipes de dev : une squad Agile devant livrer un produit 
logiciel.

Par cette démarche, nous souhaitons offrir aux professionnels de l'IT une vision claire et actualisée sur les capacités 
réelles de l'IA et son potentiel à transformer le paysage du développement logiciel. Sans prétendre apporter une réponse 
définitive à la question de la substitution des développeurs par l'IA, notre objectif est de présenter des données 
concrètes et des résultats tangibles qui éclairent le débat et invitent à la réflexion sur l'avenir de notre profession 
dans un monde où l'IA prend de plus en plus de place.

<hr class="hr-text" data-content="Sommaire">

* TOC
{:toc}

<hr class="hr-text" data-content="Technos">

## Les Outils à notre Disposition

Pour mettre en œuvre notre projet, nous allons utiliser des solutions d'IA existantes et qui sont disponibles pour le 
grand public. Pas besoin donc d'avoir une ferme de serveurs calculant, pendant des semaines, un nouveau modèle 
potentiellement révolutionnaire.

### Architecture d'IA

Une des dernières avancées de l'IA est l'utilisation d'architecture multi-agents, une approche où plusieurs agents intelligents 
fonctionnent de manière autonome tout en collaborant pour atteindre un objectif commun. Cette technique surpasse les 
approches traditionnelles basées sur un seul modèle d'IA en reproduisant des processus de pensée et de décision 
complexes qui caractérisent normalement l'intelligence humaine. Plusieurs solutions existent. Les plus notables sont à l'heure actuelle : 
[AutoGen](https://microsoft.github.io/autogen/){:target="_blank" rel="noopener noreferrer nofollow"} de Microsoft et 
[CrewAI](https://www.crewai.com/){:target="_blank" rel="noopener noreferrer nofollow"}, plus simple à utiliser, car basé sur le framework 
[LangChain](https://www.langchain.com/){:target="_blank" rel="noopener noreferrer nofollow"}. 

Notre choix se portera donc sur CrewAI. Son intégration à LangChain lui permet de bénéficier de l'intégration de tous 
les modèles Open Source de [Ollama](https://ollama.com/){:target="_blank" rel="noopener noreferrer nofollow"} et de les 
faire fonctionner très simplement sur un poste en local. De plus, il simplifie la simulation de différents rôles et 
interactions entre les agents.

### Modèle d'IA

Pour simuler notre équipe virtuelle de développement Agile, nous allons utiliser des modèles LLM afin de remplir le 
rôles de chacun de ses membres. 

Plusieurs choix s'offrent à nous grâce aux [différents modèles](https://ollama.com/library){:target="_blank" rel="noopener noreferrer nofollow"}
supportés par Ollama. Nous utiliserons le dernier modèle de MistralAI, [Mixtral8x7B](https://mistral.ai/news/mixtral-of-experts/){:target="_blank" rel="noopener noreferrer nofollow"},
un modèle LLM de dernière génération basé sur une architecture Mixture-of-Experts (MoE).

Avec cette combinaison de technologies, nous allons pouvoir repousser les frontières de ce qui est possible dans le 
domaine du développement logiciel et explorer des approches novatrices pour la gestion de projet et la collaboration 
d'équipe.

### Conception du Système

Notre système doit reproduire une équipe Agile complète, où chaque agent d'IA a un rôle précis :
- Le **Product Owner** qui définit les user stories,
- Le **Développeur** qui les traduit en code,
- Le **Reviewer** en charge de s'assurer de la qualité du code produit.

> info "Note"
> Pour cette démonstration, nul besoin d'un **Scrum Master**. En effet, du point de vue d'un réseau de neurones, son 
> rôle de facilitateur est complètement inutile.

Chaque composant de notre architecture est conçu pour interagir de manière cohérente avec les autres, dans le but de 
mener à bien la livraison du produit. Cette approche nous permet de tester l'efficacité de l'IA dans des rôles 
traditionnellement humains et d'évaluer son potentiel à améliorer la productivité et la qualité du développement logiciel.

### Principes Directeurs

Pour rappel, notre projet est guidé par 3 principes clés :
1. nous cherchons à démontrer que l'IA peut non seulement automatiser des tâches, mais aussi contribuer de manière 
significative à des processus créatifs et décisionnels.
2. Nous visons à maintenir une approche Agile la plus authentique possible, même dans un contexte d'automatisation avancée. 
3. Nous accordons une importance particulière à la responsabilité dans l'utilisation de l'IA, en veillant à ce que 
notre projet contribue positivement à l'évolution du développement logiciel.

Nous espérons ainsi montrer de nouvelles perspectives sur l'intégration de l'IA dans le développement logiciel. Cette 
démarche nous permet de questionner et de redéfinir les frontières entre l'Intelligence Artificielle et l'Intelligence 
Humaine, en montrant comment l'IA peut compléter et enrichir les capacités humaines plutôt que de simplement les 
remplacer.

### Code Source 

Vous trouverez le code source de ce projet dans le repo GitHub [https://github.com/jeanjerome/ai-agile-team](https://github.com/jeanjerome/ai-agile-team){:target="_blank" rel="noopener noreferrer nofollow"}

<hr class="hr-text" data-content="Agents">

## Les Agents Autonomes

Notre projet s'appuie sur l'utilisation de CrewAI, un framework d'orchestration d'Agents autonomes d'IA.

Il faut voir un Agent comme un membre d'une équipe, avec des compétences spécifiques et une tâche particulière à accomplir.
Il peut exécuter des tâches, prendre des décisions ou encore communiquer avec d'autres agents.

Dans CrewAI, un agent est caractérisé par trois attributs principaux :
- Un **Rôle** (Role) qui spécifie sa fonction au sein de l'équipe et identifie les tâches pour lesquelles il est 
particulièrement qualifié.
- Un **Objectif** (Goal) représentant la finalité que l'agent s'efforce d'atteindre, orientant ainsi ses choix et ses 
actions.
- Une **Histoire** (Backstory) offrant un cadre au rôle et à l'objectif de l'agent, améliorant de ce fait les dynamiques 
d'interaction et de collaboration.

Dans notre cas de squad Agile, nous allons créer 3 types d'Agents :
- Le **Product Owner**,
- Le **Developer**,
- Le **Reviewer**.

### L'Agent Product Owner

Nous attendons de cet Agent la génération automatisée de User Stories (US) : l'IA analyse les besoins du projet et génère des
US cohérentes, permettant que le **_Developer_** ait une compréhension rapide et une mise en œuvre efficace des 
fonctionnalités requises.

Voici comment le définir avec CrewAI :

{% highlight python %}
po = Agent(
  role="Product Owner",
  goal="Ensure the detailed drafting of user stories",
  backstory="""As the Product Owner of an Agile team, you excel at comprehending market demands, identifying the target audience,
    and analyzing the competition. This expertise is essential for validating if a concept addresses a market need and possesses
    the potential to captivate a broad audience. You are skilled at devising strategies to appeal to the widest possible audience,
    ensuring the product aligns with user stories and meets market expectations.
  """,
  [.../...]
)
{% endhighlight %}

### L'Agent Developer

Nous souhaitons que cet Agent implémente les fonctionnalités du produit qui sont décrites sous la forme d'US : les 
**_Developer_**s programment le code nécessaire pour répondre aux US.

Définissons-le à son tour :

{% highlight python %}
developer = Agent(
  role="Bash Scripting Expert",
  goal="Implement the requirements outlined in each user story through coding",
  backstory="""You are a master of Bash scripting, with a profound knowledge of Unix-based systems. Your expertise is in writing
    scripts and also understanding how these scripts can streamline operations, automate mundane tasks, and solve complex technical
    challenges. With a keen eye for detail and a deep understanding of system architecture, you adeptly craft scripts that enhance
    productivity and ensure robust system performance. Your ability to decipher and optimize existing scripts, as well as to innovate
    new solutions, makes you an invaluable asset. Your insights and contributions are key in optimizing workflows, improving operational
    reliability, and driving technological efficiency.
  """,
  [.../...]
)
{% endhighlight %}

### L'Agent Reviewer

Cet agent effectue la revue du code, s'assurant de la qualité et de la conformité aux standards du code produit.

Examinons plus en détail sa définition :

{% highlight python %}
reviewer = Agent(
  role="Reviewer",
  goal="Review the code to assess the quality, maintainability, and alignment with the team's standards and best practices",
  backstory="""You are a guardian of code quality, with a keen understanding of Agile development practices and a sharp eye for detail in code review.
    Your expertise goes beyond mere code inspection; you are adept at ensuring that developments not only function as intended but also adhere
    to the team's coding standards, enhance maintainability, and seamlessly integrate with existing systems. With a deep appreciation for
    collaborative development, you provide constructive feedback, guiding contributors towards best practices and fostering a culture of
    continuous improvement. Your meticulous approach to reviewing code, coupled with your ability to foresee potential issues and recommend
    proactive solutions, ensures the delivery of high-quality software that is robust, scalable, and aligned with the team's strategic goals.
  """,
  [.../...]
)
{% endhighlight %}

<hr class="hr-text" data-content="Tasks">

## Les Tâches (Tasks)

Dans le contexte de CrewAI, les tâches (tasks) sont des missions individuelles que les agents accomplissent. Elles 
encapsulent les informations nécessaires pour l'exécution, incluant une description, un agent assigné, et les outils 
requis, offrant une flexibilité pour diverses complexités d'action.

Ces tâches peuvent aussi être conçues pour nécessiter une collaboration entre les agents. Cette approche collaborative 
peut être définie dans les propriétés de la tâche.

### La Tâche assignée au Product Owner

Voici la définition des tâches d'un Product Owner. C'est ici qu'un certain niveau de détails est requis :

{% highlight python %}
task1 = Task(
  description="""Develop user stories for a Bash script wrapper function designed to :
    - Execute commands with parameters,
    - Log execution information to a file,
    - Manage status codes,
    - Output result to stdout when available.
    This tool aims to streamline and automate processes, enhancing operational efficiency and reliability. Your user stories should
    clearly articulate the needs and expectations of the users, focusing on how they will interact with the wrapper to perform tasks
    more effectively. Include scenarios covering a range of use cases, from simple command execution to complex workflows involving
    error handling and output management. Ensure that each user story is detailed, specifying the context, the user's goal, and the
    desired outcome, to guide the development team in creating a solution that meets users' needs.
  """,
  agent=po,
)
{% endhighlight %}

> info "Note"
> En fonction du LLM utilisé, il peut être nécessaire de donner des instructions techniques au modèle pour générer sa 
> réponse. En effet, la réponse d'un Agent doit pouvoir servir d'entrée à un autre Agent et un certain format doit être 
> respecté. 
> 
> Les LLMs prenant certaines libertés, il est parfois nécessaires d'ajouter les instructions ci-dessous, à la description,
> afin que l'Agent respecte le formatage attendu :

{% highlight python %}
  description="""
    [.../...]
     These keywords must never be translated and transformed:
     - Action:
     - Thought:
     - Action Input:
     because they are part of the thinking process instead of the output.
     Action Input should be formatted as coworker|task|context.
  """
{% endhighlight %}

### La Tâche assignée au Developer

Voici la tâche du développeur avec tous les détails nécessaires sur la manière de l'accomplir :

{% highlight python %}
task2 = Task(
  description="""Implement the user stories developed by your Product Owner. Your implementation should thoroughly
    address each user story's requirements, providing a seamless experience for the end-users, focusing on creating a robust and efficient tool.
    The task involves coding the various operational scenarios described in the provided user stories. You will follow 'the stdout is for output,
    stderr is for messaging' principal. You ensure your code is clean, well-documented, and adheres to best practices for script development.
    The final product should be a code formatted in markdown.
  """,
  agent=developer,
)
{% endhighlight %}

### La Tâche assignée au Reviewer

Ci-dessous, une description précise des tâches d'un reviewer : 

{% highlight python %}
task3 = Task(
  description="""Ensure the delivery is a code based. Ensure the quality of the code, the adherence to coding standards, and the respect
    of the specifications included in the user stories. Provide detailed feedback to developers, highlighting areas for improvement, potential
    bugs, and suggestions for optimization. Your review should include a checklist of criteria that align with best practices in software
    development and the specific requirements of the project. Ensure that the code is not only functional but also maintainable and scalable.
    Collaborate with the development team to achieve high-quality software delivery in the project.
  """,
  agent=reviewver,
)
{% endhighlight %}

<hr class="hr-text" data-content="Crew">

## La Formation de la Squad

Un équipage (crew) dans CrewAI représente un groupe collaboratif d'agents travaillant ensemble pour accomplir un ensemble 
de tâches. Chaque équipage définit la stratégie pour l'exécution des tâches, la collaboration entre les agents et le 
déroulement global du travail.

Dans notre cas, la formation de l'équipage se fera ainsi :

{% highlight python %}
crew = Crew(
  agents=[po, developer, reviewer],
  tasks=[task1, task2, task3],
  verbose=2,
  process=Process.sequential,
)
{% endhighlight %}

Enfin, nous démarrerons le _**Sprint**_ en exécutant les instructions :

{% highlight python %}
result = crew.kickoff()

print("######################")
print(result)
{% endhighlight %}

<hr class="hr-text" data-content="Résultats">

## Résultats

CrewAI ne garantit pas que votre processus ira jusqu'au bout avec succès ni que les modèles de LLM que vous avez choisis
sont pertinents pour accomplir les tâches que vous leur avez soumises.

Entre les hallucinations des modèles, les erreurs de format des réponses, le nombre maximal d'itérations possibles, il 
peut y avoir un travail d'adaptation et de tuning à effectuer.

Toutefois, après une heure de tâtonnements dans mon cas, j'ai pu obtenir des réponses satisfaisantes de la part de ma 
Squad Agile virtuelle.

### La Réponse du Product Owner

Voici ce que l'Agent "Product Owner" a rédigé lors de la finalisation de sa tâche :

**Final Answer**:

1. As a busy system administrator, I want to be able to execute simple commands with parameters using the wrapper function so that I can save time and reduce errors in command line input.

   Context: System administrator needs to run "ls -l" frequently on various servers to check file permissions.

2. As a developer, I want the wrapper function to log execution information to a file so that I can keep track of all commands executed and their outcomes for debugging purposes.

   Context: Developer wants to monitor long-running scripts and detect any issues during execution.

3. As a QA engineer, I want the wrapper function to manage status codes effectively so that I can identify and handle errors in a consistent manner, ensuring reliable test automation.

   Context: QA engineer is executing a suite of integration tests and wants to ensure proper handling of failed tests.

4. As a DevOps engineer, I want the wrapper function to output results to stdout when available so that I can quickly view command outputs without having to check log files.

   Context: DevOps engineer is executing multiple commands in parallel and needs real-time feedback on their execution status.

5. As a data analyst, I want the wrapper function to handle complex workflows involving error handling and output management so that I can automate my daily tasks more efficiently and focus on data analysis instead of command line management.

   Context: Data analyst is running several data processing scripts and needs to ensure they execute correctly, log errors, and manage outputs in a consistent manner.

### La Réponse du Developer

L'Agent Developer a, quant à lui, répondu :

**Final Answer**: 

To implement the user stories, I will create a Bash function called `execute_command` that takes a command and parameters as input. This function will address all the requirements outlined in the user stories. It will log execution information to a file, manage status codes effectively, output results to stdout when available, and handle complex workflows involving error handling and output management. Here's the Bash function:

{% highlight bash %}
#!/bin/bash

execute_command() {
    # Parse command and parameters
    local command=$1
    shift
    local params=("$@")

    # Log execution information to a file
    echo "$(date) - Executing: $command ${params[@]}" >> ~/execution.log

    # Output results to stdout when available
    "$command" "${params[@]}" | while read line; do
        echo "[$command]: $line"
    done

    # Manage status codes effectively
    local status=$?
    if [ $status -ne 0 ]; then
        echo "Error: $command exited with status $status" >> ~/execution.log
    fi

    return $status
}
{% endhighlight %}

This function can be used to execute simple commands with parameters, like the `ls -l` example mentioned in the user story. The output will be sent both to stdout and a log file, allowing for easy tracking of executed commands and their outcomes. Error handling is built into the function, ensuring reliable execution and consistent error management.

Example usage:

{% highlight bash %}
execute_command ls -l /var/log
{% endhighlight %}

### La Réponse du Reviewer

Le reviewer a finalisé le processus en renvoyant :

**Final Answer**: 

The Bash function `execute_command` is well-written and adheres to the specified requirements. It effectively logs execution information, manages status codes, and outputs results to stdout when available. Additionally, it handles complex workflows involving error handling and output management. However, there are a few recommendations to improve code quality, maintainability, and alignment with team's best practices:

1. Add comments describing the function's purpose and its behavior to make it easier for other developers to understand.
2. Use lowercase and underscores for local variable names to follow Bash scripting conventions (e.g., `command` should be `command_`).
3. Separate logging, execution, and error handling into different functions to improve readability and maintainability.
4. Add input validation to ensure the function receives valid inputs, such as checking if the command provided exists.
5. Implement a more sophisticated logging mechanism, for example using the `tee` command or Bash's built-in `exec` command, to enable real-time log monitoring during development and debugging.
6. Add error messages to the log when the status code is not zero, explaining what went wrong. This will make it easier to diagnose issues when they occur.
7. Consider adding a mechanism to pass flags for enabling or disabling logging or outputting results to stdout based on user requirements.
8. Ensure that the function handles special characters and edge cases in command names and parameters, such as spaces or quotes.
9. Test the function with various commands, input types, and error scenarios to ensure it works as expected.

<hr class="hr-text" data-content="Analyse">

## Analyse des Résultats

Les résultats de cette démonstration sont plus que positifs, voire troublants, montrant que les agents IA peuvent 
effectivement simuler les rôles et les responsabilités d'une équipe de développement logiciel avec une grande efficacité.

### Les Points Forts

Parmi les points forts observés, nous pouvons remarquer :

- **L'efficacité dans la Génération de User Stories** : Les agents IA ont démontré une capacité impressionnante à 
générer des User Stories claires et pertinentes, permettant une compréhension rapide des besoins du projet.
- **La Qualité du Développement de Code** : Le code produit par les agents développeurs IA respecte des standards de 
qualité élevés et une excellente adéquation aux exigences du projet.
- **L'Amélioration des Processus de Révision de Code** : Les agents IA chargés de la révision de code ont effectué cette
tâche avec une précision et une efficacité accrues, contribuant ainsi à améliorer la qualité globale du code.

### Bilan

Nous avons donc là une solution qui pourrait améliorer l'efficacité de n'importe quelle équipe Agile.

Qu'il s'agisse d'automatiser la génération du Backlog, d'implémenter une première version du code, ou de vérifier le 
respect de standards, toutes ces tâches préparatoires pourraient être automatisées. Les équipes pourraient alors se 
concentrer sur des tâches à plus forte valeur ajoutée.

C'est aussi un moyen simple et à moindre coût, d'augmenter leur vélocité.

<hr class="hr-text" data-content="Conclusion">

## Conclusion

Les résultats obtenus illustrent comment l'adoption de l'IA dans le développement logiciel pourrait révolutionner la 
manière dont les équipes conçoivent et mènent leurs projets. Ils mettent en évidence la capacité de l'IA à servir de 
moteur d'innovation dans ce domaine, en offrant à la fois une automatisation de pointe et des opportunités d'accroître 
l'efficacité et la qualité du travail collaboratif.

Ces découvertes encouragent une exploration plus poussée de l'application de l'IA dans le développement logiciel, y 
compris l'expérimentation avec de nouvelles configurations d'agents intelligents, des modèles de LLM et la résolution de
problématiques plus complexes.

Néanmoins, l'exploitation de ces avantages implique de relever certains défis, comme la nécessité de former les 
professionnels aux technologies de l'IA et de trouver le juste milieu entre automatisation et interaction humaine.

En conclusion, l'avenir du développement logiciel avec l'IA s'annonce prometteur. Il appartient désormais aux équipes de
développement de saisir ces opportunités tout en naviguant judicieusement à travers les défis.

## Les +

* Amélioration significative de l'efficacité des équipes
* Stimulation de la créativité et de l'innovation
* Capacité à résoudre rapidement des problèmes complexes

## Les -

* Nécessité d'un investissement initial en temps et en ressources pour la formation
* Défis liés au maintien de l'équilibre entre automatisation et intervention humaine

## Usages

Les implications de l'intégration de l'IA dans le développement logiciel vont au-delà de la simple automatisation des 
tâches répétitives. Elles incluent l'amélioration de la prise de décision, l'innovation dans la conception de produits, 
et la personnalisation des expériences utilisateur. À mesure que la technologie évolue, il est crucial pour les 
professionnels de l'IT de rester informés et ouverts à l'exploration de ces nouveaux outils, tout en considérant 
soigneusement les avantages et les défis qu'ils présentent.
