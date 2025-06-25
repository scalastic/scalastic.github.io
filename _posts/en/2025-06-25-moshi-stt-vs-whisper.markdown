---
layout: post
title: "Why Moshi STT Could Replace Whisper (and How to Install It on macOS!)"
date: 2025-06-25 20:15:00 +0200
description: "Discover Moshi STT by Kyutai, an open-source real-time speech transcription solution, optimized for Mac (Apple Silicon) and CUDA—fast, accurate, and easy to install. Includes a guide, user feedback, and useful links."
img: moshi-stt-vs-whisper.jpg
fig-caption: AI-generated image
tags: ["Moshi", "Whisper", "STT", "AI", "macOS"]
lang: en
permalink: /moshi-stt-vs-whisper/
status: finished
---

Kyutai is a nonprofit artificial intelligence research lab founded in November 2023 in Paris, with support from patrons such as Xavier Niel (Iliad), Rodolphe Saadé (CMA CGM), and Eric Schmidt (former CEO of Google). The initial team, made up of six talented researchers from major U.S. companies like Meta and Google DeepMind, quickly grew to include around a dozen members today, including PhD students and highly skilled engineers. With an estimated initial budget of 300 million euros, Kyutai aims to develop and release innovative foundation models, while promoting an open-science approach that combines academic rigor with industrial-scale resources.

Interest in Speech-To-Text (STT) technologies has never been higher. These systems are now essential for live meeting transcription, video subtitling, improving accessibility, powering voice assistants, and automating customer services. In response to these needs, Kyutai has invested in a unified model capable of simultaneously handling recognition, understanding, and speech generation—breaking traditional silos and drastically reducing latency.

This article focuses on the STT function of **Moshi**, Kyutai's unified base model for speech and text. We will explore this model in detail, optimized for high-performance execution while remaining accessible and open-source. You'll discover why Moshi could be a real alternative to OpenAI’s Whisper, before guiding you step by step through its installation and implementation on macOS.


<hr class="hr-text" data-content="Table of Contents">

* TOC
{:toc}


<hr class="hr-text" data-content="Moshi">

## 1. Discovering Moshi

### What is Moshi?

**Moshi** is a speech recognition and natural language processing server developed by Kyutai. It is based on next-generation models capable of converting speech to text (Speech-To-Text, or STT), analyzing vocal content in real time, and powering interactive dialogue systems.

#### Quick Project History

The Moshi project was launched in 2024, following the founding of Kyutai. The Kyutai team aimed to offer a credible open-source alternative to proprietary solutions, especially OpenAI’s Whisper, which had become the global STT benchmark. From the outset, Moshi was designed to address challenges of latency, accuracy, and accessibility, while integrating easily with modern application ecosystems.

#### Main Objectives of the Moshi Server

The Moshi server pursues three major goals:

1. **Performance and Accessibility**: Provide a fast, accurate voice transcription tool suitable for both research and production, with no access barriers or hidden costs.
2. **Openness and Compatibility**: Deliver a fully open-source solution, compatible with multiple hardware architectures, and easy to integrate into various environments (cloud, edge, local).
3. **Advanced User Experience**: Enable real-time processing of human speech, including in interactive scenarios, through smooth, bidirectional, uninterrupted voice dialogue.

#### Key Technical Features and Advantages Over Other Solutions

* **Cross-platform Optimization**: Moshi is specially optimized to leverage modern architectures, including Apple Silicon (via Metal), as well as Linux and Windows environments, delivering high performance on any hardware.
* **Advanced Voice Models**: Built on the latest progress in Delayed Streams Modeling, Moshi offers improved latency handling, resulting in faster and more natural transcription compared to traditional models.
* **Flexible Architecture**: The Moshi server provides a simple API designed for integration with any type of application or service, facilitating the development of voice assistants, automatic transcription tools, or accessibility apps.
* **Open Source and Community-Driven**: Unlike closed-source solutions like Whisper, Moshi emphasizes code transparency, community contributions, and adaptability to specific needs.

In summary, Moshi presents itself as a next-generation solution for speech recognition—combining openness, performance, and flexibility—with the ambition of democratizing access to advanced speech transcription technologies.


<hr class="hr-text" data-content="Delayed Streams Modeling">

## 2. Kyutai's STT Models: Delayed Streams Modeling

### Overview of the "Delayed Streams Modeling" Approach: Concept and Technical Advantages

