using System;
using System.Collections.Generic;

namespace RestaurantMS.Domain.Entities
{
    public class RestaurantTable
    {
        public int TableId { get; set; }
        public string TableNumber { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public string? Location { get; set; }
        public string Status { get; set; } = string.Empty;
        public ICollection<RestaurantOrder> Orders { get; set; } = new List<RestaurantOrder>();
        public ICollection<TableReservation> TableReservations { get; set; } = new List<TableReservation>();
    }
}
