---
layout: post
title: "Mixtral 8x7B en Local : Entraînez votre LLM avec vos Propres Données"
date: 2023-12-30 09:26:00 +0100
description: "Explorez Mixtral 8x7B en local avec Ollama et LlamaIndex pour une IA personnalisée, abordant installation, tests et spécialisation."
img: mixtral-ollama-llamaindex-llm.jpg
fig-caption: Mistral AI à l'honneur selon <a href="#">DALL•E</a>
tags: [AI, LLM, Mixtral, Llama, Privacy]
lang: fr
permalink: /mixtral-ollama-llamaindex-llm/
status: finished
---

La toute jeune société française Mistral AI a réussi à se positionner comme un acteur de premier plan dans le monde de 
l'Intelligence Artificielle. Avec son Large Language Model (LLM), Mixtral 8x7B, basé sur un concept innovant 
de Mixture of Experts (MoE), elle rivalise avec des géants comme Meta et son modèle Llama 2 70B ou encore OpenAI et son fameux ChatGPT
3.5. L'adoption de la licence ouverte Apache 2.0 par Mistral AI démocratise l'accès à cette technologie de pointe, 
permettant à un large éventail d'utilisateurs et de développeurs d'exploiter et personnaliser cette technologie selon 
leurs besoins spécifiques.

Prenons en main ce modèle et voyons comment tirer le meilleur parti de Mixtral 8x7B pour personnaliser un modèle de LLM
avec nos propres données, en local, pour préserver leur confidentialité. Cette démarche offre enfin une flexibilité et 
une fiabilité sans précédent pour les développeurs et les entreprises cherchant à intégrer l'IA dans leurs projets, tout
en maintenant un contrôle total sur leurs données.

<hr class="hr-text" data-content="Sommaire">

* TOC
{:toc}

<hr class="hr-text" data-content="Terminologie">

## Comprendre le Jargon de l'IA

Avant d'aller plus loin dans notre démarche, il peut être utile de comprendre les termes que nous allons utiliser et qui
sont au cœur des modèles d'IA en vogue actuellement :

- **LLM (Large Language Models)** : Ce sont des modèles d'IA conçus pour comprendre et générer le langage naturel. Ils 
  sont basés sur de vastes ensembles de données et le plus connu est sans doute ChatGPT de OpenAI. Toutefois, il en existe de 
  nombreux autres comme BERT de Google, Llama de Meta, BLOOM de Hugging Face, Falcon de Technology Innovation Institute 
  et celui qui nous intéresse aujourd'hui, Mixtral de Mistral AI.

- **RAG (Retrieval-Augmented Generation)** : C'est un moyen d'ajouter de nouvelles informations à un LLM ou de le 
  spécialiser dans un domaine précis. Il nécessite des bases de données vectorielles qui permettent au LLM 
  d'utiliser ces nouvelles informations et de fournir des réponses plus contextuelles.

- **LangChain** : C'est un framework de développement, dédié aux LLM. Il permet de combiner une grande variété de 
  modèles de langage dont les LLM, avec des sources externes ou des composants de saisie pour l'utilisateur. Il est 
  devenu de facto le framework open source le plus utilisé dans les applications utilisant des LLM. 

- **Token** : Il représente l'unité de base dans le traitement du langage par les modèles d'IA. Il peut représenter un 
  mot, un caractère, ou une partie de mot comme un phonème par exemple. C'est donc cette abstraction que manipulent les 
  modèles LLM et sa taille influence leur capacité à analyser et générer du langage.

- **Mixture-of-Experts (MoE)** : C'est une technique où un modèle d'IA est divisé en 'experts' spécialisés, chacun 
  traitant une partie différente de l'information. En fonction du contexte de la requête, l'expert le plus pertinent est
  sollicité, ce qui permet d'obtenir une réponse plus précise et adaptée. Cette approche améliore la qualité de 
  l'information générée en exploitant les compétences spécifiques de chaque expert.

<hr class="hr-text" data-content="Concepts">

## Les Concepts derrière Mixtral 8x7B

**Mixtral 8x7B** est un LLM de type Mixture-of-Experts (MoE). Il fonctionne en dirigeant chaque token vers 2 des 8 groupes 
d'experts qui constituent le modèle. Les sorties de ces experts sont ensuite combinées pour obtenir le résultat final, 
optimisant ainsi le traitement et la génération de la réponse.

