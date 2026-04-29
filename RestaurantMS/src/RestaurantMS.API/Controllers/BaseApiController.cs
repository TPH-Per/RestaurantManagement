using MediatR;
using Microsoft.AspNetCore.Mvc;
using RestaurantMS.API.Models;

namespace RestaurantMS.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    private ISender? _mediator;
    protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();

    protected ActionResult<ApiResponse<T>> OkResponse<T>(T data, string message = "OK")
        => base.Ok(ApiResponse<T>.SuccessResponse(data, message));
}
