---
layout: post
title: "Programmation Fonctionnelle en Bash : Exploitez la Puissance de la Simplicité"
date: 2023-04-30 15:50:00 +0200
description: "Découvrez la puissance de la programmation fonctionnelle en Bash : principes, fonctions et exemples de code. Améliorez vos scripts avec simplicité."
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

<hr class="hr-text" data-content="Concepts">

## Rappels des concepts de la programmation fonctionnelle

La programmation fonctionnelle est un paradigme de programmation basé sur l'utilisation de fonctions au sens 
mathématique comme élément central du développement logiciel. Voici quelques concepts clés de la programmation 
fonctionnelle.

### Fonctions Pures

Les fonctions pures sont des fonctions (au sens mathématique) qui ne modifient pas l'état global et produisent toujours
le même résultat pour les mêmes entrées. Elles n'ont pas d'effets de bord indésirables, ce qui les rend prévisibles et
faciles à comprendre.

### Immutabilité des Données

L'immutabilité est le principe selon lequel les données ne peuvent pas être modifiées une fois qu'elles sont créées. Au 
lieu de cela, de nouvelles données sont créées lors des transformations. Cela permet d'éviter les effets de bord et 
facilite le raisonnement sur le comportement des fonctions.

### Fonctions d'Ordre Supérieur

Les fonctions d'ordre supérieur sont des fonctions qui peuvent prendre d'autres fonctions en tant qu'arguments ou les 
retourner en tant que résultats. Elles permettent une abstraction puissante et la réutilisation de code en permettant de
manipuler des fonctions comme des valeurs de première classe.

### Récursivité

La récursivité est une technique où une fonction s'appelle elle-même pour résoudre un problème de manière itérative au 
lieu d'utiliser des boucles. Elle permet de résoudre des problèmes complexes en les décomposant en problèmes plus petits
et répétitifs. La récursivité est souvent utilisée pour parcourir des structures de données.

### Composition de Fonctions

La composition de fonctions consiste à combiner plusieurs fonctions pour former de nouvelles fonctions plus complexes.
Cela permet de créer des pipelines de traitement de données où la sortie d'une fonction devient l'entrée de la suivante.
La composition de fonctions favorise une approche modulaire et déclarative du développement.

### Décomposition en Fonctions plus Petites

La programmation fonctionnelle encourage la décomposition de problèmes complexes en fonctions plus petites et 
spécialisées. Cela favorise la réutilisation de code, améliore la lisibilité et facilite la maintenance.

### Évaluation Différée

C'est un autre des concepts clés de la programmation fonctionnelle. L'évaluation différée, également connue sous le nom 
de "lazy evaluation" est une approche dans laquelle les expressions ne sont évaluées que lorsque leur valeur est 
réellement nécessaire. Cela permet d'économiser des ressources en évitant d'évaluer des expressions inutiles.


Pour résumer, ces concepts clés de la programmation fonctionnelle permettent de créer un code plus lisible, prévisible, modulaire et 
réutilisable. Ils favorisent une approche déclarative du développement, en se concentrant sur le "quoi" plutôt que sur 
le "comment" du code.

<hr class="hr-text" data-content="Fonctions de Base">

## Fonctions de Base d'un Langage Fonctionnel

Les fonctions de base d'un langage fonctionnel varient d'un langage à l'autre, mais il existe généralement quelques 
fonctions couramment utilisées dans la plupart des langages fonctionnels. D'ailleurs, ce sont pour la plupart des 
fonctions d'ordre supérieur, c'est-à-dire des fonctions qui peuvent prendre d'autres fonctions en tant que paramètres 
et/ou renvoyer des fonctions en tant que résultats. Voici quelques exemples de fonctions de base :

1. **map** : Applique une fonction à chaque élément d'une liste ou d'une structure de données similaire, renvoyant une 
nouvelle liste contenant les résultats.

2. **filter** : Filtre les éléments d'une liste en fonction d'une condition spécifiée par une fonction, renvoyant une 
nouvelle liste ne contenant que les éléments qui satisfont la condition.

3. **reduce (ou fold)** : Combine les éléments d'une liste en appliquant une opération cumulative. Par exemple, une 
somme, un produit ou une concaténation.

4. **zip** : Combine deux listes (ou plus) en une liste de paires, prenant un élément de chaque liste à chaque fois.

5. **curry** : Transforme une fonction prenant plusieurs arguments en une séquence de fonctions, chaque fonction 
n'acceptant qu'un seul argument à la fois.

6. **compose** : Permet de composer plusieurs fonctions ensemble pour former une nouvelle fonction. Les sorties d'une 
fonction deviennent les entrées de la fonction suivante.

