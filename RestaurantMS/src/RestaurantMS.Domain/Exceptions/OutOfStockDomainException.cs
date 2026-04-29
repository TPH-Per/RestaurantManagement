using System;

namespace RestaurantMS.Domain.Exceptions;

public class OutOfStockDomainException : Exception
{
    public OutOfStockDomainException(string message) : base(message) {}
}

