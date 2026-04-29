using System;
using Microsoft.Data.SqlClient;

namespace RestaurantMS.Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly SqlConnection _connection;
    private SqlTransaction _transaction;
    public UnitOfWork(SqlConnectionFactory factory)
    {
        _connection = factory.CreateConnection();
        _connection.Open();
    }
    public SqlTransaction BeginTransaction() { _transaction = _connection.BeginTransaction(); return _transaction; }
    public void Commit() { _transaction?.Commit(); }
    public void Rollback() { _transaction?.Rollback(); }
    public void Dispose() { _transaction?.Dispose(); _connection?.Dispose(); }
}

