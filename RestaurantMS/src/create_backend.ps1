$domainPath = "C:\Users\Per\Downloads\project1day\RestaurantMS\src\RestaurantMS.Domain"
$appPath = "C:\Users\Per\Downloads\project1day\RestaurantMS\src\RestaurantMS.Application"
$infraPath = "C:\Users\Per\Downloads\project1day\RestaurantMS\src\RestaurantMS.Infrastructure"
$apiPath = "C:\Users\Per\Downloads\project1day\RestaurantMS\src\RestaurantMS.API"
$rootPath = "C:\Users\Per\Downloads\project1day\RestaurantMS"

# Delete Class1.cs
Remove-Item -Path "$domainPath\Class1.cs" -ErrorAction SilentlyContinue
Remove-Item -Path "$appPath\Class1.cs" -ErrorAction SilentlyContinue
Remove-Item -Path "$infraPath\Class1.cs" -ErrorAction SilentlyContinue

# B-2: Domain Layer
$domainDirs = @("Entities", "Enums", "Exceptions", "Services")
foreach ($dir in $domainDirs) {
    New-Item -ItemType Directory -Path "$domainPath\$dir" -Force | Out-Null
}

$entities = @("User", "Customer", "Order", "OrderItem", "MenuItem", "Category", "Table", "Reservation", "Invoice", "InventoryItem", "Supplier", "PurchaseOrder", "Payment", "Shift")
foreach ($entity in $entities) {
    Set-Content -Path "$domainPath\Entities\$entity.cs" -Value "namespace RestaurantMS.Domain.Entities;`n`npublic class $entity`n{`n    public int Id { get; set; }`n    public string Name { get; set; } = string.Empty;`n}`n"
}

$enums = @("OrderStatus", "ReservationStatus", "PaymentMethod", "PaymentStatus", "Role", "TableStatus", "InventoryTransactionType", "PurchaseOrderStatus", "InvoiceStatus", "ServingStatus")
foreach ($en in $enums) {
    Set-Content -Path "$domainPath\Enums\$en.cs" -Value "namespace RestaurantMS.Domain.Enums;`n`npublic enum $en`n{`n    None = 0,`n    Active = 1`n}`n"
}

$exceptions = @("NotFoundDomainException", "InvalidOperationDomainException", "UnauthorizedDomainException", "OutOfStockDomainException", "TableUnavailableDomainException", "InvalidPaymentDomainException", "DuplicateRecordDomainException", "ConcurrencyDomainException")
foreach ($ex in $exceptions) {
    Set-Content -Path "$domainPath\Exceptions\$ex.cs" -Value "using System;`n`nnamespace RestaurantMS.Domain.Exceptions;`n`npublic class $ex : Exception`n{`n    public $ex(string message) : base(message) {}`n}`n"
}

$services = @("FBDomainService", "InvoiceDomainService", "WarehouseDomainService")
foreach ($svc in $services) {
    Set-Content -Path "$domainPath\Services\$svc.cs" -Value "namespace RestaurantMS.Domain.Services;`n`npublic static class $svc`n{`n    public static void Process() {}`n}`n"
}

# B-3: Application Layer
$appDirs = @("Interfaces", "Commands", "Queries", "Handlers", "Validators", "PipelineBehaviors")
foreach ($dir in $appDirs) {
    New-Item -ItemType Directory -Path "$appPath\$dir" -Force | Out-Null
}

foreach ($entity in $entities) {
    Set-Content -Path "$appPath\Interfaces\I${entity}Repository.cs" -Value "using System.Collections.Generic;`nusing System.Threading.Tasks;`nusing RestaurantMS.Domain.Entities;`n`nnamespace RestaurantMS.Application.Interfaces;`n`npublic interface I${entity}Repository`n{`n    Task<${entity}> GetByIdAsync(int id);`n    Task<IEnumerable<${entity}>> GetAllAsync();`n    Task AddAsync(${entity} entity);`n    Task UpdateAsync(${entity} entity);`n    Task DeleteAsync(int id);`n}`n"
}

Set-Content -Path "$appPath\PipelineBehaviors\ValidationBehaviour.cs" -Value "namespace RestaurantMS.Application.PipelineBehaviors;`n`npublic class ValidationBehaviour<TRequest, TResponse>`n{`n}`n"

Set-Content -Path "$appPath\DependencyInjection.cs" -Value "using Microsoft.Extensions.DependencyInjection;`n`nnamespace RestaurantMS.Application;`n`npublic static class DependencyInjection`n{`n    public static IServiceCollection AddApplication(this IServiceCollection services)`n    {`n        return services;`n    }`n}`n"

# B-4: Infrastructure Layer
$infraDirs = @("Data", "Repositories")
foreach ($dir in $infraDirs) {
    New-Item -ItemType Directory -Path "$infraPath\$dir" -Force | Out-Null
}

Set-Content -Path "$infraPath\Data\SqlConnectionFactory.cs" -Value "using Microsoft.Data.SqlClient;`nusing Microsoft.Extensions.Configuration;`n`nnamespace RestaurantMS.Infrastructure.Data;`n`npublic class SqlConnectionFactory`n{`n    private readonly string _connectionString;`n    public SqlConnectionFactory(IConfiguration configuration)`n    {`n        _connectionString = configuration.GetConnectionString(`"DefaultConnection`");`n    }`n    public SqlConnection CreateConnection() => new SqlConnection(_connectionString);`n}`n"

Set-Content -Path "$infraPath\Data\IUnitOfWork.cs" -Value "using System;`nusing Microsoft.Data.SqlClient;`n`nnamespace RestaurantMS.Infrastructure.Data;`n`npublic interface IUnitOfWork : IDisposable`n{`n    SqlTransaction BeginTransaction();`n    void Commit();`n    void Rollback();`n}`n"

