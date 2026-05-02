using System.Threading;
using System.Threading.Tasks;
using RestaurantMS.Application.Interfaces;

namespace RestaurantMS.Application.Common.Interfaces
{
    public interface IUnitOfWork : IAsyncDisposable
    {
        IFBRepository           FBs           { get; }
        ICategoryRepository     Categories    { get; }
        IManufacturerRepository Manufacturers { get; }
        IWarehouseRepository    Warehouses    { get; }
        IRestaurantTableRepository    Tables  { get; }
        ITableReservationRepository   Reservations { get; }
        IRestaurantOrderRepository    Orders  { get; }
        IOrderItemRepository    OrderItems    { get; }
        IReceiptRepository      Receipts      { get; }
        IReceiptDetailRepository ReceiptDetails { get; }
        IInvoiceRepository      Invoices      { get; }
        IDiscountCodeRepository DiscountCodes { get; }
        IReviewRepository       Reviews       { get; }
        IReviewReplyRepository  ReviewReplies { get; }
        ICustomerRepository     Customers     { get; }
        IStaffRepository        Staff         { get; }

        Task BeginTransactionAsync(CancellationToken ct = default);
        Task CommitAsync(CancellationToken ct = default);
        Task RollbackAsync(CancellationToken ct = default);
    }
}