using System;
using System.Collections.Generic;

namespace RestaurantMS.Domain.Entities
{
    public class OrderItem
    {
        public long OrderItemId { get; set; }
        public long OrderId { get; set; }
        public RestaurantOrder Order { get; set; } = null!;
        public int ItemId { get; set; }
        public FB FB { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
        public string? Notes { get; set; }
    }
}
