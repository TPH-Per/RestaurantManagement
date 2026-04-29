using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface IRestaurantOrderRepository
{
    Task<RestaurantOrder> GetByIdAsync(long id);
    Task<IEnumerable<RestaurantOrder>> GetAllAsync();
    Task AddAsync(RestaurantOrder entity);
    Task UpdateAsync(RestaurantOrder entity);
    Task DeleteAsync(long id);
}

