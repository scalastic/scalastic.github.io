---
layout: post
title: "Le Guide Ultime pour Maîtriser l'Architecture Hexagonale : Focus sur le Domaine"
date: 2024-10-03 13:32:00 +0100
description: "Découvrez le guide ultime pour maîtriser l'architecture hexagonale. Focus sur le domaine et les meilleures pratiques pour structurer votre application."
img: hexagonal-architecture-domain.jpg
fig-caption: Une sonde hexagonale sur Mars par <a href="#">DALL•E</a>
tags: [Hexagonal-Architecture, Domain, Software-Design, Clean-Architecture, Craftsmanship]
lang: fr
permalink: /hexagonal-architecture-domain/
status: finished
---

Bien qu'elle existe depuis de nombreuses années, l'**Architecture Hexagonale** connait un réel essor ces derniers temps. Au
cœur de cette architecture se trouve le **Domaine** : il y joue un rôle central en encapsulant la logique métier et en 
assurant une séparation claire entre les préoccupations fonctionnelles et techniques.

Cet article a pour objectif de vous guider, pas à pas, dans la mise en place de la partie domaine d'une architecture 
hexagonale. Nous aborderons des questions essentielles que tout développeur doit se poser pour construire un domaine 
applicatif solide : _Comment structurer les ports inbound et outbound ? Quel est le rôle des services métier et des 
entités ? Comment gérer les exceptions et les types de retour ? Quelles sont les bonnes pratiques pour la validation des
données ou encore à quoi peuvent servir les DTO ?_

En explorant ces thématiques, nous présenterons les solutions adéquates et les choix d'implémentation qui vous 
permettront de construire votre domaine avec les bons outils, tout en respectant l'état de l'art. Ce guide vous 
apportera les clés pour maîtriser la conception d'un domaine efficace et cohérent au sein de votre application.

<hr class="hr-text" data-content="Sommaire">

* TOC
{:toc}

<hr class="hr-text" data-content="Ports">

## 1. Définition des Ports Inbound et Outbound

Dans une architecture hexagonale, les **ports** définissent les points d'interaction entre la logique métier du domaine 
et les couches externes. Ils sont découpés en deux catégories principales : les **ports inbound** et les **ports outbound**.

### Ports Inbound (Interfaces Applicatives)

Les **ports inbound**, représentés par des interfaces comme **`UserApiPort`**, exposent les opérations que l'application
offre aux couches externes. Ces ports définissent les **cas d'utilisation** ou les **services applicatifs** que le 
système propose, tels que `createUser`, `findUserById`, `updateUser` et `deleteUser`.

{% highlight java %}
public interface UserApiPort {
    User createUser(User user);
    User findUserById(Long id);
    User updateUser(Long id, User user);
    void deleteUser(Long id);
}
{% endhighlight %}

- **Utilisation des appels aux ports inbound :**

  - Les ports inbound servent de **contrats applicatifs** entre le domaine et les adaptateurs externes (par exemple, les
  contrôleurs REST, les interfaces utilisateur).
  - Ils permettent aux couches externes d'invoquer des opérations **métier** sans connaître les détails de 
  l'implémentation interne.
  - En se concentrant sur les **besoins fonctionnels** de l'application, ils offrent une interface claire pour réaliser 
  les cas d'utilisation définis.

- **Différences de nommage et de responsabilité :**

  - Les interfaces inbound peuvent être nommées avec le suffixe **`ApiPort`**, reflétant leur rôle d'interface 
  applicative (API) pour les opérations offertes.
  - Elles se concentrent sur la **logique fonctionnelle** et les **services** que l'application fournit aux utilisateurs.

- **Gestion des retours et des exceptions :**

  - Les méthodes des ports inbound renvoient directement les objets métiers, comme `User`, ou lèvent des 
  **exceptions métier** en cas de problème (par exemple, `ResourceNotFoundException`, `BusinessRuleViolationException`).
  - Cela permet aux adaptateurs externes de gérer les erreurs de manière appropriée, en fournissant des réponses claires
  aux clients de l'application.

> info "Note"
> - La méthode `findUserById(Long id)` renvoie un `User` ou lève une `ResourceNotFoundException` si l'utilisateur n'existe
> pas.
> - La méthode `createUser(User user)` lève une `BusinessRuleViolationException` si le nom de l'utilisateur est vide ou 
> nul.

**Avantages :**

- **Découplage fonctionnel** : Les ports inbound isolent la logique métier des détails techniques des couches externes.
- **Clarté des services** : Ils définissent explicitement les opérations disponibles, facilitant la compréhension et 
l'utilisation de l'application.

**Inconvénients :**

- **Conception initiale complexe** : Cela nécessite une bonne compréhension des cas d'utilisation pour définir des 
interfaces pertinentes.

### Ports Outbound (Interfaces Techniques)

Les **ports outbound**, tels que **`UserSpiPort`**, définissent comment le domaine interagit avec les systèmes externes. 
Ils sont axés sur les aspects **techniques** nécessaires pour réaliser les opérations métier, comme l'accès à la base de
données ou à des services externes.

{% highlight java %}
public interface UserSpiPort {
    User saveUser(User user);
    Optional<User> findUser(Long userId);
    User updateUser(User user);
    void deleteUser(Long userId);
}
{% endhighlight %}

- **Utilisation des appels aux ports outbound :**

  - Les ports outbound agissent comme des **interfaces techniques** que le domaine utilise pour accomplir ses tâches, 
  sans se soucier des implémentations concrètes.
  - Ils permettent de **déléguer** les opérations techniques à des adaptateurs spécialisés, tout en maintenant le 
  domaine indépendant des technologies spécifiques.

