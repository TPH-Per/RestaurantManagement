using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class TableReservationRepository : ITableReservationRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public TableReservationRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<TableReservation> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<TableReservation>> GetAllAsync() { return new List<TableReservation>(); }
    public async Task AddAsync(TableReservation entity) {}
    public async Task UpdateAsync(TableReservation entity) {}
    public async Task DeleteAsync(long id) {}

    private TableReservation MapTableReservation(SqlDataReader reader)
    {
        return new TableReservation();
    }
}

