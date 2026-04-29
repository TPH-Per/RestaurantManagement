using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public ReviewRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<Review> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Review>> GetAllAsync() { return new List<Review>(); }
    public async Task AddAsync(Review entity) {}
    public async Task UpdateAsync(Review entity) {}
    public async Task DeleteAsync(long id) {}

    private Review MapReview(SqlDataReader reader)
    {
        return new Review();
    }
}

