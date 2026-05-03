using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Infrastructure.Identity;
using RestaurantMS.Infrastructure.Data;
using RestaurantMS.Infrastructure.Repositories;
using RestaurantMS.Infrastructure.Services;

namespace RestaurantMS.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddSingleton<SqlConnectionFactory>(); // shared, thread-safe

        // UnitOfWork: Scoped — one per HTTP request, wraps all 16 repos
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Application-layer service implementations
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IPasswordHasher,  PasswordHasher>();
        services.AddScoped<IDateTimeService, DateTimeService>();

        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        return services;
    }
}
