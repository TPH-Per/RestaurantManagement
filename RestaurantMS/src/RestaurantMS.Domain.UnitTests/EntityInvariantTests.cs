using System;
using Xunit;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Domain.Exceptions;

namespace RestaurantMS.Domain.UnitTests
{
    public class EntityInvariantTests
    {
        [Fact]
        public void FB_SetVisibility_ThrowsIfFreshRaw()
        {
            var fb = new FB { Type = FBType.FRESH_RAW, Name = "Raw Meat" };
            Assert.Throws<DomainException>(() => fb.SetVisibility(true));
        }

        [Fact]
        public void FB_IsSellable_ReturnsFalseForFreshRaw()
        {
            var fb = new FB { Type = FBType.FRESH_RAW, IsVisible = true };
            Assert.False(fb.IsSellable());
        }

        [Fact]
        public void Warehouse_DeductStock_ThrowsIfRegularGoesNegative()
        {
            var warehouse = new Warehouse { FBType = FBType.REGULAR, Quantity = 5 };
            Assert.Throws<StockCannotGoNegativeException>(() => warehouse.DeductStock(10, "Burger"));
        }

        [Fact]
        public void Warehouse_AdjustStock_ThrowsIfRegular()
        {
            var warehouse = new Warehouse { FBType = FBType.REGULAR };
            Assert.Throws<DomainException>(() => warehouse.AdjustStock(10, "Burger"));
        }

        [Fact]
        public void RestaurantOrder_StartServing_ThrowsIfNotPending()
        {
            var order = new RestaurantOrder { Status = OrderStatus.SERVING };
            Assert.Throws<DomainException>(() => order.StartServing());
        }

        [Fact]
        public void RestaurantOrder_Complete_ThrowsIfNotServing()
        {
            var order = new RestaurantOrder { Status = OrderStatus.PENDING };
            Assert.Throws<DomainException>(() => order.Complete());
        }

        [Fact]
        public void Invoice_Create_ThrowsIfOrderNotCompleted()
        {
            var order = new RestaurantOrder { Status = OrderStatus.SERVING };
            Assert.Throws<InvoiceRequiresCompletedOrderException>(() => Invoice.Create(order, 100));
        }

        [Fact]
        public void Review_Create_ThrowsIfInvoiceNotPaid()
        {
            var invoice = new Invoice { Status = InvoiceStatus.UNPAID };
            Assert.Throws<ReviewRequiresPaidInvoiceException>(() => Review.Create(invoice, 1, 5, "Great!"));
        }

        [Fact]
        public void Receipt_ValidateItem_ThrowsIfInhouse()
        {
            var fb = new FB { Type = FBType.INHOUSE, Name = "Homemade Sauce" };
            Assert.Throws<InhouseCannotBeImportedException>(() => Receipt.ValidateItem(fb, 1));
        }

        [Fact]
        public void RestaurantTable_Reserve_ThrowsIfNotAvailable()
        {
            var table = new RestaurantTable { Status = TableStatus.OCCUPIED };
            Assert.Throws<TableNotAvailableException>(() => table.Reserve());
        }
    }
}
