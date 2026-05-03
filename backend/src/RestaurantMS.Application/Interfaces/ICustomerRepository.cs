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
    Task<Customer?> GetByPhoneAsync(string phone);
    Task UpdateLoyaltyPointsAsync(long customerId, int points);
    Task<long> InsertAndReturnIdAsync(Customer entity);
}