The "Delayed Streams Modeling" approach represents a major innovation in the field of speech transcription. Traditionally, Speech-To-Text (STT) systems process audio sequentially: they convert each voice fragment into text, which can lead to breaks, latency, or inaccuracies when speech is fast, overlapping, or interrupted.

With Delayed Streams Modeling, Kyutai's models adopt a more flexible and intelligent handling of audio streams. Rather than stopping at the first generated version of the text, the model introduces a slight delay to analyze the overall context, adjust certain words, and better interpret the ambiguities of spoken language. This approach enables:

* A significant reduction in transcription errors, especially for difficult-to-recognize words or in noisy environments.
* Effective handling of overlapping speech and interruptions, for faithful transcription even in lively dialogues.
* A better balance between latency and accuracy, thanks to dynamic adjustment of processing time.

### Quick Comparison with OpenAI’s Whisper

OpenAI’s Whisper is currently the mainstream benchmark for open-source STT systems. It offers high accuracy, especially on clean and well-segmented recordings. However, Whisper operates primarily on audio blocks: it segments speech and waits for the end of each block to generate a transcription. This can result in:

* Noticeable latency in real-time use (several seconds of delay).
* Difficulties in handling interruptions, overlaps, and hesitations.
* Less flexibility for interactive or multitasking dialogue applications.

In contrast, Kyutai’s STT models—particularly Moshi with Delayed Streams Modeling—are designed for conversational, interactive, and synchronous use cases. The measured latency is around 160 to 200 ms, a level virtually imperceptible to the human ear. The system can thus keep pace with fast conversations, handle interruptions, and switch between speakers without losing text or meaning.

### Key Strengths and Specific Use Cases of Kyutai’s STT Models

Kyutai’s STT models offer several distinct advantages:

* **Real-Time and Smooth Interaction**: Designed for live transcription, even in complex or noisy environments, with advanced handling of interruptions and speaker turns.
* **Contextual Accuracy**: Thanks to the slight delay built into the model, transcription takes the overall context into account, corrects potential errors on the fly, and improves sentence fidelity.
* **Versatility**: These models adapt to subtitling, accessibility, meeting transcription, voice assistants, and customer service automation.
* **Openness and Adaptability**: The open-source and modular approach allows developers to integrate, adapt, and customize the models to their needs, whether locally, in the cloud, or on specific architectures like Apple Silicon.

In summary, Kyutai’s Delayed Streams Modeling approach enables a new level of performance and flexibility in speech transcription, positioning these models as serious—and sometimes superior—alternatives to Whisper for all use cases requiring speed, accuracy, and real-time interaction.


<hr class="hr-text" data-content="Architecture">

## 3. Moshi Server Architecture

### General Architecture: Detailed Overview of the Main Components

The Moshi server is designed as a modular and robust solution, capable of meeting various demands—from interactive dialogue to fast and accurate transcription. Its architecture is divided into several complementary layers, each playing a key role in the processing chain.

**1. Frontend**  
The frontend represents any system or application capable of sending audio streams to Moshi and receiving results (text or audio). This could be:

* A web application,
* A desktop or mobile client,
* An integration microservice for a larger platform (e.g., meeting tool, subtitling system, voice assistant, etc.).

The frontend is thus the audio data entry point. It communicates with the Moshi server using modern protocols, typically WebSocket to ensure low latency and streaming capability.

**2. Backend (Moshi server)**  
The backend is the core of the system: it manages connections, coordinates audio streams, handles user sessions, and orchestrates interactions between different modules. The Moshi backend is primarily developed in **Rust**, a language known for its performance and reliable memory management. Depending on the execution platform, the backend may delegate certain intensive tasks to modules in Python (for AI) or MLX (for Mac optimization).

**3. Models and Processing Components**  
Much of Moshi’s innovation lies in its models and how they handle audio streams:

* **Mimi**: It is a streaming neural codec that converts continuous audio input into compact sequences of semantic and acoustic tokens. With a latency of 80 ms corresponding to the frame size and an audio compression rate of 1.1 kbps, Mimi significantly reduces the amount of data to process without sacrificing quality or the nuances of the speech signal.
* **Helium**: Moshi’s foundation language model (LLM), based on a transformer architecture with 7 billion parameters. It handles textual reasoning, conversational context management, and response planning.
* **Hierarchical Transformers**:
  * *Depth Transformer*: Manages local dependencies between audio tokens over short time windows, for fine-grained understanding of each sequence.
  * *Temporal Transformer*: Oversees the overall organization of sequences over time, enabling smooth streaming processing essential for real-time dialogue.
