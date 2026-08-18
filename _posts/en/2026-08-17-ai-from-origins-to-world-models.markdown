---
layout: post
title: "What LLMs Will Never Do: The History of AI from Perceptrons to World Models"
date: 2026-08-18 12:06:00 +0200
description: "Why language models do not lead to intelligence, and what Yann Le Cun proposes instead: world models, JEPA, self-supervised learning."
img: ai-from-origins-to-world-models.jpg
fig-caption: AI-generated illustration
tags: ["AI", "LLM", "Neural Networks", "Deep Learning", "JEPA", "World Models", "Yann Le Cun", "Self-Supervised Learning"]
lede: "70 years of neural networks and two major crises later, training models on ever more text will not be enough for intelligence to emerge."
lang: en
permalink: /ai-from-origins-to-world-models/
status: finished
---

Here is a calculation that should trouble anyone who thinks artificial intelligence is reaching human level.

A large language model (LLM), such as the engine behind ChatGPT, Claude, or Gemini, is now trained on around 20 trillion words, or roughly 30 trillion **tokens** (the basic units processed by the model, generally corresponding to a word or part of a word). At around three bytes per token, **that represents on the order of 10<sup>14</sup> bytes**, roughly equivalent to all the text publicly accessible on the Internet. A human reading twelve hours a day would take 400,000 years to get through it all.

Now consider a four-year-old child. They have spent around 16,000 hours awake. Their two optic nerves contain some two million nerve fibers and transmit around two megabytes of information per second to the brain. The calculation is simple: 16,000 hours × 3,600 seconds × 2 MB. **Once again, we get an order of magnitude of 10<sup>14</sup> bytes.**

<div class="key-figures">
  <div class="figure">
    <span class="figure-label">A large language model</span>
    <span class="figure-value">10<sup>14</sup></span>
    <span class="figure-note">bytes of text, or nearly everything that is publicly readable on the Internet.</span>
  </div>
  <div class="figure">
    <span class="figure-label">A four-year-old child</span>
    <span class="figure-value">10<sup>14</sup></span>
    <span class="figure-note">bytes received through vision, over 16,000 waking hours.</span>
  </div>
</div>

The same volume. A four-year-old child has received as much information through vision as the largest language model ever trained on all the text in the world. And that child knows things no language model knows: that objects fall, that a glass pushed near the top can tip over, that a closed door stays closed. At ten, they will effortlessly perform tasks that the best robot in the world still fails to execute. At seventeen, they will learn to drive in about fifteen hours, while self-driving car companies have millions of hours of recorded data.

This is the argument made by **Yann Le Cun**, one of the three researchers who brought neural networks back to prominence in the 2010s: we will not reach human intelligence by piling up more text. Something else will be needed.

This article tells the story of how we got here: the history of neural networks, how today’s models work, their limitations, and what that “something else” might be.

<hr class="hr-text" data-content="Table of Contents">

* TOC
{:toc}

<hr class="hr-text" data-content="History">

## 1. A History of Highs and Lows

### The 1950s: pattern recognition

The founding idea is simple and old. In the 1950s, researchers sought to make a machine recognize patterns: a letter, a digit. The device, called a **perceptron**, computes a weighted sum of the pixels in the image: each pixel is multiplied by a coefficient, everything is added together, and if the result exceeds a threshold, the machine announces, “it’s a C.”

The whole question is how to find the right coefficients. They are called **weights**, and this is the essence of machine learning: rather than programming the rules, let the machine adjust its weights from examples.

This work emerged at the intersection of three communities that largely ignored one another: statisticians, engineers working on adaptive signal processing, and proponents of **cybernetics**, the school of thought that, after the war, sought to describe machines and living organisms within the same framework of information / control / feedback. The field would eventually become known as *statistical pattern recognition*.

### 1969: the first setback

In 1969, **Seymour Papert**, a professor at MIT, co-authored a book demonstrating the mathematical limitations of the perceptron. A single perceptron can solve only simple problems. The effect was devastating: funding dried up, and the field of neural networks collapsed for a decade.

And yet, ten years later, Papert defended a position that seems almost the opposite of the one associated with him since 1969. In France, during a famous debate between **Jean Piaget**, the Swiss psychologist of child development, and **Noam Chomsky**, the American linguist, the question was the origin of language: is it largely innate, or is it built through learning? Papert sided with Piaget and with learning. The man who had helped discredit the first neural networks now emphasized that, from very simple mechanisms, a machine can learn surprisingly complex behaviors. **He did not retract his criticism of perceptrons; instead, he defended an idea that would become central a few decades later: complexity can emerge from learning.**

The young Yann Le Cun would read the transcript of that debate. He would remember one sentence, attributed to Piaget, who never actually said it, but which sums up his thinking. Remember it. This sentence contains the seed of the entire critique of LLMs:

> citation "Wrongly attributed to Jean Piaget"
> Intelligence is not what you know; it is what you do when you don’t know.

### The 1980s: backpropagation and the golden age

The breakthrough comes from an idea of disarming simplicity: instead of a single stage of computation, several are stacked, separated by nonlinear functions. This is the principle of what would later be called **deep learning**: “deep” means nothing more than “made up of several layers.”

