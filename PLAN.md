# Refactoring Plan

## Part 0 — Problem Inventory
All legacy anti-patterns catalogued per file with their exact fix.

## Part 1 — Target Solution Structure
4-project backend (Domain → Application → Infrastructure → API) + layered frontend folders.

## Part 2 — Required Packages
All NuGet packages (MediatR 12, FluentValidation 11, Microsoft.Data.SqlClient 5, Dapper 2) and npm packages (axios, pinia, gsap, zod, TypeScript).

## Parts 3–5 — Backend Refactor (Step by Step)
### B-1: Delete legacy files
Delete 7 legacy files including AppDbContext.cs and WeatherForecast.cs

### B-2: Domain layer
14 entity classes, 10 enums, 8 domain exceptions, 3 static domain services (FBDomainService, InvoiceDomainService, WarehouseDomainService)

### B-3: Application layer
14 repository interfaces, 80+ Commands/Queries/Handlers/Validators, ValidationBehaviour pipeline, rewritten DependencyInjection.cs

### B-4: Infrastructure layer
SqlConnectionFactory, UnitOfWork (manages SqlTransaction, not EF SaveChanges), 14 raw-SQL repositories with full MapXxx(SqlDataReader) pattern, Staff password migration

### B-5: API layer
ExceptionHandlingMiddleware mapping all 13 domain exceptions to HTTP codes, ApiResponse.Ok<T>() wrapper, 14 thin controllers with zero try/catch

## Part 4 — Business Rules Checklist
13 rules mapped to exact handler + domain service method + exception thrown.

## Parts 5–7 — Frontend Refactor
Convert all .js → .ts, add tsconfig.json with strict: true
Delete the mock api.js, create 14 typed Axios service modules
Create domain/, composables/, stores/ layers; refactor all 27 pages to use composables instead of direct service calls

## Part 8 — API Endpoint Reference
Complete table of 40+ endpoints with HTTP method, path, and auth role.

## Part 9 — Build Order
Exact sequence: Domain → Application → Infrastructure → API → Frontend domain → Services → Stores → Composables → Pages → Components → Animations.

## Most Critical Rule Reminder
All SQL is hand-written raw SQL via SqlCommand with @Parameters. No EF Core anywhere. IUnitOfWork wraps SqlTransaction so atomic operations (add order item + deduct stock) either fully commit or fully roll back.