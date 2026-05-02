using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System;
using Microsoft.Data.SqlClient;

namespace RestaurantMS.Infrastructure.Data
{
    public class SqlConnectionFactory
    {
        private readonly string _cs;
        public SqlConnectionFactory(IConfiguration config)
            => _cs = config.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("DefaultConnection not configured.");

        public async Task<SqlConnection> CreateConnectionAsync()
        {
            var conn = new SqlConnection(_cs);
            await conn.OpenAsync();
            return conn;
        }
    }
}
