---
layout: post
title: "Functional Programming in Bash: Harnessing the Power of Simplicity"
date: 2023-04-30 15:50:00 +0200
description: "Discover the power of functional programming in Bash: principles, functions, and code examples. Enhance your scripts with simplicity."
img: functional-programming.jpg
fig-caption: Photo by <a href="https://unsplash.com/de/@mediaecke?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">MediaEcke</a> on <a href="https://unsplash.com/fr/photos/QGdmkyLK7jo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [FP, Bash, DevOps, Scripting]
lang: en
permalink: /bash-functional-programming/
status: finished
---

Bash, the command-line shell and scripting language commonly used in Unix-based systems, is primarily known for its 
imperative and procedural style. However, with a little creativity, it is possible to apply the principles of functional
programming to write elegant and powerful scripts in Bash.

In this article, we will explore how the concepts of functional programming can be utilized in Bash scripts, enabling 
cleaner code, improved modularity, and increased readability.

<hr class="hr-text" data-content="Summary">

* TOC
{:toc}

<hr class="hr-text" data-content="Concepts">

## Reminder of Functional Programming Concepts

Functional programming is a programming paradigm based on the use of functions in the mathematical sense as a central 
element of software development. Here are some key concepts of functional programming.

### Pure Functions

Pure functions are functions (in the mathematical sense) that do not modify the global state and always produce the 
same result for the same inputs. They have no undesirable side effects, making them predictable and easy to understand.

### Immutability of Data

Immutability is the principle that data cannot be changed once it is created. Instead, new data is created during 
transformations. This avoids side effects and facilitates reasoning about the behavior of functions.

### Higher-Order Functions

Higher-order functions are functions that can take other functions as arguments or return them as results. They enable 
powerful abstraction and code reuse by allowing the manipulation of functions as first-class values.

### Recursion

Recursion is a technique where a function calls itself to solve a problem iteratively instead of using loops. It allows 
solving complex problems by breaking them down into smaller, repetitive problems. Recursion is often used for traversing
data structures.

### Function Composition

Function composition involves combining multiple functions to form new, more complex functions. This allows the creation
of data processing pipelines where the output of one function becomes the input of the next one. Function composition 
promotes a modular and declarative approach to development.

### Decomposition into Smaller Functions

Functional programming encourages the decomposition of complex problems into smaller, specialized functions. This 
promotes code reuse, improves readability, and facilitates maintenance.

### Lazy Evaluation

This is another key concept of functional programming. Lazy evaluation is an approach where expressions are only 
evaluated when their value is actually needed. This helps save resources by avoiding the evaluation of unnecessary 
expressions.

In summary, these key concepts of functional programming allow for the creation of more readable, predictable, modular, 
and reusable code. They promote a declarative approach to development, focusing on the "what" rather than the "how" of 
the code.

<hr class="hr-text" data-content="Basic Functions">

## Basic Functions in a Functional Language

The basic functions in a functional language may vary from one language to another, but there are generally a few 
commonly used functions in most functional languages. Moreover, most of these functions are higher-order functions, 
meaning they can take other functions as parameters and/or return functions as results. Here are some examples of basic 
functions:

1. **map**: Applies a function to each element of a list or a similar data structure, returning a new list containing 
the results.

2. **filter**: Filters the elements of a list based on a condition specified by a function, returning a new list that 
only contains the elements satisfying the condition.

3. **reduce (or fold)**: Combines the elements of a list by applying a cumulative operation. For example, summing, 
multiplying, or concatenating.

4. **zip**: Combines two or more lists into a list of pairs, taking one element from each list at a time.

5. **curry**: Transforms a function that takes multiple arguments into a sequence of functions, with each function 
accepting only one argument at a time.

6. **compose**: Allows the composition of multiple functions together to form a new function. The outputs of one 
function become the inputs of the next function.

These basic functions enable functional data manipulation, avoiding the use of loops and mutable variables, for example.
Therefore, if we manage to implement such functions in Bash, we should be able to program following functional concepts.

<hr class="hr-text" data-content="Advantages">

## Advantages of Functional Programming in Bash Scripts

Functional programming brings several advantages to programming in Bash, which is commonly used following the procedural
paradigm:

1. **Improved Readability**: By focusing on concise, self-contained, and single-purpose functions, functional 
programming promotes code that is easier to read and understand, making it more maintainable over time.

