using System;

namespace RestaurantMS.Domain.Exceptions
{
    public class ReviewRequiresPaidInvoiceException : DomainException
    {
        public ReviewRequiresPaidInvoiceException()
            : base("A review can only be submitted after the invoice is paid.") { }
    }
}