using System;
using RestaurantMS.Application.Common.Interfaces;

namespace RestaurantMS.Infrastructure.Services;

public class DateTimeService : IDateTimeService
{
    public DateTime UtcNow => DateTime.UtcNow;
}