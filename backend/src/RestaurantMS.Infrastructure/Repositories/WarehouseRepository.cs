using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.DTOs;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Enums;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class WarehouseRepository : BaseRepository, IWarehouseRepository
{
    public WarehouseRepository(SqlConnectionFactory factory, UnitOfWork uow) : base(factory, uow) {}
    public async Task<Warehouse?> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<Warehouse>> GetAllAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT * FROM Warehouses";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<Warehouse>();
            while (await r.ReadAsync()) list.Add(new Warehouse { ItemId = (int)r.GetInt64(0), Quantity = r.GetInt32(1), LowStockThreshold = r.GetInt32(2) });
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
    public async Task AddAsync(Warehouse entity) {}
    public async Task UpdateAsync(Warehouse entity) {}
    public async Task DeleteAsync(long id) {}
    public async Task<Warehouse?> GetByFBIdAsync(long fbId) { return null; }
    public async Task UpdateQuantityAsync(long fbId, int newQuantity) {}
    public async Task<IEnumerable<WarehouseReportRow>> GetReportAsync() {
        var (conn, tx, owned) = await GetConnAsync();
        try {
            await using var cmd = conn.CreateCommand(); cmd.Transaction = tx;
            cmd.CommandText = "SELECT f.fb_id, f.name, f.type, w.quantity, w.low_stock_threshold, 'NORMAL' FROM Warehouses w JOIN FBs f ON w.fb_id = f.fb_id";
            await using var r = await cmd.ExecuteReaderAsync();
            var list = new List<WarehouseReportRow>();
            while (await r.ReadAsync()) list.Add(new WarehouseReportRow(r.GetInt64(0), r.GetString(1), Enum.Parse<FBType>(r.GetString(2)), r.GetInt32(3), r.GetInt32(4), StockStatus.NORMAL));
            return list;
        } finally { if (owned) await conn.DisposeAsync(); }
    }
}