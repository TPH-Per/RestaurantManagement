using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface IOrderItemRepository
{
    Task<OrderItem> GetByIdAsync(long id);
    Task<IEnumerable<OrderItem>> GetAllAsync();
    Task AddAsync(OrderItem entity);
    Task UpdateAsync(OrderItem entity);
    Task DeleteAsync(long id);
}

