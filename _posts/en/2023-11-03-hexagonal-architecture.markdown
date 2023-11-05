---
layout: post
title: "Everything You Need to Know About Hexagonal Architecture: Kernel, Ports, Adapters"
date: 2023-11-06 00:28:00 +0200
description: "Explore hexagonal architecture, an approach that isolates business logic for scalable and robust applications."
img: hexagonal-architecture.jpg
fig-caption: Photo by <a href="https://unsplash.com/photos/hsg538WrP0Y?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">drmakete lab</a> on <a href="https://unsplash.com/photos/hsg538WrP0Y?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [Hexagonal, Clean, Architecture, DDD, SOLID, Craftsmanship]
lang: en
permalink: /hexagonal-architecture/
status: finished
---

In the vast world of software development, architecture serves as the cornerstone upon which the construction of any computer system relies. The choice of architecture is a crucial decision that influences how an application is designed, evolves, and is maintained.

A critical aspect to consider is that once a technical choice is made for an application, it becomes challenging to change course as the project progresses. The risks of regressions increase, and the point of no return is quickly reached.

This is where hexagonal architecture comes into play to address these challenges.

<hr class="hr-text" data-content="Table of Content">

* TOC
{:toc}

<hr class="hr-text" data-content="History">

## 1. Definition and History

Hexagonal architecture, also known as the Ports and Adapters architecture, was formulated by Alistair Cockburn in 2005. It is built on the fundamental idea that applications should be driven by both users and programs, batch scripts, or automated tests. Furthermore, it advocates for developing and testing these applications in isolation, free from dependencies on databases and execution systems.

At the core of hexagonal architecture lies an essential principle: isolating the application's business logic.

This concept strongly resembles Domain-Driven Design (DDD), which emphasizes the importance of the business domain over technology. It's important to note that hexagonal architecture and DDD are distinct concepts, although they can complement each other.

<hr class="hr-text" data-content="Principles">

## 2. Principles of Hexagonal Architecture

<figure class="article">
  <img src="{{site.baseurl}}/assets/img/hexagonal-architecture-port-adapter.svg" alt="Concepts of Kernel, Port, and Adapter" />
  <figcaption>Concepts of Kernel, Port, and Adapter</figcaption>
</figure>

The fundamental principles of hexagonal architecture can be summarized in three key points:

1. **Isolation of Business Logic**: The application's business logic is separated from its technical implementation. This separation is achieved by breaking the application into three distinct parts: the Business (or Core) part, the Interface part (Drivers, Primary Actors, those who invoke the application), and the Infrastructure part (Driven, Secondary Actors, those called by the application). The Business part is isolated within a fictitious structure often represented by an hexagon, hence the name.

2. **Independence of the Business Part**: According to hexagonal architecture, the Business part is independent of everything else. It is the Interface and Infrastructure parts that depend on the Business part. In other words, dependencies are established from the outside to the inside of the hexagon.

3. **Ports and Adapters**: To enable communication between the Business part and the external world (Drivers and Driven), hexagonal architecture relies on the concept of ports and adapters. Adapters act as translators between the business domain and the external technical part. Ports define the interfaces with which adapters interact with the Core. Both are essential to manage changes in the external world without affecting the business logic.

This organization ensures that any technical change has no impact on the business logic, reducing the risk of regressions and simplifying tests of the business part.

## 3. Comparison with Other Architectural Approaches

Hexagonal architecture is a powerful architectural approach, but it is essential to compare it to other approaches to understand its advantages and specifics.

### Comparison with Traditional MVC Architecture

Hexagonal architecture distinguishes itself from the traditional Model-View-Controller (MVC) architecture, which has long been used to develop applications.

MVC architecture is based on separating components into three distinct layers: the model (which manages data and business logic), the view (which handles the user interface), and the controller (which acts as an intermediary between the model and the view). MVC is widely used in web and desktop applications.

Hexagonal architecture, on the other hand, focuses on separating business logic from the rest of the application. The hexagon, at the core of this architecture, represents the business model, while ports and adapters facilitate communication with the outside world. This approach places a stronger emphasis on business logic and protects it from technical dependencies. Unlike MVC, which can sometimes lead to code where business logic is intertwined with presentation logic, hexagonal architecture promotes a clearer isolation.