The remaining question is how to adjust the weights of all the layers at once. The answer is called **gradient backpropagation**: starting from the error measured at the output, it is propagated backward, layer by layer, to determine how much each weight should be corrected. Mathematically, it is nothing more than the chain rule for differentiating composite functions, known since Newton and Leibniz. Yet it took until the 1980s for someone to think of applying it to machine learning.

Yann Le Cun defended his thesis on the subject in Paris in 1987. He then spent a year as a postdoctoral researcher at the University of Toronto with **Geoffrey Hinton** (one of the main architects of the revival of neural networks, and a future Nobel Prize winner in Physics), before joining **Bell Labs** in late 1988, the famous research laboratory of the American telephone company AT&T in New Jersey. He would remain there for twelve years.

Bell Labs at the time were the stuff of legend, and their culture was explicit. The group’s director, physicist **Larry Jackel**, had set up a team devoted to neural networks in 1985 on the advice of **John Hopfield**, a Princeton physicist whose work on **Hopfield networks** (associative-memory networks inspired by the physics of magnetic materials) would earn him the 2024 Nobel Prize in Physics, shared with Hinton for his **Boltzmann machines** (another network model in which learning is described in terms of temperature and energy, borrowed directly from statistical physics).

The principle at Bell Labs was simple: hire brilliant people, give them the resources to work, and leave them alone. When Le Cun, still in Toronto, timidly asked for a computer for his arrival, they ordered, just for him, a machine of the kind that until then had served as the central server for an entire department. Seeing his surprise, Jackel replied: *“You don’t get famous by saving money.”*

This is where **convolutional neural networks** were born. The idea came from the visual cortex: instead of connecting each neuron to every pixel in the image, it is connected only to a small local neighborhood, and the same weights are reused everywhere. The remarkable consequence, known as **translation equivariance**, is that when the object moves within the image, the network’s response remains the same. The network can therefore detect objects wherever they are.

Applications followed quickly: automatic reading of amounts on bank checks, commercially deployed from the mid-1990s to the early 2000s. Today, convolutional networks are everywhere real-time vision is required, from automatic emergency braking and medical image analysis to facial recognition at borders, population surveillance, and target recognition by military drones.

### The mid-1990s: the second winter, the technological limit

Starting in 1996, the field fell into decline again. The reasons were less theoretical than material, and the explanation is worth knowing for anyone interested in open source.

There were no tools. No Python, no shared libraries, no platform for exchanging code: **SourceForge**, the first major host for open-source projects, would not appear until 1999, and the Internet was not yet there. Each team worked on a different proprietary system: Sun workstations, Silicon Graphics, AIX, IRIX, HP-UX systems. Anyone who wanted to train a neural network first had to invest six months to a year writing their own software platform.

Le Cun and **Léon Bottou**, a young graduate of École Polytechnique whom he met in 1987, had worked around the problem by building their own tools: a neural-network simulator controlled through a **Lisp** interpreter (a language in which the program itself is data that can be manipulated, making it particularly well suited to building other languages). They wrote it on Amiga personal computers. The system, called SN and later Lush when it was released as open source in 2002, would serve them until 2011. According to Le Cun, this was what gave them “superpowers”: they could try ideas that others could not implement.

> note "The takeaway"
> A scientific field advances not only at the pace of its ideas, but at the pace at which those ideas can circulate and be reproduced.

### 2010: the revival, then recognition

Three researchers persisted through this long period in the wilderness: Yann Le Cun, Geoffrey Hinton, and **Yoshua Bengio**, a professor in Montreal. In the mid-2000s, they decided to rename the field (this is how the term *deep learning* entered the vocabulary) and proposed new methods. From 2010 onward, it worked. Three fields were transformed in quick succession: speech recognition, image recognition, and then natural language processing.

In 2013, Le Cun joined Facebook and founded **FAIR** (*Fundamental AI Research*), the company’s fundamental research laboratory. Its Paris branch, created in 2015, would grow to more than 140 people, including around forty PhD students in residence, with roughly a dozen dissertations defended each year. Its impact on the French ecosystem has been considerable: a large share of French AI researchers and startup founders have passed through it, including two of Mistral’s founders. It was also in Paris, by a team of around a dozen people, almost all of them French, that the first **Llama** model, Meta’s family of open language models, was produced in late 2022. Le Cun is careful to point out that he made no technical contribution to it: his only role was to push for it to be released as open source.

Finally, in 2018, Le Cun, Bengio, and Hinton received the **Turing Award**, the equivalent of the Nobel Prize for computer science.

<hr class="hr-text" data-content="Mechanisms">

## 2. How It Really Works

This section is the only slightly technical one. It comes down to three ideas, and it is worth the effort because everything else follows from them.

### Idea 1: you don’t write the program, you train it

For many tasks, nobody knows how to write the program. Writing a program by hand that decides whether an image contains a pedestrian is beyond reach: the variability is too great.

What we do know how to do, however, is write a very short program (half a page) that performs additions, multiplications, and comparisons, with some coefficients left blank. Then we adjust those coefficients from examples.

### Idea 2: learning by correcting errors

