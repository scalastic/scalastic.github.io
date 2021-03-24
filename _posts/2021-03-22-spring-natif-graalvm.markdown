---
layout: post
title: Compiler une application Spring en un exécutable natif avec GraalVM
redirects:
- /compiler-une-application-spring-en-un-exécutable-natif-avec-graalvm/
date: 2021-03-22 01:10:00 +2
description: Tuto pour compiler une application ✨Spring✨ en code natif avec ✨GraalVM✨ - Détails avec explications à chaque étapes.
img: spring-native-graalvm-post.jpg
fig-caption: Photo de <a href="https://unsplash.com/@helloimnik?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Hello I'm Nik 🪴</a> sur <a href="https://unsplash.com/s/photos/rocket?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [Spring Native, GraalVM, Spring, Docker, Tutoriel]
excerpt_separator: <!--more-->
---

Avec la sortie cette semaine de Spring Native Beta en version 0.9.0, il est intéressant de faire un état des lieux de la compilation d'applications `Spring` en exécutables natifs à l'aide de `GraalVM` et de son mode `native-image`.

<!--more-->

L'exécution d'une application en code natif a, en effet, de nombreux intérêts comparée à celle en Bytecode dans une JVM :
- Le démarrage est instantanné
- La performance est optimale dès le démarrage
- La consommation de la mémoire est fortement réduite

La version de Spring Native est, toutefois, en Beta ce qui signifie que tous les composants de Spring ne sont pas encore fonctionnels en mode natif. Voyons en détails son fonctionnement.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Installation">

## Configuration requise de base

Tout d'abord, vous devrez installer [GraalVM](https://www.graalvm.org/){:target="_blank" rel="noopener noreferrer nofollow"} et ensuite son compilateur en code natif `native-image` :

- Pour MacOS et Linux, il est recommandé d'installer ses JDKs avec [SDKMAN](https://sdkman.io/){:target="_blank" rel="noopener noreferrer nofollow"}. Rien de compliqué : référez-vous à la [doc. officielle](https://sdkman.io/install){:target="_blank" rel="noopener noreferrer nofollow"} ou bien retrouvez un précédent article sur cet outil 👍 [SDKMAN! ou comment gérer simplement différentes versions d'un SDK](/sdkman-ou-comment-gérer-simplement-différentes-versions-dun-SDK/)