### Connection with Domain-Driven Design (DDD)

Hexagonal architecture and Domain-Driven Design (DDD) share a common philosophy: the importance of business logic in software development. However, it's crucial to note that they are distinct concepts.

DDD is a software design approach that emphasizes a deep understanding of the business domain and modeling that domain in code. It encourages collaboration between domain experts and developers to create a representation of the domain that best reflects reality.

Hexagonal architecture is an architectural structure that implements the separation of business logic, infrastructure, and presentation. It draws inspiration from DDD by placing the business domain at the center of attention, but it focuses more on how components communicate, using ports and adapters.

In summary, hexagonal architecture can be implemented in a DDD context to ensure that business logic is isolated from technical details, thus facilitating better application of DDD principles.

### Perspective of Hexagonal Architecture Compared to Clean Architecture

Hexagonal architecture and Clean Architecture share similarities in their software development philosophies, but they differ in their implementation.

Clean Architecture, popularized by Uncle Bob (Robert C. Martin), emphasizes separation of concerns and inverted dependencies. It is based on concentric circles, with each circle representing a software layer, and the business domain at the center. Outer circles contain the user interface, technical details, and databases.

Hexagonal architecture, on the other hand, emphasizes business logic using the hexagon analogy. It provides stricter isolation of business logic by placing it at the heart of the application and protecting it from external dependencies. Ports and adapters are there to interact with the external world.

In comparison, Clean Architecture offers a more structured approach with well-defined layers, while hexagonal architecture is more flexible in how it allows interaction with the business domain.

It's important to note that these two approaches can be complementary. Clean Architecture can be used to structure an entire application, while hexagonal architecture can be used to specifically isolate business logic. The choice between the two depends on the project's needs and priorities.

In conclusion, hexagonal architecture, while sharing fundamental principles with other approaches, stands out for its focus on business logic and its approach to separation of concerns. It can be a valuable solution for projects aiming to isolate and protect business logic while enabling increased scalability and adaptability.

## 4. Advantages of Hexagonal Architecture

Hexagonal architecture offers several significant advantages that make it a popular approach in software development.

### Reduction of Functional Regression Risks during Technical Changes
One of the main advantages of hexagonal architecture is its ability to reduce the risks of functional regressions during technical changes. Unlike some other architectures where business logic can be tightly coupled with technical details, hexagonal architecture isolates business logic within the hexagon. This means that when it's necessary to modify elements such as the database, storage system, or other technical components, the business logic remains largely unchanged. This isolation minimizes potential functional regressions, ensuring the stability of the application even during technical alterations.

### Ease of Adding New Features and Modifying Existing Ones
Hexagonal architecture lends itself well to adding new features and modifying existing ones. By isolating business logic, it becomes simpler to introduce new features without disrupting what already exists. This approach also promotes flexibility, as business knowledge is robustly protected. Developers can thus focus on expanding the application without fearing adverse effects on other parts of the system.

### Simplicity of Business Logic Testing
Hexagonal architecture significantly simplifies testing the business logic of the application. Given that business logic is clearly isolated and has no technical dependencies, tests can concentrate on this crucial part of the application without handling complex dependencies. Automated tests become easier to write and execute, fostering practices like Test-Driven Development (TDD) and Behavior-Driven Development (BDD). This testing simplicity contributes to code quality improvement and ensures that the business logic functions as intended.

### Promotion of BDD and DDD Approaches
Hexagonal architecture actively promotes Behavior-Driven Development (BDD) and Domain-Driven Design (DDD) approaches. BDD emphasizes the expected behavior of an application, while DDD focuses on modeling a complex business domain. By isolating business logic and using automated tests, hexagonal architecture facilitates the implementation of these approaches. It allows for a better understanding of expected behaviors and more precise modeling of the business domain, enhancing the overall quality of the application.

In conclusion, hexagonal architecture offers major advantages, making it an attractive choice for software projects where business logic needs to be at the core of the application while allowing for maximum testability, scalability, and adaptability.

## 5. Limitations and Drawbacks

Despite its many advantages, hexagonal architecture is not without limitations and drawbacks. It is essential to consider
these aspects to determine if this approach is suitable for a specific project.

