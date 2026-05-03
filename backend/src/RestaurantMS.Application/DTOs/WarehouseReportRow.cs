using RestaurantMS.Domain.Enums;

namespace RestaurantMS.Application.DTOs;

public record WarehouseReportRow(long FBId, string Name, FBType Type, int Quantity, int LowStockThreshold, StockStatus StockStatus);