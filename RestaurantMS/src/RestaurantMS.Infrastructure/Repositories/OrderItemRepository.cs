using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories;

public class OrderItemRepository : IOrderItemRepository
{
    private readonly SqlConnectionFactory _connectionFactory;
    public OrderItemRepository(SqlConnectionFactory connectionFactory) { _connectionFactory = connectionFactory; }
    public async Task<OrderItem> GetByIdAsync(long id) { return null; }
    public async Task<IEnumerable<OrderItem>> GetAllAsync() { return new List<OrderItem>(); }
    public async Task AddAsync(OrderItem entity) {}
    public async Task UpdateAsync(OrderItem entity) {}
    public async Task DeleteAsync(long id) {}

    private OrderItem MapOrderItem(SqlDataReader reader)
    {
        return new OrderItem();
    }
}

