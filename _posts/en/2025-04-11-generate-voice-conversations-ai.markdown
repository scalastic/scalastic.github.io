---
layout: post
title: "How to Generate Voice Conversations with AI to Test a Transcription Tool"
date: 2025-04-11 13:47:00 +0100
description: "A feedback on generating synthetic audio dialogues using OuteTTS to test a meeting transcription tool."
img: generate-voice-conversations-ai.jpg
fig-caption: Photo generated with Le Chat by Mistral AI
tags: ["TTS", "synthetic-voices", "AI", "OuteTTS"]
lang: en
permalink: /generate-voice-conversations-ai/
status: finished
---

Developing a meeting transcription and analysis tool on my own, I quickly needed realistic audio files to test it. Without any participants to record mock meetings, nor any usable recordings at hand, I decided to create a voice conversation generator from text files.

The idea: start from a structured conversation script (with multiple speakers), and use AI to automatically produce an audio file where each character speaks with a different synthetic voice.

To do this, I relied on existing TTS models from [HuggingFace](https://huggingface.co/models?pipeline_tag=text-to-speech&sort=trending){:target="_blank" rel="noopener noreferrer nofollow"} and selected [**OuteTTS**](https://github.com/edwko/OuteTTS){:target="_blank" rel="noopener noreferrer nofollow"}, an open-source voice synthesis project based on **llama.cpp** and the **Transformers** library—top-notch tools—and also capable of generating natural voices in different languages.

In this article, I share how the generator I built with Python works, how I managed speaker profiles, the issues I encountered, and some tips for getting a smooth, customizable, and practical result to test any transcription tool.

{% github_card jeanjerome/VoiceGenMeeting %}


<hr class="hr-text" data-content="Table of Contents">

* TOC
{:toc}

<hr class="hr-text" data-content="Generator">

## The Generator: Concept and Structure

The idea behind the generator is simple: start from a text file where each line corresponds to a dialogue, preceded by the speaker's name, for example:

{% highlight plaintext %}
Marc: Hello everyone, shall we start?
Julie: Yes, I’m ready.
...
{% endhighlight %}

The script automatically identifies the speakers, assigns them a voice, then generates each audio segment using the OuteTTS model. All segments are then concatenated, with a short silence between each line, to produce a single `.wav` file that plays the entire conversation.

I chose to build a command-line tool in Python, which takes a text file as input and outputs an audio file. The process is quite modular and consists of several steps:

1. **Reading and parsing the text file**: each line is analyzed to extract the speaker's name and their dialogue.
2. **Voice assignment**: for each new speaker, the script creates a unique voice profile. This is a feature provided by OuteTTS, which can generate a voice clone from a simple 15-second audio file.
3. **Generating audio segments**: the OuteTTS model is invoked for each line, using the voice assigned to the respective speaker.
4. **Concatenating the segments**: the audio segments are then combined in the order they appear, with a short pause between each to make the listening experience more natural.

This setup allows for easily simulating meetings with multiple speakers, each with their own voice, from a simple `.txt` file. It’s an excellent way to create realistic test cases without needing manual audio recording.

<hr class="hr-text" data-content="Generator">

## Custom Voices for Each Speaker

To make the generated conversations believable, it was essential for each participant to have their own voice. OuteTTS enables precisely this: it can create a personalized voice profile from a simple audio file.

The script I developed follows a straightforward logic: when a new speaker name is encountered, it looks for a corresponding audio file in the `data/speakers` folder. For example, if a line in the transcript file begins with `Julie: ...`, the script will attempt to load `data/speakers/julie.wav` (or `.mp3`).

If the file exists, OuteTTS uses it to generate a voice clone in just a few seconds. In fact, this process relies on `Whisper`, OpenAI’s audio transcription model, which is used upstream to transcribe the file and accurately segment the voice. The usable length of the file is automatically trimmed to `15 seconds`, which is sufficient to capture the necessary vocal characteristics.

The generated profile is then saved as a `.json` file in the `data/profiles` folder, so it does not need to be regenerated on every run. If no file is found, the script can fall back on the model’s default voice, `en-female-1-neutral` (though this is not the intended use).

To simplify voice preparation, the script automatically converts `.mp3` (or `.wav`) files to mono, 44.1 kHz, and trims them to a maximum of 15 seconds if needed. This ensures compatibility with the model’s requirements, while allowing the use of basic voice recordings—even those made quickly with a simple microphone.

This system makes the creation of voice dialogues fully automatable. You only need to prepare a text script with character names, add a short voice clip for each, and run the generator to get a credible mock meeting in just a few minutes.

<hr class="hr-text" data-content="Pitfalls">

## Pitfalls Encountered and Necessary Adjustments

Setting up an audio meeting generator seemed simple on paper… but several technical details quickly forced me to adjust my approach. Here are some of the obstacles I encountered and how I worked around them.

### 1. Only One Default Voice Available
When testing the initial OuteTTS model, I quickly realized it only offers one default voice profile (`en-female-1-neutral`). Any attempt to load a different voice returned an error.

**Solution**: use custom audio files for each speaker. This allowed me to dynamically generate as many profiles as needed from my own clips (`marc.mp3`, `julie.wav`, etc.).

### 2. Audio Format: Tensor or WAV?
Contrary to what one might expect, the `output.audio` returned by OuteTTS **is not always a WAV file**. It’s actually a **raw tensor** (typically a `numpy.ndarray` or `torch.Tensor`) representing the audio signal.

**Solution**: instead of treating the stream as an encoded file (which caused an error like “a bytes-like object is required”), I simply converted the tensor to a NumPy array using `np.asarray(output.audio, dtype='float32').flatten()`. This resolved the issue and enabled proper segment concatenation.

### 3. Slow, Deep, or Distorted Voice
During my initial tests, the generated voice sounded odd: slow, deep, almost distorted. In fact, this was due to an **incorrect sample rate** during the final file recording.

**Solution**: manually set the `sample_rate` to **44,100 Hz**, which is the expected output rate for natural-sounding audio with OuteTTS.

### 4. Incompatibility with NumPy 2.0
A NumPy update introduced a `DeprecationWarning` related to the use of the `copy` parameter when converting to arrays. While not blocking, it cluttered the console output.

**Solution**: avoid `np.array(..., copy=True)` and prefer `np.asarray(...).copy()` to ensure compatibility with NumPy 2.0 while keeping the code clean.

### 5. Automatically Trimming Long Audio Files
Some of my audio sources exceeded 30 seconds, which caused issues for OuteTTS in generating reliable voice profiles. While the model automatically trims to 15 seconds, it’s better to handle this beforehand.

**Solution**: I integrated the `pydub` library to automatically convert and trim any `.mp3` or `.wav` file to 15 seconds, in mono and at 44.1 kHz. This step ensures profiles are compatible, even from imperfect audio files.

These small adjustments helped stabilize the tool and achieve smooth, reliable generation—especially reusable across different testing contexts. And as often with generative AI, the devil is in the details.


<hr class="hr-text" data-content="Conclusion">

## Conclusion

By combining a simple text file, a few audio clips, and an open-source model like OuteTTS, I was able to create a tool capable of automatically generating realistic voice conversations to test my meeting transcription and analysis pipeline.

This generator allows me to simulate multi-speaker exchanges, vary the voices, and produce as many test cases as needed—without relying on real recordings or involving other people.

Beyond testing, this tool opens the door to other applications: voice rendering of meeting summaries, synthetic audio playback of sessions, or even on-the-fly simulated dialogue generation for learning environments or conversational agent prototyping.

The full code is open source. If you're interested in this kind of approach, or if you're developing transcription tools, TTS systems, or voice assistants, I’d be glad to connect and discuss.
