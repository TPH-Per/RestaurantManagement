using System;

namespace RestaurantMS.Domain.Exceptions;

public class ConcurrencyDomainException : Exception
{
    public ConcurrencyDomainException(string message) : base(message) {}
}

