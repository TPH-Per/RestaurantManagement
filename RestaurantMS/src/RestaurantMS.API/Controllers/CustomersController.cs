using Microsoft.AspNetCore.Mvc;
using RestaurantMS.API.Models;
using RestaurantMS.Application.Features.Auth.Commands.RegisterCustomer;

namespace RestaurantMS.API.Controllers;

public class CustomersController : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<CustomerAuthDto>>> Register(RegisterCustomerCommand command)
    {
        return OkResponse(await Mediator.Send(command));
    }
}
