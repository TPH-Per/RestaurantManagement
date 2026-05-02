using System;
using System.Collections.Generic;

using RestaurantMS.Domain.Exceptions;
using RestaurantMS.Domain.Enums;

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

        // Called before inserting each receipt detail line
        public static void ValidateItem(FB fb, long receiptManufacturerId)
        {
            if (fb.Type == FBType.INHOUSE)
                throw new InhouseCannotBeImportedException(fb.Name);

            // All items in one receipt must share the same manufacturer
            if (fb.ManufacturerId.HasValue && fb.ManufacturerId.Value != receiptManufacturerId)
                throw new DomainException(
                    $"'{fb.Name}' belongs to a different manufacturer than this receipt.");
        }
    }
}
