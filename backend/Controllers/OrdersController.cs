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
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<RestaurantOrder>> CreateOrder([FromBody] RestaurantOrder order)
        {
            var customerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(customerIdClaim)) return Unauthorized();

            var customerId = long.Parse(customerIdClaim);

            // Verify that the reservation exists and its status is SERVING
            var reservation = await _context.TableReservations
                .FirstOrDefaultAsync(r => r.ReservationId == order.ReservationId && r.CustomerId == customerId);

            if (reservation == null)
            {
                return BadRequest(new { message = "Reservation not found or does not belong to you." });
            }

            if (reservation.Status != "SERVING")
            {
                return BadRequest(new { message = "You can only place orders when your reservation status is 'SERVING'." });
            }

            order.CreatedAt = DateTime.Now;
            order.Status = "PENDING";
            
            // Add items
            if (order.OrderItems != null)
            {
                foreach (var item in order.OrderItems)
                {
                    item.OrderId = 0; // Ensure it's a new item
                }
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(order);
        }

        [HttpGet("reservation/{reservationId}")]
        public async Task<ActionResult<IEnumerable<RestaurantOrder>>> GetOrdersByReservation(long reservationId)
        {
            var customerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(customerIdClaim)) return Unauthorized();

            var customerId = long.Parse(customerIdClaim);

            // Verify ownership
            var reservation = await _context.TableReservations
                .AnyAsync(r => r.ReservationId == reservationId && r.CustomerId == customerId);

            if (!reservation) return Unauthorized();

            return await _context.Orders
                .Where(o => o.ReservationId == reservationId)
                .Include(o => o.OrderItems!)
                .ThenInclude(oi => oi.FB)
                .ToListAsync();
        }
    }
}