- **Différences de nommage et de responsabilité :**

  - Les interfaces outbound peuvent être nommées avec le suffixe **`SpiPort`**, indiquant leur rôle de **Service 
  Provider Interface** ou SPI.
  - Elles se concentrent sur les **détails techniques** nécessaires au domaine pour fonctionner, sans inclure de logique
  métier.

- **Gestion des retours et des exceptions :**

  - Les méthodes des ports outbound renvoient souvent des **`Optional<User>`**, reflétant l'incertitude technique quant
  à l'existence d'une ressource.
  - Elles ne lèvent pas d'exceptions métier, laissant au domaine le soin de décider comment gérer les cas où les données
  ne sont pas disponibles.

> info "Note"
> La méthode `findUserById(Long id)` renvoie un `Optional<User>`, indiquant que l'utilisateur peut être présent ou non 
> dans le système externe.

**Avantages :**

- **Flexibilité technique** : Facilite le changement d'implémentation des services techniques sans affecter le domaine.
- **Testabilité** : Les ports outbound peuvent être facilement mockés lors des tests unitaires, isolant ainsi la logique
métier.

**Inconvénients :**

- **Nécessité d'une abstraction adéquate** : Les ports doivent être suffisamment génériques pour ne pas introduire de 
dépendances technologiques dans le domaine.

### Importance de ces distinctions

- **Gestion cohérente des erreurs** : En séparant les responsabilités, le domaine peut décider comment gérer les cas 
d'absence de données (lever une exception métier) tandis que les ports outbound gèrent les incertitudes techniques.
- **Clarté du code** : Les développeurs peuvent comprendre rapidement le rôle de chaque interface en se basant sur son 
nom et sa localisation dans le projet.
- **Maintenabilité** : Cette organisation facilite les modifications ultérieures, qu'il s'agisse d'ajouter de nouvelles 
fonctionnalités ou de changer l'implémentation technique.

### Raison du choix de cette structure

- **Découplage fort** : En distinguant clairement les ports inbound et outbound, l'architecture hexagonale assure un 
découplage entre la logique fonctionnelle de l'application et les détails techniques d'implémentation.
- **Adaptabilité** : Permet de modifier ou remplacer les adaptateurs techniques sans impacter le domaine ou les services
applicatifs.
- **Cohérence dans la communication** : Les adaptateurs externes interagissent avec le domaine via des interfaces 
fonctionnelles claires, tandis que le domaine utilise des interfaces techniques bien définies pour accéder aux 
ressources externes.

<hr class="hr-text" data-content="Exceptions">

## 2. Gestion des Exceptions dans le Domaine

Le domaine est censé être indépendant des détails techniques et se concentrer sur la **logique métier**. Cela soulève la
question suivante : le domaine doit-il uniquement gérer des **exceptions métier** ou peut-il également être concerné par
certaines erreurs techniques ?

### Le Domaine et les Erreurs Métier

Le domaine est responsable de la **logique métier** et doit gérer les situations où les règles métier sont violées. Pour
cela, des exceptions spécifiques au domaine doivent être définies, telles que :

- **`ResourceNotFoundException`** : Levée lorsqu'une ressource demandée (comme un utilisateur) n'existe pas.
- **`BusinessRuleViolationException`** : Levée lorsqu'une règle métier est violée, par exemple, lorsqu'un utilisateur 
tente de s'inscrire avec une adresse e-mail déjà utilisée.

{% highlight java %}
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
{% endhighlight %}

{% highlight java %}
public class BusinessRuleViolationException extends RuntimeException {
    public BusinessRuleViolationException(String message) {
        super(message);
    }
    public BusinessRuleViolationException(String message, Throwable cause) {
        super(message, cause);
    }
}
{% endhighlight %}

Ces exceptions permettent au domaine de signaler clairement aux couches appelantes qu'une violation des règles métier a 
eu lieu, sans exposer les détails techniques internes.

> info "Note"
> L'utilisation de `RuntimeException` (unchecked exceptions) simplifie le code en évitant la déclaration explicite des 
> exceptions tout en permettant leur propagation automatique jusqu'aux adaptateurs pour une gestion centralisée des 
> erreurs métier.

### Le Domaine Peut-il se Limiter Uniquement aux Erreurs Métier ?

Idéalement, le domaine devrait se concentrer exclusivement sur les **erreurs métier**. Les erreurs techniques, telles 
que les exceptions liées à la base de données, aux réseaux ou aux entrées/sorties, devraient être gérées par les 
adaptateurs techniques (implémentations des ports SPI). Cependant, dans la pratique, certaines erreurs techniques 
peuvent avoir un impact sur la logique métier et ne peuvent pas être totalement ignorées par le domaine.

- **Exemples de cas où le domaine doit considérer des erreurs techniques :**

  - **Indisponibilité d'un service externe essentiel** : Si une opération métier dépend d'un service externe (comme un 
  système de paiement) et que celui-ci est indisponible, le domaine doit décider comment réagir, par exemple en annulant
  la transaction et en informant l'utilisateur.
  - **Violations de contraintes techniques reflétant des règles métier** : Par exemple, une violation de contrainte 
  d'unicité en base de données peut refléter une règle métier d'unicité qui n'a pas été respectée en amont.

### Responsabilité du Domaine vis-à-vis des API et des SPI en Matière d'Erreurs

#### Au Niveau des Ports Inbound (API)

Les ports inbound, tels que **`UserApiPort`**, définissent les **cas d'utilisation** que le domaine expose aux 
adaptateurs externes (comme des contrôleurs REST).

- **Responsabilités du domaine :**

  - **Lever des exceptions métier** : Lorsque des règles métier sont violées, le domaine lève des exceptions spécifiques
  comme `BusinessRuleViolationException` ou `ResourceNotFoundException`.
  - **Fournir des retours clairs** : Les méthodes du port API renvoient des objets métier ou lèvent des exceptions 
  métier, ce qui permet aux adaptateurs externes de gérer les erreurs de manière appropriée.

