using System;

namespace RestaurantMS.Domain.Exceptions;

public class DuplicateRecordDomainException : Exception
{
    public DuplicateRecordDomainException(string message) : base(message) {}
}

