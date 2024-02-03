---
layout: post
title: "How to Install the New Apple Ferret LLM on Your Mac"
date: 2024-01-08 16:04:00 +0100
description: "Learn how to install and use Ferret, Apple's LLM, on Mac with Apple Silicon - a complete guide."
img: ferret-apple-mac-llm.jpg
fig-caption: Apple Ferret on a Mac with <a href="#">DALL•E</a>
tags: [AI, LLM, Ferret, MacOS]
lang: en
permalink: /ferret-apple-mac-llm/
status: finished
---

Developed in collaboration with Cornell University, Apple has very discreetly presented on GitHub, its very first
LLM model, Ferret. Well after OpenAI, Meta, and Google, Apple is, in turn, entering the LLM race.
However, the approach is different. Open source and multimodal, this model combines computer vision and natural
language processing, offering unique capabilities in terms of understanding and analyzing text and images. More
powerful than OpenAI's GPT-4, according to Apple, this advance promises to enrich the company's devices, especially in improving
data interpretation and perhaps even Siri.

Ironically, although Apple stopped using and supporting NVIDIA products since 2016, its Ferret model
was developed using NVIDIA's highly performant graphics cards, the A100s. The source code
available on [GitHub](https://github.com/apple/ml-ferret){:target="_blank" rel="noopener noreferrer nofollow"} therefore does not work on Apple products.

Let's see how to remedy this and test the capabilities and responsiveness of this very first version of Ferret on our
machines "Designed by Apple".

<hr class="hr-text" data-content="Table of Contents">

* TOC
{:toc}

<hr class="hr-text" data-content="Prerequisites">

## CUDA, MPS, and Prerequisites

The greatest adherence of Ferret's code lies in its use of CUDA, NVIDIA's GPU framework.
Fortunately, the library used is PyTorch, which has been ported and optimized for Apple Silicon GPUs. The porting to
Apple's Metal API and its Metal Performance Shaders (MPS) framework will be all the simpler.

Another point to note is the basic documentation on installing and using Ferret on GitHub,
proof, if any were needed, that Apple reserves its LLM model solely for researchers as specified in its terms of use.

So let's find out together how to run this Ferret on our Macs. For this, keep in mind that a substantial amount
of GPU memory is required. Our tests were conducted on a MacBook Pro M1 Max with 64 GB of memory.

<hr class="hr-text" data-content="Installation">

## Ferret Installation

### Step 1: Configure Git

Start by installing Git Large File Storage (LFS) to manage the large file sizes we're going to
need:

{% highlight shell %}
brew install git-lfs
git lfs install
{% endhighlight %}

### Step 2: Download Ferret's Source Code

I've adapted the Ferret code for Silicon processors and Apple's Metal Performance Shaders (MPS) framework. It
is available at [https://github.com/jeanjerome/ml-ferret/tree/silicon](https://github.com/jeanjerome/ml-ferret/tree/silicon){:target="_blank" rel="noopener noreferrer nofollow"} :

- The **_main_** branch contains the original code from Apple.
- The **_silicon_** branch contains my adapted version.

This structuring makes it easier to compare the two versions.

To download the code:

{% highlight shell %}
git clone https://github.com/jeanjerome/ml-ferret
cd ml-ferret
git switch silicon
{% endhighlight %}

### Step 3: Create a Python Virtual Environment

Ferret uses Python, so let's create a virtual environment with Conda to isolate dependencies:

{% highlight shell %}
conda create -n ferret python=3.10 -y
conda activate ferret
{% endhighlight %}

Then, install the necessary dependencies:

{% highlight shell %}
pip install --upgrade pip
pip install -e .
pip install pycocotools
pip install protobuf==3.20.0
{% endhighlight %}

### Step 4: Install the Vicuna Model

Place the Vicuna model in the `./model` directory at the root of the project:

{% highlight shell %}
mkdir -p ./model
git lfs install
git clone https://huggingface.co/lmsys/vicuna-13b-v1.3 model/vicuna-13b-v1.3
{% endhighlight %}

Wait for the model to download.

### Step 5: Download Ferret Weights

Apple provides a file with the differences between Vicuna and Ferret's weights. Download them:

{% highlight shell %}
mkdir -p ./delta
curl -o ./delta/ferret-13b-delta.zip https://docs-assets.developer.apple.com/ml-research/models/ferret/ferret-13b/ferret-13b-delta.zip
unzip ./delta/ferret-13b-delta.zip -d ./delta
{% endhighlight %}

This step may take some time.


### Step 6: Transform Vicuna into Ferret

To apply Ferret's modifications to Vicuna:

{% highlight shell %}
python -m ferret.model.apply_delta \
--base ./model/vicuna-13b-v1.3 \
--target ./model/ferret-13b-v1-3 \
--delta ./delta/ferret-13b-delta
{% endhighlight %}

Follow the logs to confirm the operation is proceeding well:

{% highlight shell %}
/opt/homebrew/Caskroom/miniconda/base/envs/ferret/lib/python3.10/site-packages/bitsandbytes/cextension.py:34: UserWarning: The installed version of bitsandbytes was compiled without GPU support. 8-bit optimizers, 8-bit multiplication, and GPU quantization are unavailable.
warn("The installed version of bitsandbytes was compiled without GPU support. "
'NoneType' object has no attribute 'cadam32bit_grad_fp32'
Loading base model
Loading checkpoint shards: 100%|██████████████████████████████████████████████████████| 3/3 [00:04<00:00,  1.57s/it]
Loading delta
Loading checkpoint shards: 100%|██████████████████████████████████████████████████████| 3/3 [00:08<00:00,  2.94s/it]
Applying delta
Applying delta: 100%|█████████████████████████████████████████████████████████████| 421/421 [00:16<00:00, 26.04it/s]
Saving target model
{% endhighlight %}

You have now installed Ferret on your Mac!


<hr class="hr-text" data-content="Getting Started">

## Launching Ferret Demo

The demo provided by Apple allows you to appreciate the capabilities of the new model through a web interface.

This demonstrator includes a controller, a Gradio web server, and a model worker that loads the weights and performs
inference.

Launch the demo with these commands in three separate terminals:

### Step 7: First Terminal

Start the controller:

{% highlight shell %}
conda activate ferret
python -m ferret.serve.controller --host 0.0.0.0 --port 10000
{% endhighlight %}

Wait for the message indicating that the controller is operational: `Uvicorn running on http://0.0.0.0:10000 (Press CTRL+C to quit)`

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-starting-controller.png --alt Starting the controller %}
  <figcaption>Starting the controller</figcaption>
</figure>

### Step 8: Second Terminal

Launch the web server:

{% highlight shell %}
conda activate ferret
python -m ferret.serve.gradio_web_server --controller http://localhost:10000 --model-list-mode reload --add_region_feature
{% endhighlight %}

Wait for the line `Running on local URL:  http://0.0.0.0:7860` to appear:

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-starting-web-ui.png --alt Starting the Web Interface %}
  <figcaption>Starting the Web Interface</figcaption>
</figure>

### Step 9: Third Terminal

Run the model worker:

{% highlight shell %}
conda activate ferret
python -m ferret.serve.model_worker --host 0.0.0.0 --controller http://localhost:10000 --port 40000 --worker http://localhost:40000 --model-path ./model/ferret-13b-v1-3 --add_region_feature
{% endhighlight %}

Monitor the logs to ensure everything is working correctly: `Uvicorn running on http://0.0.0.0:40000 (Press CTRL+C to quit)`

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-starting-worker-model.png --alt Starting the Model %}
  <figcaption>Starting the Model</figcaption>
