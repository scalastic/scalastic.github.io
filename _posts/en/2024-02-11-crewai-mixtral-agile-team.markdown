---
layout: post
title: "CrewAI, Ollama, Mixtral: An Agile Squad in Your Computer"
date: 2024-02-12 14:49:00 +0100
description: "Discover how AI is transforming software development with a virtual Agile squad, enhancing efficiency and velocity."
img: crewai-mixtral-agile-team.jpg
fig-caption: An Agile Squad in Your Computer with <a href="#">DALL•E</a>
tags: [AI, Agile, LLM, Mixtral, Development, DevOps]
lang: en
permalink: /crewai-mixtral-agile-team/
status: finished
---

In the IT field, Artificial Intelligence (AI) presents itself as a revolutionary phenomenon, carrying both promises and 
challenges. At the heart of professional discussions, two schools of thought stand out distinctly. On one side, there is
a population of skeptical developers, doubting strongly that AI could ever replace the human expertise and creative 
intuition necessary for their work. On the other, a second population considers this possibility with some resignation, 
wondering more "when" this will happen rather than "if" it is possible.

This article aims to evaluate the advancements of AI in the field of software development, using a typical case found in
dev teams: an Agile squad tasked with delivering a software product.

Through this approach, we wish to offer IT professionals a clear and updated view on the real capabilities of AI and its
potential to transform the software development landscape. Without claiming to provide a definitive answer to the 
question of replacing developers with AI, our goal is to present concrete data and tangible results that illuminate the 
debate and invite reflection on the future of our profession in a world where AI is increasingly taking a more 
significant role.

<hr class="hr-text" data-content="Summary">

* TOC
{:toc}

<hr class="hr-text" data-content="Technologies">

## The Tools at Our Disposal

To implement our project, we will use existing AI solutions that are available to the general public. There's no need 
for a server farm calculating for weeks to come up with a potentially revolutionary new model.

### AI Architecture

