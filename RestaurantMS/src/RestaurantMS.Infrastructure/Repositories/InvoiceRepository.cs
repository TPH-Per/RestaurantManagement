using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class InvoiceRepository : IInvoiceRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public InvoiceRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<Invoice> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Invoice>> GetAllAsync() { return new List<Invoice>(); }
    public async Task AddAsync(Invoice entity) {}
    public async Task UpdateAsync(Invoice entity) {}
    public async Task DeleteAsync(long id) {}

    private Invoice MapInvoice(SqlDataReader reader)
    {
        return new Invoice();
    }
}

