using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Features.Manufacturer.Queries;

namespace RestaurantMS.API.Controllers;

[Route("api/manufacturers")]
[ApiController]
[Authorize(Policy = "StaffOnly")]
public class ManufacturerController : ControllerBase
{
    private readonly IMediator _m;
    public ManufacturerController(IMediator m) => _m = m;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct) => Ok(await _m.Send(new GetManufacturersQuery(), ct)); // Mock list
}