* **Inner Monologue**: A unique mechanism where Moshi first generates an internal textual representation (“inner monologue”) before producing the final audio response. This enhances the coherence and relevance of the generated reply.

**4. Access and Output API**  
The Moshi API is one of the project’s strengths. Exposed via WebSocket, it allows for:

* Injecting audio streams (input),
* Retrieving textual results progressively (streaming STT),
* Receiving a generated voice response (streaming TTS) within the same dialogue,
* Accessing advanced functions such as multi-user management, session control, or integration into larger processing pipelines.


### Explanation of Key Technical Components

**Advanced Audio Stream Management**  
Moshi manages multiple simultaneous audio streams: one for the user and one for the machine (the Moshi agent). This multi-stream design ensures a full-duplex dialogue experience, allowing speaking and listening at the same time—even when speakers interrupt or overlap. Audio is segmented into 80 ms frames to ensure smooth transmission, while the Mimi codec optimizes compression to reduce network and system load.

**Real-Time Processing and Robustness**  
Thanks to its efficient Rust backend and the hierarchical design of its models, Moshi achieves near-human conversational performance, with total latency around 160 to 200 ms under real-world conditions. This speed enables demanding interactive uses such as live meeting transcription, video subtitling, or dialogue with voice assistants. The system handles interruptions, speaker changes, and even complex cases of simultaneous speech.

**STT Results Output API**  
Results can be retrieved in real time (as text or generated audio), either as segments or continuous streams. This allows for highly flexible integration across various use cases such as subtitling, accessibility, conversational monitoring, or task automation.

### Rust Optimization: Metal and CUDA for Maximum Performance

One of Moshi’s major strengths lies in its focus on hardware optimization:

* **On Mac (Apple Silicon)**:  
  Thanks to integration with Metal (Apple’s graphics and compute API), Moshi leverages the full power of M-series chips and their GPU. Resource-intensive tasks (inference, audio stream processing) are executed on Apple’s GPU, enabling very fast local execution with low latency—without relying on external cloud services. This approach enhances data sovereignty and energy efficiency.

* **On PC and Servers (Nvidia CUDA)**:  
  Moshi is also compatible with CUDA, Nvidia’s high-performance computing platform. This means that in Linux or Windows environments, the server can utilize Nvidia GPUs to process large volumes of audio in parallel—crucial for professional use, mass transcription, or data center integration.

With a backend written in Rust, combined with these hardware optimizations (Metal for Apple, CUDA for Nvidia), Moshi is a versatile, scalable server offering the best of both worlds: local performance on Mac and GPU scalability on Nvidia platforms.

In short, Moshi’s architecture reflects a modern vision of speech recognition and dialogue: modularity, efficiency, multi-platform support, and openness to integration in any environment—from individual workstations to enterprise infrastructure.


<hr class="hr-text" data-content="Practical Guide">

## 4. Practical Guide: Compiling and Using Moshi STT on macOS (Metal)

In this section, we guide you step-by-step to install and run Moshi STT on an Apple Silicon Mac, using a dedicated script that automates the entire procedure. The goal is to make the installation accessible even to non-specialists.

### Technical Prerequisites

Before starting, make sure your environment is ready:

* A Mac with an Apple Silicon chip, running macOS.
* **Xcode development tools** installed (available via the Mac App Store or with the command:  
  `xcode-select --install`)
