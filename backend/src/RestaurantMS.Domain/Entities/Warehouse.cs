using System;
using System.Collections.Generic;

using RestaurantMS.Domain.Exceptions;
using RestaurantMS.Domain.Enums;

namespace RestaurantMS.Domain.Entities
{
    public class Warehouse
    {
        public int ItemId { get; set; }
        public FB FB { get; set; } = null!;
        public int CurrentStock { get; set; }
        public DateTime LastUpdated { get; set; }
        public FBType FBType { get; set; }
        public int Quantity { get; set; }
        public int LowStockThreshold { get; set; }

        // Called when OrderItem is created — REGULAR enforced strictly
        public void DeductStock(int amount, string fbName)
        {
            if (amount <= 0) throw new DomainException("Amount must be positive.");
            if (FBType == FBType.REGULAR && Quantity - amount < 0)
                throw new StockCannotGoNegativeException(fbName, Quantity, amount);
            Quantity -= amount;
        }

        // Called when OrderItem is removed or Order is cancelled
        public void RestoreStock(int amount)
        {
            if (amount <= 0) throw new DomainException("Amount must be positive.");
            Quantity += amount;
        }

        // Called by Receipt handler — adds stock after import
        public void AddStock(int amount)
        {
            if (amount <= 0) throw new DomainException("Import amount must be positive.");
            Quantity += amount;
        }

        // Staff-only: INHOUSE (kitchen output) or FRESH_RAW (spoilage). REGULAR is FORBIDDEN.
        public void AdjustStock(int newQuantity, string fbName)
        {
            if (FBType == FBType.REGULAR)
                throw new DomainException($"REGULAR stock for '{fbName}' cannot be adjusted manually.");
            if (newQuantity < 0)
                throw new DomainException("Stock quantity cannot be negative.");
            Quantity = newQuantity;
        }

        public StockStatus GetStockStatus()
        {
            if (Quantity == 0) return StockStatus.OUT_OF_STOCK;
            if (Quantity <= LowStockThreshold) return StockStatus.LOW_STOCK;
            return StockStatus.NORMAL;
        }
    }
}
