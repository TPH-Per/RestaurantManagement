using Microsoft.AspNetCore.Mvc;
using RestaurantMS.API.Common;
using System.Threading.Tasks;
using MediatR;

namespace RestaurantMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReceiptController : ControllerBase
{
    private readonly IMediator _mediator;
    public ReceiptController(IMediator mediator) { _mediator = mediator; }

    [HttpGet]
    public async Task<IActionResult> Get() => Ok(ApiResponse<string>.Ok("Success"));
}