Chaque expert au sein du modèle Mixtral 8x7B dispose d'environ 7 milliards de paramètres, ce qui explique le nom du 
modèle. Lors du traitement d'une requête, Mixtral 8x7B utilise seulement 12,6 milliards de paramètres (environ 2x7B), ce qui accélère 
son traitement et réduit les ressources nécessaires. La spécialisation de chaque expert permet à Mixtral 8x7B de 
surpasser des modèles plus volumineux comme Llama 2 70B (70 milliards de paramètres), tout en étant six fois plus rapide.
De plus, il égale ou surpasse GPT3.5 sur la plupart des benchmarks standards.

Sous licence Apache 2.0, Mixtral 8x7B peut être réutilisé par des développeurs, des chercheurs, et des entreprises, 
favorisant ainsi l'innovation et la collaboration dans le domaine de l'IA. Cette licence ouverte permet une adaptation 
et une personnalisation étendues du modèle, rendant la technologie modifiable pour un large éventail d'applications.

<hr class="hr-text" data-content="Installation">

## Installation de Mixtral 8x7B

### Étape 1 : Installation de Ollama

Auparavant, installer et faire fonctionner un modèle d'IA sur son poste était une tâche très complexe. Cependant, 
l'arrivée d'Ollama, un logiciel open source, a significativement simplifié ce processus. En effet, Ollama permet aux utilisateurs d'exécuter 
facilement des modèles avancés tels que Mixtral 8x7B, directement sur leurs propres systèmes, ouvrant ainsi la voie à 
une démocratisation de ces technologies.

Pour installer Ollama sur votre poste :

- Allez sur le projet Github et suivez les instructions :
  {% github_card ollama/ollama %}
- Ou bien téléchargez directement le binaire d'installation de Ollama [https://ollama.ai/download](https://ollama.ai/download){:target="_blank" rel="noopener noreferrer nofollow"}
et lancez son installation sur votre poste.

### Étape 2 : Démarrage de Mixtral 8x7B

Pour activer le réseau de neurones Mixtral 8x7B, exécutez cette commande dans votre terminal :

{% highlight shell %}
ollama run mixtral
{% endhighlight %}

- Lors de la première exécution, Ollama téléchargera le modèle Mixtral 8x7B, qui a une taille de 26 Go. La durée du 
téléchargement dépendra de votre connexion Internet.
- Il est nécessaire que votre système dispose d'au moins 48 Go de mémoire RAM pour exécuter efficacement Mixtral 8x7B.
- Dans ce scénario, opter pour un Mac Apple Silicon avec sa mémoire unifiée présente un grand avantage, 
puisque cela offre au GPU un accès à une vaste quantité de mémoire, améliorant ainsi ses capacités de traitement.

<hr class="hr-text" data-content="Test de Référence">

## Test des Capacités Intrinsèques de Mixtral 8x7B

Dans ce premier test, nous examinerons la capacité de Mixtral à générer du code Java en utilisant le framework Spring 
Boot 3.2. Ce test servira de référence avant de spécialiser notre LLM spécifiquement pour Spring Boot 3.2, fournissant 
ainsi un point de comparaison pour évaluer les améliorations apportées par la spécialisation.

### Étape optionnelle : Créer un Environnement Virtuel Python

Selon vos habitudes, vous pouvez créer un environnement virtuel pour isoler le programme de test et ses dépendances.
Il existe plusieurs outils pour créer des environnements virtuels Python, notamment :

- **venv** : Intégré dans Python 3.3 et versions ultérieures, il permet de créer des environnements virtuels légers.

- **virtualenv** : Un outil plus ancien et indépendant qui offre des fonctionnalités supplémentaires par rapport à venv.

- **conda** : Particulièrement utile pour gérer des environnements qui nécessitent des dépendances complexes, y compris 
des bibliothèques non-Python.

- **pipenv** : Combine pip et virtualenv pour un meilleur workflow de gestion de dépendances.

- **poetry** : Gère les dépendances et les environnements virtuels, en se concentrant sur la facilité d'utilisation et 
la reproductibilité.

Sous **_conda_**, pour créer un environnement virtuel nommé **_mixtral_ollama_** sous **_Python 3.11_**, exécutez les commandes :

