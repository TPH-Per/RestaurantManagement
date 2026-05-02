using System;
using System.Collections.Generic;

namespace RestaurantMS.Application.Common.Exceptions;

public class ValidationException : Exception
{
    public ValidationException(IEnumerable<string> errors) 
        : base("Validation failed")
    {
        Errors = errors;
    }

    public IEnumerable<string> Errors { get; }
}