We start with a collection of examples: for instance, images accompanied by labels indicating what they represent. We then define a **loss function** that measures the gap between the machine’s prediction and the expected answer, for example by calculating the mean squared error. This function depends on the network’s weights: the lower its value, the better the prediction. Training the network therefore consists of gradually adjusting its weights to reduce this error.

How do we minimize it? By **gradient descent**. The gradient is the slope: it indicates the direction in which the error increases fastest. So we take small steps in the opposite direction. The size of each step is called the **learning rate**. We repeat this process millions of times.

That is all. Linear regression, taught in introductory statistics courses, already follows this principle.

### Idea 3: stacking layers, and propagating the error backward

A simple weighted sum is not enough to recognize an image. So we stack several stages: a weight matrix, a nonlinear function, another matrix, another nonlinearity, and so on. That is deep learning: multiplying the number of layers.

To adjust the weights of an intermediate stage, we need to know how much it contributes to the final error. This is what **backpropagation** does: it works backward step by step, multiplying at each stage by the block’s **Jacobian matrix** (the table of all the partial derivatives of its outputs with respect to its inputs, which answers the question, “if I perturb this input slightly, how much does this output change?”). For a linear block, this matrix is simply the transpose of the weight matrix.

In practice, nobody writes this by hand. Modern libraries (**PyTorch**, developed by Meta and now the de facto standard) automatically construct the backpropagation function from the computation function. This technique is called **automatic differentiation**, and its power extends far beyond machine learning.

### Two major architectures

A neural network is therefore nothing more than layers, weights, and a gradient. What distinguishes different models is the way those layers are structured: their **architecture**. Two families dominate.

**Convolutional networks**, already described, are translation-equivariant: they dominate real-time vision.

**Transformers**, introduced in 2017, now dominate language processing. Their name, unlike that of convolutional networks, does not really describe the operation they perform. Their central mechanism is **attention**: each element in the sequence can be related to every other element, regardless of distance. Without additional information, this mechanism is **permutation-equivariant**: if the input vectors are reordered, the output vectors are reordered in the same way. The network can therefore process relationships between elements, but not their order. For language, explicit **positional information** is therefore added so that it can distinguish not only which words are present and how they relate to one another, but also the order in which they appear.

<hr class="hr-text" data-content="LLMs">

## 3. LLMs: What They Can Do and What They Miss

### How a language model is trained

The architecture that changed the world is called **GPT**, for *Generative Pre-trained Transformer*.

The important word is *pre-trained*. The model is not trained for a specific task (translating, summarizing, or answering questions), but on a much more general one: **predicting the next token** in a sequence. This is called **self-supervised learning**: no human needs to indicate the correct answer, because it is already present in the text. In the sentence “The cat is sleeping on the couch,” for example, “cat” is the expected answer after “The,” “is” after “The cat,” and so on.

The architectural trick comes down to a very simple constraint: the network is **causal**. When it has to predict the next token, it can use only the tokens that come before it. A masking mechanism in the attention layer prevents it from looking at the rest of the text. It therefore cannot know the answer in advance: it must learn, from everything it has seen before, which token is most likely to come next.

Earlier generations worked differently, using an **encoder-decoder** (a model with two blocks, one that compresses the input text and another that reconstructs the masked text); this was the principle behind BERT. It turned out that, for scaling up, it was better to remove the encoder and keep only the causal decoder.

A modern LLM consists of trillions of parameters. The result is a form of compression of nearly all the declarative human knowledge accessible online.

### The four limitations

These systems, Le Cun argues, do not understand the physical world, have no persistent memory, do not really have reasoning abilities, and have no planning ability. Let us look more closely at the last two, which are the most interesting.

**Reasoning.** An LLM does have a **latent space**: inside the network, words are transformed into high-dimensional continuous vectors representing their properties, context, and relationships. This is the space in which the model performs its computations.

The difficulty appears between two generation steps. An LLM works **autoregressively**: it performs its internal computations, produces a token, adds that token to the context, then starts again to produce the next one. In other words, its rich internal representations are not directly carried forward from one step to the next as a continuous train of reasoning: they culminate in a discrete symbol, from which the next step begins.

This is one of the points Le Cun criticizes. A system capable of reasoning should, in his view, be able to perform several computation steps **directly in its latent space**, manipulating abstract representations without having to convert them into words at every step.

Today, one common way to improve an LLM’s reasoning is precisely to make it produce more intermediate steps: the famous *step-by-step reasoning* (**chain of thought**). This gives it more computation, but in the form of a longer sequence of tokens. **Le Cun argues for a different approach: allow reasoning to continue in latent space before, potentially, translating it into language.**

**Planning.** Le Cun criticizes the current enthusiasm for so-called *agentic* systems:

> citation "Yann Le Cun"
> I don’t understand how people imagine they can build agentic systems that work without those systems having the ability to predict the consequences of their actions.

His analogy: you can take someone who knows nothing about cooking and have them follow a great chef’s recipe. It will work. But when it fails, they will not know why. Today’s agentic systems are trained to follow recipes; they accumulate recipes; they do not have a model of how the ingredients interact with one another.