- Pour nos amis sur Windows, reportez-vous directement à la page [Installation on Windows Platforms](https://www.graalvm.org/docs/getting-started/windows/){:target="_blank" rel="noopener noreferrer nofollow"}

<hr class="hr-text" data-content="Squelette">

## Génération du squelette d'application

L'arrivée de la version Beta implique que Spring Native est désormais supporté par [Spring Initializr]( https://start.spring.io){:target="_blank" rel="noopener noreferrer nofollow"}, une interface web qui permet de composer son application Spring puis de générer son squelette.

Utilisons-la pour définir notre application démo : 
- Renseignez les métadonnées du projet
- Sélectionnez la dépendance `Spring Native [Experimental]` pour bénéficier de la compilation native
- Ajoutez la dépendance `Spring Web` dans le cadre de cette démo
- Téléchargez le code généré en cliquant sur le bouton `Generate`

{% figure caption:"Interface Spring Initializr pour l'application démo" class:"article" %}
![Ecran Spring Initializr pour la démo]({{site.baseurl}}/assets/img/spring-initializr-demo.jpg)
{% endfigure %}

### Modules Spring Native

Vous trouverez, dans le POM, la liste de modules Spring configurés en tant que dépendances Maven :

- La dépendance `Spring Native` et sa version :

{% highlight maven %}
<properties>
<java.version>11</java.version>
<spring-native.version>0.9.1-SNAPSHOT</spring-native.version>
</properties>
.../...
<dependency>
  <groupId>org.springframework.experimental</groupId>
  <artifactId>spring-native</artifactId>
  <version>${spring-native.version}</version>
</dependency>
{% endhighlight %}

- Le plugin `Spring Boot Maven` et sa configuration pour exécuter le build d'une image native dans un conteneur [Buildpacks](https://buildpacks.io){:target="_blank" rel="noopener noreferrer nofollow"} :

{% highlight maven %}
<plugin>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-maven-plugin</artifactId>
	<configuration>
	  <image>
	    <builder>paketobuildpacks/builder:tiny</builder>
	    <env>
	      <BP_NATIVE_IMAGE>true</BP_NATIVE_IMAGE>
	    </env>
	  </image>
	</configuration>
</plugin>
{% endhighlight %}

- Le plugin `AOT Maven` qui sert à configurer Spring pour sa compilation `Ahead-Of-Time` ainsi qu'à générer du code pour la configuration et le classpath de l'application :

{% highlight maven %}
<plugin>
  <groupId>org.springframework.experimental</groupId>
  <artifactId>spring-aot-maven-plugin</artifactId>
  <version>${spring-native.version}</version>
  <executions>
    <execution>
      <id>test-generate</id>
      <goals>
        <goal>test-generate</goal>
      </goals>
    </execution>
    <execution>
      <id>generate</id>
      <goals>
        <goal>generate</goal>
      </goals>
    </execution>
  </executions>
</plugin>
{% endhighlight %}

### Remarques

	> warning "Dépendances non supportées"	
	> Au cas où vous sélectionneriez une dépendance Spring non encore supportée dans le mode natif, le fichier `HELP.md` contiendra un avertissement :

{% figure caption:"Avertissement dans le fichier HELP.md" class:"article" %}
![Avertissement Spring dans HELP.md]({{site.baseurl}}/assets/img/spring-initializr-help.jpg)
{% endfigure %}


	> info "Dépendances supportées"	
	> - Dans le cas des dépendances supportées par Spring, l'initializr va configurer tous les plugins nécessaires pour que le build et l'exécution de l'application Spring fonctionnent ***out-of-the-box*** !

 Dans l'exemple de `Spring Data JPA`, Maven sera configuré pour que les classes Hibernate soient compilées au moment du build de l'application et non pas lors de son runtime comme c'est le cas pour une JVM :

{% highlight maven %}
<plugin>
  <groupId>org.hibernate.orm.tooling</groupId>
  <artifactId>hibernate-enhance-maven-plugin</artifactId>
  <version>${hibernate.version}</version>
  <executions>
    <execution>
      <id>enhance</id>
      <goals>
        <goal>enhance</goal>
      </goals>
      <configuration>
        <failOnError>true</failOnError>
        <enableLazyInitialization>true</enableLazyInitialization>
        <enableDirtyTracking>true</enableDirtyTracking>
        <enableAssociationManagement>true</enableAssociationManagement>
        <enableExtendedEnhancement>false</enableExtendedEnhancement>
      </configuration>
    </execution>
  </executions>
</plugin>
{% endhighlight %}


Tout cela est très rassurant ! J'avais testé auparavant la version `0.7.1` de Spring Native (nommé spring-graalvm-native à l'époque) et il y avait alors beaucoup de modifications manuelles à apporter. 

> note "But affiché de l'équipe en charge de Spring Native"
> - Fournir une **configuration automatiquement** afin qu'il n'y ait pas besoin de modifier le code Java, que l'application soit exécutée en mode natif ou dans une JVM.
> - Faire en sorte que les **tests unitaires** s'exécutent de la même façon dans une image native ou dans une JVM.
> - Réduire encore plus la taille de l'image native générée dans la prochaine version 0.10 de Spring Native.

<hr class="hr-text" data-content="Implémentation de la démo">

## Ajout d'un Controller Web

- Dézippez le fichier généré par `Spring Initializr` et ouvrez le répertoire avec votre IDE préféré.

- Créez un nouveau Controller à la racine du package de votre projet avec le code ci-dessous :

{% highlight java linedivs %}
package io.scalastic.demo.demo_spring_native;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoSpringNativeController {

    @GetMapping("/")
    public String hello() {
        return "Hello!";
    }

}
{% endhighlight %}

{% figure caption:"Le projet et son Controller dans IntelliJ IDEA" class:"article" %}
![IntelliJ IDEA projet démo]({{site.baseurl}}/assets/img/spring-initializr-demo-intellij.jpg)
{% endfigure %}

<hr class="hr-text" data-content="Compilation">

## Compilation en code natif

