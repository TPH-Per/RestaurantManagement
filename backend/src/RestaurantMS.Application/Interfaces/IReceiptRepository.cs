using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface IReceiptRepository
{
    Task<Receipt> GetByIdAsync(long id);
    Task<IEnumerable<Receipt>> GetAllAsync();
    Task AddAsync(Receipt entity);
    Task UpdateAsync(Receipt entity);
    Task DeleteAsync(long id);
    Task<Receipt?> GetWithDetailsAsync(long receiptId);
    Task<long> InsertAndReturnIdAsync(Receipt receipt);
}
