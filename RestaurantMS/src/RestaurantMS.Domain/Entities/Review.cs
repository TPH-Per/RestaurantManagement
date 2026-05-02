using System;
using System.Collections.Generic;

using RestaurantMS.Domain.Exceptions;

namespace RestaurantMS.Domain.Entities
{
    public class Review
    {
        public long ReviewId { get; set; }
        public long InvoiceId { get; set; }
        public Invoice Invoice { get; set; } = null!;
        public long CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        public int Stars { get; set; }
        public byte Rating { get; set; }
        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<ReviewReply> Replies { get; set; } = new List<ReviewReply>();

        public static Review Create(Invoice invoice, long customerId, int stars, string content)
        {
            if (!invoice.CanBeReviewed())
                throw new ReviewRequiresPaidInvoiceException();
            if (stars < 1 || stars > 5)
                throw new DomainException("Stars must be between 1 and 5.");
            if (string.IsNullOrWhiteSpace(content))
                throw new DomainException("Review content cannot be empty.");
            return new Review { InvoiceId = invoice.InvoiceId, CustomerId = customerId,
                Stars = stars, Content = content, CreatedAt = DateTime.UtcNow };
        }
    }
}
