using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface IReviewReplyRepository
{
    Task<ReviewReply> GetByIdAsync(long id);
    Task<IEnumerable<ReviewReply>> GetAllAsync();
    Task AddAsync(ReviewReply entity);
    Task UpdateAsync(ReviewReply entity);
    Task DeleteAsync(long id);
}

