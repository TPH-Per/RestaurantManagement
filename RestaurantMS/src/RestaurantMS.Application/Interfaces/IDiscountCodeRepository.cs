using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface IDiscountCodeRepository
{
    Task<DiscountCode> GetByIdAsync(long id);
    Task<IEnumerable<DiscountCode>> GetAllAsync();
    Task AddAsync(DiscountCode entity);
    Task UpdateAsync(DiscountCode entity);
    Task DeleteAsync(long id);
}

