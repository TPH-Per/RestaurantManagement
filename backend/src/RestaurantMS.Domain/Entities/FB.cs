using System;
using System.Collections.Generic;

using RestaurantMS.Domain.Exceptions;
using RestaurantMS.Domain.Enums;

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
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public FBType Type { get; set; }
        public bool IsVisible { get; set; }
        public string ItemType { get; set; } = string.Empty;
        public string StockStatus { get; set; } = string.Empty;
        public bool ShowOnMenu { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public Warehouse? Warehouse { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<ReceiptDetail> ReceiptDetails { get; set; } = new List<ReceiptDetail>();

        // Mirrors business rule: FRESH_RAW items are never available for sale
        public bool IsSellable() => Type != FBType.FRESH_RAW && IsVisible;

        // Domain invariant: FRESH_RAW can never be made visible on menu
        public void SetVisibility(bool visible)
        {
            if (Type == FBType.FRESH_RAW && visible)
                throw new DomainException("FRESH_RAW items cannot be shown on the menu.");
            IsVisible = visible;
        }
    }
}
