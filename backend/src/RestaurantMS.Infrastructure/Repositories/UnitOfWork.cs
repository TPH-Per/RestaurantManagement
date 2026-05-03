using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Infrastructure.Data;

namespace RestaurantMS.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        internal SqlConnection? ActiveConnection => _connection;
        internal SqlTransaction? ActiveTransaction => _transaction;

        private readonly SqlConnectionFactory _factory;
        private SqlConnection? _connection;
        private SqlTransaction? _transaction;

        public IFBRepository FBs { get; }
        public ICategoryRepository Categories { get; }
        public IManufacturerRepository Manufacturers { get; }
        public IWarehouseRepository Warehouses { get; }
        public IRestaurantTableRepository Tables { get; }
        public ITableReservationRepository Reservations { get; }
        public IRestaurantOrderRepository Orders { get; }
        public IOrderItemRepository OrderItems { get; }
        public IReceiptRepository Receipts { get; }
        public IReceiptDetailRepository ReceiptDetails { get; }
        public IInvoiceRepository Invoices { get; }
        public IDiscountCodeRepository DiscountCodes { get; }
        public IReviewRepository Reviews { get; }
        public IReviewReplyRepository ReviewReplies { get; }
        public ICustomerRepository Customers { get; }
        public IStaffRepository Staff { get; }

        public UnitOfWork(SqlConnectionFactory factory)
        {
            _factory = factory;
            FBs = new FBRepository(_factory, this);
            Categories = new CategoryRepository(_factory, this);
            Manufacturers = new ManufacturerRepository(_factory, this);
            Warehouses = new WarehouseRepository(_factory, this);
            Tables = new RestaurantTableRepository(_factory, this);
            Reservations = new TableReservationRepository(_factory, this);
            Orders = new RestaurantOrderRepository(_factory, this);
            OrderItems = new OrderItemRepository(_factory, this);
            Receipts = new ReceiptRepository(_factory, this);
            ReceiptDetails = new ReceiptDetailRepository(_factory, this);
            Invoices = new InvoiceRepository(_factory, this);
            DiscountCodes = new DiscountCodeRepository(_factory, this);
            Reviews = new ReviewRepository(_factory, this);
            ReviewReplies = new ReviewReplyRepository(_factory, this);
            Customers = new CustomerRepository(_factory, this);
            Staff = new StaffRepository(_factory, this);
        }

        public async Task BeginTransactionAsync(CancellationToken ct = default)
        {
            _connection = await _factory.CreateConnectionAsync();
            _transaction = (SqlTransaction)await _connection.BeginTransactionAsync(ct);
        }

        public async Task CommitAsync(CancellationToken ct = default)
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync(ct);
                await _transaction.DisposeAsync();
                _transaction = null;
            }
            if (_connection != null)
            {
                await _connection.CloseAsync();
                await _connection.DisposeAsync();
                _connection = null;
            }
        }

        public async Task RollbackAsync(CancellationToken ct = default)
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync(ct);
                await _transaction.DisposeAsync();
                _transaction = null;
            }
            if (_connection != null)
            {
                await _connection.CloseAsync();
                await _connection.DisposeAsync();
                _connection = null;
            }
        }

        public async ValueTask DisposeAsync()
        {
            if (_transaction != null) await _transaction.DisposeAsync();
            if (_connection != null) await _connection.DisposeAsync();
        }
    }
}
