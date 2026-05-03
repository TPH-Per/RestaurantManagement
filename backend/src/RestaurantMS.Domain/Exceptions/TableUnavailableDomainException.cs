using System;

namespace RestaurantMS.Domain.Exceptions;

public class TableUnavailableDomainException : Exception
{
    public TableUnavailableDomainException(string message) : base(message) {}
}

