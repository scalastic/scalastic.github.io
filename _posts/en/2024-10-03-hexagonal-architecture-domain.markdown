---
layout: post
title: "The Ultimate Guide to Mastering Hexagonal Architecture: Focus on the Domain"
date: 2024-10-03 13:32:00 +0100
description: "Discover the ultimate guide to mastering hexagonal architecture. Focus on the domain and best practices for structuring your application."
img: hexagonal-architecture-domain.jpg
fig-caption: A hexagonal probe on Mars by <a href="#">DALL•E</a>
tags: [Hexagonal-Architecture, Domain, Software-Design, Clean-Architecture, Craftsmanship]
lang: en
permalink: /hexagonal-architecture-domain/
status: finished
---

Although it has existed for many years, **Hexagonal Architecture** has been experiencing significant growth recently. At the core 
of this architecture is the **Domain**: it plays a central role by encapsulating business logic and ensuring a clear 
separation between functional and technical concerns.

This article aims to guide you step-by-step in setting up the domain part of hexagonal architecture. We will address 
essential questions that every developer must ask to build a solid application domain: _How to structure inbound and 
outbound ports? What is the role of business services and entities? How to handle exceptions and return types? What are 
the best practices for data validation and how can DTOs be used?_

By exploring these topics, we will present appropriate solutions and implementation choices that will allow you to build 
your domain with the right tools while adhering to the state of the art. This guide will provide you with the keys to 
mastering the design of an efficient and coherent domain within your application.

<hr class="hr-text" data-content="Table of Contents">

* TOC
{:toc}

<hr class="hr-text" data-content="Ports">

## 1. Definition of Inbound and Outbound Ports

In hexagonal architecture, **ports** define the interaction points between the domain’s business logic and the external
layers. They are divided into two main categories: **inbound ports** and **outbound ports**.

### Inbound Ports (Application Interfaces)

**Inbound ports**, represented by interfaces like **`UserApiPort`**, expose the operations the application offers to
external layers. These ports define the **use cases** or **application services** that the system provides, such as
`createUser`, `findUserById`, `updateUser`, and `deleteUser`.

{% highlight java %}
public interface UserApiPort {
    User createUser(User user);
    User findUserById(Long id);
    User updateUser(Long id, User user);
    void deleteUser(Long id);
}
{% endhighlight %}

- **Use of inbound port calls:**

    - Inbound ports act as **application contracts** between the domain and external adapters (e.g., REST controllers,
      user interfaces).
    - They allow external layers to invoke **business operations** without needing to know the internal implementation
      details.
    - By focusing on the application’s **functional needs**, they provide a clear interface for implementing defined use
      cases.

- **Naming and responsibility distinctions:**

    - Inbound interfaces can be named with the **`ApiPort`** suffix, reflecting their role as application interfaces 
  (API) for the provided operations.
    - They focus on the **functional logic** and **services** the application provides to users.

- **Handling return values and exceptions:**

    - Inbound port methods return business objects, such as `User`, or raise **business exceptions** when issues arise
      (e.g., `ResourceNotFoundException`, `BusinessRuleViolationException`).
    - This allows external adapters to appropriately handle errors and provide clear responses to the application’s clients.

> info "Note"
> - The `findUserById(Long id)` method returns a `User` or raises a `ResourceNotFoundException` if the user does not
    > exist.
> - The `createUser(User user)` method raises a `BusinessRuleViolationException` if the user’s name is empty or null.

**Advantages:**

- **Functional Decoupling**: Inbound ports isolate business logic from the technical details of external layers.
- **Service Clarity**: They explicitly define the available operations, making the application easier to understand and
  use.

**Disadvantages:**

- **Complex Initial Design**: This requires a good understanding of use cases to define relevant interfaces.

### Outbound Ports (Technical Interfaces)

**Outbound ports**, such as **`UserSpiPort`**, define how the domain interacts with external systems. They focus on the
**technical aspects** necessary to carry out business operations, like database access or external services.

{% highlight java %}
public interface UserSpiPort {
    User saveUser(User user);
    Optional<User> findUser(Long userId);
    User updateUser(User user);
    void deleteUser(Long userId);
}
{% endhighlight %}

