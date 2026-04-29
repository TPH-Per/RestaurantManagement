using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface IRestaurantTableRepository
{
    Task<RestaurantTable> GetByIdAsync(long id);
    Task<IEnumerable<RestaurantTable>> GetAllAsync();
    Task AddAsync(RestaurantTable entity);
    Task UpdateAsync(RestaurantTable entity);
    Task DeleteAsync(long id);
}

