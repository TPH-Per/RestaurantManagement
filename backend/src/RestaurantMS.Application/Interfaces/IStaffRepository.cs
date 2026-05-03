using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface IStaffRepository
{
    Task<Staff> GetByIdAsync(long id);
    Task<IEnumerable<Staff>> GetAllAsync();
    Task AddAsync(Staff entity);
    Task UpdateAsync(Staff entity);
    Task DeleteAsync(long id);
    Task<Staff?> GetByEmailAsync(string email);
}