> info "Note"
> Le domaine ne doit **pas** propager d'exceptions techniques via les ports inbound mais il peut lever des exceptions 
> métier (comme ResourceNotFoundException, BusinessRuleViolationException). Les adaptateurs externes capturent ces 
> exceptions métier et les traduisent en réponses appropriées pour les clients (par exemple, des codes HTTP comme `404 
> Not Found` ou `409 Conflict` dans le cas d'une API REST).

#### Au Niveau des Ports Outbound (SPI)

Les ports outbound, comme **`UserSpiPort`**, définissent comment le domaine interagit avec les systèmes externes (par 
exemple, une base de données).

- **Responsabilités du domaine :**

  - **Gérer les incertitudes techniques** : Les méthodes du port SPI peuvent renvoyer des `Optional<User>` pour signaler
  que l'utilisateur peut ne pas exister, sans lever d'exceptions techniques.
  - **Ne pas gérer les exceptions techniques** : Les adaptateurs qui implémentent le SPI doivent capturer les exceptions
  techniques (comme une `SQLException` ou encore une `ConstraintViolationException`) et les transformer en résultats 
  que le domaine peut comprendre (par exemple, un `Optional.empty()`).

> info "Note"
> Le domaine doit être protégé des exceptions techniques provenant des adaptateurs SPI pour maintenir son indépendance 
> vis-à-vis des détails techniques.

### En Résumé

- **Le domaine** :

    - Gère les **erreurs métier** en levant des exceptions spécifiques.
    - Doit être informé des erreurs techniques critiques impactant le métier, mais sans gérer les détails techniques.
    - Ne propage pas d'exceptions techniques vers les adaptateurs externes.

- **Les adaptateurs techniques (SPI)** :

    - Capturent les **erreurs techniques** et les transforment en résultats que le domaine peut comprendre (par exemple, `Optional.empty()`).
    - Ne propagent pas les exceptions techniques au domaine.

- **Les adaptateurs externes (API)** :

    - Reçoivent les exceptions métier du domaine et les transforment en réponses appropriées pour les clients (par exemple, des codes d'erreur HTTP).

En respectant ces principes, la gestion des erreurs dans le domaine reste cohérente avec les objectifs de l'architecture hexagonale : maintenir une séparation claire entre la logique métier et les détails techniques, tout en assurant une robustesse et une résilience de l'application face aux diverses erreurs qui peuvent survenir.

<hr class="hr-text" data-content="Services Métier">

## 3. Les Services Métier dans l'Architecture Hexagonale

Dans l'architecture hexagonale, les **services métier** encapsulent la **logique métier** de l'application. Ils 
orchestrent les opérations nécessaires pour réaliser les cas d'utilisation définis, en s'appuyant sur les ports et les 
adaptateurs pour interagir avec les systèmes externes et les couches d'infrastructure.

### Positionnement des Services Métier au sein des API et des SPI

{% highlight java %}
public class UserApiService implements UserApiPort {

    private final UserSpiPort userSpiPort;
...
    @Override
    public User addUser(User user) {
        return userSpiPort.saveUser(user);
    }

    @Override
    public User getUser(Long userId) {
        return userSpiPort.findUser(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }
...
}
{% endhighlight %}

Les services métier se situent **au cœur du domaine** et interagissent avec les ports inbound (API) et outbound (SPI) :

- **Ports Inbound (API)** : Les services métier **implémentent** les interfaces définies par les ports API. Ces 
interfaces représentent les **cas d'utilisation** que l'application expose aux adaptateurs externes (par exemple, aux 
contrôleurs REST).

    - *Exemple* : Le service `UserApiService` implémente l'interface `UserApiPort`, qui définit les opérations telles 
  que `createUser`, `findUserById`, `updateUser` et `deleteUser`.

- **Ports Outbound (SPI)** : Les services métier **utilisent** les interfaces définies par les ports SPI pour interagir 
avec les systèmes externes (comme la persistance des données). Ils délèguent les opérations techniques aux adaptateurs 
qui implémentent ces ports.

    - *Exemple* : `UserApiService` utilise `UserSpiPort` pour accéder aux méthodes `saveUser`, `findUserById`, etc., 
  sans se soucier de savoir où et comment ces données seront sauvegardées.

### Ce que les Services Métier Peuvent Faire

- **Encapsuler la Logique Métier** : Ils sont responsables de la mise en œuvre des règles métier, des validations spécifiques et de l'orchestration des opérations nécessaires pour réaliser un cas d'utilisation.

    - *Exemple* : Vérifier qu'un utilisateur n'existe pas déjà avant de le créer, ou que les données fournies respectent les contraintes métier.

- **Lever des Exceptions Métier** : En cas de violation des règles métier, les services peuvent lever des exceptions spécifiques pour signaler le problème aux couches supérieures.

    - *Exemple* : Lever une `BusinessRuleViolationException` si une adresse e-mail est déjà utilisée.

- **Utiliser les Ports SPI** : Ils délèguent les opérations techniques aux adaptateurs via les ports SPI, assurant ainsi le **découplage** entre la logique métier et les détails techniques.

    - *Exemple* : Appeler `userSpiPort.saveUser(user)` pour persister un utilisateur sans connaître les détails de la base de données.

### Ce que les Services Métier Ne Doivent Pas Faire

- **Gérer les Détails Techniques** : Ils ne doivent pas inclure de logique liée aux technologies spécifiques, telles que les interactions directes avec la base de données, les protocoles réseau ou les frameworks externes.

    - *Explication* : Cela violerait le principe de séparation des préoccupations et rendrait le domaine dépendant des détails techniques.

- **Manipuler les Objets Techniques** : Les services métier ne doivent pas manipuler directement des objets techniques (par exemple, des entités JPA, des DTOs spécifiques aux frameworks).

    - *Explication* : Ils doivent travailler avec des objets métier purs pour maintenir l'indépendance du domaine.

- **Gérer les Exceptions Techniques** : Ils ne doivent pas traiter les exceptions liées aux couches techniques (comme les `SQLException`). Ces exceptions doivent être capturées et gérées par les adaptateurs techniques.

    - *Explication* : Le domaine doit rester agnostique des détails techniques pour assurer sa portabilité et sa testabilité.

### Avantages des Services Métier

- **Centralisation de la Logique Métier** : En regroupant les règles et les processus métier au sein des services, on facilite la maintenance et l'évolution du système.

- **Découplage des Couches** : Les services métier interagissent avec les ports, assurant ainsi une séparation nette entre le domaine et les couches techniques.

- **Testabilité Améliorée** : En isolant la logique métier, les services peuvent être testés indépendamment des infrastructures externes.

En suivant ces directives, les services métier contribuent à une architecture claire, modulaire et respectueuse des 
principes du **DevOps** et du **craftsmanship**.

<hr class="hr-text" data-content="Modèle Métier">

## 4. Utilisation des Entités Métier

Dans le cadre de l'architecture hexagonale, les **entités métier** représentent les objets principaux du domaine, en 
encapsulant à la fois l'état et le comportement associés. Elles sont au cœur de la logique métier et doivent être 
conçues de manière à assurer la cohérence, la maintenabilité et l'indépendance vis-à-vis des couches techniques.

### Les Entités Métier

Les entités métier sont des objets qui modélisent les éléments clés du domaine applicatif, tels que les `User`s, 
les commandes ou les produits. Elles contiennent les données essentielles et les méthodes qui permettent de manipuler 
ces données selon les règles métier définies.

{% highlight java %}
public class User {
    private Long id;
    private String name;
    private String email;
    private boolean active;

    public User(Long id, String name, String email) {
        validateName(name);
        validateEmail(email);
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = false;
    }

    // Méthodes métier
    public void activateAccount() {
        this.active = true;
    }

    public void changeEmail(String newEmail) {
        validateEmail(newEmail);
        this.email = newEmail;
    }

    // Validations internes
    private void validateName(String name) {
        if (name == null || name.isEmpty()) {
            throw new BusinessRuleViolationException("Name cannot be null or empty.");
        }
    }

    private void validateEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new BusinessRuleViolationException("Invalid email address.");
        }
    }

    // Getters et setters
    // ...
}
{% endhighlight %}

- **Principales caractéristiques des entités métier :**

  - **Encapsulation de l'état et du comportement** : Les entités regroupent les attributs (données) et les méthodes 
  (comportements) qui leur sont propres.
  - **Indépendance technologique** : Elles ne dépendent pas des frameworks, bibliothèques ou technologies spécifiques, 
  ce qui permet de maintenir le domaine indépendant des couches externes.
  - **Cohérence des règles métier** : Elles assurent le respect des contraintes et des invariants du domaine.

### Différentes Implémentations Possibles

Plusieurs approches peuvent être adoptées pour implémenter les entités métier en Java :

#### 1. Java POJO (Plain Old Java Object)

Les POJOs sont des classes Java classiques sans dépendances particulières à des frameworks. Ils contiennent des 
attributs privés et des méthodes publiques pour accéder et modifier ces attributs.

- **Avantages :**

  - **Simplicité et clarté** : Faciles à comprendre et à maintenir.
  - **Contrôle total** : Permettent une personnalisation complète du comportement.

- **Inconvénients :**

  - **Verbosity** : Nécessitent l'écriture manuelle de code répétitif (constructeurs, getters, setters).

#### 2. Records Java

Introduits en Java 14, les **records** sont des classes immuables concises destinées à contenir des données.

{% highlight java %}
public record User(Long id, String name, String email, boolean active) {
    public User {
        validateName(name);
        validateEmail(email);
    }

    // Méthodes métier renvoyant de nouveaux objets en raison de l'immutabilité
    public User activateAccount() {
        return new User(id, name, email, true);
    }

    public User changeEmail(String newEmail) {
        validateEmail(newEmail);
        return new User(id, name, newEmail, active);
    }

    // Validations internes
    private static void validateName(String name) {
        if (name == null || name.isEmpty()) {
            throw new BusinessRuleViolationException("Name cannot be null or empty.");
        }
    }

    private static void validateEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new BusinessRuleViolationException("Invalid email address.");
        }
    }
}
{% endhighlight %}

