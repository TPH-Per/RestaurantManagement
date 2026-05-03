using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Features.Customer.Queries;

namespace RestaurantMS.API.Controllers;

[Route("api/customers")]
[ApiController]
[Authorize(Policy = "StaffOnly")]
public class CustomerController : ControllerBase
{
    private readonly IMediator _m;
    public CustomerController(IMediator m) => _m = m;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct) => Ok(new List<object>());
}
