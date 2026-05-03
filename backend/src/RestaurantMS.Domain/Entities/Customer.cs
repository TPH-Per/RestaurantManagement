using System;
using System.Collections.Generic;

namespace RestaurantMS.Domain.Entities
{
    public class Customer
    {
        public long CustomerId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string Phone { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? Gender { get; set; }
        public string MembershipLevel { get; set; } = string.Empty;
        public int LoyaltyPoints { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<TableReservation> TableReservations { get; set; } = new List<TableReservation>();
    }
}