- **Use of outbound port calls:**

    - Outbound ports act as **technical interfaces** that the domain uses to perform its tasks, without concerning itself
      with concrete implementations.
    - They allow **delegation** of technical operations to specialized adapters, while keeping the domain independent of
      specific technologies.

- **Naming and responsibility distinctions:**

    - Outbound interfaces can be named with the **`SpiPort`** suffix, indicating their role as **Service Provider 
  Interface** or SPI.
    - They focus on the **technical details** required for the domain to function, without involving business logic.

- **Handling return values and exceptions:**

    - Outbound port methods often return **`Optional<User>`**, reflecting technical uncertainty about the existence of a
      resource.
    - They do not raise business exceptions, leaving it to the domain to decide how to handle cases where data is not
      available.

> info "Note"
> The `findUserById(Long id)` method returns an `Optional<User>`, indicating that the user may or may not exist in the
> external system.

**Advantages:**

- **Technical Flexibility**: Makes it easier to change the implementation of technical services without affecting the
  domain.
- **Testability**: Outbound ports can be easily mocked during unit tests, thereby isolating the business logic.

**Disadvantages:**

- **Need for Adequate Abstraction**: Ports must be generic enough to avoid introducing technological dependencies into
  the domain.

### Importance of These Distinctions

- **Consistent Error Handling**: By separating responsibilities, the domain can decide how to handle cases of missing
  data (e.g., raising a business exception), while outbound ports manage technical uncertainties.
- **Code Clarity**: Developers can quickly understand the role of each interface based on its name and location within
  the project.
- **Maintainability**: This organization simplifies future modifications, whether adding new features or changing the
  technical implementation.

### Reason for Choosing This Structure

- **Strong Decoupling**: By clearly distinguishing between inbound and outbound ports, hexagonal architecture ensures
  decoupling between the application’s functional logic and technical implementation details.
- **Adaptability**: Allows for technical adapters to be modified or replaced without impacting the domain or application
  services.
- **Consistency in Communication**: External adapters interact with the domain via clear functional interfaces, while
  the domain uses well-defined technical interfaces to access external resources.

<hr class="hr-text" data-content="Exceptions">

## 2. Exception Handling in the Domain

The domain is meant to be independent of technical details and should focus on **business logic**. This raises the
following question: should the domain handle only **business exceptions**, or can it also be concerned with certain
technical errors?

### The Domain and Business Errors

The domain is responsible for **business logic** and must handle situations where business rules are violated. To do
this, specific domain exceptions should be defined, such as:

- **`ResourceNotFoundException`**: Thrown when a requested resource (such as a user) does not exist.
- **`BusinessRuleViolationException`**: Thrown when a business rule is violated, for instance, when a user attempts to
  register with an already-used email address.

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

These exceptions allow the domain to clearly signal to the calling layers that a business rule violation has occurred,
without exposing internal technical details.

> info "Note"
> The use of `RuntimeException` (unchecked exceptions) simplifies the code by avoiding the explicit declaration of 
> exceptions while allowing their automatic propagation to the adapters for centralized handling of business errors.

### Can the Domain Focus Solely on Business Errors?

Ideally, the domain should concentrate exclusively on **business errors**. Technical errors, such as database, network,
or input/output exceptions, should be handled by technical adapters (implementations of SPI ports). However, in
practice, some technical errors can impact business logic and cannot be completely ignored by the domain.

- **Examples of cases where the domain must consider technical errors:**

    - **Unavailability of an essential external service**: If a business operation depends on an external service (such as
      a payment system) and that service is unavailable, the domain must decide how to respond, for example by canceling the
      transaction and informing the user.
    - **Violations of technical constraints reflecting business rules**: For example, a database uniqueness constraint
      violation might reflect a business rule of uniqueness that was not enforced earlier.

### Domain's Responsibility Regarding Errors in APIs and SPIs

#### At the Inbound Ports (API) Level

Inbound ports, such as **`UserApiPort`**, define the **use cases** that the domain exposes to external adapters (such as
REST controllers).

