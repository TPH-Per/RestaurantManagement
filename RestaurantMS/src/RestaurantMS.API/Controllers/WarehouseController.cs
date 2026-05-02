using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.API.Controllers;

[Route("api/warehouse")]
[ApiController]
[Authorize(Policy = "StaffOnly")]
public class WarehouseController : ControllerBase
{
    private readonly IMediator _m;
    public WarehouseController(IMediator m) => _m = m;

    [HttpGet("report")]
    public async Task<IActionResult> GetReport(CancellationToken ct) => Ok(new List<object>()); // Mock list
}
