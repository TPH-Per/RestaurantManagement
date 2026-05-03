using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Features.Reservation.Queries;

namespace RestaurantMS.API.Controllers;

[Route("api/reservations")]
[ApiController]
[Authorize(Policy = "CustomerOnly")]
public class TableReservationController : ControllerBase
{
    private readonly IMediator _m;
    public TableReservationController(IMediator m) => _m = m;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReservationDto cmd, CancellationToken ct) => Ok(new { ReservationId = 1 });

    [HttpGet("all")]
    [Authorize(Policy = "StaffOnly")]
    public async Task<IActionResult> GetAll(CancellationToken ct)
        => Ok(await _m.Send(new GetAllReservationsQuery(), ct));

    public class CreateReservationDto { public int TableId { get; set; } public DateTime ReservedAt { get; set; } public int GuestCount { get; set; } }
}