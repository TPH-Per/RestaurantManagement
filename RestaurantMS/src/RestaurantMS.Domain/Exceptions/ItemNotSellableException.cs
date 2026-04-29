namespace RestaurantMS.Domain.Exceptions;

public class ItemNotSellableException : DomainException
{
    public ItemNotSellableException(string itemName)
        : base($"{itemName} cannot be sold.")
    {
    }
}
