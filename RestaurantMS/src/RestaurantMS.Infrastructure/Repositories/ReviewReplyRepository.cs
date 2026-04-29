using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class ReviewReplyRepository : IReviewReplyRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public ReviewReplyRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<ReviewReply> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<ReviewReply>> GetAllAsync() { return new List<ReviewReply>(); }
    public async Task AddAsync(ReviewReply entity) {}
    public async Task UpdateAsync(ReviewReply entity) {}
    public async Task DeleteAsync(long id) {}

    private ReviewReply MapReviewReply(SqlDataReader reader)
    {
        return new ReviewReply();
    }
}

