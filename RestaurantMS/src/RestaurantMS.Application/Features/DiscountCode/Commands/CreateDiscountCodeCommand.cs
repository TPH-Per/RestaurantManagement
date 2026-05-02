using MediatR;
using RestaurantMS.Application.Common.Interfaces;
using RestaurantMS.Application.Features.DiscountCode.Queries;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace RestaurantMS.Application.Features.DiscountCode.Commands;

public record CreateDiscountCodeCommand(
    string Code, string DiscountType, decimal Value,
    decimal? MinOrderAmount, decimal? MaxDiscountAmount,
    DateTime ValidFrom, DateTime ValidTo, int? UsageLimit) : IRequest<DiscountCodeDto>;

public class CreateDiscountCodeCommandHandler : IRequestHandler<CreateDiscountCodeCommand, DiscountCodeDto>
{
    private readonly IUnitOfWork _uow;
    public CreateDiscountCodeCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<DiscountCodeDto> Handle(CreateDiscountCodeCommand cmd, CancellationToken ct)
    {
        var code = new Domain.Entities.DiscountCode {
            Code = cmd.Code,
            DiscountType = cmd.DiscountType,
            DiscountValue = cmd.Value,
            MinOrderAmount = cmd.MinOrderAmount,
            MaxDiscountAmount = cmd.MaxDiscountAmount,
            ValidFrom = cmd.ValidFrom,
            ValidTo = cmd.ValidTo,
            UsageLimit = cmd.UsageLimit,
            UsedCount = 0,
            IsActive = true
        };
        await _uow.DiscountCodes.AddAsync(code);
        return new DiscountCodeDto(code.DiscountCodeId, code.Code, code.DiscountType, code.DiscountValue, code.MinOrderAmount, code.MaxDiscountAmount, code.IsActive, code.ValidTo, code.UsedCount, code.UsageLimit);
    }
}