{% highlight shell %}
conda create --name mixtral_ollama python=3.11
conda activate mixtral_ollama
{% endhighlight %}

### Étape 3 : Implémentation de l'Application Test

Cette étape implique la création de deux fichiers. Le premier, `requirements.txt`, contient les dépendances nécessaires 
pour l'application. Le deuxième, `reference_test.py`, est un script Python qui envoie une requête à Mixtral 8x7B. Nous 
utiliserons la bibliothèque LlamaIndex afin de faciliter l'utilisation des LLM et, dans un second temps, l'intégration 
de différentes sources de données.

- **requirements.txt** :

{% highlight python %}
llama-index
{% endhighlight %}

- **reference_test.py** :

{% highlight python %}
from llama_index.llms import Ollama

llm = Ollama(model="mixtral")

prompt = (
  "Crée une classe de contrôleur REST en Java pour une application Spring Boot 3.2. "
  "Cette classe doit gérer des requêtes GET et POST, et inclure des annotations "
  "de sécurité et de configuration."
)

response = llm.complete(prompt)
print(response)
{% endhighlight %}

### Étape 4 : Interrogation du Modèle

{% highlight bash %}
pip install -r requirements.txt
python reference_test.py
{% endhighlight %}

Voici ce que Mixtral nous renvoie :

> Comme Spring Boot 3.2 n'est pas encore sorti, je vais créer une classe de contrôleur REST pour la dernière version stable de Spring Boot (2.6.x) en utilisant Java 8. Voici un exemple simple d'une classe de contrôleur REST pour gérer des requêtes GET et POST avec des annotations de sécurité et de configuration :
>
{% highlight java %}
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/example")
@PreAuthorize("hasRole('ROLE_USER')") // Annotation de sécurité de base
public class ExampleController {

    private final ExampleService exampleService;

    @Autowired
    public ExampleController(ExampleService exampleService) {
        this.exampleService = exampleService;
    }

    // Endpoint GET
    @GetMapping
    public Object getAll() {
        return exampleService.getAll();
    }

    // Endpoint POST
    @PostMapping
    public Object create(@RequestBody ExampleDto exampleDto) {
        return exampleService.create(exampleDto);
    }
}
{% endhighlight %}
>
> Cet exemple suppose que vous avez une `ExampleService` qui gère les requêtes métier et retourne des objets `Object` ou `List<Object>`.
>
> Pour Spring Boot 3.2 (lorsque cette version sera disponible), il est possible que certaines dépendances ou annotations changent, mais l'idée générale restera la même : mapper les requêtes HTTP sur des méthodes de la classe de contrôleur et utiliser des annotations pour configurer le comportement du contrôleur.
>
> Notez également que dans cet exemple, j'ai inclus une annotation `@PreAuthorize` au niveau de la classe, ce qui signifie que toute requête vers les endpoints de cette classe nécessitera une authentification et l'utilisateur devra avoir le rôle "ROLE_USER". Vous pouvez modifier cela en fonction des besoins de votre application.

Mixtral 8x7B a généré du code basé sur Spring Boot 2.6.x car c'est la version disponible dans les données qui ont permis
d'entraîner le modèle. La version 3.2 de Spring Boot n'étant sortie que récemment, elle n'avait pas été incluse dans ces 
données. Cela explique pourquoi le modèle n'a aucune connaissance de Spring Boot en version 3.x.

<hr class="hr-text" data-content="Test de la Spécialisation">

## Spécialisation de notre Modèle Mixtral

Nous allons à présent spécialiser notre modèle. Pour cela, nous allons lui fournir des documents PDF qui contiennent
les informations spécifiques relatives au nouveau contexte visé, dans notre exemple, la [documentation de référence de
Spring Boot 3.2](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/){:target="_blank" rel="noopener noreferrer nofollow"}.

### Étape 5 : Implémentation de la Spécialisation du Modèle

- Nous placerons le fichier PDF de la documentation de référence de Spring Boot dans un sous-répertoire `./data` :

{% highlight bash %}
mkdir ./data
curl -o ./data/spring-boot-reference.pdf https://docs.spring.io/spring-boot/docs/3.2.1/reference/pdf/spring-boot-reference.pdf
{% endhighlight %}

- Ajoutons de nouvelles dépendances à notre projet dans le fichier `requirements.txt` :