### Moravec’s paradox

What LLMs do well (mathematics, code, legal text) is no accident. These are domains in which symbol manipulation is genuinely the substrate of reasoning. When we do mathematics, we write derivations; when we write code, the formulation itself sheds light on the abstractions to use.

This is a restatement of **Moravec’s paradox**, formulated in the 1980s: what is difficult for humans (playing chess, calculating a symbolic integral, proving a theorem) turned out to be easy for machines, while what is easy for a ten-year-old child (clearing a table, climbing stairs, pouring water) remains out of reach. The real world is noisy, continuous, and high-dimensional. Language, by comparison, is simple.

### System 1 and System 2

The psychologist **Daniel Kahneman**, winner of the Nobel Prize in Economics, popularized a distinction that has become commonplace: **System 1**, fast, automatic, reactive, the one that acts without thinking because we have done the same thing a thousand times; and **System 2**, slow and deliberate, the one that draws on our model of the world to plan a sequence of actions.

An LLM is a pure System 1. You give it an input, the input propagates through the network, and an output comes out. Always the same path, always the same cost.

What is missing is a System 2: a mode of inference in which the output is not computed but searched for. You imagine an action, predict its result, evaluate whether that result satisfies the objective, and optimize. Le Cun frames this in terms of the **energy-based models** he has advocated for twenty years: instead of learning a function that maps a single answer to each input, you learn a “landscape” (an **energy function**) that measures the compatibility between an input and a candidate answer. Good answers lie in the valleys, bad ones on the heights. Answering means searching for the optima in the valleys. This allows for several valid answers, which a function does not.

Searching for an answer through optimization is intrinsically more powerful than propagating it through a fixed number of layers.

### What “intelligence” means

Hence the fundamental objection, and the return to Piaget. Intelligence is not an accumulation of declarative knowledge (which is precisely what an LLM accumulates). Nor is it a collection of skills: with enough resources, you can build a machine for almost any task.

Intelligence is the ability to adapt quickly to a new situation. To learn to drive in twenty hours. To do something you have never done before, successfully on the first attempt.

This leads Le Cun to regard the term **AGI** (artificial general intelligence) as a contradiction in terms. It assumes that human intelligence is general, whereas it is extremely specialized. The proof: a twenty-euro toy can beat you at chess, and a website can calculate a symbolic integral better than you can. We are not general in any domain; we are adaptive.

> note "The counting argument"
> One million bits arrive at the visual cortex. How many functions are there that take one million bits and return one bit? Such a function is defined by choosing the answer, 0 or 1, for each of the 2<sup>1,000,000</sup> possible inputs. There are therefore 2<sup>2<sup>1,000,000</sup></sup> such functions.
>
> The brain, meanwhile, has around 10<sup>14</sup> synapses, corresponding to roughly 10<sup>14</sup> bytes of adjustable capacity, or 8 × 10<sup>14</sup> bits. It can therefore take on only 2<sup>8 × 10<sup>14</sup></sup> configurations, and implement at most that many different functions.
>
> Both quantities are powers of two: all that is needed is to compare their exponents:
>
> * The brain’s exponent, 8 × 10<sup>14</sup>, is written with **fifteen** digits.
> * The exponent for the number of possible functions, 2<sup>1,000,000</sup>, takes more than **three hundred thousand** digits.
>
> Claiming that we possess general intelligence makes no mathematical sense.

And yet, for Yann Le Cun, there is no doubt that we will eventually have machines more intelligent than humans in every domain in which humans are intelligent. The question is when: five years for the most optimistic, twenty for the more cautious. But it will not happen through the current approach.

<hr class="hr-text" data-content="World Models">

## 4. World Models

### The definition

A **world model** can be summed up in one sentence:

> note ""
> Given the state of the world at time *t*, and given an action I am considering taking, can I predict the state of the world at time *t+1* after carrying out that action?

That is all. It is not necessarily physics, or 3D, or a game engine. It is abstract. We have one in our heads; a cat has one; an ant has one.

It has also become a catch-all term. Le Cun says so plainly: everyone talks about world models, many companies claim to be building them, very few actually are. As early as 2016, he ended a talk at NeurIPS (the world’s leading machine learning conference) with this message: the future of AI lies in world models. His research had not yet succeeded.

### What a world model is not

A common confusion is to equate **generative ability** with **understanding the world**. Producing a plausible image or video does not necessarily mean that a model has learned the rules governing reality.

The problem comes down to a fundamental property of the world: **not everything in it is predictable**. From a given state, several futures remain possible. Some information can be inferred from what has already been observed; other information depends on contingent events or on data that are simply unavailable.

A model trained to predict directly what will be observed must nevertheless produce a complete answer. It therefore has to predict not only the aspects determined by the past, but also those that are not. When several futures are possible, it can only choose one, distribute its probability across several possibilities, or produce some form of compromise.

This is particularly problematic with images and videos. Their content is continuous, extremely rich, and filled with details whose evolution is difficult, or even impossible, to predict precisely. Early attempts at pixel-level video prediction therefore often produced blurry images: when a model minimizes reconstruction error in the face of several possible futures, it tends to predict an average of those futures.

