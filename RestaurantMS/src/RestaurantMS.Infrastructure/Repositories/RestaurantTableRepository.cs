using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class RestaurantTableRepository : IRestaurantTableRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public RestaurantTableRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<RestaurantTable> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<RestaurantTable>> GetAllAsync() { return new List<RestaurantTable>(); }
    public async Task AddAsync(RestaurantTable entity) {}
    public async Task UpdateAsync(RestaurantTable entity) {}
    public async Task DeleteAsync(long id) {}

    private RestaurantTable MapRestaurantTable(SqlDataReader reader)
    {
        return new RestaurantTable();
    }
}

