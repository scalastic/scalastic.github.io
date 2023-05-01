---
layout: post
title: Functional Programming in Bash - Harnessing the Power of Simplicity
date: 2023-04-30 15:50:00 +0200
description: 
img: functional-programming.jpg
fig-caption: Photo by <a href="https://unsplash.com/de/@mediaecke?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">MediaEcke</a> on <a href="https://unsplash.com/fr/photos/QGdmkyLK7jo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [FP, Bash, DevOps, Scripting]
lang: en
permalink: /bash-functional-programming/
status: finished
---

Bash, the command-line shell and scripting language commonly found in Unix-based systems, is primarily known for its 
imperative and procedural style. However, with a little creativity, it is possible to apply functional programming 
principles to write elegant and powerful scripts in Bash.

In this post, we will explore how functional programming concepts can be utilized in Bash scripts, enabling cleaner 
code, improved modularity, and increased readability.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="Benefits">

## Benefits of Functional Programming in Bash
Functional programming brings several advantages to Bash scripting, including:

1. **Improved Readability**: By focusing on functions that are concise, self-contained, and single-purpose, functional 
programming promotes code that is easier to read and understand, making it more maintainable over time.

2. **Modularity and Reusability**: Functions in functional programming are designed to be composable and reusable. This 
allows you to build complex scripts by combining smaller, self-contained functions, promoting modularity and code 
reusability.

3. **Fewer Side Effects**: Functional programming discourages the use of mutable state and encourages immutability. This 
reduces the likelihood of introducing side effects, making scripts easier to test and reason about.

<hr class="hr-text" data-content="Concepts">

## Functional Programming Concepts in Bash

### Pure Functions
Pure functions are the foundation of functional programming. They take input parameters and produce output without any 
side effects. In Bash, we can create pure functions by ensuring that they only use input parameters and local variables,
without modifying global state or relying on external dependencies.

Example:
{% highlight bash %}
#!/bin/bash

# Pure function to calculate the square of a number
square() {
  local num=$1
  echo $((num * num))
}

{% endhighlight %}

### Higher-Order Functions
Higher-order functions take one or more functions as input parameters or return a function as output. In Bash, we can 
pass functions as arguments or store them in variables, allowing us to create higher-order functions.

Example:
{% highlight bash %}
#!/bin/bash

# Higher-order function to apply a given function to each element of an array
map() {
  local func=$1
  local array=("${@:2}")
  local result=()

  for element in "${array[@]}"; do
    result+=("$("$func" "$element")")
  done

  echo "${result[@]}"
}

# Usage example
square() {
  local num=$1
  echo $((num * num))
}

array=(1 2 3 4 5)
result=($(map square "${array[@]}"))
echo "${result[@]}"  # Output: 1 4 9 16 25

{% endhighlight %}


### Recursion

Recursion is a powerful technique in functional programming. Bash, though not optimized for recursion, can still 
handle it effectively for certain use cases. Recursion allows you to solve problems by breaking them down into smaller 
subproblems, leading to more concise and expressive code.

Example:
{% highlight bash %}
#!/bin/bash

# Recursive function to calculate the factorial of a number
factorial() {
  local num=$1

  if ((num <= 1)); then
    echo 1
  else
    local subfactorial=$(factorial $((num - 1)))
    echo $((num * subfactorial))
  fi
}

# Usage example
echo $(factorial 5)  # Output: 120

{% endhighlight %}

<hr class="hr-text" data-content="Conclusion">

## Conclusion
While Bash is primarily an imperative language, functional programming concepts can be effectively applied to write 
cleaner and more modular scripts. By leveraging pure functions, higher-order functions, and recursion, you can take 
advantage of the simplicity and power of functional programming in the Bash scripting environment. So next time you 
find yourself writing a Bash script, consider applying functional programming principles to enhance your code.
