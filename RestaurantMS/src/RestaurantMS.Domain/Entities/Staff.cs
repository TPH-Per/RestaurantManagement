using System;
using System.Collections.Generic;

namespace RestaurantMS.Domain.Entities
{
    public class Staff
    {
        public long StaffId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Role { get; set; } = string.Empty;
        public string? Department { get; set; }
        public DateTime? HireDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<Receipt> CreatedReceipts { get; set; } = new List<Receipt>();
        public ICollection<Invoice> ProcessedInvoices { get; set; } = new List<Invoice>();
        public ICollection<ReviewReply> ReviewReplies { get; set; } = new List<ReviewReply>();
    }
}