A **world model** therefore cannot have the goal of faithfully reproducing everything that will be observable. Its function is different: it must learn **what, in the present state, genuinely makes it possible to anticipate the future state**.

This is what distinguishes a world model from a simple generative model. The former seeks the regularities that make it possible to predict how a system will evolve; the latter primarily seeks to produce a plausible observation.

That leaves an essential question: **if not everything is worth predicting, what should be preserved from reality, and what can be discarded?** That is precisely the role of abstraction.

### Abstraction, or why details must be forgotten

Here is the central idea: **a good world model does not try to represent everything**.

Reality can be described at different levels. The most fundamental laws describe the elementary constituents of matter; from them emerge increasingly complex levels of organization: atoms, molecules, cells, organisms, individuals, societies. At each level, an enormous amount of information is discarded. Only the variables relevant to understanding and predicting the phenomena we care about are retained.

This loss of information is not a flaw. **It is the very condition that makes prediction possible.** A model that tried to preserve every microscopic detail of the world would quickly become as complex as the world itself. It would be impossible to build, impossible to compute, and, above all, useless for anticipating how the world will evolve.

Abstraction therefore consists in replacing an extremely detailed description with a much smaller set of variables. Some properties are preserved because they influence the future; others are ignored. The farther ahead in time we try to predict, or the larger the scale at which we reason, the more necessary it becomes to discard details that have only local or transient effects.

This principle explains why the sciences operate at several levels of description. Each discipline constructs its own objects, its own variables, and its own laws because the relevant phenomena are not the same at every scale. A more fundamental description is therefore not necessarily a better one: it may contain more information while being less useful for the task at hand.

A learned **world model** must work in the same way. It should not try to reconstruct every detail of what it observes faithfully, but rather extract from it a compact representation containing what is **stable, predictive, and relevant for action**. It must learn which transformations of the world matter and which can be ignored.

This is precisely the role of a **latent space**: to represent the world not in all its perceptual complexity, but through a set of abstract variables that make it possible to predict how it will evolve. Learning a world model is therefore less about learning to reproduce reality than about discovering **the right level of abstraction for reasoning about it**.

A world model should therefore not be an exhaustive simulator, still less a digital copy of reality. **It must forget an enormous amount, but forget the right things.**

<hr class="hr-text" data-content="JEPA">

## 5. JEPA

### The principle

**JEPA** stands for *Joint Embedding Predictive Architecture*. An *embedding* is the **vector representation of a piece of data in a latent space**: an image, a sound, a text, or more generally a state of the world is translated into a set of numbers. The **latent space** is the space in which all these representations exist and are organized.

The idea behind JEPA is to **predict not the observed data directly, but their internal representation**.

<div class="compare">
  <div>
    <p class="compare-label">Generative architecture</p>
    <p class="compare-lede">Predict what will be observed.</p>
    <p>Starting from a state <em>x</em>, possibly accompanied by an action <em>a</em>, the model directly predicts the future state <em>y</em>: its pixels, audio samples, tokens, or any other observable data.</p>
  </div>
  <div>
    <p class="compare-label">JEPA architecture</p>
    <p class="compare-lede">Predict what the future state means.</p>
    <p>We transform <em>x</em> into an abstract representation, then the model predicts the representation of the future state <em>y</em>. During training, <em>y</em> is also encoded in order to provide the target to be reached. The model therefore never needs to reconstruct <em>y</em> in every last detail.</p>
  </div>
</div>

The difference is essential. A generative architecture must produce a complete observation, including details that are difficult or impossible to predict. JEPA, by contrast, can learn a representation of *y* that preserves only the properties useful for prediction. **The goal is no longer to guess exactly what the world will look like, but what relevant state it will be in.**

The model thus learns to predict directly in a **latent space**, that is, in the space of its internal representations. There, it can manipulate abstract information without having to convert it at every step into pixels, sounds, or symbols.

This also provides an answer to the reasoning problem discussed earlier: computation can continue in latent space without having to be converted back into discrete symbols at every step. Some intermediate approaches are already exploring this direction: *state-space models* maintain a continuous internal state, while work such as **Coconut** seeks to perform several reasoning steps directly in this latent space before returning to tokens. But these approaches still remain, in their overall operation, tied to the language-model paradigm.

### The collapse problem

JEPA runs into a classic trap.

If we simply minimize prediction error, the system can find a trivial solution: ignore the input and always produce the same representation. Prediction then becomes perfect, since both sides produce the same thing, but the network has learned nothing. This is known as **collapse**.

Preventing this collapse is one of the central problems in self-supervised learning based on joint representations. Three major families of methods have been developed.

### Family 1: contrastive methods

For Le Cun, the idea goes back to 1993, with a very concrete problem posed by an AT&T client: how could a handwritten signature be stored on the magnetic stripe of a credit card, which had only 80 bytes available?

The solution was to use a convolutional network that transforms the signature trace into an 80-dimensional vector. Training then imposes two constraints: two signatures from the same person should produce nearby representations; signatures from different people, or forgeries, should instead produce representations that are far apart.