* **Rust** (installable via [rustup.rs](https://rustup.rs){:target="_blank" rel="noopener noreferrer nofollow"})
* **Git** (usually pre-installed on macOS)
* **Homebrew** (universal package manager; the script installs it if needed)
* An active internet connection

The script automatically handles the installation and updating of all necessary dependencies, including some audio utilities and build libraries.

### Overview of the Optimized Installation Script

The project below offers a ready-to-use shell script designed for macOS and the Metal architecture:

{% github_card jeanjerome/moshi-stt-apple-installer %}

It automates:

* Installation of Homebrew and Rust if not already present
* Installation of build dependencies (cmake, python)
* Compiling the Moshi server with Metal-specific options (Apple GPU acceleration)
* Adding required paths to the environment

### All-in-One: Compilation, Installation, and Launch

Open the Terminal and enter:

{% highlight bash %}
git clone https://github.com/jeanjerome/moshi-stt-apple-installer.git
cd moshi-stt-apple-installer
./scripts/install.sh
{% endhighlight %}

   The script:

   * Installs any missing system dependencies
   * Compiles `moshi-server` with Metal support (binary installed in `~/.cargo/bin/moshi-server`)
   * Downloads the STT configuration for the `kyutai/stt-1b-en_fr` model, a bilingual English/French model with about 1 billion parameters, offering a 0.5-second delay and semantic voice activity detection (VAD), if not already present.
   * Starts the server on port `8080`

   The Moshi STT server is then locally accessible at `ws://localhost:8080/api/asr-streaming`, ready to receive requests.

### Practical Tests: Real-Time Transcription or Audio File Input

The repository provides a small Python script (`test_transcribe.py`) for quick local transcription testing:

{% highlight bash %}
uv run test_client.py
{% endhighlight %}

The script will send the audio file located at `data/bonjour.wav` to the Moshi server and display the resulting transcription.

### API Usage Demo (Advanced Integration Example)

For more advanced integrations (PyTorch, MLX, with microphone capture, etc.), it is recommended to refer to the official [Delayed Streams Modeling documentation](https://github.com/kyutai-labs/delayed-streams-modeling){:target="_blank" rel="noopener noreferrer nofollow"} and explore the examples provided in the `scripts` folder.

Thanks to this guide and the dedicated installation script, you can start using Moshi speech recognition on your Apple Silicon Mac within minutes, with minimal manual setup—and enjoy the latest open-source advances in real-time STT.


<hr class="hr-text" data-content="RETEX">

## 5. Feedback and Practical Use Cases

### First Impressions of Use

Installing and getting started with Moshi STT on macOS is straightforward and fast, thanks to the dedicated script. After just a few minutes of setup, the server is operational and ready to receive transcription requests.

* **Real-Time Performance**  
One of the most striking aspects during initial tests is the processing speed. Moshi offers extremely low latency: the text appears on screen almost instantly after speech. Under standard conditions (built-in microphone, quiet environment), the server delivers smooth, accurate transcription that is nearly synchronous with the audio—particularly impressive for interactive exchanges. No hallucinations were observed in the transcriptions, and punctuation is consistently present. This is noteworthy, as it's not always the case with Whisper.

* **Handling Background Noise**  
Moshi also demonstrates commendable robustness to background noise. Tests conducted in moderately noisy environments (rooms with conversations in the background, keyboard or fan noise) confirmed the model’s ability to isolate and understand the primary voice. The semantic voice activity detection (VAD) built into the `kyutai/stt-1b-en_fr` model helps reduce segmentation errors and minimizes the generation of noise-related artifacts.

* **Limitations Observed in Long Transcriptions**  
One issue to note is the system’s stability during prolonged transcription sessions. I repeatedly experienced WebSocket disconnections and interruptions in the transcription process after around ten minutes of continuous audio. This aligns with the way the model was trained: according to the documentation, the audio samples used for training did not exceed ten minutes, clearly positioning Moshi for conversational or dialogue-based use rather than long-form, uninterrupted transcription.

I am continuing more thorough testing to determine whether these limitations are inherent to the model or if they can be mitigated in my implementation. A deeper analysis will help identify whether client-side adaptations could overcome this constraint.


### Practical Examples of Potential Applications

Moshi STT is well-suited for numerous real-world use cases where speed, accuracy, and flexibility are critical. Here are a few examples:

* **Meetings and Video Conferences**  
  Moshi can be integrated into a video conferencing or note-taking app to provide real-time transcription of conversations. This helps with meeting follow-ups, automatic minutes creation, and improves accessibility for hearing-impaired participants.

* **Podcasts and Audio Content**  
  Podcast and audio content creators can use Moshi to automatically generate transcriptions of their episodes, simplifying the creation of subtitles, summaries, or derivative content for the web.

* **Live Video Subtitling**  
  Thanks to its low latency, Moshi can be used to generate real-time subtitles for live or recorded video broadcasts. This opens new possibilities for accessibility, content indexing, and even downstream automatic translation.

* **Mobile Apps and Voice Assistants**  
  With its simple API, Moshi can easily be integrated into mobile applications to enable voice input, voice search, or control of personal assistants—without relying on external cloud services.

* **Medical, Legal, or Technical Transcription Systems**  
  Moshi’s contextual accuracy and speed make it suitable for high-stakes sectors where every word matters and data confidentiality may require local processing.

> info "Note"
> The service [unmute.sh](https://unmute.sh/){:target="_blank" rel="noopener noreferrer nofollow"} uses the same Moshi server and the `kyutai/stt-1b-en_fr` model for its speech recognition engine.  
> On this platform, you can test all components developed by Kyutai:
> - speech transcription (STT),
> - LLM-assisted dialogue,
> - speech synthesis (TTS).
>
> This online demo provides a hands-on view of the performance and quality of the Moshi ecosystem, with no local installation required.

In summary, Moshi STT combines ease of integration, performance, and robustness, making it a particularly appealing solution for any project requiring real-time speech recognition—whether for professional, creative, or accessibility purposes.


<hr class="hr-text" data-content="Conclusion">

## Conclusion

The arrival of Delayed Streams Modeling (Moshi STT) marks a new milestone in the field of open-source speech recognition. With its modern architecture, optimization for Apple Silicon environments (via Metal) and CUDA, and advanced transcription models, Moshi offers a high-performance, flexible, and accessible solution for all. Finally, a real challenger to OpenAI’s Whisper.

**Key strengths observed include:**

* Extremely low latency, enabling real-time transcription suitable for interactive use cases.
* Notable robustness to background noise and reliable results, especially in punctuation accuracy and the absence of hallucinations.
* Easy integration thanks to a clear API and multi-platform support (Mac, Linux, Windows).
* The project’s openness, promoting transparency, customization, and innovation within the open-source community.

For developers, Moshi STT is a top-tier tool to integrate speech recognition into various applications: subtitling, meeting transcription, voice assistants, accessibility, or service automation. End users benefit from a smoother, more accurate experience—whether for work, content creation, or daily life.

**We encourage everyone to explore the Moshi project further**: check out its documentation, test its capabilities with the dedicated installation script, or try the online demo at [unmute.sh](https://unmute.sh/){:target="_blank" rel="noopener noreferrer nofollow"}. Contributions, feedback, and suggestions for improvement are invaluable to help the tool evolve and enrich the growing community around the project.

**The future looks promising**: the Kyutai team plans to release new multilingual models, improve support for long audio sessions, and advance real-time speech synthesis and dialogue. With Moshi, the open-source ecosystem now has a solid foundation to meet the new challenges of voice, artificial intelligence, and accessibility.

So don’t hesitate to contribute, share your feedback, and follow the evolution of Moshi—to actively participate in building the voice tools of tomorrow.


<hr class="hr-text" data-content="Resources">

## Additional Resources

To deepen your use of Moshi STT, contribute to the project, or find support, here is a selection of helpful links and community resources:

* **Moshi Server (Official GitHub)**  
  * [https://github.com/kyutai-labs/moshi](https://github.com/kyutai-labs/moshi){:target="_blank" rel="noopener noreferrer nofollow"}  
  * Access the source code, technical documentation, usage examples, and update information on the project’s main repository.

* **Kyutai STT Models (Official GitHub)**  
  * [https://github.com/kyutai-labs/delayed-streams-modeling](https://github.com/kyutai-labs/delayed-streams-modeling){:target="_blank" rel="noopener noreferrer nofollow"}  
  * Learn about the Speech-To-Text model configurations, associated datasets, employed architectures, and recent developments in speech recognition.

* **Optimized Installation Script for Apple Metal**  
  * [https://github.com/jeanjerome/moshi-stt-apple-installer](https://github.com/jeanjerome/moshi-stt-apple-installer){:target="_blank" rel="noopener noreferrer nofollow"}  
  * This repository offers an automated script to install and configure Moshi STT on Apple Silicon Macs, with all required dependencies and optimizations.

* **Kyutai Official Website**  
  * [https://kyutai.org/](https://kyutai.org/){:target="_blank" rel="noopener noreferrer nofollow"}  
  * Learn more about the team, their vision, other projects, and Kyutai’s publications.

* **Online Demo: Unmute.sh**  
  * [https://unmute.sh/](https://unmute.sh/){:target="_blank" rel="noopener noreferrer nofollow"}  
  * Try out Kyutai’s STT, LLM, and TTS modules without installing anything, for an immediate hands-on experience with Moshi technologies.