</figure>

### Step 10: Access the Demo

Click on the address [http://localhost:7860/](http://localhost:7860/){:target="_blank" rel="noopener noreferrer nofollow"} to access the web interface of the demo.

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-web-interface.png --alt Ferret Demonstrator Interface %}
  <figcaption>Ferret Demonstrator Interface</figcaption>
</figure>


<hr class="hr-text" data-content="Testing">

## Demo Testing

Apple has included tests with images and pre-filled prompts to evaluate Ferret.

Let's test them!

### Test 1: The Dog and the Ferrets

- Select the first image (the white dog) in `Examples`.
- In `Referring Input Type`, choose `Sketch`.
- Draw on the dog and the ferret in `Image & Sketch`.
- Finally, click the `Submit` button next to the prompt `What’s the relationship between object [region0] and object [region1]?`

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-test-the-dog-and-the-ferrets.png --alt Test of the dog and the ferrets %}
  <figcaption>Test of the dog and the ferrets</figcaption>
</figure>

The answers vary, but remain consistent with the image and probably depend on the pixels selected:

- **Trial 1**: `The object [497, 303, 791, 658] is a dog, and it’s standing next to another dog [307, 507, 459, 690]. They seem to be enjoying their time together in the snow.`
- **Trial 2**: `The object [457, 283, 817, 701] is a dog, and the object [318, 498, 464, 707] is a ferret. The dog and the ferret appear to be sitting together in the snow, suggesting a friendly interaction or companionship.`

> info "Limitations"
> Ferret can consume a lot of memory, and it may be necessary to restart the model worker between tests.
> On my MacBook M1 Max with its 64 GB, 62 GB of RAM were used, 2 GB of files were cached, and 20 GB for the
> swap file.


