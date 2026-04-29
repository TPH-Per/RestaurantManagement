using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface IManufacturerRepository
{
    Task<Manufacturer> GetByIdAsync(long id);
    Task<IEnumerable<Manufacturer>> GetAllAsync();
    Task AddAsync(Manufacturer entity);
    Task UpdateAsync(Manufacturer entity);
    Task DeleteAsync(long id);
}

