using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Features.Receipt.Queries;
using RestaurantMS.Application.Features.Receipt.Commands.CreateReceipt;

namespace RestaurantMS.API.Controllers;

[Route("api/receipts")]
[ApiController]
[Authorize(Policy = "ManagerOnly")]
public class ReceiptController : ControllerBase
{

    private readonly IMediator _m;
    public ReceiptController(IMediator m) => _m = m;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReceiptCommand cmd, CancellationToken ct) 
        => Ok(await _m.Send(cmd, ct));

    [HttpGet]
    [Authorize(Policy = "StaffOnly")]
    public async Task<IActionResult> GetAll(CancellationToken ct) => Ok(await _m.Send(new GetAllReceiptsQuery(), ct));
}