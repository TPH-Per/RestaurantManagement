using System;
using System.Collections.Generic;

namespace RestaurantMS.Domain.Entities
{
    public class Warehouse
    {
        public int ItemId { get; set; }
        public FB FB { get; set; } = null!;
        public int CurrentStock { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
