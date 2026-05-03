$domainPath = "C:\Users\Per\Downloads\project1day\RestaurantMS\src\RestaurantMS.Domain"
$appPath = "C:\Users\Per\Downloads\project1day\RestaurantMS\src\RestaurantMS.Application"
$infraPath = "C:\Users\Per\Downloads\project1day\RestaurantMS\src\RestaurantMS.Infrastructure"
$apiPath = "C:\Users\Per\Downloads\project1day\RestaurantMS\src\RestaurantMS.API"

$badEntities = @("User", "Order", "MenuItem", "Table", "Reservation", "InventoryItem", "Supplier", "PurchaseOrder", "Payment", "Shift")

foreach ($ent in $badEntities) {
    Remove-Item -Path "$domainPath\Entities\$ent.cs" -ErrorAction SilentlyContinue
    Remove-Item -Path "$appPath\Interfaces\I${ent}Repository.cs" -ErrorAction SilentlyContinue
    Remove-Item -Path "$infraPath\Repositories\${ent}Repository.cs" -ErrorAction SilentlyContinue
    Remove-Item -Path "$apiPath\Controllers\${ent}Controller.cs" -ErrorAction SilentlyContinue
}

$allEntities = @("Category", "Customer", "DiscountCode", "FB", "Invoice", "Manufacturer", "OrderItem", "Receipt", "ReceiptDetail", "RestaurantOrder", "RestaurantTable", "Review", "ReviewReply", "Staff", "TableReservation", "Warehouse")

foreach ($entity in $allEntities) {
    # Generate Interface
    Set-Content -Path "$appPath\Interfaces\I${entity}Repository.cs" -Value "using System.Collections.Generic;`nusing System.Threading.Tasks;`nusing RestaurantMS.Domain.Entities;`n`nnamespace RestaurantMS.Application.Interfaces;`n`npublic interface I${entity}Repository`n{`n    Task<${entity}> GetByIdAsync(long id);`n    Task<IEnumerable<${entity}>> GetAllAsync();`n    Task AddAsync(${entity} entity);`n    Task UpdateAsync(${entity} entity);`n    Task DeleteAsync(long id);`n}`n"

    # Generate Repository
    Set-Content -Path "$infraPath\Repositories\${entity}Repository.cs" -Value "using System.Collections.Generic;`nusing System.Threading.Tasks;`nusing Microsoft.Data.SqlClient;`nusing RestaurantMS.Application.Interfaces;`nusing RestaurantMS.Domain.Entities;`nusing RestaurantMS.Infrastructure.Data;`n`nnamespace RestaurantMS.Infrastructure.Repositories;`n`npublic class ${entity}Repository : I${entity}Repository`n{`n    private readonly SqlConnectionFactory _connectionFactory;`n    public ${entity}Repository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }`n    public async Task<${entity}> GetByIdAsync(long id) { return null; }`n    public async Task<IEnumerable<${entity}>> GetAllAsync() { return new List<${entity}>(); }`n    public async Task AddAsync(${entity} entity) {}`n    public async Task UpdateAsync(${entity} entity) {}`n    public async Task DeleteAsync(long id) {}`n`n    private ${entity} Map${entity}(SqlDataReader reader)`n    {`n        return new ${entity}();`n    }`n}`n"

    # Generate Controller
    Set-Content -Path "$apiPath\Controllers\${entity}Controller.cs" -Value "using Microsoft.AspNetCore.Mvc;`nusing RestaurantMS.API.Common;`nusing System.Threading.Tasks;`nusing MediatR;`n`nnamespace RestaurantMS.API.Controllers;`n`n[ApiController]`n[Route(`"api/[controller]`")]`npublic class ${entity}Controller : ControllerBase`n{`n    private readonly IMediator _mediator;`n    public ${entity}Controller(IMediator mediator) { _mediator = mediator; }`n`n    [HttpGet]`n    public async Task<IActionResult> Get() => Ok(ApiResponse<string>.Ok(`"Success`"));`n}`n"
}
