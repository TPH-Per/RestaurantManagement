using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class CustomerRepository : ICustomerRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public CustomerRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<Customer> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Customer>> GetAllAsync() { return new List<Customer>(); }
    public async Task AddAsync(Customer entity) {}
    public async Task UpdateAsync(Customer entity) {}
    public async Task DeleteAsync(long id) {}

    private Customer MapCustomer(SqlDataReader reader)
    {
        return new Customer();
    }
}