- **Domain's responsibilities:**

    - **Raise business exceptions**: When business rules are violated, the domain raises specific exceptions like
      `BusinessRuleViolationException` or `ResourceNotFoundException`.
    - **Provide clear returns**: API port methods return business objects or raise business exceptions, allowing external
      adapters to handle errors appropriately.

> info "Note"
> The domain should **not** propagate technical exceptions through inbound ports, but it may raise business exceptions
> (such as `ResourceNotFoundException` or `BusinessRuleViolationException`). External adapters capture these business
> exceptions and translate them into appropriate responses for clients (e.g., HTTP status codes like `404 Not Found` or
> `409 Conflict` in the case of a REST API).

#### At the Outbound Ports (SPI) Level

Outbound ports, such as **`UserSpiPort`**, define how the domain interacts with external systems (e.g., a database).

- **Domain's responsibilities:**

    - **Handle technical uncertainties**: SPI port methods may return `Optional<User>` to indicate that the user might not
      exist, without raising technical exceptions.
    - **Avoid managing technical exceptions**: Adapters that implement the SPI should capture technical exceptions (such
      as `SQLException` or `ConstraintViolationException`) and transform them into results the domain can understand (e.g.,
      `Optional.empty()`).

> info "Note"
> The domain should be protected from technical exceptions arising from SPI adapters to maintain its independence from
> technical details.

### In Summary

- **The domain**:

    - Manages **business errors** by raising specific exceptions.
    - Must be informed of critical technical errors impacting business logic, without handling technical details.
    - Does not propagate technical exceptions to external adapters.

- **Technical adapters (SPI)**:

    - Capture **technical errors** and transform them into results the domain can understand (e.g., `Optional.empty()`).
    - Do not propagate technical exceptions to the domain.

- **External adapters (API)**:

    - Receive business exceptions from the domain and transform them into appropriate responses for clients (e.g., HTTP
      error codes).

By adhering to these principles, exception handling in the domain remains consistent with the goals of hexagonal
architecture: maintaining a clear separation between business logic and technical details, while ensuring robustness and
resilience of the application in the face of various errors.

<hr class="hr-text" data-content="Business Services">

## 3. Business Services in Hexagonal Architecture

In hexagonal architecture, **business services** encapsulate the application's **business logic**. They orchestrate the
operations necessary to carry out the defined use cases, relying on ports and adapters to interact with external systems
and infrastructure layers.

### Positioning of Business Services within APIs and SPIs

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

Business services sit **at the heart of the domain** and interact with inbound (API) and outbound (SPI) ports:

- **Inbound Ports (API)**: Business services **implement** the interfaces defined by API ports. These interfaces represent
  the **use cases** the application exposes to external adapters (e.g., REST controllers).

    - *Example*: The `UserApiService` implements the `UserApiPort` interface, which defines operations such as
      `createUser`, `findUserById`, `updateUser`, and `deleteUser`.

- **Outbound Ports (SPI)**: Business services **use** the interfaces defined by SPI ports to interact with external
  systems (such as data persistence). They delegate technical operations to adapters that implement these ports.

    - *Example*: `UserApiService` uses `UserSpiPort` to access methods like `saveUser` and `findUserById`, without
      worrying about where and how this data will be stored.

### What Business Services Can Do

- **Encapsulate Business Logic**: They are responsible for enforcing business rules, specific validations, and
  orchestrating the operations necessary to execute a use case.

    - *Example*: Verifying that a user does not already exist before creating them, or ensuring that the provided data
      meets business constraints.

- **Raise Business Exceptions**: In case of a business rule violation, services can raise specific exceptions to signal
  the issue to higher layers.

    - *Example*: Raising a `BusinessRuleViolationException` if an email address is already in use.

- **Use SPI Ports**: They delegate technical operations to adapters via SPI ports, ensuring **decoupling** between
  business logic and technical details.

    - *Example*: Calling `userSpiPort.saveUser(user)` to persist a user without knowing the details of the database.

### What Business Services Should Not Do

- **Manage Technical Details**: They should not include logic related to specific technologies, such as direct database
  interactions, network protocols, or external frameworks.

    - *Explanation*: This would violate the principle of separation of concerns and make the domain dependent on
      technical details.

