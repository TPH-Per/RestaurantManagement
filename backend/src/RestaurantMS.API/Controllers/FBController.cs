using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.API.Controllers;

[Route("api/fb")]
[ApiController]
[Authorize(Policy = "ManagerOnly")]
public class FBController : ControllerBase
{
    private readonly IMediator _m;
    public FBController(IMediator m) => _m = m;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetMenu(CancellationToken ct) => Ok(new List<object>()); // Mock list
}
