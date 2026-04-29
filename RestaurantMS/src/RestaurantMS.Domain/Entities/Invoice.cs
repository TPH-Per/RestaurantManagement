using System;
using System.Collections.Generic;

namespace RestaurantMS.Domain.Entities
{
    public class Invoice
    {
        public long InvoiceId { get; set; }
        public string InvoiceCode { get; set; } = string.Empty;
        public long OrderId { get; set; }
        public RestaurantOrder Order { get; set; } = null!;
        public long ProcessedBy { get; set; }
        public Staff Staff { get; set; } = null!;
        public int? DiscountCodeId { get; set; }
        public DiscountCode? DiscountCode { get; set; }
        public DateTime CreatedDate { get; set; }
        public decimal Subtotal { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string? PaymentMethod { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime IssuedAt { get; set; }
        public Review? Review { get; set; }
    }
}
