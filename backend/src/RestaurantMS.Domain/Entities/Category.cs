using System;
using System.Collections.Generic;

namespace RestaurantMS.Domain.Entities
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal MinPrice { get; set; }
        public decimal MaxPrice { get; set; }
        public ICollection<FB> FBs { get; set; } = new List<FB>();
    }
}