Ces fonctions de base permettent de manipuler des données de manière fonctionnelle, en évitant, par exemple, les boucles
et les variables modifiables. Par conséquent, si nous parvenons à implémenter de telles fonctions en Bash, nous devrions
pouvoir programmer suivant les concepts fonctionnels.

<hr class="hr-text" data-content="Bénéfices">

## Avantages de la Programmation Fonctionnelle dans les scripts Bash

La programmation fonctionnelle apporte plusieurs avantages à la programmation en Bash qui, le plus souvent, est utilisée
en suivant le paradigme procédural :

1. **Amélioration de la Lisibilité** : En se concentrant sur des fonctions concises, autonomes et à usage unique, la 
programmation fonctionnelle favorise un code plus facile à lire et à comprendre, ce qui le rend plus maintenable 
dans le temps.

2. **Modularité et Réutilisabilité** : Les fonctions en programmation fonctionnelle sont conçues pour être composables et 
réutilisables. Cela vous permet de construire des scripts complexes en combinant des fonctions plus petites et 
autonomes, favorisant ainsi la modularité et la réutilisabilité du code.

3. **Moins d'Effets Secondaires** : La programmation fonctionnelle décourage l'utilisation de l'état mutable et encourage 
l'immutabilité. Cela réduit la probabilité d'introduire des effets secondaires, ce qui facilite grandement les tests et la 
compréhension des scripts.

<hr class="hr-text" data-content="Concepts">

## Concepts de Programmation Fonctionnelle appliqués à Bash

### Fonctions Pures en Bash

Les fonctions pures sont donc la base de la programmation fonctionnelle. Elles prennent des paramètres d'entrée et 
produisent une sortie sans aucun effet secondaire. En Bash, nous pouvons créer des fonctions pures en veillant à ce 
qu'elles n'utilisent que des paramètres d'entrée et des variables locales, sans modifier l'état global ni dépendre 
de dépendances externes.

Exemple :
{% highlight bash %}
#!/bin/bash

# Fonction pure pour calculer le carré d'un nombre
carre() {
  local num=$1
  echo $((num * num))
}

# Exemple d'utilisation
result=$(carre 2)

echo "$result" 
# Sortie : 4
{% endhighlight %}

### Immutabilité des Données en Bash

L'immutabilité implique que les données ne peuvent pas être modifiées une fois qu'elles sont créées. En Bash, cela peut 
être réalisé en évitant de modifier directement les variables existantes et en favorisant la création de nouvelles 
variables lors des transformations. Cela reste donc de la responsabilité du développeur.

Il existe toutefois, dans Bash, l'instruction `local` pour déclarer une variable locale à une fonction. C'est une 
pratique courante en programmation fonctionnelle pour éviter les effets de bord et maintenir l'encapsulation des 
données. L'option `-r` permet de définir une variable immutable, c'est-à-dire une constante.

Voyons un exemple de son utilisation :

{% highlight bash %}
#!/bin/bash

my_function() {
  local var="Local"
  local -r read_only_var="Read-only"

  var="Modified"           # Modification d'une variable locale
  read_only_var="Modified" # Test de modification d'une variable immutable
}

my_function
# Sortie : bash: read_only_var : variable en lecture seule
{% endhighlight %}

On voit dans cet exemple que la variable déclarée `local` n'est pas immutable tandis que celle déclarée avec 
`local -r` est bien immutable.

### Fonctions d'Ordre Supérieur en Bash

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
echo "${result[@]}" 
# Sortie : 1 4 9 16 25
{% endhighlight %}


### Récursivité en Bash

La récursivité est une technique puissante en programmation fonctionnelle. Bash, bien qu'il ne soit pas optimisé 
pour la récursivité, peut tout de même la gérer efficacement pour certains cas d'utilisation. Cependant, comme la récursivité 
en Bash peut être coûteuse en termes de ressources, il est donc important de faire attention à la complexité de 
l'algorithme. La récursivité vous permet de résoudre des problèmes en les décomposant en sous-problèmes plus petits, ce 
qui conduit à un code plus concis et expressif.

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
echo $(factorielle 5) 
# Sortie : 120
{% endhighlight %}

### Composition de Fonctions en Bash

La composition est un concept fondamental en programmation fonctionnelle qui consiste à combiner plusieurs fonctions 
pour créer une nouvelle fonction. L'idée est de prendre le résultat d'une fonction et de l'utiliser comme entrée pour 
une autre fonction, formant ainsi une chaîne de transformations. Cela permet de diviser un problème complexe en petites 
étapes plus simples et de les relier entre elles de manière fluide.

Exemple :
{% highlight bash %}
#!/bin/bash

# Fonction 1 : Convertir le texte en majuscules
to_uppercase() {
  echo "$1" | tr '[:lower:]' '[:upper:]'
}

# Fonction 2 : Ajouter un préfixe au texte
add_prefix() {
  echo "Prefix $1"
}

