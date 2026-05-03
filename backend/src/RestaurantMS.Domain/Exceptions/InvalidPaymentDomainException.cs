using System;

namespace RestaurantMS.Domain.Exceptions;

public class InvalidPaymentDomainException : Exception
{
    public InvalidPaymentDomainException(string message) : base(message) {}
}

