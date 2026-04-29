using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class ReceiptRepository : IReceiptRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public ReceiptRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<Receipt> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Receipt>> GetAllAsync() { return new List<Receipt>(); }
    public async Task AddAsync(Receipt entity) {}
    public async Task UpdateAsync(Receipt entity) {}
    public async Task DeleteAsync(long id) {}

    private Receipt MapReceipt(SqlDataReader reader)
    {
        return new Receipt();
    }
}

