using System;

namespace RestaurantMS.Domain.Exceptions
{
    public class StockCannotGoNegativeException : DomainException
    {
        public StockCannotGoNegativeException(string name, int available, int requested)
            : base($"Insufficient stock for '{name}': available={available}, requested={requested}.") { }
    }
}