using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class DiscountCodeRepository : IDiscountCodeRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public DiscountCodeRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<DiscountCode> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<DiscountCode>> GetAllAsync() { return new List<DiscountCode>(); }
    public async Task AddAsync(DiscountCode entity) {}
    public async Task UpdateAsync(DiscountCode entity) {}
    public async Task DeleteAsync(long id) {}

    private DiscountCode MapDiscountCode(SqlDataReader reader)
    {
        return new DiscountCode();
    }
}

