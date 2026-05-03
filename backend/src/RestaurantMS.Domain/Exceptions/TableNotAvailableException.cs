using System;

namespace RestaurantMS.Domain.Exceptions
{
    public class TableNotAvailableException : DomainException
    {
        public TableNotAvailableException(long tableId)
            : base($"Table {tableId} is not available for reservation.") { }
    }
}