using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Features.DiscountCode.Commands;
using RestaurantMS.Application.Features.DiscountCode.Queries;

namespace RestaurantMS.API.Controllers;

[Route("api/discount-codes")]
[ApiController]
public class DiscountCodeController : ControllerBase
{
    private readonly IMediator _m;
    public DiscountCodeController(IMediator m) => _m = m;

    [HttpPost]
    [Authorize(Policy = "ManagerOnly")]
    public async Task<IActionResult> Create([FromBody] CreateDiscountCodeCommand cmd, CancellationToken ct)
        => Ok(await _m.Send(cmd, ct));

    [HttpPut("{id}/toggle")]
    [Authorize(Policy = "ManagerOnly")]
    public async Task<IActionResult> Toggle(long id, CancellationToken ct)
        => Ok(await _m.Send(new ToggleDiscountCodeCommand(id), ct));

    [HttpGet("validate/{code}")]
    [Authorize(Policy = "StaffOnly")]
    public async Task<IActionResult> Validate(string code, CancellationToken ct)
        => Ok(await _m.Send(new ValidateDiscountCodeQuery(code), ct));

    [HttpGet]
    [Authorize(Policy = "StaffOnly")]
    public async Task<IActionResult> GetAll(CancellationToken ct)
        => Ok(await _m.Send(new GetDiscountCodesQuery(), ct));
}
