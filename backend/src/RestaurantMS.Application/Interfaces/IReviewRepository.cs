using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface IReviewRepository
{
    Task<Review> GetByIdAsync(long id);
    Task<IEnumerable<Review>> GetAllAsync();
    Task AddAsync(Review entity);
    Task UpdateAsync(Review entity);
    Task DeleteAsync(long id);
    Task<bool> ExistsByInvoiceIdAsync(long invoiceId);
    Task<long> InsertAndReturnIdAsync(Review review);
}
