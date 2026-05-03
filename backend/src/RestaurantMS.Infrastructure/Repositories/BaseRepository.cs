using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public abstract class BaseRepository
{
    protected readonly SqlConnectionFactory _factory;
    protected readonly UnitOfWork _uow;

    protected BaseRepository(SqlConnectionFactory factory, UnitOfWork uow)
    {
        _factory = factory;
        _uow = uow;
    }

    protected async Task<(SqlConnection conn, SqlTransaction? tx, bool owned)> GetConnAsync()
    {
        if (_uow.ActiveConnection != null)
            return (_uow.ActiveConnection, _uow.ActiveTransaction, false);

        var conn = await _factory.CreateConnectionAsync();
        return (conn, null, true);
    }
}
