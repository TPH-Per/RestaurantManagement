using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Features.Order.Commands.AddOrderItem;
using RestaurantMS.Application.Features.Order.Commands.CancelOrder;
using RestaurantMS.Application.Features.Order.Commands;
using RestaurantMS.Application.Features.Order.Queries;

namespace RestaurantMS.API.Controllers;

[Route("api/orders")]
[ApiController]
[Authorize(Policy = "StaffOnly")]
public class RestaurantOrderController : ControllerBase
{
    private readonly IMediator _m;
    public RestaurantOrderController(IMediator m) => _m = m;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderCommand cmd, CancellationToken ct)
        => Ok(await _m.Send(cmd, ct));

    [HttpPost("{orderId}/items")]
    public async Task<IActionResult> AddItem(long orderId, [FromBody] AddOrderItemDto req, CancellationToken ct) 
        => Ok(await _m.Send(new AddOrderItemCommand(orderId, req.FBId, req.Quantity), ct));

    [HttpDelete("{orderId}")]
    public async Task<IActionResult> Cancel(long orderId, CancellationToken ct) 
        => Ok(await _m.Send(new CancelOrderCommand(orderId), ct));

    [HttpPut("{orderId}/start-serving")]
    public async Task<IActionResult> StartServing(long orderId, CancellationToken ct)
    {
        await _m.Send(new StartServingCommand(orderId), ct);
        return NoContent();
    }

    [HttpPut("{orderId}/complete")]
    public async Task<IActionResult> Complete(long orderId, CancellationToken ct)
    {
        await _m.Send(new CompleteOrderCommand(orderId), ct);
        return NoContent();
    }

    [HttpGet("{orderId}")]
    public async Task<IActionResult> Get(long orderId, CancellationToken ct)
        => Ok(await _m.Send(new GetOrderQuery(orderId), ct));

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
        => Ok(await _m.Send(new GetAllOrdersQuery(), ct));

    public class AddOrderItemDto { public long FBId { get; set; } public int Quantity { get; set; } }
}