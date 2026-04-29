using backend.Application.Interfaces;
using backend.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace backend.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        return services;
    }
}
