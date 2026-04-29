using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface IReceiptDetailRepository
{
    Task<ReceiptDetail> GetByIdAsync(long id);
    Task<IEnumerable<ReceiptDetail>> GetAllAsync();
    Task AddAsync(ReceiptDetail entity);
    Task UpdateAsync(ReceiptDetail entity);
    Task DeleteAsync(long id);
}