2. **Modularity and Reusability**: Functions in functional programming are designed to be composable and reusable. This 
allows you to build complex scripts by combining smaller, self-contained functions, promoting code modularity and 
reusability.

3. **Fewer Side Effects**: Functional programming discourages the use of mutable state and encourages immutability. This
reduces the likelihood of introducing side effects, greatly facilitating testing and understanding of the scripts.

<hr class="hr-text" data-content="Concepts">

## Functional Programming Concepts Applied to Bash

### Pure Functions in Bash

Pure functions are the foundation of functional programming. They take input parameters and produce an output without 
any side effects. In Bash, we can create pure functions by ensuring that they only use input parameters and local 
variables, without modifying the global state or relying on external dependencies.

Example:
{% highlight bash %}
#!/bin/bash

# Pure function to calculate the square of a number
square() {
  local num=$1
  echo $((num * num))
}

# Example usage
result=$(square 2)

echo "$result"
# Output: 4
{% endhighlight %}

In the example above, the `square` function is a pure function that calculates the square of a number. It takes an input
parameter, `num`, and returns the squared value without modifying any global state. This demonstrates the concept of 
pure functions in Bash.

### Data Immutability in Bash

Immutability means that data cannot be modified once it is created. In Bash, this can be achieved by avoiding direct 
modifications of existing variables and instead favoring the creation of new variables during transformations. It 
remains the responsibility of the developer to enforce immutability.

In Bash, the `local` keyword is commonly used to declare a local variable within a function. This is a common practice 
in functional programming to avoid side effects and maintain data encapsulation. The `-r` option can be used to define 
an immutable variable, which is essentially a constant.

Let's see an example of its usage:

{% highlight bash %}
#!/bin/bash

my_function() {
  local var="Local"
  local -r read_only_var="Read-only"

  var="Modified"            # Modifying a local variable
  read_only_var="Modified"  # Attempting to modify an immutable variable
}

my_function
# Output: bash: read_only_var: readonly variable
{% endhighlight %}

In this example, the variable declared with `local` is not immutable, while the one declared with `local -r` is 
immutable.

### Higher-Order Functions in Bash

Higher-order functions take one or more functions as input parameters or return a function as output. In Bash, we can 
pass functions as arguments or store them in variables, enabling us to create higher-order functions.

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

# Example usage
square() {
  local num=$1
  echo $((num * num))
}

array=(1 2 3 4 5)
result=($(map square "${array[@]}"))
echo "${result[@]}"
# Output: 1 4 9 16 25
{% endhighlight %}

### Recursion in Bash

Recursion is a powerful technique in functional programming. Bash, although not optimized for recursion, can still 
handle it effectively for certain use cases. However, since recursion in Bash can be resource-intensive, it is important
to be mindful of the algorithm's complexity. Recursion allows you to solve problems by breaking them down into smaller 
problems, resulting in more concise and expressive code.

Example:
{% highlight bash %}
#!/bin/bash

# Recursive function to calculate the factorial of a number
factorial() {
  local num=$1

  if ((num <= 1)); then
    echo 1
  else
    local sub_factorial=$(factorial $((num - 1)))
    echo $((num * sub_factorial))
  fi
}

# Example usage
echo $(factorial 5)
# Output: 120
{% endhighlight %}

### Function Composition in Bash

Composition is a fundamental concept in functional programming that involves combining multiple functions to create a 
new function. The idea is to take the result of one function and use it as the input for another function, forming a 
chain of transformations. This allows breaking down a complex problem into smaller, simpler steps and seamlessly 
connecting them.

Example:
{% highlight bash %}
#!/bin/bash

# Function 1: Convert text to uppercase
to_uppercase() {
  echo "$1" | tr '[:lower:]' '[:upper:]'
}

# Function 2: Add a prefix to the text
add_prefix() { 
  echo "Prefix $1"
}

# Function 3: Display the final text
display_text() {
  echo "Final text: $1"
}

# Composition of functions
compose_functions() {
  local result="$1"
  shift
  for func in "$@"; do
    result="$($func "$result")"
  done
  echo "$result"
}

# Using function composition
text="example text"

result=$(compose_functions "$text" to_uppercase add_prefix display_text)

echo "$result"
# Output: Final text: Prefix EXAMPLE TEXT
{% endhighlight %}

### Lazy Evaluation in Bash

