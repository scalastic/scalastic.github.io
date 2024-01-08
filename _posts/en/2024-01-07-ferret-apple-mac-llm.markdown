---
layout: post
title: "How to Install the New Apple LLM Ferret on Your Mac"
date: 2024-01-08 16:04:00 +0100
description: "Learn how to install and use Ferret, Apple's LLM, on Mac with Apple Silicon - a complete guide."
img: ferret-apple-mac-llm.jpg
fig-caption: Apple Ferret on a Mac with <a href="#">DALL•E</a>
tags: [AI, LLM, Ferret, MacOS]
lang: en
permalink: /ferret-apple-mac-llm/
status: finished
---

Developed in collaboration with Cornell University, Apple has quietly introduced on GitHub its very first
LLM model, Ferret. Following in the footsteps of OpenAI, Meta, and Google, Apple has now joined the LLM race.
However, their approach is different. Open source and multimodal, this model combines computer vision and natural
language processing, offering unique capabilities in terms of understanding and analyzing text and images. Claimed
by Apple to be more powerful than OpenAI's GPT-4, this advancement promises to enrich the company's devices, especially in improving
data interpretation and perhaps even Siri.

Ironically, although Apple stopped using and supporting NVidia products in 2016, its Ferret model
was developed using NVidia's highly efficient A100 graphics cards. Therefore, the source code
available on [GitHub](https://github.com/apple/ml-ferret){:target="_blank" rel="noopener noreferrer nofollow"} does not 
work on Apple's products.

Let's see how to remedy this and test the capabilities and responsiveness of this very first version of Ferret on our
"Designed by Apple" machines.


<hr class="hr-text" data-content="Summary">

* TOC
{:toc}

<hr class="hr-text" data-content="Prerequisites">

## CUDA, MPS, and Prerequisites

The biggest challenge in the Ferret code is its use of CUDA, NVidia's GPU framework.
Fortunately, the library used is PyTorch, which has been ported and optimized for Apple Silicon GPUs. The transition to
Apple's Metal architecture will be all the more straightforward.

Another point to note is the rudimentary documentation on the installation and use of Ferret on GitHub,
suggesting that Apple is reserving its LLM model exclusively for researchers, as stated in its terms of use.

So let's explore together how to run Ferret on our Macs. For this, keep in mind that a substantial
amount of GPU memory is necessary. Our tests were conducted on a MacBook Pro with 64 GB of memory.


<hr class="hr-text" data-content="Installation">

## Installing Ferret

### Step 1: Setting Up Git

Start by installing Git Large File Storage (LFS) to manage the large file sizes we will
need:

{% highlight shell %}
brew install git-lfs
git lfs install
{% endhighlight %}

### Step 2: Downloading the Ferret Source Code

The official Ferret code is available at [https://github.com/apple/ml-ferret](https://github.com/apple/ml-ferret){:target="_blank" rel="noopener noreferrer nofollow"}. I have adapted this code for
Silicon processors and Apple's Metal Performance Shaders (MPS) framework, available at [https://github.com/jeanjerome/ml-ferret/tree/silicon](https://github.com/jeanjerome/ml-ferret/tree/silicon){:target="_blank" rel="noopener noreferrer nofollow"}:

- The **_main_** branch contains the original code from Apple.
- The **_silicon_** branch contains my adapted version.

This structure makes it easy to compare the two versions. To clone the code:

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


### Step 5: Download the Ferret Weights

Apple provides a file with the differences between the weights of Vicuna and Ferret. Download them:

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

Follow the logs to confirm the operation is proceeding correctly:

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

You have now installed Ferret on your Mac.


<hr class="hr-text" data-content="Startup">

## Launching the Ferret Demo

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
  {% picture {{site.baseurl}}/assets/img/ferret-starting-controller.png --alt Starting the Controller %}
  <figcaption>Starting the Controller</figcaption>
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

Execute the model worker:

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

<hr class="hr-text" data-content="Test">

## Testing the Demo

Apple has included tests with pre-filled images and prompts to evaluate Ferret.

Let's test them!

### Test 1: The Dog and the Ferrets

- Select the first image (the white dog) in `Examples`.
- In `Referring Input Type`, choose `Sketch`.
- Draw on the dog and the ferret in `Image & Sketch`.
- Finally, click the `Submit` button next to the prompt `What’s the relationship between object [region0] and object [region1]?`

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-test-the-dog-and-the-ferrets.png --alt Test of the Dog and the Ferrets %}
  <figcaption>Test of the Dog and the Ferrets</figcaption>
</figure>

Responses vary but remain consistent with the image and likely depend on the selected pixels:

- **Trial 1**: `The object [497, 303, 791, 658] is a dog, and it’s standing next to another dog [307, 507, 459, 690]. They seem to be enjoying their time together in the snow.`
- **Trial 2**: `The object [457, 283, 817, 701] is a dog, and the object [318, 498, 464, 707] is a ferret. The dog and the ferret appear to be sitting together in the snow, suggesting a friendly interaction or companionship.`

> info "Limitations"
> Ferret can consume a lot of memory, and it may be necessary to restart the model between tests.
> On my MacBook M1 Max with 64 GB, 62 GB of RAM was used, 2 GB of cached files, and 20 GB for the
> swap file.


### Test 2: The Jetty on the Lake

- Select the second image (the jetty).
- Without drawing, submit the prompt by clicking on the `Submit` button next to the prompt `What are the things I should be cautious about when I visit here? Tell me the coordinates in response.`

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-test-the-jetty-on-the-lake.png --alt Test of the Jetty on the Lake %}
  <figcaption>Test of the Jetty on the Lake</figcaption>
