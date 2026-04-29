using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace RestaurantMS.Infrastructure.Data;

public class SqlConnectionFactory
{
    private readonly string _connectionString;
    public SqlConnectionFactory(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }
    public SqlConnection CreateConnection() => new SqlConnection(_connectionString);
}