This is the principle of **contrastive learning**. The loss function combines two forces: an **attractive** one, which brings similar representations closer together, and a **repulsive** one, which pushes different representations apart. Without this second constraint, all representations could eventually collapse into one another.

This approach has since become widespread. It has been used for facial recognition, and later by methods such as **SimCLR** for images. **CLIP**, proposed by OpenAI, is also based on this principle: the representation of an image should move closer to that of its description and farther away from unrelated descriptions. The C in CLIP stands precisely for *contrastive*.

This method does, however, come at a cost: it requires many examples to compare and tends to produce representations whose dimensions are not all used optimally.

### Family 2: distillation methods

This time, two encoders with the same architecture are used. One receives a partial, masked, or transformed version of the input; the other receives a more complete version. The first must learn to recover the representation produced by the second.

To prevent collapse, the two encoders are not trained in the same way. The gradient flows through only one of them. The parameters of the second are gradually updated from those of the first using an **exponential moving average**. It therefore changes more slowly and serves as a relatively stable target.

The mechanism works remarkably well, even though its effectiveness is not yet fully explained theoretically. Several lines of research seek to understand why this learning dynamic avoids trivial solutions, but no general theory has reached consensus so far.

This family includes **BYOL** (*Bootstrap Your Own Latent*), developed at DeepMind, **DINO**, from FAIR Paris, as well as **I-JEPA** for images and **V-JEPA** for video.

These methods have been trained at large scale with very strong results. I-JEPA, for example, produces better representations than some approaches based on **masked autoencoders**, while requiring less computation during training.

### Family 3: information maximization

This is the approach Le Cun currently favors. The idea is to attack the cause of collapse directly: if every input produces the same representation, that representation contains virtually no information. The encoder must therefore be constrained to produce representations that are sufficiently rich and varied.

The difficulty is that the amount of information contained in a representation is very hard to measure directly. Theoretical definitions rely on the probability distribution of the data, which is generally unknown. Accurately estimating such a distribution in a high-dimensional space from a limited number of examples is extremely difficult.

Simpler criteria are therefore used to ensure that the representations actually make use of the available space.

Concretely, a batch of examples is passed through the encoder, producing a matrix. Each row corresponds to one example; each column to one dimension of its representation. Collapse can then be prevented in two complementary ways:

* **differentiate the rows**: two different examples should produce different representations; this is the idea behind contrastive methods;
* **differentiate the columns**: the different dimensions of the representation should not all carry the same information.

In both cases, the goal is the same: prevent the encoder from reducing every input to a single representation, and force it to preserve sufficiently rich information about what it observes.

It is this second approach that this family of methods explores. It has led to three successive approaches:

* **Barlow Twins** owes its name to **Horace Barlow**, a British neuroscientist whose work focused extensively on the efficiency of neural coding and information maximization. The idea, proposed by **Stéphane Deny**, then a postdoctoral researcher at Meta, is to prevent the different dimensions of the representation from carrying the same information. To do this, the variables are decorrelated by pushing their covariance matrix toward a diagonal matrix.

* **VICReg** (*Variance-Invariance-Covariance Regularization*) takes up this idea in a simpler form. Developed notably with **Adrien Bardes**, then a PhD student at FAIR and co-supervised by Jean Ponce, the method combines three constraints: preserving a stable representation of the same data, maintaining sufficient variance across examples, and reducing correlations between the different dimensions.

* **SIGReg** (*Sketched Isotropic Gaussian Regularization*) goes further. The method, developed notably by **Randall Balestriero**, seeks not merely to decorrelate the variables, but to make their distribution as close as possible to an **isotropic Gaussian**.

  The distinction is important: two variables can be decorrelated without being statistically independent. Yet independence is precisely what we would like to obtain. The problem is that it is extremely difficult to measure directly in a high-dimensional space.

  SIGReg gets around this difficulty by imposing a particular shape on the set of representations. An isotropic Gaussian is a bell-shaped distribution with the same spread in every direction. Its different components are then independent of one another.

  The remaining challenge is to verify that a high-dimensional point cloud actually has this shape. Here again, the method avoids tackling the problem directly in all its dimensions. It projects the representations onto selected directions, reducing the problem each time to a single dimension. The resulting distribution can then be compared with an ideal Gaussian, and the model can determine how the points should be moved to bring it closer.

  The operation is repeated over many randomly selected directions. The term *sketched* refers precisely to this idea: instead of exhaustively examining the high-dimensional space, enough projections are taken to obtain an approximation of it. The measured deviations provide a gradient that can then be backpropagated through the network.

  The appeal of SIGReg is that it can impose a rich structure on representations with relatively few parameters to tune. Theoretical results even suggest that, under certain assumptions about the latent variables that generate the data, this type of regularization may allow the network to recover those underlying variables, up to a transformation.

There remains, however, an important limitation: **the dimension of the latent space must be fixed in advance**. Yet there is no guarantee that the data actually require that many dimensions. Ideally, the system should discover their **intrinsic dimension** by itself, that is, the minimum number of variables needed to describe them, as well as their **topology**, in other words the way those variables are organized and connected to one another.

