using System;
using System.Collections.Generic;

namespace RestaurantMS.Domain.Entities
{
    public class Manufacturer
    {
        public int ManufacturerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public bool IsInhouse { get; set; }
        public ICollection<FB> FBs { get; set; } = new List<FB>();
        public ICollection<Receipt> Receipts { get; set; } = new List<Receipt>();
    }
}
