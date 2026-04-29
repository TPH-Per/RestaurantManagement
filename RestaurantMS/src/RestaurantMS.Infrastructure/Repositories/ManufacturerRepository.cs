using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class ManufacturerRepository : IManufacturerRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public ManufacturerRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<Manufacturer> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Manufacturer>> GetAllAsync() { return new List<Manufacturer>(); }
    public async Task AddAsync(Manufacturer entity) {}
    public async Task UpdateAsync(Manufacturer entity) {}
    public async Task DeleteAsync(long id) {}

    private Manufacturer MapManufacturer(SqlDataReader reader)
    {
        return new Manufacturer();
    }
}

