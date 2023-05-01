---
layout: post
title: Programmation fonctionnelle en Bash - Exploitez la puissance de la simplicité
date: 2023-04-30 15:50:00 +0200
description: 
img: functional-programming.jpg
fig-caption: Photo de <a href="https://unsplash.com/de/@mediaecke?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">MediaEcke</a> sur <a href="https://unsplash.com/fr/photos/QGdmkyLK7jo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [FP, Bash, DevOps, Scripting]
lang: fr
permalink: /bash-functional-programming/
status: finished
---

Bash, le shell en ligne de commande et langage de script couramment utilisé dans les systèmes basés sur Unix, est 
principalement connu pour son style impératif et procédural. Cependant, avec un peu de créativité, il est possible 
d'appliquer les principes de la programmation fonctionnelle pour écrire des scripts élégants et puissants en Bash.

Dans cet article, nous explorerons comment les concepts de programmation fonctionnelle peuvent être utilisés 
dans les scripts Bash, permettant ainsi un code plus propre, une modularité améliorée et une lisibilité accrue.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Bénéfices">

## Avantages de la programmation fonctionnelle en Bash
La programmation fonctionnelle apporte plusieurs avantages à la programmation en Bash, notamment :

1. **Amélioration de la lisibilité** : En se concentrant sur des fonctions concises, autonomes et à usage unique, la 
programmation fonctionnelle favorise un code plus facile à lire et à comprendre, ce qui le rend plus maintenable 
dans le temps.

2. **Modularité et réutilisabilité** : Les fonctions en programmation fonctionnelle sont conçues pour être composables et 
réutilisables. Cela vous permet de construire des scripts complexes en combinant des fonctions plus petites et 
autonomes, favorisant ainsi la modularité et la réutilisabilité du code.

3. **Moins d'effets secondaires** : La programmation fonctionnelle décourage l'utilisation de l'état mutable et encourage 
l'immuabilité. Cela réduit la probabilité d'introduire des effets secondaires, ce qui facilite les tests et la 
compréhension des scripts.

<hr class="hr-text" data-content="Concepts">

## Concepts de programmation fonctionnelle en Bash

### Fonctions pures
   Les fonctions pures sont la base de la programmation fonctionnelle. Elles prennent des paramètres d'entrée et 
   produisent une sortie sans aucun effet secondaire. En Bash, nous pouvons créer des fonctions pures en veillant à ce 
   qu'elles n'utilisent que des paramètres d'entrée et des variables locales, sans modifier l'état global ni dépendre 
   de dépendances externes.

Exemple :
{% highlight bash %}
#!/bin/bash

### Fonction pure pour calculer le carré d'un nombre
carre() {
  local num=$1
  echo $((num * num))
}
{% endhighlight %}

### Fonctions d'ordre supérieur
   Les fonctions d'ordre supérieur prennent une ou plusieurs fonctions en tant que paramètres d'entrée ou renvoient une 
   fonction en sortie. En Bash, nous pouvons transmettre des fonctions en tant qu'arguments ou les stocker dans des 
   variables, ce qui nous permet de créer des fonctions d'ordre supérieur.

Exemple :
{% highlight bash %}
#!/bin/bash

# Fonction d'ordre supérieur pour appliquer une fonction donnée 
# à chaque élément d'un tableau

map() {
  local func=$1
  local array=("${@:2}")
  local result=()
  
  for element in "${array[@]}"; do
    result+=("$("$func" "$element")")
  done
  
  echo "${result[@]}"
}

# Exemple d'utilisation
carre() {
  local num=$1
  echo $((num * num))
}

array=(1 2 3 4 5)
result=($(map carre "${array[@]}"))
echo "${result[@]}"  # Sortie: 1 4 9 16 25

{% endhighlight %}


### Récursivité

   La récursivité est une technique puissante en programmation fonctionnelle. Bash, bien qu'il ne soit pas optimisé 
   pour la récursivité, peut tout de même la gérer efficacement pour certains cas d'utilisation. La récursivité vous 
   permet de résoudre des problèmes en les décomposant en sous-problèmes plus petits, ce qui conduit à un code plus 
   concis et expressif.

Exemple :
{% highlight bash %}
#!/bin/bash

# Fonction récursive pour calculer le factoriel d'un nombre
factorielle() {
  local num=$1
    
  if ((num <= 1)); then
    echo 1
  else
    local sous_factorielle=$(factorielle $((num - 1)))
    echo $((num * sous_factorielle))
  fi
}

# Exemple d'utilisation
echo $(factorielle 5) # Sortie : 120

{% endhighlight %}

<hr class="hr-text" data-content="Conclusion">

## Conclusion
Bien que Bash soit principalement un langage impératif, les concepts de programmation fonctionnelle peuvent être 
appliqués efficacement pour écrire des scripts plus propres et plus modulaires. En exploitant les fonctions pures, les 
fonctions d'ordre supérieur et la récursivité, vous pouvez tirer parti de la simplicité et de la puissance de la 
programmation fonctionnelle dans l'environnement de script Bash. Donc, la prochaine fois que vous écrirez un script 
Bash, envisagez d'appliquer les principes de la programmation fonctionnelle pour améliorer votre code.