- **Manipulate Technical Objects**: Business services should not directly manipulate technical objects (e.g., JPA
  entities or framework-specific DTOs).

    - *Explanation*: They should work with pure business objects to maintain domain independence.

- **Handle Technical Exceptions**: They should not handle exceptions related to technical layers (such as `SQLException`).
  These exceptions should be captured and handled by the technical adapters.

    - *Explanation*: The domain should remain agnostic of technical details to ensure its portability and testability.

### Advantages of Business Services

- **Centralization of Business Logic**: By grouping rules and business processes within services, system maintenance and
  evolution become easier.

- **Layer Decoupling**: Business services interact with ports, ensuring a clear separation between the domain and
  technical layers.

- **Improved Testability**: By isolating business logic, services can be tested independently from external
  infrastructure.

By following these guidelines, business services contribute to a clear, modular architecture that adheres to **DevOps**
and **craftsmanship** principles.

<hr class="hr-text" data-content="Business Model">

## 4. Using Business Entities

Within hexagonal architecture, **business entities** represent the primary objects of the domain, encapsulating both the
state and behavior associated with them. They are central to business logic and must be designed to ensure consistency,
maintainability, and independence from technical layers.

### Business Entities

Business entities are objects that model key elements of the application domain, such as `User`s, orders, or products.
They contain essential data and methods that manipulate this data according to the defined business rules.

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

    // Business methods
    public void activateAccount() {
        this.active = true;
    }

    public void changeEmail(String newEmail) {
        validateEmail(newEmail);
        this.email = newEmail;
    }

    // Internal validations
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

    // Getters and setters
    // ...
}
{% endhighlight %}

- **Key characteristics of business entities:**

    - **Encapsulation of state and behavior**: Entities group together their attributes (data) and methods (behaviors).
    - **Technological independence**: They are not dependent on frameworks, libraries, or specific technologies, allowing
      the domain to remain independent of external layers.
    - **Consistency of business rules**: They ensure that domain constraints and invariants are respected.

### Different Possible Implementations

Several approaches can be used to implement business entities in Java:

#### 1. Java POJO (Plain Old Java Object)

POJOs are classic Java classes without dependencies on any particular framework. They contain private attributes and
public methods to access and modify these attributes.

- **Advantages:**

    - **Simplicity and clarity**: Easy to understand and maintain.
    - **Full control**: Allows complete customization of behavior.

- **Disadvantages:**

    - **Verbosity**: Requires manually writing repetitive code (constructors, getters, setters).

#### 2. Java Records

Introduced in Java 14, **records** are concise, immutable classes designed to hold data.

{% highlight java %}
public record User(Long id, String name, String email, boolean active) {
    public User {
        validateName(name);
        validateEmail(email);
    }

    // Business methods returning new objects due to immutability
    public User activateAccount() {
        return new User(id, name, email, true);
    }

    public User changeEmail(String newEmail) {
        validateEmail(newEmail);
        return new User(id, name, newEmail, active);
    }

    // Internal validations
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

- **Advantages:**

    - **Conciseness**: Reduces boilerplate code.
    - **Immutability**: Encourages data safety and consistency.

- **Disadvantages:**

    - **Limitation of mutations**: Every modification creates a new instance, which may be less performant.
    - **Availability**: Requires Java 14 or higher.

#### 3. Lombok

**Lombok** is a library that automatically generates repetitive code through annotations.

{% highlight java %}
@Data
@AllArgsConstructor
public class User {
    private Long id;
    private String name;
    private String email;
    private boolean active;

    // Business methods
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

- **Advantages:**

    - **Reduces repetitive code**: Automatically generates getters, setters, constructors, etc.
    - **Improved readability**: More concise source code.

- **Disadvantages:**

    - **External dependency**: Introduces an additional dependency.
    - **Hidden magic**: The generated code is not visible, which can complicate debugging.

### Recommendations

After evaluating the different options, here are clear recommendations:

1. **Favor POJOs for Complete Control**

