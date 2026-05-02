using System;
using System.Collections.Generic;

using RestaurantMS.Domain.Exceptions;
using RestaurantMS.Domain.Enums;

namespace RestaurantMS.Domain.Entities
{
    public class RestaurantOrder
    {
        public long OrderId { get; set; }
        public long? ReservationId { get; set; }
        public TableReservation? Reservation { get; set; }
        public int TableId { get; set; }
        public RestaurantTable Table { get; set; } = null!;
        public long? CustomerId { get; set; }
        public OrderStatus Status { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public Invoice? Invoice { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        public bool CanAddItem() =>
            Status == OrderStatus.PENDING || Status == OrderStatus.SERVING;

        public bool CanCreateInvoice() => Status == OrderStatus.COMPLETED;

        public void StartServing()
        {
            if (Status != OrderStatus.PENDING)
                throw new DomainException("Only PENDING orders can move to SERVING.");
            Status = OrderStatus.SERVING;
        }

        public void Complete()
        {
            if (Status != OrderStatus.SERVING)
                throw new DomainException("Only SERVING orders can be completed.");
            Status = OrderStatus.COMPLETED;
        }

        public void Cancel()
        {
            if (Status == OrderStatus.COMPLETED)
                throw new DomainException("Completed orders cannot be cancelled.");
            Status = OrderStatus.CANCELLED;
        }
    }
}
