using System;

namespace RestaurantMS.Domain.Exceptions
{
    public class FreshRawCannotBeSoldException : DomainException
    {
        public FreshRawCannotBeSoldException(string name)
            : base($"'{name}' is a raw ingredient and cannot be sold.") { }
    }
}