using System.Collections.Generic;
using System.Threading.Tasks;
using RestaurantMS.Domain.Entities;

namespace RestaurantMS.Application.Interfaces;

public interface ITableReservationRepository
{
    Task<TableReservation> GetByIdAsync(long id);
    Task<IEnumerable<TableReservation>> GetAllAsync();
    Task AddAsync(TableReservation entity);
    Task UpdateAsync(TableReservation entity);
    Task DeleteAsync(long id);
}