</figure>

- **Result**: `When you’re on the dock [218, 535, 810, 993], you should be mindful of a few things. Firstly, the water [0, 518, 998, 997] is a crucial aspect, and you should be careful not to go too close to the edge [731, 543, 998, 591]. Secondly, the surrounding trees [875, 366, 940, 510] [707, 385, 757, 535] [650, 393, 695, 529] [512, 420, 540, 526] [775, 375, 818, 522] could pose a hazard if you’re not cautious. Lastly, it’s important to be aware of the path [218, 535, 810,] to ensure you stay on the right track to avoid any unintentional falls or injuries.`

### Test 3: The Living Room

- Choose the third image (the living room).
- Submit the prompt without drawing by clicking on the `Submit` button next to the prompt `What are the things I should be cautious about when I visit here? Tell me the coordinates in response.`
- Ferret begins to respond...

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-test-the-living-room.png --alt Test of the Living Room %}
  <figcaption>Test of the Living Room</figcaption>
</figure>

- **Result**:
  - Ferret slowly writes its response. It seems to feel cramped in the 64 GB of RAM.
  - It still manages to write this: `The image depicts a cozy living room [12, 1, 982, 989] with various pieces of furniture [490, 588, 709, 883] and decorations [244, 27, 394, 110] [247, 28, 274, 109] [378, 43, 411, 108]. In the center, there is a colorful, multicolored rug [90, 689, 746, 994] on the floor. A flat-screen TV [1, 394, 93, 723] is mounted on the left wall, with remotes [5, 679, 60, 734] placed nearby. Two couches [513, 421, 938, 769] [501, 577, 993, 995] are arranged in the room, with one along the right wall and another on the far end of the room. A few chairs are also present, scattered around the room. A dining table [710, 392, 954, 511] [`
  - Before crashing miserably with a `NETWORK ERROR DUE TO HIGH TRAFFIC. PLEASE REGENERATE OR REFRESH THIS PAGE. (error_code: 1)`
  - In the logs, we can read: `Caught Unknown Error MPS backend out of memory (MPS allocated: 26.50 GB, other allocations: 55.14 GB, max allowed: 81.60 GB). Tried to allocate 10.00 KB on private pool. Use PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.0 to disable upper limit for memory allocations (may cause system failure).`

No solution then for my MacBook Pro, the 80 GB occupied by Ferret are not enough...

<hr class="hr-text" data-content="Conclusion">

## Conclusion

In conclusion, the integration of Ferret, Apple's latest LLM model, on machines equipped with Apple Silicon processors, 
represents a significant advancement in the field of artificial intelligence. Despite some challenges inherent in 
adapting the initial code, which was designed for NVidia GPUs, the efforts to port it to Apple's Metal architecture have
been straightforward.

The installation and deployment of Ferret, while demanding in terms of memory and resources, open up exciting prospects 
for Mac users. The demonstrations provided with the source code illustrate the power and versatility of Ferret, capable 
of deeply analyzing and interpreting visual and textual data.

It is important to note that this implementation of Ferret, despite its power, remains resource-intensive, particularly 
in terms of RAM. No doubt Apple will now adapt its new model to its machines, especially iPhones. Its potential to 
enhance existing applications and create new ones is immense, and we can expect its next evolution to bring even more 
innovation and features.