# Fonction 3 : Afficher le texte final
display_text() {
  echo "Texte final : $1"
}

# Composition des fonctions
compose_functions() {
  local result="$1"
  shift
  for func in "$@"; do
    result="$($func "$result")"
  done
  echo "$result"
}

# Utilisation de la composition de fonctions
text="exemple de texte"

result=$(compose_functions "$text" to_uppercase add_prefix display_text)

echo "$result" 
# Sortie: Texte final : Prefix EXEMPLE DE TEXTE
{% endhighlight %}

### Évaluation Différée en Bash

En Bash, bien que ce ne soit pas une caractéristique native du langage, il est possible d'adopter une approche simple 
pour simuler l'évaluation lazy : l'utilisation de fonctions génératrices. Plutôt que de générer et stocker toutes les 
valeurs d'une séquence, on pourra générer les valeurs à la demande, lorsqu'elles sont nécessaires, en appelant la fonction.

Exemple d'évaluation différée :
{% highlight bash %}
#!/bin/bash

# Fonction lazy : Calcule et retourne la liste des nombres pairs jusqu'à un certain seuil
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

# Utilisation de la fonction lazy
numbers=$(get_even_numbers_lazy 10)

echo "Les nombres pairs jusqu'à 10 : ${numbers[@]}" 
# Sortie : Les nombres pairs jusqu'à 10 : 0 2 4 6 8
{% endhighlight %}

## Fonction de Base de la Programmation Fonctionnelle en Bash

### La Fonction Map

{% highlight bash %}
#!/bin/bash

# Définition de la fonction map
map() {
  local -n input_list=$1
  local -r transform_fn=$2
  
  local mapped_list=()
  for element in "${input_list[@]}"; do
    mapped_list+=("$("$transform_fn" "$element")")
  done
  
  echo "${mapped_list[@]}"
}

# Exemple de fonction de transformation
square() {
  local input=$1
  echo "$((input * input))"
}

declare -a my_list=(1 2 3 4 5)
mapped_list=$(map my_list square)

# Affichage du résultat
echo "Liste d'origine: ${my_list[@]}"
echo "Liste transformée: ${mapped_list[@]}"

# Sortie : Liste d'origine: 1 2 3 4 5
# Sortie : Liste transformée: 1 4 9 16 25
{% endhighlight %}

### La Fonction Filter

{% highlight bash %}
#!/bin/bash

# Définition de la fonction filter
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

# Exemple de fonction filtrante
is_even() {
  local input=$1
  ((input % 2 == 0))
}

declare -a my_list=(1 2 3 4 5)
filtered_list=$(filter my_list is_even)

# Affichage du résultat
echo "Liste d'origine: ${my_list[@]}"
echo "Liste filtrée (éléments pairs): ${filtered_list[@]}"

# Sortie : Liste d'origine: 1 2 3 4 5
# Sortie : Liste filtrée (éléments pairs): 2 4
{% endhighlight %}

### La Fonction Reduce

{% highlight bash %}
#!/bin/bash

# Définition de la fonction reduce
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

# Exemple de fonction d'agrégation
sum() {
  local accumulator=$1
  local element=$2
  echo "$((accumulator + element))"
}

declare -a my_list=(1 2 3 4 5)
result=$(reduce my_list sum 0)

# Affichage du résultat
echo "Liste d'origine: ${my_list[@]}"
echo "Résultat de la réduction (somme): $result"

# Sortie : Liste d'origine: 1 2 3 4 5
# Sortie : Résultat de la réduction (somme): 15
{% endhighlight %}

### La Fonction Zip

{% highlight bash %}
#!/bin/bash

# Définition de la fonction zip
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

# Exemple d'utilisation
declare -a list1=("a" "b" "c")
declare -a list2=("x" "y" "z")
zipped_list=$(zip list1 list2)

# Affichage du résultat
echo "Liste 1: ${list1[@]}"
echo "Liste 2: ${list2[@]}"
echo "Liste zippée: ${zipped_list[@]}"

# Sortie : Liste 1: a b c
# Sortie : Liste 2: x y z
# Sortie : Liste zippée: a,x b,y c,z
{% endhighlight %}

<hr class="hr-text" data-content="Conclusion">

## Conclusion

Bien que Bash soit principalement un langage impératif, les concepts de programmation fonctionnelle peuvent être 
appliqués efficacement pour écrire des scripts plus propres et plus modulaires. En exploitant les fonctions pures, les 
fonctions d'ordre supérieur et la récursivité, vous pouvez tirer parti de la simplicité et de la puissance de la 
programmation fonctionnelle dans l'environnement de script Bash. Donc, la prochaine fois que vous écrirez un script 
Bash, envisagez d'appliquer les principes de la programmation fonctionnelle pour améliorer votre code.
