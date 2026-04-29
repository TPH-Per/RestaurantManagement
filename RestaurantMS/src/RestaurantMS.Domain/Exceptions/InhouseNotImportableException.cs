namespace RestaurantMS.Domain.Exceptions;

public class InhouseNotImportableException : DomainException
{
    public InhouseNotImportableException(string itemName)
        : base($"{itemName} is kitchen-made and cannot be imported.")
    {
    }
}
