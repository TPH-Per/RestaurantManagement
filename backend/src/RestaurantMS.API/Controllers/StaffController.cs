using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Features.Staff.Queries;

namespace RestaurantMS.API.Controllers;

[Route("api/staff")]
[ApiController]
[Authorize(Policy = "ManagerOnly")]
public class StaffController : ControllerBase
{
    private readonly IMediator _m;
    public StaffController(IMediator m) => _m = m;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct) 
        => Ok(await _m.Send(new GetStaffQuery(), ct));
}