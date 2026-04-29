using System;
using System.Collections.Generic;

namespace RestaurantMS.Domain.Entities
{
    public class ReceiptDetail
    {
        public long ReceiptDetailId { get; set; }
        public long ReceiptId { get; set; }
        public Receipt Receipt { get; set; } = null!;
        public int ItemId { get; set; }
        public FB FB { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal ImportPrice { get; set; }
        public decimal Subtotal { get; set; }
    }
}