    - **Why**: They offer great flexibility and independence from Java versions or external dependencies.
    - **Best Practices**:
        - Use private attributes with public methods for access.
        - Include validations in constructors and setters.
        - Avoid exposing too much of the internal state (encapsulation principle).

2. **Use Records for Immutable Entities**

    - **Why**: If the business entity is naturally immutable, records offer a concise and safe syntax.
    - **Best Practices**:
        - Include validations in the compact constructor.
        - Handle mutations by returning new instances.

3. **Use Lombok with Caution**

    - **Why**: Lombok can speed up development but may introduce complexity.
    - **Best Practices**:
        - Ensure the team is comfortable with Lombok.
        - Clearly document the use of annotations.
        - Limit Lombok to cases where the benefit is significant.

### Data Validation in Business Entities

Data validation is essential to maintain domain integrity.

- **Implementing Validation**:

    - **In constructors and methods**: Integrate validation for each attribute during creation or modification.
    - **Raise business exceptions**: Use specific exceptions to signal business rule violations.

{% highlight java %}
public class User {
    // Private attributes

    public User(Long id, String name, String email) {
        validateName(name);
        validateEmail(email);
        // Initialize attributes
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

    // Other methods and getters/setters
}
{% endhighlight %}

<hr class="hr-text" data-content="Return Types">

## 5. Choosing Return Types for Methods

In a hexagonal architecture, the choice of return types for domain, SPI, and API methods is crucial. This decision
directly affects the roles and capabilities of each component and must be made carefully to maintain a clear separation
between business logic, technical details, and external communication.

Return types act as interface points between the domain, SPI, and API. By wisely defining these types, each layer can
perform its specific function without overstepping the responsibilities of others. For example:

- The **domain** can focus on business logic by returning clear **business objects** or raising appropriate **business
  exceptions**.
- The **SPI** handles technical details and external system uncertainties, using technical return types such as
  `Optional` or **error codes**.
- The **API** interacts with external clients by translating domain results into appropriate responses and adhering to
  standard **communication protocols**.

> info "Note"
> Introduced in Java 8, `Optional` is a container class that may or may not contain a non-null value. It is used to
> explicitly represent the possible absence of a value, thereby avoiding issues related to `NullPointerException`.

### Illustrative Scenarios

To better understand how this separation works in practice, here are some concrete scenarios showing the interactions
between SPI, domain, and API.

| **Scenario**                                                            | **SPI**                                                      | **Domain**                                                                                                                        | **API** (e.g., REST)                                                                    |
|--------------------------------------------------------------------------|---------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| **1. Searching for a non-existent user**                                 | Returns `Optional.empty()`                                     | Raises a `ResourceNotFoundException` business exception.                                                                            | Captures the exception and returns an HTTP **404 Not Found** response to the client.    |
| **2. Creating an already existing user**                                 | Captures the technical uniqueness constraint exception.        | Before saving, the domain checks if the user already exists. If they do, it raises a `BusinessRuleViolationException`.              | Captures the exception and returns an HTTP **409 Conflict** response to the client.     |
| **3. Updating a non-existent resource**                                  | Returns a boolean indicating whether the update succeeded.     | If the update fails (returns `false`), the domain raises a `ResourceNotFoundException`.                                             | Captures the exception and returns an HTTP **404 Not Found** response to the client.    |
| **4. Database connection error**                                         | Captures the technical `DatabaseConnectionException`.          | May raise a `ServiceUnavailableException` or handle the error according to business rules.                                          | Captures the exception and returns an HTTP **503 Service Unavailable** response.        |
| **5. Empty resource list when fetching users**                           | Returns a list, which may be empty.                           | The empty list is considered a valid response and is returned as-is.                                                               | Returns an HTTP **200 OK** response with an empty list to the client.                   |

### Benefits of This Approach

- **Decoupling Layers**: Each layer has a well-defined responsibility, making maintenance and scalability easier.
- **Clarity in Error Handling**: Technical errors do not cross layers, and clients receive consistent messages.
- **Flexibility**: The technical implementation of the SPI can be changed without impacting the domain or API.

### Best Practices

- **Do Not Expose SPI Technical Types to the Domain**: The domain should work with business objects and not depend on
  specific technical types.
- **Use Business Exceptions in the Domain**: To signal issues related to business rules.
- **Translate Business Exceptions into Appropriate HTTP Codes**: The API should map exceptions to standard HTTP codes
  for clear communication with the client.
- **Handle Technical Exceptions in the SPI**: The SPI should capture technical exceptions and provide results that the
  domain can interpret.

<hr class="hr-text" data-content="Validation">

## 6. Data Validation

In hexagonal architecture, data validation can occur at multiple levels, but the **business service** is primarily
responsible for **business validations**. However, **input adapters** (e.g., REST controllers or application services)
can also play a role by validating the **syntax and structure of data** before passing it to the domain.

Here is the breakdown of responsibilities.

#### Input Adapters (REST, UI, etc.)

They can check that the received data respects the expected **syntax** and **format** (e.g., required fields, valid date
formats, etc.).

These adapters can use validation libraries like **Hibernate Validator** (which follows the **Bean Validation**
standard) to validate **DTOs** before passing them to the domain.

This helps **filter** errors before the data reaches the business service, reducing the complexity of error handling
within the domain.

{% highlight java %}
@PostMapping("/users")
public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) {
    // If validation fails, a 400 Bad Request will be returned automatically
    User createdUser = userService.createUser(userDtoMapper.toDomain(userDto));
    return new ResponseEntity<>(userDtoMapper.toDto(createdUser), HttpStatus.CREATED);
}
{% endhighlight %}

#### Business Service (Domain)

It is responsible for **business validations** that are specific to the domain. This involves verifying, for example,
that a user does not already exist, or that a specific business rule is respected (e.g., the user must be of legal age).

The domain uses standard language instructions to encapsulate these validations in business objects. **Business
exceptions** are raised if any rules are violated.

Business validation ensures that business rules are upheld. This helps maintain data integrity within the domain.

{% highlight java %}
public User createUser(User user) {
    if (userRepository.findUserByEmail(user.getEmail()).isPresent()) {
        throw new BusinessRuleViolationException("User already exists.");
    }
    return userRepository.saveUser(user);
}
{% endhighlight %}

#### Impacts for Other Components

- **Input Adapters**:
    - By ensuring that received data is valid at the reception point, input adapters help **reduce complexity** and
      error handling in the domain. If validation fails, the adapters directly return a **400 Bad Request** with an
      explanatory message.

- **Business Service**:
    - If validation fails within the business service (e.g., due to a business rule violation), a **specific exception**
      (such as a **`BusinessRuleViolationException`**) is raised and captured by the input adapter to return a **409
      Conflict** or another appropriate HTTP code. This ensures that business rules remain **centralized** within the
      domain and not within the infrastructure.

#### Advantages and Disadvantages

- **Advantages**:
    - **Separation of responsibilities**: Structure and syntax validations are handled at the adapter level, while
      business validations are concentrated in the business service.
    - **Clear error handling**: Errors related to business rule violations or incorrect formats are clearly identified
      and returned with appropriate HTTP codes (400, 409, etc.).

- **Disadvantages**:
    - **Potential duplication**: In some cases, the same validation might be needed in both the adapter (for structure
      reasons) and in the domain (for business reasons), which could lead to duplication.
    - **Additional complexity**: Although this approach is highly modular and decoupled, it can sometimes make the
      system more complex to implement and maintain.

In summary, within hexagonal architecture, data validation is split between **input adapters** and the **business
service**, with a clear separation between structure/syntax validations and business validations. This decoupling
enhances modularity but requires careful attention to avoid validation duplication.

<hr class="hr-text" data-content="DTO">

## 7. Role of DTOs in Hexagonal Architecture

In hexagonal architecture, **DTOs (Data Transfer Objects)** serve to transfer data between the various layers of the
application, especially between external adapters (such as REST controllers) and the domain. They ensure strict
**decoupling** between business logic and external interfaces, while facilitating adaptation to the specific data formats
needed by each layer.

### Why Use DTOs?

- **Separation of Concerns**:

