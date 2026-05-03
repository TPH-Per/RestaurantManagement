namespace RestaurantMS.Domain.Exceptions;

public class RegularNotAdjustableException : DomainException
{
    public RegularNotAdjustableException(string itemName)
        : base($"{itemName} is managed by receipts and order flow, not manual adjustment.")
    {
    }
}
