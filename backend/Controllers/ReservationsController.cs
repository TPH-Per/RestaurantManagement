using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReservationsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<TableReservation>>> GetMyReservations()
        {
            var customerIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(customerIdClaim)) return Unauthorized();

            var customerId = long.Parse(customerIdClaim);
            return await _context.TableReservations
                .Where(r => r.CustomerId == customerId)
                .OrderByDescending(r => r.ReservedAt)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TableReservation>> GetReservation(long id)
        {
            var reservation = await _context.TableReservations.FindAsync(id);
            if (reservation == null) return NotFound();

            return reservation;
        }

        [HttpPost]
        public async Task<ActionResult<TableReservation>> CreateReservation(TableReservation reservation)
        {
            var customerIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(customerIdClaim))
            {
                reservation.CustomerId = long.Parse(customerIdClaim);
            }

            reservation.CreatedAt = DateTime.Now;
            reservation.Status = "PENDING";

            _context.TableReservations.Add(reservation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReservation), new { id = reservation.ReservationId }, reservation);
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "ADMIN,MANAGER,WAITER")]
        public async Task<IActionResult> UpdateStatus(long id, [FromBody] string status)
        {
            var reservation = await _context.TableReservations.FindAsync(id);
            if (reservation == null) return NotFound();

            reservation.Status = status;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
