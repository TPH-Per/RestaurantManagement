namespace RestaurantMS.Domain.Exceptions;

public class OutOfStockException : DomainException
{
    public OutOfStockException(string itemName, int available, int requested)
        : base($"{itemName} is out of stock. Available: {available}, Requested: {requested}")
    {
    }
}
