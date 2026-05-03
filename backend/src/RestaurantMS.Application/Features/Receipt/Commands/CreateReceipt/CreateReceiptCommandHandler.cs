using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Application.Interfaces;
using RestaurantMS.Domain.Entities;
using RestaurantMS.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.Receipt.Commands.CreateReceipt
{
    public record ReceiptItemDto(long FBId, int Quantity, decimal UnitPrice);
    public record CreateReceiptCommand(int ManufacturerId, List<ReceiptItemDto> Items) : IRequest<ReceiptDto>;
    public record ReceiptDto(long ReceiptId, int ManufacturerId, DateTime ImportedAt);

    public class CreateReceiptCommandHandler : IRequestHandler<CreateReceiptCommand, ReceiptDto>
    {
        private readonly IUnitOfWork _uow;
        private readonly ICurrentUserService _currentUser;

        public CreateReceiptCommandHandler(IUnitOfWork uow, ICurrentUserService currentUser)
        {
            _uow = uow;
            _currentUser = currentUser;
        }

        public async Task<ReceiptDto> Handle(CreateReceiptCommand cmd, CancellationToken ct)
        {
            var manufacturer = await _uow.Manufacturers.GetByIdAsync(cmd.ManufacturerId)
                ?? throw new NotFoundException(nameof(Manufacturer), cmd.ManufacturerId);

            await _uow.BeginTransactionAsync(ct);
            try
            {
                var receipt = new RestaurantMS.Domain.Entities.Receipt { ManufacturerId = cmd.ManufacturerId,
                    CreatedBy = _currentUser.UserId ?? 0, ReceiptDate = DateTime.UtcNow };
                receipt.ReceiptId = await _uow.Receipts.InsertAndReturnIdAsync(receipt);

                foreach (var line in cmd.Items)
                {
                    var fb = await _uow.FBs.GetByIdAsync(line.FBId)
                        ?? throw new NotFoundException(nameof(FB), line.FBId);

                    // Domain rule: INHOUSE forbidden + same manufacturer enforced
                    RestaurantMS.Domain.Entities.Receipt.ValidateItem(fb, cmd.ManufacturerId);

                    await _uow.ReceiptDetails.InsertAndReturnIdAsync(new ReceiptDetail {
                        ReceiptId = receipt.ReceiptId, ItemId = (int)line.FBId,
                        Quantity = line.Quantity, ImportPrice = line.UnitPrice });

                    // Auto-add stock after import
                    var wh = await _uow.Warehouses.GetByFBIdAsync(line.FBId);
                    if (wh != null) {
                        wh.AddStock(line.Quantity);
                        await _uow.Warehouses.UpdateQuantityAsync(line.FBId, wh.Quantity);
                    }
                }
                await _uow.CommitAsync(ct);
                return new ReceiptDto(receipt.ReceiptId, cmd.ManufacturerId, receipt.ReceiptDate);
            }
            catch { await _uow.RollbackAsync(ct); throw; }
        }
    }
}