  DTOs allow separation between **data representation** in external interfaces (REST API, UI) and the business objects
  in the domain. This ensures that business logic encapsulated in domain objects is not directly exposed to external
  adapters.

  *Example*: A **`UserDto`** used to transfer user data via a REST API contains only the necessary information (ID,
  name, address), while the **`User`** domain object encapsulates more complex behaviors and business rules.

  {% highlight java %}
  public class User {
    private Long id;
    private String name;
    private String email;
    private Address address; // Class that contains the user's address information
    private List<Order> orders; // List of orders placed by the user
    
    // Constructors, getters, and setters...
  }
  {% endhighlight %}

  {% highlight java %}
  public class UserDto {
    private Long id;
    private String name;
    private String address; // Address represented as a string (e.g., "123 Main St, City, Country")
    
    // Constructors, getters, and setters...
  }
  {% endhighlight %}

- **Adapting to Data Formats**:

  DTOs facilitate mapping data from a format suited to external clients' needs (e.g., JSON for a REST API) to richer
  domain objects that adhere to business rules. This provides flexibility in data transformation.

  *Example*: A **`UserDtoMapper`** can convert a `UserDto` into a `User` domain object and vice versa.

  {% highlight java %}
  public class UserDtoMapper {
    // Method to convert a DTO into a domain object
    public User toDomain(UserDto dto) {
        Address address = parseAddress(dto.getAddress()); // Convert the address from String to an Address object
        return new User(dto.getId(), dto.getName(), dto.getEmail(), address, new ArrayList<>());
    }

