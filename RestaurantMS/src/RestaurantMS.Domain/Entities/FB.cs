using System;
using System.Collections.Generic;

namespace RestaurantMS.Domain.Entities
{
    public class FB
    {
        public int ItemId { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public int? ManufacturerId { get; set; }
        public Manufacturer? Manufacturer { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ItemType { get; set; } = string.Empty;
        public string StockStatus { get; set; } = string.Empty;
        public bool ShowOnMenu { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public Warehouse? Warehouse { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<ReceiptDetail> ReceiptDetails { get; set; } = new List<ReceiptDetail>();
    }
}