### Test 2: The Jetty on the Lake

- Select the second image (the jetty).
- Without drawing, submit the prompt by clicking the `Submit` button next to the prompt `What are the things I should be cautious about when I visit here? Tell me the coordinates in response.`

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-test-the-jetty-on-the-lake.png --alt Test of the jetty on the lake %}
  <figcaption>Test of the jetty on the lake</figcaption>
</figure>

- **Result**: `When you’re on the dock [218, 535, 810, 993], you should be mindful of a few things. Firstly, the water [0, 518, 998, 997] is a crucial aspect, and you should be careful not to go too close to the edge [731, 543, 998, 591]. Secondly, the surrounding trees [875, 366, 940, 510] [707, 385, 757, 535] [650, 393, 695, 529] [512, 420, 540, 526] [775, 375, 818, 522] could pose a hazard if you’re not cautious. Lastly, it’s important to be aware of the path [218, 535, 810,] to ensure you stay on the right track to avoid any unintentional falls or injuries.`

### Test 3: The Living Room

- Choose the third image (the living room).
- Submit the prompt without drawing by clicking the `Submit` button next to the prompt `Describe the image in detail.`
- Ferret begins to respond...

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-test-the-living-room.png --alt Test of the living room %}
  <figcaption>Test of the living room</figcaption>
</figure>

- **Result**:
  - Ferret writes its response slowly. It seems to be constrained by the 64 GB of RAM.
  - It still manages to write this: `The image depicts a cozy living room [12, 1, 982, 989] with various pieces of furniture [490, 588, 709, 883] and decorations [244, 27, 394, 110] [247, 28, 274, 109] [378, 43, 411, 108]. In the center, there is a colorful, multicolored rug [90, 689, 746, 994] on the floor. A flat-screen TV [1, 394, 93, 723] is mounted on the left wall, with remotes [5, 679, 60, 734] placed nearby. Two couches [513, 421, 938, 769] [501, 577, 993, 995] are arranged in the room, with one along the right wall and another on the far end of the room. A few chairs are also present, scattered around the room. A dining table [710, 392, 954, 511] [`
  - Before crashing miserably with a `NETWORK ERROR DUE TO HIGH TRAFFIC. PLEASE REGENERATE OR REFRESH THIS PAGE. (error_code: 1)`
  - In the logs, one can read: `Caught Unknown Error MPS backend out of memory (MPS allocated: 26.50 GB, other allocations: 55.14 GB, max allowed: 81.60 GB). Tried to allocate 10.00 KB on private pool. Use PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.0 to disable upper limit for memory allocations (may cause system failure).`

No solution then for my MacBook Pro, the 80 GB occupied by Ferret is not enough...

### Test Summary

After this series of tests, it's clear that Ferret demonstrates an impressive capability to analyze and describe an
image and to transcribe it into natural language, offering new possibilities. However, it also
became apparent that Ferret can be subject to high memory consumption issues, particularly during
prolonged processing, leading to noticeable slowdowns as memory begins to compress, and even crashes.

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-test-metrics.jpg --alt Resources consumed by Ferret %}
  <figcaption>Resources consumed by Ferret</figcaption>
</figure>

When Ferret operates normally, GPU usage peaks up to 90%, indicating that the neural
network activity takes place in this part of the SoC (System on Chip). By contrast, CPU activity remains
stable at around 20%.

However, analyzing Ferret's resource consumption tracking reveals that periods of slowdown in
the model's responses coincide with phases of RAM memory compression. GPU activity then drops
to around 20% while CPU activity stays around 20%. The problem seems to reside in the
memory, suggesting that the system is swapping or compressing/decompressing memory due to a lack of sufficient
RAM available for the model and its processing.

<hr class="hr-text" data-content="Lightweight Ferret">

## Optimizing the Ferret Model for Apple Devices

Following the analysis of the installation and testing of the 13B model, it becomes evident that Apple must tackle
the challenge of adapting its model to work optimally on its Macs and iPhones. To this end, Apple
is considering various strategies, according to rumors and information available on the internet. Some of
these strategies are already well-established, while others come directly from its research labs:

### Model Quantization
Quantization reduces the precision of the model's weights, thereby decreasing its size and resource consumption
without significantly compromising prediction performance. While traditional models may use weights represented by 32-bit floating-point numbers (float32), quantization reduces this precision to more
compact formats, such as 16 bits (float16) or even 8 bits (int8). This is particularly advantageous for iPhones, where storage
space and computational capacity are more limited than on a Mac.

The availability of a 7B version of Ferret illustrates this.