- **Avantages :**

  - **Concision** : Réduisent le code boilerplate.
  - **Immutabilité** : Favorisent la sécurité et la cohérence des données.

- **Inconvénients :**

  - **Limitation des mutations** : Chaque modification crée une nouvelle instance, ce qui peut être moins performant.
  - **Disponibilité** : Nécessitent Java 14 ou supérieur.

#### 3. Lombok

**Lombok** est une bibliothèque qui génère automatiquement du code répétitif grâce à des annotations.

{% highlight java %}
@Data
@AllArgsConstructor
public class User {
    private Long id;
    private String name;
    private String email;
    private boolean active;

    // Méthodes métier
    public void activateAccount() {
        this.active = true;
    }

    public void changeEmail(String newEmail) {
        if (newEmail == null || !newEmail.contains("@")) {
            throw new BusinessRuleViolationException("Invalid email address.");
        }
        this.email = newEmail;
    }
}
{% endhighlight %}

- **Avantages :**

  - **Réduction du code répétitif** : Génère automatiquement les getters, setters, constructeurs, etc.
  - **Lisibilité améliorée** : Code source plus concis.

- **Inconvénients :**

  - **Dépendance externe** : Introduit une dépendance supplémentaire.
  - **Magie cachée** : Le code généré n'est pas visible, ce qui peut compliquer le débogage.

