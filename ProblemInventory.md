# Problem Inventory (Part 0)

This document catalogs the legacy anti-patterns found in the old `backend` project and outlines the exact fixes required as part of our migration to the new 4-project Clean Architecture solution.

## 1. Fat Controllers (Business Logic in API Layer)
**Anti-Pattern:** Controllers (like `OrdersController.cs`) contain complex business rules, such as verifying reservation ownership, checking if a reservation status is `"SERVING"`, and conditionally creating records.
**Exact Fix:** Extract all business logic into the Application layer. Implement CQRS using **MediatR**. Controllers will become "thin" and only dispatch commands/queries to the Application layer. Domain rules will be encapsulated in Domain entities or Application handlers, throwing specific domain exceptions when rules are violated.

## 2. Direct Entity Framework Core Usage
**Anti-Pattern:** Controllers directly inject `AppDbContext` and execute LINQ-to-Entities queries (`.FirstOrDefaultAsync()`, `_context.Orders.Add()`, `_context.SaveChangesAsync()`).
**Exact Fix:** Completely remove Entity Framework Core from the solution. Implement the **Repository Pattern** in the Application layer, with concrete implementations in the Infrastructure layer using **Dapper** and raw SQL commands (`SqlCommand`, `SqlDataReader`) for optimal performance and control. 

## 3. Magic Strings
**Anti-Pattern:** State is tracked using hardcoded magic strings (e.g., `Status = "PENDING"`, checking `reservation.Status != "SERVING"`).
**Exact Fix:** Replace all magic strings with strongly-typed `enum` structures (e.g., `OrderStatus.Pending`, `ReservationStatus.Serving`) defined in the `RestaurantMS.Domain/Enums` folder.

## 4. Anemic Domain Models & Manual Mapping
**Anti-Pattern:** Data entities are used as plain data bags. Controllers manually manipulate state (e.g., `order.CreatedAt = DateTime.Now;` or looping to reset IDs `item.OrderId = 0`). 
**Exact Fix:** Move entities to `RestaurantMS.Domain/Entities` and refactor them into rich domain models. Use private setters and expose methods to perform state changes ensuring domain invariants are always valid. Use DTOs in the Application layer to decouple the API contract from the database schema.

## 5. In-line Identity & Claims Extraction
**Anti-Pattern:** Identity parsing (`User.FindFirst(ClaimTypes.NameIdentifier)?.Value`) and authorization checks are duplicated across multiple controller endpoints.
**Exact Fix:** Inject an `ICurrentUserService` (defined in Application, implemented in Infrastructure) to abstract away `HttpContext` and token parsing. Pass the strongly-typed user ID cleanly to Application layer Commands/Queries.