In Bash, although it is not a native feature of the language, it is possible to adopt a simple approach to simulate lazy
evaluation: using generator functions. Instead of generating and storing all the values of a sequence, we can generate 
the values on-demand, when they are needed, by calling the function.

Example of lazy evaluation:
{% highlight bash %}
#!/bin/bash

# Lazy function: Calculates and returns the list of even numbers up to a certain threshold
get_even_numbers_lazy() {
  local threshold=$1
  local numbers=()
  local current=0

  while (( current < threshold )); do
    numbers+=($current)
    current=$((current + 2))
  done

  echo "${numbers[@]}"
}

# Using the lazy function
numbers=$(get_even_numbers_lazy 10)

echo "Even numbers up to 10: ${numbers[@]}"
# Output: Even numbers up to 10: 0 2 4 6 8
{% endhighlight %}

## Basic Function of Functional Programming in Bash

### The Map Function

{% highlight bash %}
#!/bin/bash

# Definition of the map function
map() {
  local -n input_list=$1
  local -r transform_fn=$2

  local mapped_list=()
  for element in "${input_list[@]}"; do
    mapped_list+=("$("$transform_fn" "$element")")
  done

  echo "${mapped_list[@]}"
}

# Example transformation function
square() {
  local input=$1
  echo "$((input * input))"
}

declare -a my_list=(1 2 3 4 5)
mapped_list=$(map my_list square)

# Display the result
echo "Original list: ${my_list[@]}"
echo "Transformed list: ${mapped_list[@]}"

# Output: Original list: 1 2 3 4 5
# Output: Transformed list: 1 4 9 16 25
{% endhighlight %}

### The Filter Function

{% highlight bash %}
#!/bin/bash

# Definition of the filter function
filter() {
  local -n input_list=$1
  local -r predicate=$2

  local filtered_list=()
  for element in "${input_list[@]}"; do
    if "$predicate" "$element"; then
      filtered_list+=("$element")
    fi
  done

  echo "${filtered_list[@]}"
}

# Example filtering function
is_even() {
  local input=$1
  ((input % 2 == 0))
}

declare -a my_list=(1 2 3 4 5)
filtered_list=$(filter my_list is_even)

# Display the result
echo "Original list: ${my_list[@]}"
echo "Filtered list (even elements): ${filtered_list[@]}"

# Output: Original list: 1 2 3 4 5
# Output: Filtered list (even elements): 2 4
{% endhighlight %}

### The Reduce Function

{% highlight bash %}
#!/bin/bash

# Definition of the reduce function
reduce() {
  local -n input_list=$1
  local -r accumulate_fn=$2
  local initial_value=$3

  local accumulator=$initial_value
  for element in "${input_list[@]}"; do
    accumulator="$("$accumulate_fn" "$accumulator" "$element")"
  done

  echo "$accumulator"
}

# Example aggregation function
sum() {
  local accumulator=$1
  local element=$2
  echo "$((accumulator + element))"
}

declare -a my_list=(1 2 3 4 5)
result=$(reduce my_list sum 0)

# Display the result
echo "Original list: ${my_list[@]}"
echo "Reduction result (sum): $result"

# Output: Original list: 1 2 3 4 5
# Output: Reduction result (sum): 15
{% endhighlight %}

### The Zip Function

{% highlight bash %}
#!/bin/bash

# Definition of the zip function
zip() {
  local -n input_list1=$1
  local -n input_list2=$2

  local zipped_list=()
  local length=${#input_list1[@]}

  for ((i=0; i<length; i++)); do
    zipped_list+=("${input_list1[$i]},${input_list2[$i]}")
  done

  echo "${zipped_list[@]}"
}

# Example usage
declare -a list1=("a" "b" "c")
declare -a list2=("x" "y" "z")
zipped_list=$(zip list1 list2)

# Display the result
echo "List 1: ${list1[@]}"
echo "List 2: ${list2[@]}"
echo "Zipped list: ${zipped_list[@]}"

# Output: List 1: a b c
# Output: List 2: x y z
# Output: Zipped list: a,x b,y c,z
{% endhighlight %}

<hr class="hr-text" data-content="Conclusion">

## Conclusion

Indeed, although Bash is primarily an imperative language, functional programming concepts can be effectively applied to
write cleaner and more modular scripts. By leveraging pure functions, higher-order functions, and recursion, you can 
harness the simplicity and power of functional programming within the Bash scripting environment. So, the next time you 
write a Bash script, consider applying the principles of functional programming to enhance your code.
