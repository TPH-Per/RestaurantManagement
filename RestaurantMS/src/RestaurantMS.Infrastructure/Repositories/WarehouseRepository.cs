using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class WarehouseRepository : IWarehouseRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public WarehouseRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<Warehouse> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Warehouse>> GetAllAsync() { return new List<Warehouse>(); }
    public async Task AddAsync(Warehouse entity) {}
    public async Task UpdateAsync(Warehouse entity) {}
    public async Task DeleteAsync(long id) {}

    private Warehouse MapWarehouse(SqlDataReader reader)
    {
        return new Warehouse();
    }
}