### Recommandations

Après avoir évalué les différentes options, voici des préconisations claires :

1. **Favoriser les POJOs pour un Contrôle Complet**

    - **Pourquoi** : Ils offrent une grande flexibilité et indépendance vis-à-vis des versions de Java ou des 
   dépendances externes.
    - **Bonnes pratiques** :
        - Utiliser des attributs privés avec des méthodes publiques pour l'accès.
        - Inclure des validations dans les constructeurs et les setters.
        - Éviter de trop exposer l'état interne (principe d'encapsulation).

2. **Utiliser les Records pour les Entités Immuables**

    - **Pourquoi** : Si l'entité métier est naturellement immuable, les records offrent une syntaxe concise et sûre.
    - **Bonnes pratiques** :
        - Inclure des validations dans le constructeur compact.
        - Gérer les mutations en retournant de nouvelles instances.

3. **Utiliser Lombok avec Précaution**

    - **Pourquoi** : Lombok peut accélérer le développement, mais peut introduire de la complexité.
    - **Bonnes pratiques** :
        - S'assurer que l'équipe est à l'aise avec Lombok.
        - Documenter clairement l'utilisation des annotations.
        - Limiter Lombok aux cas où le gain est significatif.

### Validation des Données dans les Entités Métier

La validation des données est essentielle pour maintenir l'intégrité du domaine.

- **Mise en place de la validation :**

  - **Dans les constructeurs et méthodes** : Intégrer des validations pour chaque attribut lors de la création ou de la
  modification.
  - **Lever des exceptions métier** : Utiliser des exceptions spécifiques pour signaler les violations des règles métier.

{% highlight java %}
public class User {
    // Attributs privés

    public User(Long id, String name, String email) {
        validateName(name);
        validateEmail(email);
        // Initialisation des attributs
    }

    public void changeEmail(String newEmail) {
        validateEmail(newEmail);
        this.email = newEmail;
    }

    private void validateName(String name) {
        if (name == null || name.isEmpty()) {
            throw new BusinessRuleViolationException("Name cannot be null or empty.");
        }
    }

    private void validateEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new BusinessRuleViolationException("Invalid email address.");
        }
    }

    // Autres méthodes et getters/setters
}
{% endhighlight %}

<hr class="hr-text" data-content="Types de Retour">

## 5. Choix des Types de Retour des Méthodes

Dans une architecture hexagonale, le choix des types de retour pour les méthodes du domaine, du SPI et de l'API est 
d'une importance capitale. Ce choix influence directement les capacités et le rôle de chaque composant, et il doit être 
effectué avec soin pour maintenir une séparation claire entre la logique métier, les détails techniques et la 
communication avec les clients externes.

Les types de retour des méthodes agissent comme des points d'interface entre le domaine, le SPI et l'API. En définissant
judicieusement ces types, on s'assure que chaque couche remplit sa fonction spécifique sans empiéter sur les 
responsabilités des autres. Ainsi :

- Le **domaine** peut se concentrer sur la logique métier, en retournant des **objets métier** clairs ou en levant des 
**exceptions métier** appropriées.
- Le **SPI** gère les détails techniques et les incertitudes des systèmes externes, en utilisant des types de retour 
techniques comme `Optional` ou des **codes d'erreur**.
- L'**API** interagit avec les clients externes, en traduisant les résultats du domaine en réponses adaptées et en 
respectant les **protocoles de communication** standard.

> info "Note"
> Introduit en Java 8, `Optional` est une classe conteneur qui peut ou non contenir une valeur non nulle. Elle est 
> utilisée pour représenter explicitement l'absence possible d'une valeur, évitant ainsi les problèmes liés aux 
> `NullPointerException`.

### Exemples Illustratifs

Pour mieux comprendre comment cette séparation fonctionne en pratique, voici quelques scénarios concrets présentant les 
interactions entre le SPI, le domaine et l'API.

| **Scénario**                                                             | **SPI**                                                       | **Domaine**                                                                                                                       | **API** (ex. REST)                                                                     |
|--------------------------------------------------------------------------|---------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| **1. Recherche d'un utilisateur inexistant**                             | Renvoie `Optional.empty()`                                    | Lève une exception métier `ResourceNotFoundException`.                                                                            | Capture l'exception et renvoie une réponse HTTP **404 Not Found** au client.           |
| **2. Création d'un utilisateur déjà existant**                           | Capture  l'exception technique de contrainte d'unicité.       | Avant de sauvegarder, le domaine vérifie si l'utilisateur existe déjà. S'il existe, il lève une `BusinessRuleViolationException`. | Capture l'exception et renvoie une réponse HTTP **409 Conflict** au client.            |
| **3. Mise à jour d'une ressource inexistante**                           | Renvoie un booléen indiquant si la mise à jour a réussi.      | Si la mise à jour a échoué (retour `false`), le domaine lève une `ResourceNotFoundException`.                                     | Capture l'exception et renvoie une réponse HTTP **404 Not Found** au client.           |
| **4. Erreur de connexion à la base de données**                          | Capture  l'exception technique `DatabaseConnectionException`. | Peut lever une `ServiceUnavailableException` ou gérer l'erreur selon les règles métier.                                           | Capture l'exception et renvoie une réponse HTTP **503 Service Unavailable** au client. |
| **5. Liste de ressources vide lors de la récupération des utilisateurs** | Renvoie une liste, pouvant être vide.                         | La liste vide est considérée comme une réponse valide et la retourne telle quelle.                                                | Renvoie une réponse HTTP **200 OK** avec une liste vide au client.                     |

### Avantages de cette Approche

