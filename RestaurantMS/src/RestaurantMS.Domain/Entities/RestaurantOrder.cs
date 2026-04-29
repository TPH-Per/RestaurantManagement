using System;
using System.Collections.Generic;

namespace RestaurantMS.Domain.Entities
{
    public class RestaurantOrder
    {
        public long OrderId { get; set; }
        public long? ReservationId { get; set; }
        public TableReservation? Reservation { get; set; }
        public int TableId { get; set; }
        public RestaurantTable Table { get; set; } = null!;
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public Invoice? Invoice { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
