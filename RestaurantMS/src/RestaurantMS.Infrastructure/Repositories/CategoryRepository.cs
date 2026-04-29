using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public CategoryRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<Category> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Category>> GetAllAsync() { return new List<Category>(); }
    public async Task AddAsync(Category entity) {}
    public async Task UpdateAsync(Category entity) {}
    public async Task DeleteAsync(long id) {}

    private Category MapCategory(SqlDataReader reader)
    {
        return new Category();
    }
}

