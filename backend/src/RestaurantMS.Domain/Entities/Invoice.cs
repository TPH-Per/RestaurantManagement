using System;
using System.Collections.Generic;

using RestaurantMS.Domain.Exceptions;
using RestaurantMS.Domain.Enums;

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
        public decimal Total { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public InvoiceStatus Status { get; set; }
        public DateTime IssuedAt { get; set; }
        public long? CashierId { get; set; }
        public DateTime? PaidAt { get; set; }
        public Review? Review { get; set; }

        // Factory enforces: invoice only for COMPLETED orders
        public static Invoice Create(RestaurantOrder order, decimal subtotal)
        {
            if (!order.CanCreateInvoice())
                throw new InvoiceRequiresCompletedOrderException();
            return new Invoice { OrderId = order.OrderId, Subtotal = subtotal,
                Total = subtotal, Status = InvoiceStatus.UNPAID };
        }

        public void ApplyDiscount(decimal discountAmount)
        {
            if (Status != InvoiceStatus.UNPAID)
                throw new DomainException("Discount can only be applied to UNPAID invoice.");
            DiscountAmount = discountAmount;
            Total = Math.Max(0, Subtotal - discountAmount);
        }

        public void MarkPaid(PaymentMethod method, long cashierId)
        {
            if (Status != InvoiceStatus.UNPAID)
                throw new DomainException("Invoice is already paid or refunded.");
            Status = InvoiceStatus.PAID;
            PaymentMethod = method;
            CashierId = cashierId;
            PaidAt = DateTime.UtcNow;
        }

        public bool CanBeReviewed() => Status == InvoiceStatus.PAID;
    }
}