### Increased Number of Packages and Project Structure Complexity
One notable drawback of hexagonal architecture is the increased number of packages and the complexity of the project
structure. Compared to some other architectures, such as monolithic or 3-tier architecture, hexagonal architecture
typically requires more extensive file organization. The strict separation of business logic, interface, and infrastructure
results in a proliferation of packages. For some developers, this may seem excessive and lead to more complex project
structure management. However, this complexity can be mitigated with proper code conventions and organization.

### Potential Inefficiency in Certain Contexts
The efficiency of hexagonal architecture depends on the application context. This approach shines, particularly when
business logic is complex and stable, and frequent technical changes are expected. However, in simpler contexts or when
business stability is not a concern, hexagonal architecture may seem excessive. Small-scale projects or those where
business logic is not the focus may not fully benefit from hexagonal architecture. In such cases, lighter architectures may
be preferable.

It is essential to carefully evaluate the specific project needs and determine if hexagonal architecture is the best solution.

## 6. Implementation of Hexagonal Architecture

To implement hexagonal architecture in a project, it is crucial to follow several key steps. Additionally, a concrete
example of implementation, such as a banking application, can help illustrate how this architecture works in practice.

### Steps to Implement Hexagonal Architecture

1. **Understanding the Business Domain:** Before getting started, it is essential to have a solid understanding of the
   application's business domain. Identify the actors, use cases, and business rules that will be at the core of your
   application. This step is crucial for properly isolating business logic.

2. **Creating the Business Model:** Design a business model that is independent of technologies. This model should represent
   key concepts of the business domain, such as entities, values, and rules. Ensure that the model is stable and does not
   depend on technical details.

3. **Defining Ports and Adapters:** Identify the points of interaction between the business model and the rest of the
   application. Create interfaces (ports) that define the contracts for these interactions. Adapters are responsible for
   implementing these interfaces.

4. **Implementing API and SPI Interfaces:** Split the interfaces into two distinct parts: API interfaces (Application
   Provider Interface) for components that need to call the business model (Drivers) and SPI interfaces (Service Provider
   Interface) for retrieving data from the infrastructure (Driven). These interfaces should have clear business meanings.

5. **Developing Business Logic:** Implement the business logic within the business model. This part of the code should be
   independent of technical details and data sources. Using inversion of control helps keep the model isolated.

6. **Creating Adapters:** Develop adapters for the Interface and Infrastructure parts. These adapters are responsible for
   the interaction between the business model and the outside world. They enable adaptation to specific technologies while
   preserving the stability of the business logic.

7. **Business Logic Testing:** As the business logic is well-isolated, you can test this part independently of data sources
   or presentation. Mocks can be used to simulate interactions with the adapters.

8. **Continuous Evolution:** Domain knowledge may evolve over time. It is important to consider that the business model is not
   static and may require adjustments in the case of changes or developments.

### Example of Implementation in a Concrete Context (Banking Application)

Consider a banking management application that allows handling banking actions like deposits and withdrawals. To implement
hexagonal architecture in this context, here's how it could unfold:

- **Business Model:** Create a business model representing concepts like bank accounts, transactions, and associated business rules.

- **API Interfaces:** Define API interfaces for banking actions, such as "Deposit money into a bank account" and "Withdraw money
  from a bank account." These interfaces define contracts for these actions.

- **SPI Interfaces:** Create SPI interfaces for retrieving bank accounts and recording transactions. These interfaces are
  intended to interact with the infrastructure.

- **Business Logic:** Implement the business logic to manage banking actions in line with the defined business rules.

- **Adapters:** Develop adapters for the Presentation part (e.g., web controllers) and Persistence (e.g., data access layer using JPA). These
  adapters translate calls from API and SPI interfaces into concrete actions.

With this implementation, the business logic remains isolated, allowing independent testing without worrying about technical details
like databases or the user interface. Additionally, if technical changes occur, the business logic remains stable, reducing the risks of
functional regressions.

## 7. Best Practices and Tips

Adopting hexagonal architecture can bring many advantages, but it requires careful planning and implementation. Here are some best practices and tips to make the most of this architectural approach.

### Pre-Adoption Questions