    // Method to convert a domain object into a DTO
    public UserDto toDto(User user) {
        String address = formatAddress(user.getAddress()); // Convert the Address object to a String
        return new UserDto(user.getId(), user.getName(), user.getEmail(), address);
    }

    // Utility method to transform an address string into an Address object
    private Address parseAddress(String address) {
        // Assumes the address is in the form "123 Main St, City, Country"
        String[] parts = address.split(", ");
        return new Address(parts[0], parts[1], parts[2]);
    }

    // Utility method to format an Address object into a string
    private String formatAddress(Address address) {
        return String.format("%s, %s, %s", address.getStreet(), address.getCity(), address.getCountry());
    }
  }
  {% endhighlight %}

- **Domain Protection**:

  DTOs offer control over what data is exposed to external clients, filtering out sensitive or unnecessary information
  for the API context. This protects the integrity of domain data and prevents exposure of unnecessary technical or
  business details.

  *Example*: A **`UserDto`** can omit sensitive fields such as financial information or passwords.

### Benefits of DTOs

- **Modularity**: The decoupling between external layers and the domain enhances code modularity. Changes to DTOs do not
  directly affect the domain, simplifying maintenance.

- **Reduced Dependencies**: External layers do not need to be aware of internal domain details, which limits dependencies
  between different application layers.

- **Adaptability and Scalability**: DTOs make it easy to adapt the data format according to the needs of external
  interfaces (adding fields, handling API versions) without impacting business logic.

### Disadvantages of DTOs

- **Additional Complexity**: Using DTOs requires maintaining additional classes and mappers to transform objects between
  layers, which can complicate the code and increase maintenance.

- **Potential Duplication**: DTOs may sometimes duplicate information found in domain objects, leading to maintenance
  overhead if mappers are not well managed.

### In Summary

The use of DTOs in a hexagonal architecture is essential to maintain the independence of the domain from external
technologies. They allow for flexible **data mapping** between the different layers, protect **business objects** from
direct exposure, and ensure **better modularity** within the application. However, this approach introduces some
complexity and requires additional effort to maintain the mappers and DTOs.

<hr class="hr-text" data-content="Packages">

## 8. Organization of Domain Packages

A clear and well-structured organization of packages helps avoid design mistakes and clearly identify each component of 
the system. By isolating the domain in an independent module, we ensure that it remains free from technical dependencies
or external frameworks. This separation helps maintain the integrity of the domain by protecting its business logic from
technical concerns, while facilitating the evolution of the architecture over time.

Within a hexagonal architecture, this modular structure ensures that responsibilities are clearly defined between the 
domain, the ports (inbound and outbound), and the services, thus promoting clear decoupling and coherent code 
organization.

> info "Package by Layer vs. Package by Feature"
> - The **Package by Layer** approach organizes classes by their technical role, grouping them by the architecture's 
> cross-cutting layers.
> - The **Package by Feature** approach organizes classes by functionality or use case.

For a modern architecture aimed at flexibility and the ability to evolve rapidly (such as hexagonal architecture), 
**Package by Feature** is recommended as it guarantees better separation of concerns and facilitates the transformation 
of features into autonomous services.

#### An Example of Package Structure for the "user" Use Case

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

### Class and Interface Details

1. **Package `domain.common.exceptions`**:
    - This package contains common business exceptions to signal rule violations or resource absence, distinct from 
   technical exceptions.
    - The goal is to centralize these exceptions to maintain domain consistency and encapsulation.

2. **Package `domain.user`**:
   - The `domain.user` package groups all elements related to the "user" business domain. By isolating all relevant 
   classes, interfaces, and services within this single package, several advantages are achieved:

