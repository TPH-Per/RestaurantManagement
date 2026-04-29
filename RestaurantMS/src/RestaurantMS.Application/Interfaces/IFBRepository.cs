using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface IFBRepository
{
    Task<FB> GetByIdAsync(long id);
    Task<IEnumerable<FB>> GetAllAsync();
    Task AddAsync(FB entity);
    Task UpdateAsync(FB entity);
    Task DeleteAsync(long id);
}

