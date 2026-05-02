using System;

namespace RestaurantMS.Domain.Exceptions
{
    public class InvoiceRequiresCompletedOrderException : DomainException
    {
        public InvoiceRequiresCompletedOrderException()
            : base("An invoice can only be created for a completed order.") { }
    }
}