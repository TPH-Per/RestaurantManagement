using System;

namespace RestaurantMS.Domain.Exceptions;

public class NotFoundDomainException : Exception
{
    public NotFoundDomainException(string message) : base(message) {}
}

