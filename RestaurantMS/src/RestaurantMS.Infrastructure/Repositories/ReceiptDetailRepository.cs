using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class ReceiptDetailRepository : IReceiptDetailRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public ReceiptDetailRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<ReceiptDetail> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<ReceiptDetail>> GetAllAsync() { return new List<ReceiptDetail>(); }
    public async Task AddAsync(ReceiptDetail entity) {}
    public async Task UpdateAsync(ReceiptDetail entity) {}
    public async Task DeleteAsync(long id) {}

    private ReceiptDetail MapReceiptDetail(SqlDataReader reader)
    {
        return new ReceiptDetail();
    }
}