- **Découplage des Couches** : Chaque couche a une responsabilité bien définie, ce qui facilite la maintenance et 
l'évolutivité.
- **Clarté dans la Gestion des Erreurs** : Les erreurs techniques ne traversent pas les couches, et les clients 
reçoivent des messages cohérents.
- **Flexibilité** : Permet de changer l'implémentation technique du SPI sans impacter le domaine ou l'API.

### Bonnes Pratiques

- **Ne pas Exposer les Types Techniques du SPI au Domaine** : Le domaine doit travailler avec des objets métier et ne 
pas dépendre des types techniques spécifiques.
- **Utiliser des Exceptions Métier dans le Domaine** : Pour signaler des problèmes liés aux règles métier.
- **Traduire les Exceptions Métier en Codes HTTP Appropriés** : L'API doit mapper les exceptions aux codes HTTP standard
pour une communication claire avec le client.
- **Gérer les Exceptions Techniques dans le SPI** : Le SPI doit capturer les exceptions techniques et fournir des 
retours que le domaine peut interpréter.

<hr class="hr-text" data-content="Validation">

## 6. Validation des Données

Dans une architecture hexagonale, la validation des données peut être effectuée à plusieurs niveaux, mais le **service 
métier** est le principal responsable des **validations métier**. Cependant, les **adaptateurs d'entrée** (par 
exemple, les contrôleurs REST ou les services d'application) peuvent également jouer un rôle en validant la **syntaxe e
t la structure des données** avant qu'elles ne soient transmises au domaine.

Voici la répartition des responsabilités.

#### Adaptateurs d'Entrée (REST, UI, etc.)

Ils peuvent vérifier que les données reçues respectent la **syntaxe** et le **format attendu** (par exemple, des 
champs obligatoires, des formats de date valides, etc.).

Ces adaptateurs peuvent utiliser des bibliothèques de validation comme **Hibernate Validator** (qui suit le standard
**Bean Validation**), pour valider les **DTOs** avant qu'ils ne soient passés au domaine.

Cela permet de **filtrer** les erreurs avant que les données ne parviennent au service métier, réduisant ainsi la 
complexité de gestion des erreurs dans le domaine.

{% highlight java %}
@PostMapping("/users")
public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) {
   // If validation fails, a 400 Bad Request will be returned automatically
   User createdUser = userService.createUser(userDtoMapper.toDomain(userDto));
   return new ResponseEntity<>(userDtoMapper.toDto(createdUser), HttpStatus.CREATED);
}
{% endhighlight %}

#### Service Métier (domain)

