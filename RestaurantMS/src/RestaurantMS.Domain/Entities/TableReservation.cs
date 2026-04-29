using System;
using System.Collections.Generic;

namespace RestaurantMS.Domain.Entities
{
    public class TableReservation
    {
        public long ReservationId { get; set; }
        public long CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        public int TableId { get; set; }
        public RestaurantTable Table { get; set; } = null!;
        public DateTime ReservedAt { get; set; }
        public int GuestCount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<RestaurantOrder> Orders { get; set; } = new List<RestaurantOrder>();
    }
}
