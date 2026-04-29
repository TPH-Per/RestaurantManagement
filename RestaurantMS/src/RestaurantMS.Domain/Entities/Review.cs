using System;
using System.Collections.Generic;

namespace RestaurantMS.Domain.Entities
{
    public class Review
    {
        public long ReviewId { get; set; }
        public long InvoiceId { get; set; }
        public Invoice Invoice { get; set; } = null!;
        public long CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        public byte Rating { get; set; }
        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<ReviewReply> Replies { get; set; } = new List<ReviewReply>();
    }
}