Il est responsable des **validations métier** qui sont spécifiques au domaine. Il s'agit par exemple de vérifier qu'un 
utilisateur n'existe pas déjà, ou qu'une règle métier spécifique est respectée (exemple : l'utilisateur doit être majeur).

Le domaine utilise des instructions standards du langage pour encapsuler ces validations dans les objets métier. Les 
**exceptions métier** sont levées si des règles sont violées.

La validation métier garantit que les règles métiers sont respectées. Cela permet de maintenir l'intégrité des données 
dans le domaine.

{% highlight java %}
public User createUser(User user) {
   if (userRepository.findUserByEmail(user.getEmail()).isPresent()) {
       throw new BusinessRuleViolationException("User already exists.");
   }
   return userRepository.saveUser(user);
}
{% endhighlight %}

#### Impacts pour les Autres Composants

- **Adaptateurs d'entrée** :
    - En s'assurant que les données reçues sont valides dès la réception, les adaptateurs d'entrée permettent de 
  **réduire la complexité** et le traitement des erreurs dans le domaine. En cas de validation échouée, les adaptateurs 
  retournent directement une **400 Bad Request** avec un message explicatif.

- **Service métier** :
    - Si une validation échoue dans le service métier (par exemple, violation d'une règle métier), une **exception 
  spécifique** (comme une **`BusinessRuleViolationException`**) est levée et capturée par l'adaptateur d'entrée pour 
  renvoyer un **409 Conflict** ou un autre code HTTP approprié. Cela garantit que les règles métiers sont **centrées** 
  dans le domaine et non dans l'infrastructure.

#### Avantages et Inconvénients

- **Avantages** :
    - **Séparation des responsabilités** : Les validations de structure et de syntaxe sont gérées au niveau de 
  l'adaptateur, tandis que les validations métiers sont concentrées dans le service métier.
    - **Clarté des erreurs** : Les erreurs liées à des violations de règles métier ou à des formats incorrects sont 
  clairement identifiées et renvoyées avec des codes HTTP appropriés (400, 409, etc.).

- **Inconvénients** :
    - **Duplication potentielle** : Dans certains cas, une même validation pourrait être nécessaire à la fois dans 
  l'adaptateur (pour des raisons de structure) et dans le domaine (pour des raisons métiers), ce qui peut entraîner de 
  la duplication.
    - **Complexité supplémentaire** : Bien que cette approche soit très modulaire et découplée, elle peut parfois 
  rendre le système plus complexe à implémenter et maintenir.

En résumé, dans une architecture hexagonale, la validation des données est divisée entre les **adaptateurs d'entrée** 
et le **service métier**, avec une nette séparation entre les validations de structure et de syntaxe, et les validations
métier. Ce découplage permet de rendre le système plus modulaire, mais demande une attention particulière pour éviter la
duplication des validations.

<hr class="hr-text" data-content="DTO">

## 7. Rôle des DTO dans l'Architecture Hexagonale

Dans une architecture hexagonale, les **DTO (Data Transfer Objects)** servent à transférer des données entre les 
différentes couches de l'application, notamment entre les adaptateurs externes (comme les contrôleurs REST) et le 
domaine. Ils permettent de maintenir un **découplage** strict entre la logique métier et les interfaces externes tout en
facilitant l'adaptation aux formats de données spécifiques à chaque couche.

### Pourquoi Utiliser des DTO ?

- **Séparation des Préoccupations** :

    Les DTO permettent de séparer la **représentation des données** dans les interfaces externes (API REST, UI) des 
    objets métiers du domaine. Cela garantit que la logique métier encapsulée dans les objets métier n'est pas directement 
    exposée aux adaptateurs externes.
    
    *Exemple* : Un **`UserDto`** utilisé pour transmettre les données d'un utilisateur via une API REST ne contient que 
    les informations nécessaires (ID, nom, adresse), tandis que l'objet métier **`User`** encapsule des comportements et des règles 
    métier plus complexes.
    

  {% highlight java %}
  public class User {
      private Long id;
      private String name;
      private String email;
      private Address address; // Classe qui contient les informations d'adresse de l'utilisateur
      private List<Order> orders; // Liste des commandes passées par l'utilisateur
    
      // Constructeurs, getters et setters...
  }
  {% endhighlight %}

  {% highlight java %}
  public class UserDto {
      private Long id;
      private String name;
      private String address; // Adresse représentée sous forme de chaîne de caractères (ex: "123 Main St, City, Country")
    
      // Constructeurs, getters et setters...
  }
  {% endhighlight %}

- **Adaptation aux Formats de Données** :

   Les DTO permettent de mapper des données d'un format adapté aux besoins des clients externes (par exemple, JSON pour
   une API REST) vers des objets métier plus riches qui respectent les règles du domaine. Cela permet une flexibilité dans 
   la transformation des données.

    *Exemple* : Un **`UserDtoMapper`** peut convertir un `UserDto` en objet métier `User` et vice-versa.
    
  {% highlight java %}
  public class UserDtoMapper {
    // Méthode pour convertir un DTO en objet de domaine
    public User toDomain(UserDto dto) {
        Address address = parseAddress(dto.getAddress()); // Conversion de l'adresse sous forme de String vers un objet Address
        return new User(dto.getId(), dto.getName(), dto.getEmail(), address, new ArrayList<>());
    }

    // Méthode pour convertir un objet de domaine en DTO
    public UserDto toDto(User user) {
        String address = formatAddress(user.getAddress()); // Conversion de l'objet Address en String
        return new UserDto(user.getId(), user.getName(), user.getEmail(), address);
    }

    // Méthode utilitaire pour transformer une chaîne d'adresse en objet Address
    private Address parseAddress(String address) {
        // Suppose que l'adresse est sous forme de "123 Main St, City, Country"
        String[] parts = address.split(", ");
        return new Address(parts[0], parts[1], parts[2]);
    }

    // Méthode utilitaire pour formater un objet Address en une chaîne de caractères
    private String formatAddress(Address address) {
        return String.format("%s, %s, %s", address.getStreet(), address.getCity(), address.getCountry());
    }
  }
  {% endhighlight %}

- **Protection du Domaine** :

    Les DTO offrent un contrôle sur les données exposées aux clients externes, en filtrant les informations sensibles ou 
    inutiles dans le contexte de l'API. Cela protège l'intégrité des données du domaine et évite de dévoiler des détails 
    techniques ou métier inutiles.

   *Exemple* : Un **`UserDto`** peut omettre des champs sensibles tels que des informations financières ou des mots de 
passe.

### Les Avantages des DTO

- **Modularité** : Le découplage entre les couches externes et le domaine permet une meilleure modularité du code. Les 
changements dans les DTO n'affectent pas directement le domaine, facilitant ainsi la maintenance.

- **Réduction des Dépendances** : Les couches externes n'ont pas besoin de connaître les détails internes du domaine, ce
qui limite les dépendances entre les différentes couches de l'application.

- **Adaptabilité et Évolutivité** : Les DTO permettent d'adapter facilement le format des données en fonction des 
besoins des interfaces externes (ajout de champs, gestion des versions d'API) sans impacter la logique métier.

### Les Inconvénients des DTO

- **Complexité Supplémentaire** : L'utilisation de DTO nécessite de maintenir des classes supplémentaires ainsi que des 
mappers pour transformer les objets entre les couches, ce qui peut alourdir le code et augmenter la maintenance.

- **Duplication Potentielle** : Les DTO peuvent parfois dupliquer certaines informations présentes dans les objets 
métier, entraînant une surcharge de maintenance si les mappers ne sont pas bien gérés.

### En Résumé

L'utilisation des DTO dans une architecture hexagonale est essentielle pour maintenir l'indépendance du domaine 
vis-à-vis des technologies externes. Ils permettent de **mapper les données** entre les différentes couches de manière 
flexible, de **protéger les objets métier** contre l'exposition directe, et d'assurer une **meilleure modularité** de 
l'application. Cependant, cette approche introduit une certaine complexité et demande un effort supplémentaire pour 
maintenir les mappers et les DTO.

<hr class="hr-text" data-content="Packages">

## 8. Organisation en Packages du Domaine

Une organisation claire et bien découpée des packages permet d'éviter les erreurs de conception et de bien identifier 
chaque composant du système. En isolant le domaine dans un module indépendant, on garantit que ce dernier ne soit pas 
pollué par des dépendances techniques ou des frameworks externes. Cette séparation permet de maintenir l’intégrité du 
domaine en protégeant sa logique métier des aspects techniques, tout en facilitant l’évolution de l’architecture au fil 
du temps.

Dans le cadre d’une architecture hexagonale, cette structure modulaire assure que les responsabilités soient bien 
définies entre le domaine, les ports (inbound et outbound) et les services, favorisant ainsi un découplage clair et une 
organisation cohérente du code.

> info "Package by Layer vs. Package by Feature"
> - L'approche **Package by Layer** consiste à organiser les classes par leur rôle technique, en les regroupant par
    > couches transversales de l'architecture.
> - L'approche **Package by Feature** consiste à organiser les classes par fonctionnalité ou cas d'utilisation.

Pour une architecture moderne, orientée vers la flexibilité et la capacité à évoluer rapidement (comme l'architecture
hexagonale), le **Package by Feature** est recommandé, car il garantit une meilleure séparation des préoccupations
et facilite la transformation de fonctionnalités en services autonomes.

#### Un Exemple de Structure des Packages pour le cas d'utilisation "user"

{% highlight txt %}
domain/
├── common/
│   └── exceptions/
│       ├── BusinessRuleViolationException.java
│       └── ResourceNotFoundException.java
│   
└── user/
    ├── domain/
    │   └── User.java
    ├── port/
    │   ├── inbound/
    │   │   └── UserApiPort.java
    │   └── outbound/
    │       └── UserSpiPort.java
    └── service/
        └── UserApiService.java
{% endhighlight %}

### Détails des Classes et Interfaces

1. **Package `domain.common.exceptions`** :
    - Le package contient des exceptions métier communes pour signaler des violations de règles ou l'absence de 
   ressources, distinctes des exceptions techniques.
    - L'objectif est de centraliser ces exceptions pour maintenir la cohérence et l'encapsulation du domaine.

2. **Package `domain.user`** :
   - Le package `domain.user` regroupe l'ensemble des éléments liés au domaine métier "user". En isolant toutes les 
   classes, interfaces, et services pertinents dans ce package unique, plusieurs avantages sont obtenus :

     - **Facilité d'Identification** : Le package `domain.user` permet de regrouper tout ce qui est lié au domaine 
     "user" en un seul endroit. Cela simplifie la compréhension et la navigation dans le code, car il est facile de 
     repérer les composants associés à cette entité métier.

     - **Modularité et Réutilisabilité** : En isolant le package `domain.user`, celui-ci devient **modulaire**. Cela 
     facilite l'extensibilité du système, car de nouveaux comportements et services spécifiques à `user` peuvent être 
     ajoutés sans impacter les autres parties du domaine.

     - **Facilité de Déplacement et Maintenance** : Puisque le package `domain.user` est isolé, il peut facilement être 
     déplacé, restructuré, ou même extrait vers un autre projet. Par exemple, si l'entité `user` devait être 
     externalisée en tant que microservice indépendant, il serait relativement simple de le faire car toutes les classes
     et interfaces liées sont déjà bien encapsulées dans un package unique.

     - **Cohérence du Contexte Métier** : Regrouper toutes les parties liées à `user` dans un seul package permet de 
     préserver la **cohérence du contexte métier**. Tous les objets, services, ports (inbound et outbound) restent 
     encapsulés dans un seul contexte, ce qui aide à éviter les dépendances circulaires et à garantir une séparation 
     claire des préoccupations.

3. **Package `domain.user.port.inbound`** :
    - Le package des ports inbound contient des interfaces définissant les cas d'utilisation exposés aux adaptateurs externes.
    - Ces interfaces servent de contrat entre les couches externes et la logique métier, décrivant les opérations 
   fonctionnelles du domaine sans exposer sa logique interne.

4. **Package `domain.user.port.outbound`** :
    - Les ports outbound définissent des interfaces techniques permettant au domaine d'accéder aux systèmes externes 
   (bases de données, services tiers, etc.).
    - Ils délèguent les tâches techniques tout en maintenant l'indépendance du domaine vis-à-vis des technologies 
   sous-jacentes, assurant ainsi la flexibilité de l'infrastructure.

5. **Package `domain.user.service`** :
    - Le package des services contient les implémentations métier qui orchestrent les opérations des ports inbound et 
   outbound.
   - Ces services implémentent les interfaces inbound, assurent la logique métier et délèguent les opérations techniques
   aux ports outbound.

Cette organisation permet de structurer le code en respectant les principes de **séparation des préoccupations** et 
**découplage** entre les couches métier et techniques, garantissant ainsi une architecture modulaire et facilement 
maintenable.

<hr class="hr-text" data-content="Conclusion">

## Conclusion - Au-delà de l'Hexagone

L'architecture hexagonale, avec ses principes de découplage et de séparation des responsabilités, offre un cadre 
robuste et évolutif pour gérer la complexité d'une application moderne. Cependant, au-delà de ces choix techniques, 
d'autres dimensions de l'architecture logicielle méritent d'être explorées.

L'une des étapes naturelles après avoir maîtrisé l'architecture hexagonale est d'envisager la **gestion de 
l'infrastructure**. En effet, le découplage entre le domaine et l'infrastructure ouvre la porte à de nombreuses 
stratégies d'implémentation techniques : cloud computing, déploiement en conteneurs, microservices...

Chaque approche apporte ses propres défis et opportunités. Le passage à des architectures comme les **microservices** 
soulève également des questions sur la gestion de la distribution des services, la résilience et les compromis entre 
modularité et complexité opérationnelle.

Au-delà de l'infrastructure, d'autres architectures peuvent également être considérées.

Par exemple, **l'architecture en couches** reste une option viable pour les applications plus simples, où la séparation 
stricte entre le domaine et l'infrastructure n'est pas nécessaire. De même, les approches **event-driven** ou **CQRS 
(Command Query Responsibility Segregation)** se concentrent sur la gestion des événements et la scalabilité des 
applications complexes, avec des modèles d'implémentation souvent très différents mais complémentaires à l'architecture 
hexagonale.

Enfin, le choix des outils et des frameworks pour soutenir cette architecture doit être continuellement réévalué. 

En conclusion, l'architecture hexagonale n'est qu'une pièce du puzzle. Elle offre une base solide, mais doit être 
constamment réfléchie et adaptée dans un contexte technologique plus large. L'infrastructure, l'outillage et 
l'intégration d'autres paradigmes architecturaux seront les clés pour construire des systèmes toujours plus évolutifs, 
résilients et performants.