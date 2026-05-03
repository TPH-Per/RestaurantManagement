using System;

namespace RestaurantMS.Domain.Exceptions
{
    public class InhouseCannotBeImportedException : DomainException
    {
        public InhouseCannotBeImportedException(string name)
            : base($"'{name}' is an in-house item and cannot be imported.") { }
    }
}