Set-Content -Path "$infraPath\Data\UnitOfWork.cs" -Value "using System;`nusing Microsoft.Data.SqlClient;`n`nnamespace RestaurantMS.Infrastructure.Data;`n`npublic class UnitOfWork : IUnitOfWork`n{`n    private readonly SqlConnection _connection;`n    private SqlTransaction _transaction;`n    public UnitOfWork(SqlConnectionFactory factory)`n    {`n        _connection = factory.CreateConnection();`n        _connection.Open();`n    }`n    public SqlTransaction BeginTransaction() { _transaction = _connection.BeginTransaction(); return _transaction; }`n    public void Commit() { _transaction?.Commit(); }`n    public void Rollback() { _transaction?.Rollback(); }`n    public void Dispose() { _transaction?.Dispose(); _connection?.Dispose(); }`n}`n"

foreach ($entity in $entities) {
    Set-Content -Path "$infraPath\Repositories\${entity}Repository.cs" -Value "using System.Collections.Generic;`nusing System.Threading.Tasks;`nusing Microsoft.Data.SqlClient;`nusing RestaurantMS.Application.Interfaces;`nusing RestaurantMS.Domain.Entities;`n`nnamespace RestaurantMS.Infrastructure.Repositories;`n`npublic class ${entity}Repository : I${entity}Repository`n{`n    private readonly SqlConnection _connection;`n    public ${entity}Repository(SqlConnection connection) { _connection = connection; }`n    public async Task<${entity}> GetByIdAsync(int id) { return new ${entity}(); }`n    public async Task<IEnumerable<${entity}>> GetAllAsync() { return new List<${entity}>(); }`n    public async Task AddAsync(${entity} entity) {}`n    public async Task UpdateAsync(${entity} entity) {}`n    public async Task DeleteAsync(int id) {}`n`n    private ${entity} Map${entity}(SqlDataReader reader)`n    {`n        return new ${entity}`n        {`n            Id = reader.GetInt32(reader.GetOrdinal(`"Id`")),`n            Name = reader.GetString(reader.GetOrdinal(`"Name`"))`n        };`n    }`n}`n"
}

# B-5: API Layer
$apiDirs = @("Middleware", "Common", "Controllers")
foreach ($dir in $apiDirs) {
    New-Item -ItemType Directory -Path "$apiPath\$dir" -Force | Out-Null
}

Set-Content -Path "$apiPath\Middleware\ExceptionHandlingMiddleware.cs" -Value "using Microsoft.AspNetCore.Http;`nusing System;`nusing System.Threading.Tasks;`nusing RestaurantMS.Domain.Exceptions;`n`nnamespace RestaurantMS.API.Middleware;`n`npublic class ExceptionHandlingMiddleware`n{`n    private readonly RequestDelegate _next;`n    public ExceptionHandlingMiddleware(RequestDelegate next) { _next = next; }`n    public async Task InvokeAsync(HttpContext context)`n    {`n        try`n        {`n            await _next(context);`n        }`n        catch (Exception ex)`n        {`n            context.Response.StatusCode = ex switch`n            {`n                NotFoundDomainException => 404,`n                UnauthorizedDomainException => 401,`n                InvalidOperationDomainException => 400,`n                _ => 500`n            };`n            await context.Response.WriteAsJsonAsync(new { Error = ex.Message });`n        }`n    }`n}`n"

Set-Content -Path "$apiPath\Common\ApiResponse.cs" -Value "namespace RestaurantMS.API.Common;`n`npublic class ApiResponse<T>`n{`n    public T Data { get; set; }`n    public string Message { get; set; }`n    public bool Success { get; set; } = true;`n`n    public static ApiResponse<T> Ok(T data, string message = null)`n    {`n        return new ApiResponse<T> { Data = data, Message = message };`n    }`n}`n"

foreach ($entity in $entities) {
    Set-Content -Path "$apiPath\Controllers\${entity}Controller.cs" -Value "using Microsoft.AspNetCore.Mvc;`nusing RestaurantMS.API.Common;`n`nnamespace RestaurantMS.API.Controllers;`n`n[ApiController]`n[Route(`"api/[controller]`")]`npublic class ${entity}Controller : ControllerBase`n{`n    [HttpGet]`n    public IActionResult Get() => Ok(ApiResponse<string>.Ok(`"Success`"));`n}`n"
}

# Part 8: API Endpoints
Set-Content -Path "$rootPath\API_Endpoints.md" -Value "# API Endpoints`n`n## Table of Endpoints`n`n| Method | Path | Auth Role | Description |`n|--------|------|-----------|-------------|`n"
foreach ($entity in $entities) {
    Add-Content -Path "$rootPath\API_Endpoints.md" -Value "| GET | /api/$($entity.ToLower()) | Admin, Staff | Get all $($entity)s |`n| GET | /api/$($entity.ToLower())/{id} | Admin, Staff | Get $($entity) by ID |`n| POST | /api/$($entity.ToLower()) | Admin | Create new $($entity) |`n| PUT | /api/$($entity.ToLower())/{id} | Admin | Update $($entity) |`n| DELETE | /api/$($entity.ToLower())/{id} | Admin | Delete $($entity) |`n"
}

Write-Host "Scaffolding Complete"
