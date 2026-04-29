using System;
using Microsoft.Data.SqlClient;

namespace RestaurantMS.Infrastructure.Data;

public interface IUnitOfWork : IDisposable
{
    SqlTransaction BeginTransaction();
    void Commit();
    void Rollback();
}

