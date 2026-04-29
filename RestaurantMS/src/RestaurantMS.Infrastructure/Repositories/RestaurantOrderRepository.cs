using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class RestaurantOrderRepository : IRestaurantOrderRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public RestaurantOrderRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<RestaurantOrder> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<RestaurantOrder>> GetAllAsync() { return new List<RestaurantOrder>(); }
    public async Task AddAsync(RestaurantOrder entity) {}
    public async Task UpdateAsync(RestaurantOrder entity) {}
    public async Task DeleteAsync(long id) {}

    private RestaurantOrder MapRestaurantOrder(SqlDataReader reader)
    {
        return new RestaurantOrder();
    }
}

