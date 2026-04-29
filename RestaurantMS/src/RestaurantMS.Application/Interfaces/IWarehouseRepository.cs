using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface IWarehouseRepository
{
    Task<Warehouse> GetByIdAsync(long id);
    Task<IEnumerable<Warehouse>> GetAllAsync();
    Task AddAsync(Warehouse entity);
    Task UpdateAsync(Warehouse entity);
    Task DeleteAsync(long id);
}