     - **Ease of Identification**: The `domain.user` package brings together everything related to the "user" domain in 
     one place. This simplifies understanding and navigating the code, as it's easy to locate components associated with
     this business entity.

     - **Modularity and Reusability**: By isolating the `domain.user` package, it becomes **modular**. This makes the 
     system extensible, as new behaviors and services specific to `user` can be added without impacting other parts of 
     the domain.

     - **Ease of Relocation and Maintenance**: Since the `domain.user` package is isolated, it can easily be moved, 
     restructured, or even extracted into another project. For instance, if the `user` entity were to be externalized as
     an independent microservice, it would be relatively simple to do so, as all related classes and interfaces are 
     already well encapsulated within a single package.

     - **Business Context Consistency**: Grouping all parts related to `user` within a single package helps preserve 
     **business context consistency**. All objects, services, ports (inbound and outbound) remain encapsulated within a 
     single context, helping to avoid circular dependencies and ensuring a clear separation of concerns.

3. **Package `domain.user.port.inbound`**:
    - The inbound ports package contains interfaces defining use cases exposed to external adapters.
    - These interfaces serve as contracts between external layers and business logic, describing the functional 
   operations of the domain without exposing its internal logic.

4. **Package `domain.user.port.outbound`**:
    - Outbound ports define technical interfaces allowing the domain to access external systems (databases, third-party 
   services, etc.).
    - They delegate technical tasks while maintaining the domain's independence from underlying technologies, ensuring 
   infrastructure flexibility.

5. **Package `domain.user.service`**:
    - The services package contains business implementations that orchestrate inbound and outbound port operations.
    - These services implement inbound interfaces, ensure business logic, and delegate technical operations to outbound 
   ports.

This organization allows the code to be structured according to the principles of **separation of concerns** and 
**decoupling** between business and technical layers, thus ensuring a modular and easily maintainable architecture.

<hr class="hr-text" data-content="Conclusion">

## Conclusion - Beyond the Hexagon

Hexagonal architecture, with its principles of decoupling and separation of concerns, provides a robust and scalable
framework for managing the complexity of a modern application. However, beyond these technical choices, other dimensions
of software architecture deserve exploration.

A natural step after mastering hexagonal architecture is to consider **infrastructure management**. The decoupling
between the domain and infrastructure opens up numerous technical implementation strategies: cloud computing, container
deployment, microservices...

Each approach brings its own challenges and opportunities. Transitioning to architectures like **microservices** also
raises questions about service distribution management, resilience, and the trade-offs between modularity and operational
complexity.

Beyond infrastructure, other architectures may also be considered.

For example, **layered architecture** remains a viable option for simpler applications where strict separation between
the domain and infrastructure is not necessary. Similarly, **event-driven** approaches or **CQRS (Command Query
Responsibility Segregation)** focus on event handling and scalability for complex applications, often with very different
implementation models but complementary to hexagonal architecture.

Finally, the choice of tools and frameworks to support this architecture must be continuously reassessed.

In conclusion, hexagonal architecture is only one piece of the puzzle. It provides a solid foundation but must be
constantly reevaluated and adapted within a broader technological context. Infrastructure, tooling, and the integration
of other architectural paradigms will be key to building systems that are increasingly scalable, resilient, and
high-performing.
