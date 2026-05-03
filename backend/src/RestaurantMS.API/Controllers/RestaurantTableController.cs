using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.API.Controllers;

[Route("api/tables")]
[ApiController]
[Authorize(Policy = "StaffOnly")]
public class RestaurantTableController : ControllerBase
{
    private readonly IMediator _m;
    public RestaurantTableController(IMediator m) => _m = m;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct) => Ok(new List<object>()); // Mock list
}