1. **Nature of Your Application:** Before opting for hexagonal architecture, consider the nature of your application. Is your application complex and has significant business logic? If yes, hexagonal architecture can be a good choice. If your application is simple, it may not fully benefit from this approach.

2. **Stability of Business Rules:** Are the business rules of your application stable, or do they change frequently? Hexagonal architecture is particularly suitable for stable business rules because it minimizes the impact of technical changes.

3. **Need for Isolation:** Do you need to isolate the business logic of the application from technical details and data sources? If business logic stability is crucial, hexagonal architecture can be an excellent choice.

### Recommendations for Successful Implementation

1. **Deep Understanding of the Business Domain:** Before starting implementation, ensure a deep understanding of the business domain. Identify essential actors, use cases, and business rules. Poor domain understanding can lead to costly errors.

2. **Clear Business Model:** Create a clear business model that is independent of technologies. Ensure that the model faithfully represents business domain concepts. Avoid introducing technical details into the model.

3. **Business Logic Testing:** Invest time in testing the business logic. As it is isolated, tests can be conducted independently, ensuring that the business logic functions correctly.

4. **Adequate Documentation:** Make sure to document your hexagonal architecture well. This includes descriptions of interfaces, adapters, and business logic. Clear documentation facilitates understanding and maintenance.

### Managing Change and Business Model Evolution

1. **Flexibility of the Business Model:** Understand that the business model may evolve over time. Be prepared to make changes to the model when business needs change. Hexagonal architecture facilitates these evolutions while preserving stability.

2. **Version Management:** If your application evolves, and new versions are deployed, ensure proper management of API and SPI interface versions. This ensures compatibility between different versions of the application.

3. **Follow Best Practices:** Stay updated on best software development practices, such as using SOLID principles, managing automated tests, and implementing behavior-driven development (BDD) and domain-driven development (DDD) practices.

## 8. Additional Resources

### Links to Supplementary Articles and Resources

If you want to deepen your understanding of hexagonal architecture, here are some additional resources that may be helpful:

1. [Alistair Cockburn's Original Article](https://alistair.cockburn.us/hexagonal-architecture/){:target="_blank" rel="noopener noreferrer nofollow"}: For an in-depth read on hexagonal architecture by its creator.

2. [A Detailed Article on the Same Subject](https://jmgarridopaz.github.io/content/hexagonalarchitecture.html){:target="_blank" rel="noopener noreferrer nofollow"}: For an alternative perspective on the topic.

3. [How to start with Domain-Driven Design](https://medium.com/@m.merkulov/how-to-start-with-domain-driven-design-38561173f77a){:target="_blank" rel="noopener noreferrer nofollow"}: DDD is often related to hexagonal architecture, and these resources provide an excellent
   resource for understanding domain-driven design.

4. [8 resources to learn about SOLID design principles](https://barryvanveen.nl/articles/51-8-resources-to-learn-about-solid-design-principles){:target="_blank" rel="noopener noreferrer nofollow"}: SOLID principles are crucial
   for implementing hexagonal architecture.

## 9. Conclusion

- **Advantages:**
  : - Reducing the risks of functional regressions during technical changes.
  : - Ease of adding new features and modifying existing ones.
  : - Simplicity of business logic testing.
  : - Promotion of BDD and DDD approaches.

- **Disadvantages:**
  : - Increased number of packages and complexity of the project structure.
  : - Potential inefficiency in certain contexts.

Hexagonal architecture, also known as ports and adapters architecture, is an architectural approach that isolates the business logic of an application from technical details and data sources. Here are the key takeaways:

- Hexagonal architecture emphasizes the separation of business logic (the Hexagon) from technical parts (the adapters). Dependencies go from the outside to the Hexagon.

- It facilitates reducing the risks of functional regressions during technical changes, allows the addition of new features, and simplifies testing of business logic.

- Hexagonal architecture can be associated with Domain-Driven Design (DDD), but it remains distinct. It also promotes SOLID principles and BDD and DDD approaches.

- Implementing hexagonal architecture involves creating a technology-independent business model, clear interfaces, and adapters to communicate with technical parts.

- The advantages of hexagonal architecture mainly manifest in contexts where business logic is stable and complex.

In conclusion, hexagonal architecture offers a robust approach to developing applications with complex business logic. It can help you create scalable and easily maintainable applications.