> info "Installing the 7B Version of Ferret"
> If you have already followed the steps to install the 13B format of Ferret, installing the 7B version will be
> greatly simplified. The majority of the installation steps remain the same, with one exception: there is no
> need to recreate a virtual environment.
> To install the 7B Ferret, rerun the commands by replacing all the `13`s with `7`s.

### Model Sparsification and Pruning
These are two related model compression techniques aimed at optimizing neural networks by reducing
their complexity, for example, by decreasing the number of neurons or removing connections with weights close
to zero without significantly compromising performance.

### Model Distillation
This is a model optimization technique that involves transferring the knowledge from a
large, complex model (the "teacher" model) to a smaller, simpler model (the "student" model). The goal
is to teach the student model to replicate the performance of the teacher model while being lighter and
faster to execute, preserving the quality of predictions.

### Split Deployment
This method involves sharing the computational tasks of a model between local devices and the cloud. This
approach leverages the computational capabilities of the cloud for heavy operations while performing lighter
tasks locally. However, this strategy seems unlikely for Apple, which favors entirely local solutions or internal optimizations. Apple aims to maintain user data privacy and security
by minimizing dependence on the cloud.

### Advanced Use of Flash Memory
In a recently published article by researchers at Apple,
[LLM in a flash: Efficient Large Language Model Inference with Limited Memory](https://arxiv.org/pdf/2312.11514.pdf){:target="_blank" rel="noopener noreferrer nofollow"},
it is suggested that Apple considers using flash memory to store model parameters. These parameters are
then dynamically transferred to DRAM during inference, thus reducing the volume of data exchanged and
speeding up processing on devices with limited DRAM, like iPhones. This approach, combined with
the use of innovative data management techniques such as windowing and row-column bundling, further optimizes the amount of data to be transferred and indirectly the
speed of inference.

<hr class="hr-text" data-content="Conclusion">

## Conclusion

In summary, the integration of Ferret, Apple's latest LLM model, on machines equipped with Apple Silicon processors, 
represents a significant advancement in the field of artificial intelligence. Despite some challenges inherent in 
adapting the original code, designed for NVIDIA GPUs, the efforts to port it to Apple's Metal architecture have been 
straightforward.

This advancement raises exciting questions about how Apple will execute its multimodal language model on devices with 
more limited resources like iPhones.

There is no doubt that Apple has already found ways to run its Ferret on iPhones, utilizing advanced optimization 
techniques. Apple's ability to effectively adapt cutting-edge technologies to their devices demonstrates their mastery 
of AI within their hardware and software ecosystem. It will be interesting to see how these developments will influence 
the user experience on our iPhones and Macs and what new uses Apple will introduce into our daily lives. Rumors are 
talking about a completely renewed user interface in iOS 18! We will surely know more at WWDC 2024 next June.

## The Pros

| Advantages of Ferret        | Description                                                                                                                                             |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Multimodal Capabilities     | Combination of computer vision and natural language processing for enriched understanding and analysis of text and images.                              |
| Enhanced Performance        | Ability to perform complex tasks with increased efficiency.                                                                                             |
| Optimized User Interaction  | Improvement of interaction with users through better understanding of natural language, the external environment, and more accurate responses.          |
| Potential for Innovation    | Opens up new possibilities for innovative applications in various fields such as translation, voice assistance, augmented reality, and virtual reality. |

## The Cons

| Disadvantages of Ferret     | Description                                                                                                |
|-----------------------------|------------------------------------------------------------------------------------------------------------|
| Technical Complexity        | Implementation and optimization of the model can be complex for use on iPhones.                            |
| Resource Needs              | Even when optimized, the model will still require significant resources in terms of processing and memory. |
| Integration Limits          | Integrating with the existing ecosystem of iOS applications could pose real challenges.                    |
| Energy Consumption          | Advanced AI use may lead to increased energy consumption, affecting battery life.                          |
| Privacy Concerns            | Data management and privacy can be concerns, especially in applications sensitive to privacy.              |

## Uses

| Potential Functionality of Ferret in iOS and MacOS | Description and Impact                                                                                                                                        |
|----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Instant Translation                                | Significant improvement in real-time text translation through advanced deep learning capabilities. Can integrate with all apps from Safari to Pages.          |
| Optimized Voice Assistant                          | Improvement of Siri (finally!) for better natural language understanding and more natural and effective interactions.                                         |
| Augmented and Virtual Reality                      | Enrichment of augmented and virtual reality experiences through more sophisticated image and scene analysis in the Photos app and Camera app.                 |
| Generative Text and Image Assistance               | Extraction of lyrics in Apple Music (with translation), support for text and image generation in Apple Pages and Keynote, or even coding assistance in Xcode. |
