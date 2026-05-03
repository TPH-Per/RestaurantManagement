using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Features.Invoice.Commands.CreateInvoice;
using RestaurantMS.Application.Features.Invoice.Commands.ApplyDiscount;
using RestaurantMS.Application.Features.Invoice.Commands;
using RestaurantMS.Application.Features.Invoice.Queries;

namespace RestaurantMS.API.Controllers;

[Route("api/invoices")]
[ApiController]
[Authorize(Policy = "StaffOnly")]
public class InvoiceController : ControllerBase
{
    private readonly IMediator _m;
    public InvoiceController(IMediator m) => _m = m;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateInvoiceCommand cmd, CancellationToken ct) 
        => Ok(await _m.Send(cmd, ct));

    [HttpPost("{id}/apply-discount")]
    public async Task<IActionResult> ApplyDiscount(long id, [FromBody] ApplyDiscountRequest req, CancellationToken ct)
        => Ok(await _m.Send(new ApplyDiscountCommand(id, req.DiscountCode), ct));

    [HttpPost("{id}/pay")]
    public async Task<IActionResult> Pay(long id, [FromBody] PayInvoiceRequest req, CancellationToken ct)
        => Ok(await _m.Send(new PayInvoiceCommand(id, req.Method, req.CashierId), ct));

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(long id, CancellationToken ct)
        => Ok(await _m.Send(new GetInvoiceQuery(id), ct));

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
        => Ok(await _m.Send(new GetAllInvoicesQuery(), ct));

    public class ApplyDiscountRequest { public string DiscountCode { get; set; } = string.Empty; }
    public class PayInvoiceRequest { public string Method { get; set; } = string.Empty; public long CashierId { get; set; } }
}