using System;
using System.Collections.Generic;

namespace RestaurantMS.Domain.Entities
{
    public class Receipt
    {
        public long ReceiptId { get; set; }
        public long CreatedBy { get; set; }
        public Staff CreatedByStaff { get; set; } = null!;
        public int ManufacturerId { get; set; }
        public Manufacturer Manufacturer { get; set; } = null!;
        public DateTime ReceiptDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Notes { get; set; }
        public ICollection<ReceiptDetail> ReceiptDetails { get; set; } = new List<ReceiptDetail>();
    }
}