Il existe deux façons de compiler une application Spring en code natif :
- En utilisant le [Buildpack Spring Boot](https://github.com/paketo-buildpacks/spring-boot){:target="_blank" rel="noopener noreferrer nofollow"} intégré à Spring et qui va produire un conteneur léger contenant le code natif de l'application
- En utilisant le plugin Maven [native-image-maven-plugin](https://www.graalvm.org/reference-manual/native-image/NativeImageMavenPlugin/){:target="_blank" rel="noopener noreferrer nofollow"} qui va produire un exécutable natif


> warning "Remarque"
> La configuration Maven générée par Spring Initializr fait le choix de Buildpacks :
> - Nous n'aborderons par conséquent que cet aspect dans cet article.
> - Nous verrons le build natif à l'aide du plugin Maven **native-image** qui nécessite des modifications importantes du POM, dans un prochain article.

### Utilisation du Buildpack Spring Boot

Cette procédure permet d'obtenir un conteneur Docker qui contient l'application compilée en code natif. Il est léger et peut être déployé directement dans une orchestrateur de conteneurs.

#### Pré-requis

[Docker](https://www.docker.com){:target="_blank" rel="noopener noreferrer nofollow"} doit être installé afin de pouvoir lancer le **Buildpack Spring Boot**. C'est un conteneur qui contient tout le nécessaire pour builder une application Spring en code natif.

- Vous pouvez installer **Docker** à partir de [Docker Installation](https://docs.docker.com/installation/#installation){:target="_blank" rel="noopener noreferrer nofollow"}
- Pour MacOS, il est recommandé d'allouer au moins **8Go** de mémoire à Docker
- Pour Windows, il faut activer [Docker WSL 2 Backend](https://docs.docker.com/docker-for-windows/wsl/){:target="_blank" rel="noopener noreferrer nofollow"} pour avoir de meilleures performances


#### Compilation en mode natif avec Buildpacks

- L'application native peut être compilée en lançant la commande suivante :

{% highlight zsh %}
% mvn spring-boot:build-image
[INFO] Scanning for projects...
[INFO] 
[INFO] ----------------< io.scalastic.demo:demo_spring_native >----------------
[INFO] Building demo_spring_native 0.0.1-SNAPSHOT
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] >>> spring-boot-maven-plugin:2.4.4:build-image (default-cli) > package @ demo_spring_native >>>
[INFO] 
[INFO] --- maven-resources-plugin:3.2.0:resources (default-resources) @ demo_spring_native ---

[.../...]

[INFO] Successfully built image 'docker.io/library/demo_spring_native:0.0.1-SNAPSHOT'
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  03:03 min
[INFO] Finished at: 2021-03-21T20:57:29+01:00
[INFO] ------------------------------------------------------------------------

Process finished with exit code 0
{% endhighlight %}

  Cette commande va créer, en local, un conteneur Linux pour compiler l'application native à partir du compilateur `native-image` de GraalVM.

- Regardons les images présentes, dans le registre Docker local et qui viennent d'être mises en oeuvre dans ce build :

{% highlight zsh %}
% docker images
REPOSITORY                 TAG              IMAGE ID       CREATED        SIZE
paketobuildpacks/run       tiny-cnb         e85a0fe734d7   17 hours ago   17.3MB
paketobuildpacks/builder   tiny             1cbb20e3de7e   41 years ago   401MB
demo_spring_native         0.0.1-SNAPSHOT   a423116a12a8   41 years ago   81.9MB
{% endhighlight %}

On constate que ce processus produit 3 images Docker :
- **paketobuildpacks/run:tiny-cnb** : Le `runner` basé sur `distroless` bionic + glibc + openssl + CA certs pour exécuter une application en code natif. C'est le conteneur de base servant à encapsuler une application en code natif.
- **paketobuildpacks/builder:tiny** : Le `builder` basé sur une stack `distroless` ubuntu:bionic + openssl + CA certs + compilers + shell utilities. C'est un Buildpack servant à compiler la plupart des applications en Go et les applications Java en code natif avec GraalVM.
- **demo_spring_native:0.0.1-SNAPSHOT** : L'application en code natif encapsulée dans un runner de base `distroless`.

> note "Pour aller plus loin"
> - Les images issues du Buildpack datent de 1980, du 1er Janvier 1980 exactement ! C'est tout à fait voulu et l'explication se trouve là : [Time Travel with Pack](https://medium.com/buildpacks/time-travel-with-pack-e0efd8bf05db){:target="_blank" rel="noopener noreferrer nofollow"}
> - Les stacks [Distroless](https://github.com/GoogleContainerTools/distroless){:target="_blank" rel="noopener noreferrer nofollow"} sont des images minimalistes, développées par Google et qui améliorent la sécurité et la taille des conteneurs en diminuant la surface des attaques et le nombre de composants qu'elles intègrent. 
> - La notion de [Runner et Builder](https://paketo.io/docs/stacks/#what-is-a-stack){:target="_blank" rel="noopener noreferrer nofollow"} dans les Buildpacks.

#### Exécution de l'application

- Pour démarrer l'application issue du Buildpack, tapez la commande suivante:

{% highlight zsh %}
% docker run -p 8080:8080 docker.io/library/demo_spring_native:0.0.1-SNAPSHOT
2021-03-21 19:32:54.188  INFO 1 --- [           main] o.s.nativex.NativeListener               : This application is bootstrapped with code generated with Spring AOT

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v2.4.4)

2021-03-21 19:32:54.190  INFO 1 --- [           main] i.s.d.d.DemoSpringNativeApplication      : Starting DemoSpringNativeApplication using Java 11.0.10 on 91a2f0962a8e with PID 1 (/workspace/io.scalastic.demo.demo_spring_native.DemoSpringNativeApplication started by cnb in /workspace)
2021-03-21 19:32:54.190  INFO 1 --- [           main] i.s.d.d.DemoSpringNativeApplication      : No active profile set, falling back to default profiles: default
2021-03-21 19:32:54.218  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
Mar 21, 2021 7:32:54 PM org.apache.coyote.AbstractProtocol init
INFO: Initializing ProtocolHandler ["http-nio-8080"]
Mar 21, 2021 7:32:54 PM org.apache.catalina.core.StandardService startInternal
INFO: Starting service [Tomcat]
Mar 21, 2021 7:32:54 PM org.apache.catalina.core.StandardEngine startInternal
INFO: Starting Servlet engine: [Apache Tomcat/9.0.44]
Mar 21, 2021 7:32:54 PM org.apache.catalina.core.ApplicationContext log
INFO: Initializing Spring embedded WebApplicationContext
2021-03-21 19:32:54.220  INFO 1 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 29 ms
2021-03-21 19:32:54.231  INFO 1 --- [           main] o.s.s.concurrent.ThreadPoolTaskExecutor  : Initializing ExecutorService 'applicationTaskExecutor'
Mar 21, 2021 7:32:54 PM org.apache.coyote.AbstractProtocol start
INFO: Starting ProtocolHandler ["http-nio-8080"]
2021-03-21 19:32:54.240  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2021-03-21 19:32:54.241  INFO 1 --- [           main] i.s.d.d.DemoSpringNativeApplication      : Started DemoSpringNativeApplication in 0.057 seconds (JVM running for 0.06)
{% endhighlight %}

- Testez son fonctionnement avec :

{% highlight zsh %}
% curl http://127.0.0.1:8080
Hello!
{% endhighlight %}

Ca marche ! Magnifique !!

> info "Caractérisques du Buildpacks"
> - La compilation dure 3 min (avec les images Docker et les artefacts Maven en local)
> - L'application démarre en 0.06 s
> - L'image Docker contenant l'application Spring et l'OS, fait une taille de 82 Mo

<hr class="hr-text" data-content="Conclusion">

## Conclusion

- La version **Spring Native 0.9.0** nous a permis de compiler facilement une application Spring en mode natif.
- Comme attendu, les bénéfices du mode natif sont un démarrage instantanée et une taille de conteneur fortement réduite.

Points intéressants, cela engendre de nouvelles utilisations :
- la gestion du **High Availability** peut se faire avec une seule instance, le démarrage d'une seconde étant instantannée.
- le démarrage instantanné permet aussi à une application web d'être serverless, sans avoir besoin d'être redéveloppée.
- Avec Knative (un redisign de Kubernetes qui démarre des conteneurs serverless), GraalVM Native est une solution très bien adaptée.

Spring Native sera, à terme, intégré dans **Spring Boot 3** et **Spring Framework 6**, le but étant de spécifier uniquement dans le build Maven ou Graddle, la cible attendue (native ou autre). Le travail restant consiste à optimiser la taille du code natif générée, prendre en compte plus d'APIs Spring et améliorer l'exécution des tests dans l'image native (JUnit 5,...)

A suivre de près donc !

Cheers...

> info "Et maintenant"
> * Vous avez aimé cet article ? Dites-le ci-dessous afin que le blog gagne en visibilité.
> * Vous avez une question ? Posez-la en commentaire, je m'efforcerai d'y répondre dans les plus brefs délais !!
> 
> Merci à vous !
>
