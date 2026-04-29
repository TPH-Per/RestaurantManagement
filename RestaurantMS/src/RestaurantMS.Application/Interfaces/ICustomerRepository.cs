using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface ICustomerRepository
{
    Task<Customer> GetByIdAsync(long id);
    Task<IEnumerable<Customer>> GetAllAsync();
    Task AddAsync(Customer entity);
    Task UpdateAsync(Customer entity);
    Task DeleteAsync(long id);
}

