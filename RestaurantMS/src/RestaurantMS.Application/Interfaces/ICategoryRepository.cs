using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface ICategoryRepository
{
    Task<Category> GetByIdAsync(long id);
    Task<IEnumerable<Category>> GetAllAsync();
    Task AddAsync(Category entity);
    Task UpdateAsync(Category entity);
    Task DeleteAsync(long id);
}

