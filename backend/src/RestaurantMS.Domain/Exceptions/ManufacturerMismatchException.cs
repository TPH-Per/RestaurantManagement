namespace RestaurantMS.Domain.Exceptions;

public class ManufacturerMismatchException : DomainException
{
    public ManufacturerMismatchException(string itemName)
        : base($"{itemName} does not belong to the selected manufacturer.")
    {
    }
}
