using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;

namespace RestaurantMS.Application.Interfaces;

public interface IRestaurantOrderRepository
{
    Task<RestaurantOrder> GetByIdAsync(long id);
    Task<IEnumerable<RestaurantOrder>> GetAllAsync();
    Task AddAsync(RestaurantOrder entity);
    Task UpdateAsync(RestaurantOrder entity);
    Task DeleteAsync(long id);
    Task<RestaurantOrder?> GetWithItemsAsync(long orderId);
    Task<IEnumerable<RestaurantOrder>> GetByTableAsync(long tableId);
    Task<long> InsertAndReturnIdAsync(RestaurantOrder order);
    Task UpdateStatusAsync(long orderId, OrderStatus status);
}
