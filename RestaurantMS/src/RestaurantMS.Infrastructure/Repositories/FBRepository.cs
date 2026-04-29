using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class FBRepository : IFBRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public FBRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<FB> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<FB>> GetAllAsync() { return new List<FB>(); }
    public async Task AddAsync(FB entity) {}
    public async Task UpdateAsync(FB entity) {}
    public async Task DeleteAsync(long id) {}

    private FB MapFB(SqlDataReader reader)
    {
        return new FB();
    }
}