One of the latest advances in AI is the use of multi-agent architectures, an approach where multiple intelligent agents 
operate autonomously while collaborating to achieve a common goal. This technique surpasses traditional single-model AI 
approaches by replicating complex thought and decision-making processes that typically characterize human intelligence. 
Several solutions exist, the most notable at the moment are:
[AutoGen](https://microsoft.github.io/autogen/){:target="_blank" rel="noopener noreferrer nofollow"} from Microsoft and
[CrewAI](https://www.crewai.com/){:target="_blank" rel="noopener noreferrer nofollow"}, easier to use because it is 
based on the [LangChain](https://www.langchain.com/){:target="_blank" rel="noopener noreferrer nofollow"} framework.

Therefore, our choice will be CrewAI. Its integration with LangChain allows it to benefit from the incorporation of all 
the Open Source models from [Ollama](https://ollama.com/){:target="_blank" rel="noopener noreferrer nofollow"} and to 
operate them very simply on a local computer. Moreover, it simplifies the simulation of different roles and interactions
between agents.

### AI Model

To simulate our virtual Agile development team, we will use LLM models to fill the roles of each of its members.

Several choices are available to us thanks to the [different models](https://ollama.com/library){:target="_blank" rel="noopener noreferrer nofollow"} 
supported by Ollama. We will use the latest model from MistralAI, [Mixtral8x7B](https://mistral.ai/news/mixtral-of-experts/){:target="_blank" rel="noopener noreferrer nofollow"}, 
a next-generation LLM model based on a Mixture-of-Experts (MoE) architecture.

With this combination of technologies, we will be able to push the boundaries of what is possible in software 
development and explore innovative approaches to project management and team collaboration.

### System Design

Our system must replicate a complete Agile team, where each AI agent has a specific role:
- The **Product Owner** who defines the user stories,
- The **Developer** who translates them into code,
- The **Reviewer** in charge of ensuring the quality of the produced code.

> info "Note"
> For this demonstration, there is no need for a **Scrum Master**. Indeed, from the perspective of a neural network, 
> their role as a facilitator is completely unnecessary.

Each component of our architecture is designed to interact coherently with the others, with the goal of successfully 
delivering the product. This approach allows us to test the effectiveness of AI in traditionally human roles and to 
assess its potential to improve productivity and software development quality.

### Guiding Principles

As a reminder, our project is guided by 3 key principles:
1. We aim to demonstrate that AI can not only automate tasks but also significantly contribute to creative and 
decision-making processes.
2. We strive to maintain as authentic an Agile approach as possible, even in a context of advanced automation.
3. We place particular importance on responsibility in the use of AI, ensuring that our project positively contributes 
to the evolution of software development.

We hope to show new perspectives on the integration of AI in software development. This approach allows us to question 
and redefine the boundaries between Artificial Intelligence and Human Intelligence, demonstrating how AI can complement 
and enrich human capabilities rather than merely replace them.

### Source Code

You can find the source code for this project in the GitHub repo [https://github.com/jeanjerome/ai-agile-team](https://github.com/jeanjerome/ai-agile-team){:target="_blank" rel="noopener noreferrer nofollow"}

<hr class="hr-text" data-content="Agents">

## Autonomous Agents

Our project relies on the use of CrewAI, a framework for orchestrating autonomous AI agents.

An Agent should be seen as a team member, with specific skills and a particular task to accomplish. It can execute 
tasks, make decisions, or communicate with other agents.

In CrewAI, an agent is characterized by three main attributes:
- A **Role** which specifies its function within the team and identifies the tasks for which it is particularly qualified.
- A **Goal** representing the end that the agent strives to achieve, thus guiding its choices and actions.
- A **Backstory** providing context for the agent's role and goal, thereby improving interaction and collaboration dynamics.

In our case of an Agile squad, we will create 3 types of Agents:
- The **Product Owner**,
- The **Developer**,
- The **Reviewer**.

### The Product Owner Agent

From this Agent, we expect the automated generation of User Stories (US): the AI analyzes the project's needs and 
generates coherent US, allowing the **_Developer_** to have a quick understanding and efficient implementation of the 
required functionalities.

Here's how to define it with CrewAI:

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

### The Developer Agent

We want this Agent to implement the product features described in the form of User Stories (US): the **_Developer_** 
write the necessary code to meet the requirements of the US.

Let's define it in turn:

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

### The Reviewer Agent

This agent performs code reviews, ensuring the quality and compliance with the standards of the produced code.

Let's examine its definition in more detail:

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

## The Tasks

In the context of CrewAI, tasks are individual missions that agents accomplish. They encapsulate the necessary 
information for execution, including a description, an assigned agent, and the required tools, offering flexibility for 
various action complexities.

These tasks can also be designed to require collaboration between agents. This collaborative approach can be defined in 
the task properties.

### The Task Assigned to the Product Owner

Here is the definition of the tasks of a Product Owner. This is where a certain level of detail is required:

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
> Depending on the LLM used, it might be necessary to provide technical instructions to the model to generate its 
> response. Indeed, an Agent's response must be usable as input for another Agent, and a certain format must be respected.
>
> Since LLMs can take certain liberties, it is sometimes necessary to add the instructions below to the description, so 
> that the Agent adheres to the expected formatting:

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

### The Task Assigned to the Developer

Here is the developer's task with all the necessary details on how to accomplish it:

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

### The Task Assigned to the Reviewer

Below is a detailed description of a reviewer's tasks:

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

## Forming the Squad

A crew in CrewAI represents a collaborative group of agents working together to accomplish a set of tasks. Each crew 
defines the strategy for task execution, collaboration between agents, and the overall workflow.

In our case, the formation of the crew will proceed as follows:

{% highlight python %}
crew = Crew(
  agents=[po, developer, reviewer],
  tasks=[task1, task2, task3],
  verbose=2,
  process=Process.sequential,
)
{% endhighlight %}

Finally, we will start the _**Sprint**_ by executing the instructions:

{% highlight python %}
result = crew.kickoff()

print("######################")
print(result)
{% endhighlight %}

<hr class="hr-text" data-content="Results">

## Results

CrewAI does not guarantee that your process will successfully reach completion, nor that the LLM models you have chosen 
are relevant for accomplishing the tasks you have submitted to them.

Between model hallucinations, response format errors, and the maximum number of possible iterations, there may be a need
for adaptation and tuning.

However, after an hour of trial and error in my case, I was able to obtain satisfactory responses from my virtual Agile 
Squad.

### The Product Owner's Response

Here is what the "Product Owner" Agent wrote upon completing its task:

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

### The Developer's Response

The Developer Agent, in turn, responded:

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

### The Reviewer's Response

The reviewer finalized the process by returning:

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

<hr class="hr-text" data-content="Analysis">

## Analysis of the Results

The results of this demonstration are overwhelmingly positive, even startling, showing that AI agents can effectively 
simulate the roles and responsibilities of a software development team with great efficiency.

### Strengths

Among the strengths observed, we can note:

- **Efficiency in Generating User Stories**: The AI agents demonstrated an impressive ability to generate clear and 
relevant User Stories, allowing for a quick understanding of the project's needs.
- **Quality of Code Development**: The code produced by the developer AI agents adheres to high quality standards and 
excellent alignment with the project requirements.
- **Improvement of Code Review Processes**: The AI agents responsible for code review performed this task with increased
precision and efficiency, thereby contributing to improving the overall quality of the code.

### Evaluation

We have here a solution that could enhance the efficiency of any Agile team.

Whether it's automating the generation of the Backlog, implementing a first version of the code, or checking compliance 
with standards, all these preparatory tasks could be automated. Teams could then focus on tasks with higher added value.

It's also a simple and cost-effective way to increase their velocity.

<hr class="hr-text" data-content="Conclusion">

## Conclusion

The results obtained illustrate how the adoption of AI in software development could revolutionize the way teams design 
and conduct their projects. They highlight AI's capacity to act as an innovation driver in this field, offering both 
cutting-edge automation and opportunities to enhance efficiency and the quality of collaborative work.

These findings encourage further exploration of AI's application in software development, including experimenting with 
new configurations of intelligent agents, LLM models, and solving more complex problems.

However, leveraging these advantages involves addressing certain challenges, such as the need to train professionals in 
AI technologies and finding the right balance between automation and human interaction.

In conclusion, the future of software development with AI looks promising. It is now up to development teams to seize 
these opportunities while wisely navigating through the challenges.

## Pros

* Significant improvement in team efficiency
* Stimulation of creativity and innovation
* Ability to quickly solve complex problems

## Cons

* Necessity of an initial investment in time and resources for training
* Challenges related to maintaining the balance between automation and human intervention

## Applications

The implications of integrating AI into software development go beyond simply automating repetitive tasks. They include 
improving decision-making, innovating in product design, and personalizing user experiences. As technology evolves, 
it's crucial for IT professionals to stay informed and open to exploring these new tools, while carefully considering 
the benefits and challenges they present.
