using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface IInvoiceRepository
{
    Task<Invoice> GetByIdAsync(long id);
    Task<IEnumerable<Invoice>> GetAllAsync();
    Task AddAsync(Invoice entity);
    Task UpdateAsync(Invoice entity);
    Task DeleteAsync(long id);
}