Data can indeed be represented in an enormous space while obeying a much simpler structure. Images containing millions of pixels formally live in a space with millions of dimensions, while the variations connecting them may depend on only a few factors: orientation, position, lighting, or shape. The real challenge is therefore to discover this hidden structure automatically rather than imposing in advance the shape of the space in which the representations must organize themselves.

### What V-JEPA learned

And here is the most striking result. V-JEPA is trained to predict what will happen in a video, at the level of representations. Its internal prediction error can therefore be measured frame by frame, by sliding a sixteen-frame window across a video.

Show it an ordinary scene: the error remains low. Show it a **physically impossible** scene (an object disappearing, a ball passing through a wall, a car remaining suspended in midair after leaving a platform), and the prediction error shoots up.

This is exactly the protocol developmental psychologists use to test what a baby has understood about the world: **violation of expectation**. A six-month-old baby shown an object floating does not react: they have not yet learned gravity. A ten-month-old baby is visibly surprised. This understanding takes about nine months to develop in humans; it is also what the eight-month-old child in a high chair is doing when they systematically throw all their toys onto the floor and watch the result: they are experimenting.

According to Le Cun, this is the first time a fully self-supervised system has acquired a level of physical common sense: the ability to tell what is possible from what is not.

A second result is of the same kind. A baby learns very early that the world is three-dimensional, for a specific reason: the distance of each point is the best explanation for the way their view changes when they move their head; this is **parallax**. Researchers took the representations learned by V-JEPA 2.1 and trained a small network head on top of them to predict depth from a single image. The results surpass those of DINO v3. In other words: a system trained only to fill in missing parts of videos, at the representation level, discovered that the world is three-dimensional and constructed a notion of objects.

### Planning

With a world model, we can finally do what LLMs cannot do.

The scheme is as follows: the system perceives its environment, and a perception module produces a representation of the current state, possibly combined with the contents of a memory. A sequence of actions is proposed. The world model predicts its outcome. An **objective** function measures the extent to which the task has been accomplished: it is zero if it has, and a positive number otherwise. Then, through optimization, the system searches for the sequence of actions that minimizes this objective.

Control engineers will recognize **Model Predictive Control**, a classic optimal-control technique dating back to the 1960s.

This framework offers a property that LLMs will never have: additional objectives, or **guardrails**, can be added at every step of the sequence to prevent the system from causing the world to enter certain states. An LLM can only be made harmless through after-the-fact fine-tuning, and there is always a way to circumvent that conditioning: this is a *jailbreak*. In a system based on predictive control, by contrast, the guardrails are part of the optimization problem itself: they are taken into account at every stage of planning.

One major problem remains largely open: **hierarchical planning**. To organize a complex action, it is impossible to predict from the outset every elementary movement required to accomplish it. Reasoning must proceed through successive levels: first define a few broad stages, then turn each of them into increasingly precise subgoals, until reaching actions that are simple and familiar enough to be executed directly.

This is how we naturally plan. A distant objective is first broken down into broad stages; each is then detailed when necessary, depending on the situation and the information available. It would be both useless and impossible to plan everything in advance, down to the muscle movements required for execution.

Reproducing this ability in a machine remains a largely open research problem. A system would need to know how to **choose the right level of abstraction by itself**, break an objective down into subgoals, and then repeat the process recursively until it reaches actions that can actually be carried out.

Other approaches are already exploring part of this direction. The **PlaNet** and **Dreamer** models, developed by **Danijar Hafner**, as well as **MuZero**, also learn to predict how a system will evolve in a representation space rather than directly from raw observations. One of the differences lies in how that space is learned. In PlaNet and Dreamer, it is based on a latent generative model trained to reconstruct observations. A JEPA, by contrast, seeks to learn directly the representations useful for prediction, without having to reconstruct the original data.

<hr class="hr-text" data-content="Consequences">

## 6. What This Changes

### A research program against the current

The conclusions Le Cun draws for the research community are deliberately blunt:

* Abandon generative models in favor of joint-embedding architectures.
* Abandon probabilistic models in favor of energy-based models.
* Prefer regularized methods to contrastive methods.
* Reduce the use of **reinforcement learning** (the method in which an agent learns through trial and reward) because it is terribly sample-inefficient. “It’s what you do when you’re desperate and there’s nothing else.” Most learning should come from observation.
* And, for academics: do not work on LLMs. You have nothing to contribute against teams with tens of thousands of GPUs.

This message has not made him popular in Silicon Valley. He left Meta in late 2025 to found **AMI Labs**, a company devoted to real-world AI, with robotics as one use case, but also industrial process control: anything continuous, high-dimensional, and noisy, in other words everything LLMs are powerless against. Its headquarters are in Paris, with sites in New York, Montreal, and Singapore, and ownership deliberately distributed between Europe (around 40%), the United States, and Asia. The stated reason is as geopolitical as it is technical: there is demand from industrial companies and governments for a cutting-edge AI provider that is neither American nor Chinese.

### The real risk

Asked about the dangers of AI, Le Cun dismisses mass unemployment and science-fiction scenarios in favor of another, more immediate risk: soon, almost all the information we receive will pass through AI assistants. If those assistants come from three companies on the US West Coast and three or four Chinese companies, that is a problem for democracy and cultural diversity.

