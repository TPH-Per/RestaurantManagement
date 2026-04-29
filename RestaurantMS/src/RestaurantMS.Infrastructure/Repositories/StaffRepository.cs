using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class StaffRepository : IStaffRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public StaffRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<Staff> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Staff>> GetAllAsync() { return new List<Staff>(); }
    public async Task AddAsync(Staff entity) {}
    public async Task UpdateAsync(Staff entity) {}
    public async Task DeleteAsync(long id) {}

    private Staff MapStaff(SqlDataReader reader)
    {
        return new Staff();
    }
}