{% highlight python %}
llama-index
qdrant_client
pypdf
transformers
torch
{% endhighlight %}

- Implémentons le script de spécialisation afin d'injecter le PDF dans le modèle MixTral 8x7B, `specialized_test.py`. 
  La base de données vectorielles, Qdrant, fait office de RAG pour notre modèle :

{% highlight python %}
from pathlib import Path
import qdrant_client
from llama_index import VectorStoreIndex, ServiceContext, SimpleDirectoryReader
from llama_index.llms import Ollama
from llama_index.storage.storage_context import StorageContext
from llama_index.vector_stores.qdrant import QdrantVectorStore

# Loading the documents from the disk
documents = SimpleDirectoryReader("./data").load_data()

# Initializing the vector store with Qdrant
client = qdrant_client.QdrantClient(path="./qdrant_data")
vector_store = QdrantVectorStore(client=client, collection_name="springboot")
storage_context = StorageContext.from_defaults(vector_store=vector_store)

# Initializing the Large Language Model (LLM) with Ollama
# The request_timeout may need to be adjusted depending on the system's performance capabilities
llm = Ollama(model="mixtral", request_timeout=120.0)
service_context = ServiceContext.from_defaults(llm=llm, embed_model="local")

# Creating the index, which includes embedding the documents into the vector store
index = VectorStoreIndex.from_documents(documents, service_context=service_context, storage_context=storage_context)

# Querying the index with a specific question
query_engine = index.as_query_engine()
prompt = (
  "Crée une classe de contrôleur REST en Java pour une application Spring Boot 3.2. "
  "Cette classe doit gérer des requêtes GET et POST, et inclure des annotations "
  "de sécurité et de configuration."
)
response = query_engine.query(prompt)
print(response)
{% endhighlight %}

### Étape 6 : Interrogation du Nouveau Modèle

{% highlight bash %}
pip install -r requirements.txt
python specialized_test.py
{% endhighlight %}

Voici ce que Mixtral nous répond à présent :

> Here's an example of a Java-based REST controller class with the specified requirements for a Spring Boot 3.2 application:

{% highlight java %}
import java.time.Duration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestTemplateBuilder;

@Configuration(proxyBeanMethods = false)
@RestController
public class MyRestController {
    
    private final RestTemplate restTemplate;
    
    @Autowired
    public MyRestController(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(2))
                .build();
    }
    
    @GetMapping("/public-data")
    public ResponseEntity<String> getPublicData() {
        return new ResponseEntity<>("Public data", HttpStatus.OK);
    }
    
    @PostMapping("/private-data")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<String> postPrivateData(@RequestBody String request) {
        // Process the private data here
        return new ResponseEntity<>("Private data saved", HttpStatus.CREATED);
    }
}
{% endhighlight %}
>
> This example includes:
>
> * A REST controller (`@RestController`) with two endpoints: one for GET requests (public), and another for POST requests (private).
> * Annotations for Spring Security to restrict access to the `/private-data` endpoint.
> * A custom `RestTemplateBuilder` configuration at the class level with a constructor dependency injection.
> * The controller uses constructor-based dependency injection instead of field-based to ensure proper initialization and testability.

Le modèle spécialisé propose désormais un contrôleur REST pour Spring Boot 3.2. La réponse est en anglais, reflétant la 
langue de la documentation utilisée pour sa formation. L'implémentation s'avère plus élaborée que la précédente. 
Cependant, je n'ai pas vérifié ce code ni confirmé s'il est spécifique à Spring Boot 3. L'objectif était de tester la 
capacité de spécialisation du modèle, plutôt que l'exactitude du code généré.


<hr class="hr-text" data-content="Conclusion">

## Conclusion

L'association de Mixtral 8x7B, Ollama et LlamaIndex marque une avancée notable dans la personnalisation des modèles d'IA
et le développement d'applications sur mesure, en alliant puissance technique et facilité d'utilisation. Cette synergie 
permet non seulement de renforcer la protection des données privées, mais aussi de bénéficier d'une licence ouverte et 
gratuite, encourageant ainsi la collaboration et l'innovation. Cela rend l'intelligence artificielle plus accessible et 
adaptable à une variété de projets et d'utilisateurs, démocratisant son usage dans des contextes diversifiés.