Every system is biased: the question is not how to eliminate bias, but whether the whole world should be biased like California. No current player will ever train its model on India’s 300 languages or Indonesia’s 300 dialects, nor adapt it to the value systems of every region of the world.

Hence **Project Tapestry**, an initiative for which Le Cun serves as scientific director and whose launch workshop was held in Paris, with participants from Europe, Switzerland, the United Arab Emirates, India, and Japan, as well as American companies including IBM, NVIDIA, and AMD. The principle is based on **federated learning**: each region keeps its own data and computing center, and exchanges only parameter vectors with the others. Periodically, each participant receives the average parameter values and is regularized toward them, “like rubber bands” connecting each local model to the consensus. If the system converges, the result is an open model equivalent to what would have been obtained by training on all the combined data, without any data ever being exchanged.

Le Cun draws the underlying argument from the history of the printing press. It first spread the Bible, allowing everyone to read it without the clergy as intermediary, giving rise to the Reformation and two hundred years of religious wars in Europe. Yet no one today would argue that the printing press was bad for humanity. Conversely, the Arab-Muslim world, which dominated science in the Middle Ages (which is why stars have Arabic names), banned printing in its own language and turned inward. Spreading knowledge is beneficial overall, provided its harmful effects are prevented. Refusing to spread it never is.

### What now?

Le Cun gives it three to five years before the right ideas emerge, perhaps based on JEPA. Then, as always in the history of AI, unforeseen obstacles will appear and it will take longer than expected.

In the meantime, his advice to students can be summed up in one sentence, and it applies beyond AI: when technology changes quickly, you have to learn how to learn, which means building foundations whose expiration date comes after the end of your career. Given a choice between a course on the latest fashionable technology and a course in quantum mechanics, take quantum mechanics; the mathematics developed by twentieth-century physicists, including statistical physics and Feynman path integrals, now lies at the heart of diffusion models and probabilistic inference.

<hr class="hr-text" data-content="Glossary">

## Glossary of Technical Terms

| Term                                                     | Definition                                                                                                                                           |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Self-supervised learning                                 | Training without human labeling: part of the data is masked and the system is trained to recover it.                                                 |
| Contrastive learning                                     | Method that brings representations of semantically identical items closer together and pushes representations of different items farther apart.      |
| Reinforcement learning                                   | Learning through trial and reward. Very costly in terms of the number of trials required.                                                            |
| Autoencoder                                              | Network trained to reproduce its input at its output, generally through a compressed intermediate representation.                                    |
| Collapse                                                 | Failure mode in which a system learns to ignore its input and produce a constant output, artificially reducing its error to zero.                    |
| Gradient descent                                         | Optimization method that adjusts parameters in small steps in the direction where the error decreases fastest.                                       |
| Latent space                                             | The space of a network’s internal representations: continuous, high-dimensional, and non-symbolic.                                                   |
| Loss function                                            | Measure of the difference between what the system predicts and what is expected. This is what is minimized.                                          |
| JEPA<span>Joint Embedding Predictive Architecture</span> | Architecture in which prediction takes place in representation space rather than on raw data.                                                        |
| World model                                              | System capable of predicting the state of the world at *t+1* given its state at *t* and a proposed action.                                           |
| Generative model                                         | Model trained to reconstruct or produce its input data in detail.                                                                                    |
| Energy-based model                                       | Framework in which a landscape of compatibility between inputs and answers is learned, rather than a function mapping each input to a single answer. |
| Autoregressive prediction                                | Production of an output one symbol at a time, with each symbol fed back as input to produce the next one. The operating mode of LLMs.                |
| Convolutional network                                    | Architecture inspired by the visual cortex, translation-equivariant, which dominates computer vision.                                                |
| Gradient backpropagation                                 | Algorithm that propagates the error backward layer by layer to calculate how each weight should be adjusted.                                         |
| Token                                                    | Elementary unit processed by a language model: a word or part of a word.                                                                             |
| Transformer                                              | Permutation-equivariant architecture that emphasizes relationships between elements rather than their positions. The foundation of LLMs.             |
{: .glossary}

<hr class="hr-text" data-content="Sources">

## Sources

This article draws on various talks and interviews by Yann Le Cun, including the following:

* [*World Models: Post-LLM AI Explained by Yann Le Cun*](https://www.youtube.com/watch?v=m7ywFu3Yqh8){:target="_blank" rel="noopener noreferrer nofollow"}, interview for the À la French podcast.
* [*Inaugural Lecture: Deep Learning and Beyond, the New Challenges of AI*](https://www.youtube.com/watch?v=Z208NMP7_-0){:target="_blank" rel="noopener noreferrer nofollow"}.
* [*World Models: Enabling the Next AI Revolution*](https://www.youtube.com/watch?v=72Xj8k5WQX4){:target="_blank" rel="noopener noreferrer nofollow"}, talk in English.

> note ""
> This article was written with the help of LLMs, based on transcripts produced by a speech-recognition model that sometimes mistakes “Le Cun” for a common noun. Proper names and technical terms were therefore corrected by hand: for an article devoted to the limitations of these models, the demonstration came built in.
