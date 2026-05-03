using System;
using System.Reflection;
using DbUp;
using Microsoft.Extensions.Configuration;
using Serilog;

namespace RestaurantMS.API.Extensions;

public static class DbUpExtensions
{
    public static void RunDbMigrations(this IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        EnsureDatabase.For.SqlDatabase(connectionString);

        var upgrader = DeployChanges.To
            .SqlDatabase(connectionString)
            .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
            .WithVariablesDisabled()
            .LogToConsole()
            .Build();

        var result = upgrader.PerformUpgrade();

        if (!result.Successful)
        {
            Log.Fatal(result.Error, "Database migration failed");
            throw new Exception("Database migration failed", result.Error);
        }
        
        Log.Information("Database migration successful!");
    }
}
