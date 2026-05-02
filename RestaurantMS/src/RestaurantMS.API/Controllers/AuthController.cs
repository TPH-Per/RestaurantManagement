using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Features.Auth.Commands.LoginStaff;
using RestaurantMS.Application.Features.Auth.Commands.RegisterCustomer;

namespace RestaurantMS.API.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IMediator _m;
    public AuthController(IMediator m) => _m = m;

    [HttpPost("staff/login")]
    public async Task<IActionResult> StaffLogin([FromBody] LoginStaffCommand cmd, CancellationToken ct) => Ok(await _m.Send(cmd, ct));

    [HttpPost("customer/register")]
    public async Task<IActionResult> CustomerRegister([FromBody] RegisterCustomerCommand cmd, CancellationToken ct) => Ok(await _m.Send(cmd, ct));

    [HttpPost("customer/login")]
    public async Task<IActionResult> CustomerLogin([FromBody] object cmd, CancellationToken ct) => Ok(new { Token = "mock-customer-token" });
}
